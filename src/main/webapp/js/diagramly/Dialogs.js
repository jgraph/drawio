/**
 * Copyright (c) 2006-2020, JGraph Holdings Ltd
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
	
	var count = 0, totalBtns = 0;
	var container = document.createElement('div');
	container.style.paddingTop = '2px';
	buttons.appendChild(container);
	
	var p3 = document.createElement('p');
	
	function addLogo(img, title, mode, clientName, labels, clientFn)
	{
		totalBtns++;
		
		if (++count > rowLimit)
		{
			mxUtils.br(container);
			count = 1;
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
				if (mode == App.MODE_GOOGLE && editorUi.spinner.spin(document.body, mxResources.get('authorizing')))
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
					}), function(err)
					{
						editorUi.spinner.stop();
						editorUi.handleError(err);
					});
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
				color: 'light-dark(#000000, #C0C0C0)',
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

		if (editorUi.m365 != null)
		{
			addLogo(IMAGE_PATH + '/onedrive-logo.svg', mxResources.get('m365'), App.MODE_M365, 'm365');
		}

		if (urlParams['noDevice'] != '1')
		{
			addLogo(IMAGE_PATH + '/osa_drive-harddisk.png', mxResources.get('device'), App.MODE_DEVICE);
		}

		if (isLocalStorage && (urlParams['browser'] == '1' || urlParams['offline'] == '1'))
		{
			addLogo(IMAGE_PATH + '/osa_database.png', mxResources.get('browser'), App.MODE_BROWSER);
		}

		if (typeof window.OneDriveClient === 'function')
		{
			addLogo(IMAGE_PATH + '/onedrive-logo.svg', mxResources.get('oneDrive'), App.MODE_ONEDRIVE, 'oneDrive');
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
	later.style.position = 'absolute';
	later.style.cursor = 'pointer';
	later.style.bottom = '27px';
	later.style.color = 'gray';
	later.style.userSelect = 'none';
	later.style.textAlign = 'center';
	later.style.left = '50%';
	mxUtils.setPrefixedStyle(later.style, 'transform', 'translate(-50%,0)');
	mxUtils.write(later, mxResources.get('decideLater'));
	div.appendChild(later);

	mxEvent.addListener(later, 'click', function()
	{
		editorUi.hideDialog();
		var prev = Editor.useLocalStorage;
		editorUi.createFile(editorUi.defaultFilename,
			null, null, null, null, null, null, true);
		Editor.useLocalStorage = prev;
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
				p3.style.padding = '7px';
				p3.style.fontSize = '9pt';
				p3.style.marginTop = '-14px';
				p3.innerHTML = '<a style="background-color:#dcdcdc;padding:6px;color:black;text-decoration:none;" ' +
					'href="https://www.drawio.com/doc/faq/google-drive-connection-problems" target="_blank">' +
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
		var elt = editorUi.addLanguageMenu(div, false, '28px');
		
		if (elt != null)
		{
			elt.style.bottom = '24px';
		}
	}
	
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
	else if (editorUi.mode == App.MODE_M365)
	{
		logo.src = IMAGE_PATH + '/onedrive-logo.svg';
		service = mxResources.get('m365');
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
		buttons.style.padding = '42px 0px 10px 0px';
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
			var driveUsers = editorUi.drive.getUsersList();
		
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

				// Must use POST request to sign out of GitLab
				// see https://gitlab.com/gitlab-org/gitlab/-/issues/202291
				var form = document.createElement('form');
				form.setAttribute('method', 'post');
				form.setAttribute('action', DRAWIO_GITLAB_URL + '/users/sign_out');
				form.setAttribute('target', '_blank');

				document.body.appendChild(form);
				form.submit();
				form.parentNode.removeChild(form);
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
var EmbedDialog = function(editorUi, result, timeout, ignoreSize, previewFn, title, tweet, previewTitle, filename)
{
	tweet = (tweet != null) ? tweet : 'Check out the diagram I made using @drawio';
	var div = document.createElement('div');
	div.style.height = '100%';
	div.style.display = 'flex';
	div.style.flexDirection = 'column';
	var maxSize = 500000;

	// Checks if result is a link
	var validUrl = /^https?:\/\//.test(result) || /^mailto:\/\//.test(result);

	var header = document.createElement('div');
	header.style.flexShrink = '0';
	header.style.position = 'relative';

	if (title != null)
	{
		mxUtils.write(header, title);
	}
	else
	{
		mxUtils.write(header, mxResources.get((result.length < maxSize) ?
			((validUrl) ? 'link' : 'mainEmbedNotice') : 'preview') + ':');
	}

	var size = document.createElement('span');
	size.style.cssFloat = 'right';
	size.style.color = 'gray';
	mxUtils.write(size, editorUi.formatFileSize(result.length));
	header.appendChild(size);

	div.appendChild(header);

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
	text.style.flex = '1';
	text.style.width = '100%';
	text.style.boxSizing = 'border-box';
	text.value = mxResources.get('updatingDocument');
	div.appendChild(text);

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
	buttons.style.flexShrink = '0';
	buttons.style.textAlign = 'right';
	buttons.style.paddingTop = '14px';
	buttons.style.whiteSpace = 'nowrap';
	
	var previewBtn = null;
	
	if (EmbedDialog.showPreviewOption && !mxIsElectron &&
		!navigator.standalone && validUrl)
	{
		previewBtn = mxUtils.button((previewTitle != null) ? previewTitle :
			mxResources.get((result.length < maxSize) ? 'preview' : 'openInNewWindow'), function()
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
						doc.writeln('<html><head><title>' +
							mxUtils.htmlEntities(mxResources.get('preview')) +
							'</title><meta charset="utf-8"></head><body>' +
							(result.substring(0, 7) == '<iframe' ? result :
								mxUtils.htmlEntities(result)) + '</body></html>');
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
	
	var downloadBtn = mxUtils.button(mxResources.get('export'), function()
		{
			editorUi.hideDialog();
			editorUi.saveData((filename != null) ? filename : 'embed.txt', 'txt', result, 'text/plain');
		});
		
		downloadBtn.className = 'geBtn';
		buttons.appendChild(downloadBtn);

	if (!editorUi.isOffline() && result.length < maxSize)
	{
		var emailBtn = mxUtils.button('', function()
		{
			try
			{
				var url = 'mailto:?subject=' +
					encodeURIComponent(filename || editorUi.defaultFilename) + '&body=' +
					encodeURIComponent(text.value);

				editorUi.openLink(url);
			}
			catch (e)
			{
				editorUi.handleError({message: e.message || mxResources.get('drawingTooLarge')});
			}
		});
		
		var img = document.createElement('img');
		img.className = 'geAdaptiveAsset';
		img.setAttribute('src', Editor.mailImage);
		img.setAttribute('width', '18');
		img.setAttribute('height', '18');
		img.setAttribute('border', '0');
		img.style.marginBottom = '5px'

		emailBtn.appendChild(img);
		emailBtn.style.verticalAlign = 'bottom';
		emailBtn.style.paddingTop = '4px';
		emailBtn.style.minWidth = '46px'
		emailBtn.className = 'geBtn';
		buttons.appendChild(emailBtn);
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
	else if (previewBtn != null)
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
 * Constructs a new parse dialog.
 */
var BackgroundImageDialog = function(editorUi, applyFn, img, color, showColor)
{
	var graph = editorUi.editor.graph;
	var div = document.createElement('div');

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get('background'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
	div.appendChild(hd);

	var isPageLink = img != null && img.originalSrc != null;
	var pageFound = false;

	var urlRadio = document.createElement('input');
	urlRadio.setAttribute('value', 'url');
	urlRadio.setAttribute('type', 'radio');
	urlRadio.setAttribute('name', 'geBackgroundImageDialogOption');

	var pageRadio = document.createElement('input');
	pageRadio.setAttribute('value', 'url');
	pageRadio.setAttribute('type', 'radio');
	pageRadio.setAttribute('name', 'geBackgroundImageDialogOption');

	var urlInput = document.createElement('input');
	urlInput.setAttribute('type', 'text');
	urlInput.style.flex = '1';
	urlInput.style.minWidth = '0';
	urlInput.value = (isPageLink || img == null) ? '' : img.src;

	var pageSelect = document.createElement('select');
	pageSelect.style.flex = '1';
	pageSelect.style.minWidth = '0';
	pageSelect.style.marginLeft = '0';

	if (editorUi.pages != null)
	{
		for (var i = 0; i < editorUi.pages.length; i++)
		{
			var pageOption = document.createElement('option');
			mxUtils.write(pageOption, editorUi.pages[i].getName() ||
				mxResources.get('pageWithNumber', [i + 1]));
			pageOption.setAttribute('value', 'data:page/id,' +
				editorUi.pages[i].getId());

			if (editorUi.pages[i] == editorUi.currentPage)
			{
				pageOption.setAttribute('disabled', 'disabled');
			}

			if (img != null && img.originalSrc == pageOption.getAttribute('value'))
			{
				pageOption.setAttribute('selected', 'selected');
				pageFound = true;
			}

			pageSelect.appendChild(pageOption);
		}
	}

	if (!isPageLink && (editorUi.pages == null || editorUi.pages.length == 1))
	{
		urlRadio.style.display = 'none';
		pageRadio.style.display = 'none';
		pageSelect.style.display = 'none';
	}

	var notFoundOption = document.createElement('option');
	var resetting = false;
	var ignoreEvt = false;

	var urlChanged = function(evt, done)
	{
		// Skips blur event if called from apply button
		if (!resetting && (evt == null || !ignoreEvt))
		{
			if (pageRadio.checked)
			{
				if (done != null)
				{
					done((notFoundOption.selected) ? null : pageSelect.value);
				}
			}
			else if (urlInput.value != '' && !editorUi.isOffline())
			{
				urlInput.value = mxUtils.trim(urlInput.value);

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

	var openFiles = mxUtils.bind(this, function(files)
	{
		editorUi.importFiles(files, 0, 0, editorUi.maxBackgroundSize, function(data, mimeType, x, y, w, h)
		{
			urlInput.value = data;
			urlChanged();
			urlInput.focus();
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
	});

	this.init = function()
	{
		if (isPageLink)
		{
			pageSelect.focus();
		}
		else
		{
			urlInput.focus();
		}

		mxEvent.addListener(pageSelect, 'focus', function()
		{
			urlRadio.removeAttribute('checked');
			pageRadio.setAttribute('checked', 'checked');
			pageRadio.checked = true;
		});

		mxEvent.addListener(urlInput, 'focus', function()
		{
			pageRadio.removeAttribute('checked');
			urlRadio.setAttribute('checked', 'checked');
			urlRadio.checked = true;
		});

		// Installs drag and drop handler for local images and links
		if (Graph.fileSupport)
		{
			urlInput.setAttribute('placeholder', mxResources.get('dragImagesHere'));

			// Setup the dnd listeners
			var dlg = div.parentNode;
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
				if (dropElt == null)
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
					openFiles(evt.dataTransfer.files);
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

	// Image source section
	var srcSection = document.createElement('div');
	srcSection.className = 'geDialogSection';

	// URL row
	var urlRow = document.createElement('div');
	urlRow.className = 'geDialogCheckRow';
	urlRow.appendChild(urlRadio);
	urlRow.appendChild(urlInput);
	srcSection.appendChild(urlRow);

	// Width + Height inline fields
	var dimRow = document.createElement('div');
	dimRow.className = 'geDialogInlineFields';
	dimRow.style.marginTop = '6px';
	dimRow.style.paddingLeft = '24px';

	var wField = document.createElement('div');
	wField.className = 'geDialogInlineField';

	var wLabel = document.createElement('label');
	mxUtils.write(wLabel, mxResources.get('width'));
	wField.appendChild(wLabel);

	var widthInput = document.createElement('input');
	widthInput.setAttribute('type', 'text');
	widthInput.value = (img != null && !isPageLink) ? img.width : '';
	wField.appendChild(widthInput);
	dimRow.appendChild(wField);

	var hField = document.createElement('div');
	hField.className = 'geDialogInlineField';

	var hLabel = document.createElement('label');
	mxUtils.write(hLabel, mxResources.get('height'));
	hField.appendChild(hLabel);

	var heightInput = document.createElement('input');
	heightInput.setAttribute('type', 'text');
	heightInput.value = (img != null && !isPageLink) ? img.height : '';
	hField.appendChild(heightInput);
	dimRow.appendChild(hField);

	srcSection.appendChild(dimRow);

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

	// Page row
	var pageRow = document.createElement('div');
	pageRow.className = 'geDialogCheckRow';
	pageRow.style.marginTop = '6px';
	pageRow.appendChild(pageRadio);
	pageRow.appendChild(pageSelect);
	srcSection.appendChild(pageRow);

	div.appendChild(srcSection);

	if (isPageLink)
	{
		pageRadio.setAttribute('checked', 'checked');
		pageRadio.checked = true;
	}
	else
	{
		urlRadio.setAttribute('checked', 'checked');
		urlRadio.checked = true;
	}

	if (!pageFound && pageRadio.checked)
	{
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

	// Options section (fill color + shadow)
	var optSection = document.createElement('div');
	optSection.className = 'geDialogSection';
	optSection.style.display = (showColor) ? '' : 'none';

	var bgRow = document.createElement('div');
	bgRow.className = 'geDialogCheckRow';
	bgRow.style.cursor = 'default';

	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.defaultChecked = color != mxConstants.NONE && color != null;
	cb.checked = cb.defaultChecked;
	bgRow.appendChild(cb);

	var cbLabel = document.createElement('label');
	mxUtils.write(cbLabel, mxResources.get('fillColor'));
	bgRow.appendChild(cbLabel);

	var backgroundButton = document.createElement('button');
	backgroundButton.style.width = '36px';
	backgroundButton.style.height = '18px';
	backgroundButton.style.cursor = 'pointer';
	backgroundButton.style.marginLeft = '10px';
	backgroundButton.style.backgroundPosition = 'center center';
	backgroundButton.style.backgroundRepeat = 'no-repeat';
	backgroundButton.className = 'geColorBtn';

	var newBackgroundColor = color;

	function updateBackgroundColor()
	{
		if (newBackgroundColor == null || newBackgroundColor == mxConstants.NONE)
		{
			backgroundButton.style.display = 'none';
			cb.checked = false;
		}
		else
		{
			backgroundButton.style.backgroundColor = newBackgroundColor;
			backgroundButton.style.display = '';
			cb.checked = true;
		}
	};

	updateBackgroundColor();

	mxEvent.addListener(bgRow, 'click', function(evt)
	{
		if (mxEvent.getSource(evt) != cb)
		{
			cb.checked = !cb.checked;
		}

		if (cb.checked)
		{
			newBackgroundColor = '#ffffff';
		}
		else
		{
			newBackgroundColor = null;
		}

		updateBackgroundColor();
	});

	mxEvent.addListener(backgroundButton, 'click', function(evt)
	{
		editorUi.pickColor(newBackgroundColor || 'none', function(color)
		{
			newBackgroundColor = color;
			updateBackgroundColor();
		});

		mxEvent.consume(evt);
	});

	bgRow.appendChild(backgroundButton);
	optSection.appendChild(bgRow);

	var shadowRow = document.createElement('div');
	shadowRow.className = 'geDialogCheckRow';
	shadowRow.style.cursor = 'default';

	var shadow = document.createElement('input');
	shadow.setAttribute('type', 'checkbox');
	shadow.defaultChecked = graph.shadowVisible;
	shadow.checked = shadow.defaultChecked;
	shadowRow.appendChild(shadow);

	var shadowLabel = document.createElement('label');
	mxUtils.write(shadowLabel, mxResources.get('shadow'));
	shadowRow.appendChild(shadowLabel);

	if (!mxClient.IS_SVG || mxClient.IS_SF)
	{
		shadow.setAttribute('disabled', 'disabled');
	}

	mxEvent.addListener(shadowRow, 'click', function(evt)
	{
		if (mxEvent.getSource(evt) != shadow)
		{
			shadow.checked = !shadow.checked;
		}
	});

	optSection.appendChild(shadowRow);
	div.appendChild(optSection);

	// Buttons
	var btns = document.createElement('div');
	btns.style.marginTop = '34px';
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

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		urlInput.value = '';
		widthInput.value = '';
		heightInput.value = '';
		urlRadio.checked = true;
		newBackgroundColor = mxConstants.NONE;
		updateBackgroundColor();
		resetting = false;
	});
	mxEvent.addGestureListeners(resetBtn, function()
	{
		// Blocks processing a image URL while clicking reset
		resetting = true;
	});
	resetBtn.className = 'geBtn';
	btns.appendChild(resetBtn);

	if (Graph.fileSupport)
	{
		var fileInput = document.createElement('input');
		fileInput.setAttribute('multiple', 'multiple');
		fileInput.setAttribute('type', 'file');

		mxEvent.addListener(fileInput, 'change', function(evt)
		{
			if (fileInput.files != null)
			{
				openFiles(fileInput.files);

				// Resets input to force change event for same file (type reset required for IE)
				fileInput.type = '';
				fileInput.type = 'file';
				fileInput.value = '';
			}
		});

		fileInput.style.display = 'none';
		div.appendChild(fileInput);

		var btn = mxUtils.button(mxResources.get('open'), function()
		{
			fileInput.click();
		});

		btn.className = 'geBtn';
		btns.appendChild(btn);
	}

	applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		editorUi.hideDialog();

		urlChanged(null, function(url)
		{
			applyFn((url != '' && url != null) ? new mxImage(url, widthInput.value,
				heightInput.value) : null, url == null, newBackgroundColor,
				(!mxClient.IS_SVG || mxClient.IS_SF) ? null : shadow.checked);
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
	var plantUmlExample = '@startuml\nskinparam shadowing false\nAlice -> Bob: Authentication Request\nBob --> Alice: Authentication Response\n\n' +
		'Alice -> Bob: Another authentication Request\nAlice <-- Bob: Another authentication Response\n@enduml';
	var insertPoint = editorUi.editor.graph.getFreeInsertPoint();

	function parse(text, type, evt)
	{
		if (type == 'plantUmlDiagram' || type == 'plantUmlImage')
		{
			// Native converter paths (drawio-plantuml): parsed locally, no
			// PlantUML server involved, mirroring the Mermaid Diagram/Image
			// outputs. Parsing is async (the converter bundle loads on
			// demand), so the dialog stays open until it succeeds (see okBtn).
			if (editorUi.spinner.spin(document.body, mxResources.get('inserting')))
			{
				var insertPlantUml = mxUtils.bind(this, function(insertXml)
				{
					editorUi.spinner.stop();
					editorUi.hideDialog();
					var graph = editorUi.editor.graph;
					graph.getModel().beginUpdate();
					try
					{
						var inserted = editorUi.importXml(insertXml,
							Math.max(insertPoint.x, 20),
							Math.max(insertPoint.y, 20),
							true, null, null, true);
						graph.setSelectionCells(inserted);
					}
					finally
					{
						graph.getModel().endUpdate();
					}

					graph.scrollCellToVisible(graph.getSelectionCell());
				});

				var onPlantUmlError = mxUtils.bind(this, function(e)
				{
					// Keeps the dialog open on parse failure so the input
					// isn't lost
					editorUi.spinner.stop();
					editorUi.handleError(e);
				});

				if (type == 'plantUmlImage')
				{
					// Inserts the parsed diagram as a static SVG image cell
					// (carrying the PlantUML source for re-editing).
					editorUi.parsePlantUmlImage(text, insertPlantUml, onPlantUmlError);
				}
				else
				{
					editorUi.parsePlantUmlDiagram(text, null, mxUtils.bind(this, function(xml)
					{
						insertPlantUml(mxPlantUmlToDrawio.wrapGroup(xml, text, null));
					}), onPlantUmlError);
				}
			}
		}
		else if (type == 'mermaid' || type == 'mermaidImage')
		{
			if (editorUi.spinner.spin(document.body, mxResources.get('inserting')))
			{
				var insertMermaid = mxUtils.bind(this, function(insertXml)
				{
					editorUi.spinner.stop();

					// Parsing is async so the dialog is kept open until it
					// succeeds (see okBtn); hide it now that insert is happening
					editorUi.hideDialog();
					var graph = editorUi.editor.graph;
					graph.getModel().beginUpdate();
					try
					{
						var inserted = editorUi.importXml(insertXml,
							Math.max(insertPoint.x, 20),
							Math.max(insertPoint.y, 20),
							true, null, null, true);
						graph.setSelectionCells(inserted);
					}
					finally
					{
						graph.getModel().endUpdate();
					}

					graph.scrollCellToVisible(graph.getSelectionCell());
				});

				var onMermaidError = mxUtils.bind(this, function(e)
				{
					// Keeps the dialog open on parse failure (e.g. unsupported
					// diagram type) so the input isn't lost
					editorUi.spinner.stop();
					editorUi.handleError(e);
				});

				if (type == 'mermaidImage')
				{
					// Inserts the parsed diagram as a static SVG image cell
					// (carrying the mermaid source for re-editing).
					editorUi.parseMermaidImage(text, insertMermaid, onMermaidError);
				}
				else
				{
					editorUi.parseMermaidDiagram(text, null, mxUtils.bind(this, function(xml)
					{
						insertMermaid(mxMermaidToDrawio.wrapGroup(xml, text, null));
					}), onMermaidError);
				}
			}
		}
		else if (type == 'table')
		{
			var lines = text.split('\n');
			var tableCell = null;
			var cells = [];
			var dx = 0;
			var pkMap = {};

			//First pass to find primary keys
			for (var i = 0; i < lines.length; i++)
			{
				var line = mxUtils.trim(lines[i]);
				
				if (line.substring(0, 11).toLowerCase() == 'primary key')
				{
					var pk = line.match(/\((.+)\)/);
					
					if (pk && pk[1])
					{
						pkMap[pk[1]] = true;						
					}
					
					lines.splice(i, 1);
				}
				else if (line.toLowerCase().indexOf('primary key') > 0)
				{
					pkMap[line.split(' ')[0]] = true;
					lines[i] = mxUtils.trim(line.replace(/primary key/i, ''));
				}
			}
			
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
					
					tableCell = new mxCell(name, new mxGeometry(dx, 0, 160, 30),
						'shape=table;startSize=30;container=1;collapsible=1;childLayout=tableLayout;' +
						'fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;');
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
				
					var pk = pkMap[name.split(' ')[0]];
					var rowCell = new mxCell('', new mxGeometry(0, 0, 160, 30),
						'shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=none;' +
						'collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;' +
						'strokeColor=inherit;top=0;left=0;right=0;bottom=' + (pk ? '1' : '0') + ';');
					rowCell.vertex = true;
					
					var left = new mxCell(pk ? 'PK' : '', new mxGeometry(0, 0, 30, 30),
						'shape=partialRectangle;overflow=hidden;connectable=0;fillColor=none;' +
						'strokeColor=inherit;top=0;left=0;bottom=0;right=0;' +
						(pk ? 'fontStyle=1;' : ''));
					left.vertex = true;
					rowCell.insert(left);
					
					var right = new mxCell(name, new mxGeometry(30, 0, 130, 30),
						'shape=partialRectangle;overflow=hidden;connectable=0;fillColor=none;align=left;' +
						'strokeColor=inherit;top=0;left=0;bottom=0;right=0;spacingLeft=6;' +
						(pk ? 'fontStyle=5;' : ''));
					right.vertex = true;
					rowCell.insert(right);
					
		   			var size = editorUi.editor.graph.getPreferredSizeForCell(right);
		   			
		   			if (size != null && tableCell.geometry.width < size.width + 30)
		   			{
		   				tableCell.geometry.width = Math.min(320, Math.max(tableCell.geometry.width, size.width + 30));
		   			}
		   			
		   			tableCell.insert(rowCell, pk? 0 : null);
		   			tableCell.geometry.height += 30;
				}
			}
			
			if (cells.length > 0)
			{
				var graph = editorUi.editor.graph;
				graph.setSelectionCells(graph.importCells(cells, insertPoint.x, insertPoint.y));
				graph.scrollCellToVisible(graph.getSelectionCell());
			}
		}
		else if (type == 'list')
		{
			var lines = text.split('\n');
			
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
			var lines = text.split('\n');
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
						edge.geometry.relative = true;
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

					var runEdgeLayout = true;

					if (type == 'horizontalFlow' || type == 'verticalFlow')
					{
						var flowLayout = new mxHierarchicalLayout(graph,
							(type == 'horizontalFlow') ?
							mxConstants.DIRECTION_WEST :
							mxConstants.DIRECTION_NORTH);
						flowLayout.execute(graph.getDefaultParent(), cells);
						runEdgeLayout = false;
					}
					else if (type == 'circle')
					{
						var circleLayout = new mxCircleLayout(graph);
						circleLayout.execute(graph.getDefaultParent());
					}
					else
					{
						var layout = new mxFastOrganicLayout(graph);
						layout.disableEdgeStyle = false;
						layout.forceConstant = 180;
						layout.execute(graph.getDefaultParent());
					}
					
					if (runEdgeLayout)
					{
						var edgeLayout = new mxParallelEdgeLayout(graph);
						edgeLayout.spacing = 30;
						edgeLayout.execute(graph.getDefaultParent());
					}
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
	div.style.display = 'flex';
	div.style.flexDirection = 'column';
	div.style.height = '100%';
	div.style.boxSizing = 'border-box';
	// the flex column never overflows (the textarea scrolls internally),
	// so opt out of the .geDialog > :first-child scroll container — it
	// clips the focus halo of the bottom-row controls
	div.style.overflow = 'visible';

	var hd = document.createElement('h3');
	mxUtils.write(hd, title || mxResources.get('insert'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px;flex-shrink:0';
	div.appendChild(hd);

	var textarea = document.createElement('textarea');
	textarea.style.flex = '1';
	textarea.style.minHeight = '0';
	textarea.style.width = '100%';
	textarea.style.boxSizing = 'border-box';
	textarea.style.resize = 'none';

	textarea.setAttribute('wrap', 'off');
	textarea.setAttribute('spellcheck', 'false');
	textarea.setAttribute('autocorrect', 'off');
	textarea.setAttribute('autocomplete', 'off');
	textarea.setAttribute('autocapitalize', 'off');

	var typeSelect = document.createElement('select');
	typeSelect.className = 'geBtn';
	
	if (defaultType == 'formatSql' ||
		((defaultType == 'mermaid' || defaultType == 'plantUml') &&
		editorUi.getServiceName() != 'draw.io' &&
		editorUi.getServiceName() != 'atlassian'))
	{
		typeSelect.style.display = 'none';
	}

	var listOption = document.createElement('option');
	listOption.setAttribute('value', 'list');
	mxUtils.write(listOption, mxResources.get('list'));
	
	if (defaultType != 'plantUml' && defaultType != 'mermaid')
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

	if (defaultType == 'mermaid')
	{
		// Diagram (default, editable group) vs Image (static SVG) — restores the
		// legacy Mermaid output dropdown. Hidden for embedded services by the
		// service check above, where only the default (diagram) output is used.
		var mermaidDiagramOption = document.createElement('option');
		mermaidDiagramOption.setAttribute('value', 'mermaid');
		mermaidDiagramOption.setAttribute('selected', 'selected');
		mxUtils.write(mermaidDiagramOption, mxResources.get('diagram'));
		typeSelect.appendChild(mermaidDiagramOption);

		var mermaidImageOption = document.createElement('option');
		mermaidImageOption.setAttribute('value', 'mermaidImage');
		mxUtils.write(mermaidImageOption, mxResources.get('image'));
		typeSelect.appendChild(mermaidImageOption);
	}

	var diagramOption = document.createElement('option');
	diagramOption.setAttribute('value', 'diagram');
	mxUtils.write(diagramOption, mxResources.get('diagram'));

	var circleOption = document.createElement('option');
	circleOption.setAttribute('value', 'circle');
	mxUtils.write(circleOption, mxResources.get('circle'));

	var horizontalFlowOption = document.createElement('option');
	horizontalFlowOption.setAttribute('value', 'horizontalFlow');
	mxUtils.write(horizontalFlowOption, mxResources.get('horizontalFlow'));
	
	var verticalFlowOption = document.createElement('option');
	verticalFlowOption.setAttribute('value', 'verticalFlow');
	mxUtils.write(verticalFlowOption, mxResources.get('verticalFlow'));
	
	if (defaultType != 'plantUml' && defaultType != 'mermaid')
	{
		typeSelect.appendChild(diagramOption);
		typeSelect.appendChild(circleOption);
		typeSelect.appendChild(horizontalFlowOption);
		typeSelect.appendChild(verticalFlowOption);
	}

	if (defaultType == 'plantUml')
	{
		// Diagram (default, editable group) vs Image (static SVG rendered
		// client-side by the native drawio-plantuml converter), mirroring
		// the Mermaid output dropdown. Both parse locally, so they need no
		// PlantUML server and work offline (desktop, PWA). Hidden for
		// embedded services by the service check above, where only the
		// default (diagram) output is used.
		var plantUmlDiagramOption = document.createElement('option');
		plantUmlDiagramOption.setAttribute('value', 'plantUmlDiagram');
		plantUmlDiagramOption.setAttribute('selected', 'selected');
		mxUtils.write(plantUmlDiagramOption, mxResources.get('diagram'));
		typeSelect.appendChild(plantUmlDiagramOption);

		var plantUmlImageOption = document.createElement('option');
		plantUmlImageOption.setAttribute('value', 'plantUmlImage');
		mxUtils.write(plantUmlImageOption, mxResources.get('image'));
		typeSelect.appendChild(plantUmlImageOption);
	}

	function getDefaultValue()
	{
		if (typeSelect.value == 'list')
		{
			return 'Person\n-name: String\n-birthDate: Date\n--\n+getName(): String\n+setName(String): void\n+isBirthday(): boolean\n\n' +
				'Address\n-street: String\n-city: String\n-state: String';
		}
		else if (typeSelect.value == 'mermaid' || typeSelect.value == 'mermaidImage')
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
		else if (typeSelect.value == 'plantUmlDiagram' ||
			typeSelect.value == 'plantUmlImage')
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

	var buttons = document.createElement('div');
	buttons.style.display = 'flex';
	buttons.style.justifyContent = 'end';
	buttons.style.alignItems = 'center';
	buttons.style.marginTop = '14px';
	buttons.style.flexShrink = '0';
	
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

	// Solicits bug reports for the native converter, which renders all
	// PlantUML outputs since the server-rendered ones were removed
	if (defaultType == 'plantUml')
	{
		let warning = document.createElement('div');
		warning.style.display = 'inline-block';
		warning.style.color = '#c00';
		warning.style.fontSize = '12px';
		warning.style.marginRight = '10px';
		warning.style.display = 'flex';
		warning.style.alignItems = 'center';
		warning.innerHTML = '<a href="https://github.com/jgraph/drawio/issues" target="_blank" ' +
			'rel="noopener noreferrer">Report any PlantUML issues</a>';
		buttons.appendChild(warning);
	}

	if ((!editorUi.isOffline() || mxClient.IS_CHROMEAPP) &&
		(defaultType == 'mermaid' || defaultType == 'plantUml'))
	{
		buttons.appendChild(editorUi.createHelpIcon(
			(defaultType == 'mermaid') ?
				'https://www.drawio.com/docs/manual/mermaid/' :
				'https://plantuml.com/'));
	}

	buttons.appendChild(typeSelect);
	
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
		buttons.appendChild(cancelBtn);
	}
	
	var okBtn = mxUtils.button(mxResources.get('insert'), function(evt)
	{
		try
		{
			// Mermaid and PlantUML parsing is async and may fail (e.g. a syntax
			// error); keep the dialog open so the input isn't lost. Those
			// branches in parse hide the dialog themselves once parsing succeeds.
			if (typeSelect.value != 'mermaid' && typeSelect.value != 'mermaidImage' &&
				typeSelect.value != 'plantUmlDiagram' && typeSelect.value != 'plantUmlImage')
			{
				editorUi.hideDialog();
			}

			parse(textarea.value, typeSelect.value, evt);
		}
		catch (e)
		{
			editorUi.handleError(e);
		}
	});
	
	okBtn.className = 'geBtn gePrimaryBtn';
	buttons.appendChild(okBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	this.container = div;
};

/**
 * Constructs a new dialog for creating files from templates.
 */
var NewDialog = function(editorUi, compact, showName, callback, createOnly, cancelCallback,
		leftHighlight, rightHighlight, rightHighlightBorder, itemPadding, templateFile,
		recentDocsCallback, searchDocsCallback, openExtDocCallback, showImport, createButtonLabel,
		customTempCallback, withoutType, generatePrompt, noBlank)
{
	var ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var smallScreen = ww < 500;
	showName = (showName != null) ? showName : true;
	createOnly = (createOnly != null) ? createOnly : false;
	leftHighlight = (leftHighlight != null) ? leftHighlight : 'light-dark(#ebf2f9, ' + Editor.darkColor + ')';
	rightHighlight = (rightHighlight != null) ? rightHighlight : 'light-dark(#e6eff8, #ffffff)';
	rightHighlightBorder = (rightHighlightBorder != null) ? rightHighlightBorder :
		'2px dashed light-dark(#29b6f2, #00a8ff)';
	templateFile = (templateFile != null) ? templateFile : EditorUi.templateFile;

	// Handles click on insert while entering generate prompt
	var insertWasPressed = false;
	
	var outer = document.createElement('div');
	outer.style.userSelect = 'none';
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
	else if (editorUi.mode == App.MODE_M365)
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

	if (!compact && !smallScreen && showName)
	{
		header.appendChild(logo);
	}
	
	if (showName)
	{
		mxUtils.write(header, (smallScreen? mxResources.get('name') : ((editorUi.mode == null || editorUi.mode == App.MODE_GOOGLE ||
				editorUi.mode == App.MODE_BROWSER) ? mxResources.get('diagramName') : mxResources.get('filename'))) + ':');
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
	nameInput.style.width = (compact || smallScreen) ? '144px' : '244px';
	
	this.init = function()
	{
		if (showName)
		{
			Editor.selectFilename(nameInput);
		}
		
		if (div.parentNode != null && div.parentNode.parentNode != null)
		{
			mxEvent.addGestureListeners(div.parentNode.parentNode, mxUtils.bind(this, function(evt)
			{
				if (editorUi.sidebar != null)
				{
					editorUi.sidebar.hideTooltip();
				}
			}), null, null);
		}
	};
	
	// Adds filetype dropdown
	if (showName)
	{
		header.appendChild(nameInput);

		if (withoutType)
		{
			nameInput.style.width = (compact || smallScreen) ? '350px' : '450px';
		}
		else
		{
			if (editorUi.editor.diagramFileTypes != null)
			{
				var typeSelect = FilenameDialog.createFileTypes(editorUi, nameInput, editorUi.editor.diagramFileTypes);
				typeSelect.style.marginLeft = '6px';
				typeSelect.style.width = (compact || smallScreen) ? '80px' : '180px';
				header.appendChild(typeSelect);
			}
		}
	}

	var hasTabs = false;
	var i0 = 0;
	
	// Dynamic loading
	function addTemplates(smallSize)
	{
		//smallSize: Reduce template button size to fit 4 in a row
		if (smallSize != null)
		{
			w = h = smallSize? 135 : 140;
		}
		
		var first = true;
		
		//TODO support paging of external templates
		if (templates != null)
		{
			while (i0 < templates.length && (first || mxUtils.mod(i0, 30) != 0))
			{
				var tmp = templates[i0++];
				var btn = addButton(tmp.url, tmp.libs, tmp.title, tmp.tooltip? tmp.tooltip : tmp.title,
					tmp.select, tmp.imgUrl, tmp.info, tmp.onClick, tmp.preview, tmp.noImg, tmp.clibs,
					tmp.type);
				
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
		color: 'light-dark(#000000, #C0C0C0)', // #rgb or #rrggbb
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

	var magnifyImage = document.createElement('img');
	magnifyImage.setAttribute('src', Editor.magnifyImage);
	magnifyImage.setAttribute('title', mxResources.get('preview'));
	magnifyImage.className = 'geButton geRoundButton';
		
	// Shows a tooltip with the rendered template
	var loading = false;
	var extImg = null;
	var wasVisible = false;
	
	function showTooltip(xml, x, y, elt, title, url)
	{
		// Checks if dialog still visible
		if (xml != null && mxUtils.isAncestorNode(document.body, elt))
		{
			var doc = mxUtils.parseXml(xml);
			var tempNode = Editor.parseDiagramNode(doc.documentElement, null, true);
			var codec = new mxCodec(tempNode.ownerDocument);
			var model = new mxGraphModel();
			codec.decode(tempNode, model);
			var cells = model.root.children;
			
			var ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			var wh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			
			// TODO: Use maxscreensize
			editorUi.sidebar.createTooltip(elt, cells, Math.min(ww - 120, 1000), Math.min(wh - 120, 800),
				(title != null) ? mxResources.get(title) : null,
				true, new mxPoint(x, y), true, function()
				{
					wasVisible = editorUi.sidebar.tooltip != null &&
						editorUi.sidebar.tooltip.style.display != 'none';

					if (url != null)
					{
						selectElement(elt, null, null, url, infoObj, clibs);
					}
				}, true, false);
		}
	};

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
			searchBox.style.display = '';
			div.style.left = '160px';
			setActiveTab(0);

			div.scrollTop = 0;
			div.innerText = '';
			i0 = 0;
			
			if (oldTemplates != templates)
			{
				templates = oldTemplates;
				categories = origCategories;
				customCatCount = origCustomCatCount;
				list.innerText = '';
				initUi();	
				oldTemplates = null;
			}
		});
		
		tabsEl.push(templatesTab);
		tabs.appendChild(templatesTab);
		
		var getExtTemplates = function(isSearch)
		{
			list.style.display = 'none';
			searchBox.style.display = 'none';
			div.style.left = '30px';				
			
			setActiveTab(isSearch? -1 : 1); //deselect all of them if isSearch 
			
			if (oldTemplates == null) 
			{
				oldTemplates = templates;
			}
			
			div.scrollTop = 0;
			div.innerText = '';
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
					div.innerText = errorMsg;
				}
				else if (docList.length == 0 && importListsCount == 0)
				{
					div.innerText = mxResources.get('noDiagrams', null, 'No Diagrams Found');
				}
				else
				{
					div.innerText = '';
					
					if (importListsCount > 0)
					{
						list.style.display = '';
						div.style.left = '160px';
						list.innerText = '';

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
						addTemplates(true);
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
			searchTab.innerText = mxResources.get('search') + ':';
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
	var lastAiXml = null;
	var lastAiTitle = null;

	function create()
	{
		if (selectedElt == generateElt && templateXml == null &&
			generateButton != null && generateInput != null)
		{
			if (callback && editorUi.spinner.spin(document.body,
				mxResources.get('generate') + ' \''+
					generateInput.value + '\''))
			{
				insertWasPressed = true;
				editorUi.hideDialog();
			}

			generateButton.click();
		}
		else
		{
			if (insertWasPressed)
			{
				editorUi.spinner.stop();
			}

			if (templateExtUrl && openExtDocCallback != null)
			{
				if (!showName && !insertWasPressed)
				{
					editorUi.hideDialog();
				}
				
				openExtDocCallback(templateExtUrl, templateInfoObj, nameInput.value);
			}
			else if (callback)
			{
				if (!showName && !insertWasPressed)
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
					function doSave(mode, folderId, filename)
					{
						editorUi.createFile(filename, templateXml, (templateLibs != null &&
							templateLibs.length > 0) ? templateLibs : null, mode, function()
						{
							if (!insertWasPressed)
							{
								editorUi.hideDialog();
							}
						}, null, folderId, null, (templateClibs != null &&
							templateClibs.length > 0) ? templateClibs : null);
					};

					if (editorUi.mode == App.MODE_GOOGLE || editorUi.mode == App.MODE_ONEDRIVE)
					{
						var dlg = new SaveDialog(editorUi, title, mxUtils.bind(this, function(input, mode, folderId)
						{
							doSave(mode, folderId, input.value);
						}), null, null, null, null, editorUi.mode);

						editorUi.showDialog(dlg.container, 420, 150, true, false);
						dlg.init();
					}
					else
					{
						editorUi.pickFolder(editorUi.mode, function(folderId)
						{
							doSave(editorUi.mode, folderId, title);
						}, editorUi.mode != App.MODE_GOOGLE ||
							editorUi.stateArg == null ||
							editorUi.stateArg.folderId == null);
					}
				}
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
	
	var searchBox = document.createElement('div');
	searchBox.style.cssText = 'position:absolute;left:30px;width:128px;top:' + divTop +
		'px;height:22px;margin-top: 6px;white-space: nowrap;';
	var tmplSearchInput = document.createElement('input');
	tmplSearchInput.style.cssText = 'width:105px;height:16px;border:1px solid #d3d3d3;' +
		'padding: 3px 20px 3px 3px;font-size: 12px;border-radius:0px;';
	tmplSearchInput.setAttribute('placeholder', mxResources.get('search'));
	tmplSearchInput.setAttribute('type', 'text');
	searchBox.appendChild(tmplSearchInput);
	
	var cross = document.createElement('img');
	cross.setAttribute('src', Editor.magnifyImage);
	cross.setAttribute('title', mxResources.get('search'));
	cross.className = 'geAdaptiveAsset';
	cross.style.position = 'relative';
	cross.style.cursor = 'pointer';
	cross.style.outline = 'none';
	cross.style.opacity = '0.5';
	cross.style.height = '16px';
	cross.style.left = '-20px';
	cross.style.top = '4px';
	searchBox.appendChild(cross);
	
	mxEvent.addListener(cross, 'click', function()
	{
		if (cross.getAttribute('src') != Editor.magnifyImage)
		{
			cross.setAttribute('src', Editor.magnifyImage);
			cross.setAttribute('title', mxResources.get('search'));
			tmplSearchInput.value = '';
			resetTemplates();
		}

		tmplSearchInput.focus();
	});
	
	mxEvent.addListener(tmplSearchInput, 'keydown', mxUtils.bind(this, function(evt)
	{
		if (evt.keyCode == 13 /* Enter */)
		{
			filterTemplates();
			mxEvent.consume(evt);
		}
	}));
	
	mxEvent.addListener(tmplSearchInput, 'keyup', mxUtils.bind(this, function(evt)
	{
		if (tmplSearchInput.value == '')
		{
			cross.setAttribute('src', Editor.magnifyImage);
			cross.setAttribute('title', mxResources.get('search'));
		}
		else
		{
			cross.setAttribute('src', Editor.crossImage);
			cross.setAttribute('title', mxResources.get('reset'));
		}
	}));

	divTop += 23;

	var list = document.createElement('div');
	list.style.cssText = 'position:absolute;left:30px;width:128px;top:' + divTop +
		'px;bottom:68px;margin-top:6px;overflow:auto;border:1px solid #d3d3d3;';
	
	mxEvent.addListener(div, 'scroll', function()
	{
		if (editorUi.sidebar != null)
		{
			editorUi.sidebar.hideTooltip();
		}
	});
	
	var w = 140;
	var h = w;
	var generateElt = null;
	var generateBackground = 'url(' + Editor.thinSparklesImage + ')';
	
	var generateForm = document.createElement('div');
	generateForm.className = 'geGenerateDiagramForm';
	generateForm.style.position = 'absolute';
	generateForm.style.width = '100%';
	generateForm.style.height = '100%';

	var generatePreview = document.createElement('div');
	generatePreview.className = 'geTemplatePreview geAdaptiveAsset';
	generatePreview.style.backgroundImage = generateBackground

	function selectElement(elt, xml, libs, extUrl, infoObj, clibs, realUrl)
	{
		if (selectedElt != elt)
		{
			if (selectedElt != null)
			{
				selectedElt.classList.remove('geTemplateSelected');
				
				if (selectedElt == generateElt)
				{
					generateForm.style.display = 'none';
					generatePreview.style.display = '';
					editGenerate.style.visibility = 'hidden';
					magnifyGenerate.style.visibility = (lastAiXml != null) ? 'visible' : 'hidden';
				}
			}

			if (elt == generateElt)
			{
				xml = lastAiXml;
				
				if (xml != null)
				{
					magnifyGenerate.style.visibility = 'visible';
					magnifyGenerate.style.visibility = (lastAiXml != null) ? 'visible' : 'hidden';
					editGenerate.style.visibility = 'visible';
				}
				else
				{
					generateForm.style.display = '';
					editGenerate.style.visibility = 'hidden';
					magnifyGenerate.style.visibility = 'hidden';
				}
			}
			
			createButton.removeAttribute('disabled');
			templateXml = xml;
			templateLibs = libs;
			templateClibs = clibs;
			selectedElt = elt;
			templateExtUrl = extUrl;
			templateRealUrl = realUrl;
			templateInfoObj = infoObj;

			selectedElt.classList.add('geTemplateSelected');
			
			return true;
		}
		else
		{
			return false;
		}
	};

	var generateInput = document.createElement('textarea');
	generateInput.setAttribute('placeholder', mxResources.get('describeYourDiagram'));
	generateInput.className = 'geGenerateDiagramDescription';

	var generateButton = document.createElement('button');
	generateButton.className = 'geBtn gePrimaryBtn geGenerateDiagramButton';
	generateButton.setAttribute('disabled', 'disabled');
	generateButton.setAttribute('title', mxResources.get('ok'));
	mxUtils.write(generateButton, mxResources.get('ok'));

	var magnifyGenerate = magnifyImage.cloneNode(true);
	magnifyGenerate.style.display = 'none';
	var generatePreviewWasVisible = false;

	var mouseDownHandler = function(evt)
	{
		generatePreviewWasVisible = editorUi.sidebar.tooltip != null &&
			editorUi.sidebar.tooltip.style.display != 'none';
	};

	var mouseUpHandler = function(evt)
	{
		if (!generatePreviewWasVisible && lastAiXml != null)
		{
			var previewXml = '<mxfile><diagram>' + Graph.compress(lastAiXml) + '</diagram></mxfile>';
			showTooltip(previewXml, mxEvent.getClientX(evt),
				mxEvent.getClientY(evt), generateElt,
				lastAiTitle);
		}
	};
	
	mxEvent.addGestureListeners(magnifyGenerate, mouseDownHandler, null, mouseUpHandler);
	
	var editGenerate = magnifyImage.cloneNode(true);
	editGenerate.setAttribute('src', Editor.editImage);
	editGenerate.setAttribute('title', mxResources.get('edit'));
	editGenerate.style.visibility = 'hidden';
	editGenerate.style.left = '0px';

	var helpGenerate = magnifyImage.cloneNode(true);
	helpGenerate.setAttribute('src', Editor.helpImage);
	helpGenerate.setAttribute('title', mxResources.get('help'));

	mxEvent.addListener(helpGenerate, 'click', function(evt)
	{
		editorUi.openLink('https://www.drawio.com/blog/write-query-generate-diagram');
		mxEvent.consume(evt);
	});
	
	generateForm.appendChild(generateInput);
	generateForm.appendChild(generateButton);
	generateForm.appendChild(helpGenerate);
	generateForm.style.display = 'none';

	function createGenerate()
	{
		generateForm.style.display = '';
		generatePreview.style.display = 'none';
		editGenerate.style.visibility = 'hidden';
		magnifyGenerate.style.visibility = 'hidden';
		generateInput.focus();

		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
		{
			generateInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};

	mxEvent.addListener(editGenerate, 'click', createGenerate);

	function updateGenerateButtonState()
	{
		if (generateInput.value != '')
		{
			generateButton.removeAttribute('disabled');
		}
		else
		{
			generateButton.setAttribute('disabled', 'disabled');
		}
	};

	mxEvent.addListener(generateInput, 'input', updateGenerateButtonState);

	function stopInput()
	{
		generatePreview.style.backgroundImage = generateBackground;
		generatePreview.style.backgroundSize = 'contain';
		generateForm.style.display = 'none';
		generatePreview.style.display = '';
		editGenerate.style.visibility = 'visible';
		magnifyGenerate.style.visibility = 'visible';
	};

	var generatingDiagram = false;

	function generateDiagram(cancel)
	{
		if (generatingDiagram)
		{
			return;
		}

		generatingDiagram = true;
		var desc = mxUtils.trim(generateInput.value);

		if (!cancel && desc != '')
		{
			generatePreview.style.backgroundImage = 'url(' + Editor.spinImage + ')';
			generatePreview.style.backgroundSize = '12px 12px';
			generatePreview.style.display = '';
			generateForm.style.display = 'none';

			editorUi.generateOpenAiMermaidDiagram(desc, function(xml)
			{
				generatingDiagram = false;

				if (selectedElt == generateElt && generateForm.style.display == 'none')
				{
					generateBackground = 'url(' + Editor.createSvgDataUri(
						mxUtils.getXml(editorUi.getSvgForXml(xml))) + ')';
					generateElt.setAttribute('title', desc);
					magnifyGenerate.style.display = '';
					templateXml = xml;
					lastAiXml = xml;
					lastAiTitle = desc;
					stopInput();

					if (insertWasPressed)
					{
						create();
					}
				}
			}, mxUtils.bind(this, function(e)
			{
				generatingDiagram = false;

				if (selectedElt == generateElt)
				{
					generateForm.style.display = '';
					generatePreview.style.display = 'none';
					editGenerate.style.visibility = 'hidden';
					magnifyGenerate.style.visibility = 'hidden';
					editorUi.handleError(e);
				}
			}));
		}
		else if (lastAiTitle != null)
		{
			generateInput.value = lastAiTitle;
			stopInput();
		}
	};

	mxEvent.addListener(generateButton, 'click', function()
	{
		generateDiagram();
	});	

	mxEvent.addListener(generateInput, 'keydown', function(evt)
	{
		if (evt.keyCode == 13 && !mxEvent.isShiftDown(evt))
		{
			generateDiagram();
			mxEvent.consume(evt);
		}
		else if (evt.keyCode == 27)
		{
			generateDiagram(true);
			mxEvent.consume(evt);
		}
	});

	function addButton(url, libs, title, tooltip, select, imgUrl, infoObj, onClick, preview, noImg, clibs, templateType)
	{
		var elt = null;

		if (templateType != 'generative' || generateElt == null)
		{
			elt = document.createElement('div');
			elt.className = 'geTemplate';
			var xmlData = null, realUrl = url;
			
			if (title != null)
			{
				elt.setAttribute('title', mxResources.get(title, null, title));
			}
			else if (tooltip != null && tooltip.length > 0)
			{
				elt.setAttribute('title', tooltip);
			}
		}
		else
		{
			elt = generateElt;
		}
			
		function loadXmlData(url, callback)
		{
			if (xmlData == null)
			{
				realUrl = url;
		
				if (/^https?:\/\//.test(realUrl))
				{
					realUrl = editorUi.editor.isCorsEnabledForUrl(realUrl) ? realUrl :
						PROXY_URL + '?url=' + encodeURIComponent(realUrl);
				}
				else
				{
					realUrl = TEMPLATE_PATH + '/' + realUrl;
				}
				
				mxUtils.get(realUrl, mxUtils.bind(this, function(req)
				{
					if (req.getStatus() >= 200 && req.getStatus() <= 299)
					{
						xmlData = req.getText();
						callback(xmlData, realUrl);
					}
					else
					{
						callback(xmlData, realUrl);	
					}				
				}));
			}
			else
			{
				callback(xmlData, realUrl);
			}
		};

		function loadTooltip(evt, tooltipTitle)
		{
			if (url != null && !loading && editorUi.sidebar.currentElt != elt)
			{
				editorUi.sidebar.hideTooltip();
				
				if (extImg != null)
				{
					// Create a diagram with the image to use the same code
					// Note: Without compression it doesn't work for some reason. Find out why later
					var xml = '<mxfile><diagram>' + Graph.compress('<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>' +
						'<mxCell id="2" value="" style="shape=image;image=' + extImg.src + ';imageAspect=1;" parent="1" vertex="1">' +
						'<mxGeometry width="' + extImg.naturalWidth + '" height="' + extImg.naturalHeight + '" as="geometry" />' +
						'</mxCell></root></mxGraphModel>') + '</diagram></mxfile>';
					showTooltip(xml, mxEvent.getClientX(evt), mxEvent.getClientY(evt), title, url);
					return;
				}
				
				editorUi.sidebar.currentElt = elt;
				loading = true;
				
				loadXmlData(url, function(xml)
				{
					if (loading && editorUi.sidebar.currentElt == elt)
					{
						try
						{
							showTooltip(xml, mxEvent.getClientX(evt),
								mxEvent.getClientY(evt), elt,
								tooltipTitle);
						}
						catch (e)
						{
							editorUi.sidebar.currentElt = null;
							editorUi.handleError(e);
						}
					}
					
					loading = false;
				});
			}
			else
			{
				editorUi.sidebar.hideTooltip();
			}
		};

		var span = document.createElement('span');
		span.className = 'geAdaptiveAsset';
		mxUtils.write(span, mxResources.get(title, null, title));

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
			extImg = img;
			
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
			};
			
			mxEvent.addGestureListeners(elt, mxUtils.bind(this, function(evt)
			{
				selectElement(elt, null, null, url, infoObj, clibs);
			}), null, null);
			
			mxEvent.addListener(elt, 'dblclick', function(evt)
			{
				create();
				mxEvent.consume(evt);
			});
		}
		else if (!noImg && url != null && url.length > 0)
		{
			var png = preview || (TEMPLATE_PATH + '/' + url.substring(0, url.length - 4) + '.png');
			var preview = generatePreview.cloneNode(false);
			preview.style.backgroundImage = 'url(' + png + ')';
			preview.style.display = '';
			elt.appendChild(preview);
			
			if (title != null)
			{
				elt.appendChild(span);
			}
			
			function activate(doCreate)
			{
				if (spinner.spin(div))
				{
					loadXmlData(url, function(xml, realUrl)
					{
						spinner.stop();
						
						if (xml != null)
						{
							selectElement(elt, xml, libs, null, null, clibs, realUrl);
							
							if (doCreate)
							{
								create();
							}
						}
					});
				}
			};
			
			mxEvent.addGestureListeners(elt, mxUtils.bind(this, function(evt)
			{
				activate();
			}), null, null);

			mxEvent.addListener(elt, 'dblclick', function(evt)
			{
				activate(true);
				mxEvent.consume(evt);
			});
		}
		else
		{
			elt.appendChild(span);

			if (templateType == 'generative' && generateElt == null)
			{
				elt.appendChild(generatePreview);
				elt.appendChild(generateForm);
				elt.appendChild(magnifyGenerate);
				elt.appendChild(editGenerate);
				generateElt = elt;
			}

			if (select)
			{
				selectElement(elt);
			}

			if (onClick != null)
			{
				mxEvent.addGestureListeners(elt, null, null, mxUtils.bind(this, function(evt)
				{
					selectElement(elt, null, null, url, infoObj);
				}));
				
				mxEvent.addListener(elt, 'click', onClick);
			}
			else
			{
				mxEvent.addListener(elt, 'click', function(evt)
				{
					if (selectElement(elt, null, null, url, infoObj) && templateType == 'generative')
					{
						if (lastAiXml == null)
						{
							createGenerate();
						}
					}
				});

				mxEvent.addListener(elt, 'dblclick', function(evt)
				{
					if (templateType != 'generative')
					{
						create();
					}
					else if (generateForm.style.display == 'none')
					{
						createGenerate();
					}
					
					mxEvent.consume(evt);
				});
			}
		}
		
		// Adds preview button
		if (url != null)
		{
			var magnify = magnifyImage.cloneNode(true);
			elt.appendChild(magnify);
			
			mxEvent.addGestureListeners(magnify, mxUtils.bind(this, function(evt)
			{
				wasVisible = editorUi.sidebar.currentElt == elt;
			}), null, null);
			
			mxEvent.addListener(magnify, 'click', mxUtils.bind(this, function(evt)
			{
				if (!wasVisible)
				{
					loadTooltip(evt, (title != null) ? title : tooltip);
				}
				
				mxEvent.consume(evt);
			}));
		}

		div.appendChild(elt);
		return elt;
	};

	var categories = {}, subCategories = {}, customCats = {};
	var customCatCount = 0, firstInitUi = true;
	var currentEntry = null, lastEntry = null;

	// Adds local basic templates
	categories['basic'] = noBlank? [] : [{title: 'blankDiagram'}];
	var templates = categories['basic'];

	if (Editor.enableAi &&
		editorUi.isExternalDataComms() &&
		editorUi.getServiceName() == 'draw.io' &&
		EditorUi.isMermaidSupported())
	{
		categories['basic'].push({title: 'generate', type: 'generative'});
	}
	
	function resetTemplates()
	{
		if (lastEntry != null)
		{
			lastEntry.click();
			lastEntry = null;
		}
	};
	
	function filterTemplates()
	{
		var searchTerms = tmplSearchInput.value;
		
		if (searchTerms == '')
		{
			resetTemplates();
			return;
		}
		
		if (NewDialog.tagsList[templateFile] == null)
		{
			var tagsList = {};
			
			for (var cat in categories)
			{
				if (categories[cat].content == null)
				{
					var templateList = categories[cat];
					
					for (var i = 0; i < templateList.length; i++)
					{
						var temp = templateList[i];
						
						if (temp.tags != null)
						{
							var tags = temp.tags.toLowerCase().split(';');
							
							for (var j = 0; j < tags.length; j++)
							{
								if (tagsList[tags[j]] == null)
								{
									tagsList[tags[j]] = [];
								}
								
								tagsList[tags[j]].push(temp);
							}
						}
					}
				}
			}
			
			NewDialog.tagsList[templateFile] = tagsList;
		}

		var tmp = searchTerms.toLowerCase().split(' ');
		tagsList = NewDialog.tagsList[templateFile];
		
		if (customCatCount > 0 && tagsList.__tagsList__ == null)
		{
			for (var cat in customCats)
			{
				var templateList = customCats[cat];
				
				for (var i = 0; i < templateList.length; i++)
				{
					var temp = templateList[i];
					var tags = temp.title.split(' ');
					tags.push(cat);
					
					for (var j = 0; j < tags.length; j++)
					{
						var tag = tags[j].toLowerCase();
						
						if (tagsList[tag] == null)
						{
							tagsList[tag] = [];
						}
						
						tagsList[tag].push(temp);
					}
				}				
			}
			
			tagsList.__tagsList__ = true;
		}
		
		var results = [], resMap = {}, index = 0;
		
		for (var i = 0; i < tmp.length; i++)
		{
			if (tmp[i].length > 0)
			{
				var list = tagsList[tmp[i]];
				var tmpResMap = {};
				results = [];
				
				if (list != null)
				{
					for (var j = 0; j < list.length; j++)
					{
						var temp = list[j];
						
						//ANDing terms
						if ((index == 0) == (resMap[temp.url] == null))
						{
							tmpResMap[temp.url] = true;
							results.push(temp);
						}
					}
				}
				
				resMap = tmpResMap;
				index++;
			}
		}
		
		div.scrollTop = 0;
		div.innerText = '';
		i0 = 0;
		var msgDiv = document.createElement('div');
		msgDiv.style.padding = '6px';
		msgDiv.style.whiteSpace = 'nowrap';
		msgDiv.style.overflow = 'hidden';
		msgDiv.style.textOverflow = 'ellipsis';
		var temp = mxResources.get(results.length == 0 ?
			'noResultsFor' : 'resultsFor', [searchTerms]);
		msgDiv.setAttribute('title', temp);
		mxUtils.write(msgDiv, temp);
		div.appendChild(msgDiv);

		if (currentEntry != null && lastEntry == null)
		{
			currentEntry.style.backgroundColor = '';
			lastEntry = currentEntry;
			currentEntry = msgDiv; //To prevent NPE later
		}

		templates = results;
		oldTemplates = null;
		addTemplates(false);
	};
	
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
							div.innerText = '';
							i0 = 0;
							
							templates = customCats[cat2];
							oldTemplates = null;
							addTemplates(false);
						}
					});
				})(cat, entry);
			}
			
			title = document.createElement('div');
			title.style.cssText = titleCss;
			mxUtils.write(title, 'draw.io');
			list.appendChild(title);
		}
		
		function getEntryTitle(cat, templateList)
		{
			var label = mxResources.get(cat, null,
				cat.substring(0, 1).toUpperCase() +
				cat.substring(1));
			
			if (label.length > 18)
			{
				label = label.substring(0, 18) + '&hellip;';
			}
			
			return label + ((templateList != null) ?
				' (' + templateList.length + ')' : '');
		};
		
		function addEntryHandler(cat, entry, subCat)
		{
			mxEvent.addListener(entry, 'click', function()
			{
				if (currentEntry != entry)
				{
					if (currentEntry != null)
					{
						currentEntry.style.backgroundColor = '';
					}
					
					currentEntry = entry;
					currentEntry.style.backgroundColor = leftHighlight;

					div.scrollTop = 0;
					div.innerText = '';
					i0 = 0;

					if (categories[cat].content != null)
					{
						div.appendChild(categories[cat].content);
						templateXml = lastAiXml;
						templates = null;

						if (categories[cat].content.init != null)
						{
							categories[cat].content.init();
						}
					}
					else
					{
						templates = subCat? subCategories[cat][subCat] : categories[cat];
						oldTemplates = null;
						addTemplates(false);
					}
				}
			});
		};
			
		for (var cat in categories)
		{
			var templateList = null;
			var clickElem = null;

			if (categories[cat].content != null)
			{
				var entry = document.createElement(subCats? 'ul' : 'div');
				var title = getEntryTitle(cat);

				entry.style.cssText = 'display:block;cursor:pointer;padding:6px;white-space:nowrap;margin-bottom:-1px;overflow:hidden;text-overflow:ellipsis;user-select:none;transition: all 0.5s;';
				entry.setAttribute('title', title);
				mxUtils.write(entry, title);

				list.appendChild(entry);
				clickElem = entry;
			}
			else
			{
				var subCats = subCategories[cat];
				var entry = document.createElement(subCats? 'ul' : 'div');
				var clickElem = entry;
				templateList = categories[cat];
				var entryTitle = getEntryTitle(cat, templateList);
				
				if (subCats != null)
				{
					var entryLi = document.createElement('li');
					var entryDiv = document.createElement('div');
					entryDiv.className = 'geTempTreeCaret';
					entryDiv.setAttribute('title', entryTitle);
					mxUtils.write(entryDiv, entryTitle);
					clickElem = entryDiv;
					entryLi.appendChild(entryDiv);
					//We support one level deep only
					var subUl = document.createElement('ul');
					subUl.className = 'geTempTreeNested';
					subUl.style.visibility = 'hidden';
					
					for (var subCat in subCats)
					{
						var subLi = document.createElement('li');
						var subTitle = getEntryTitle(subCat, subCats[subCat]);
						subLi.setAttribute('title', subTitle);
						mxUtils.write(subLi, subTitle);
						addEntryHandler(cat, subLi, subCat);
						subUl.appendChild(subLi);
					}
					
					entryLi.appendChild(subUl);
					entry.className = 'geTempTree';
					entry.appendChild(entryLi);
					
					(function(subUl2, entryDiv2)
					{
						mxEvent.addListener(entryDiv2, 'click', function()
						{
							subUl2.style.visibility = 'visible';
							subUl2.classList.toggle('geTempTreeActive');
							
							if (subUl2.classList.toggle('geTempTreeNested'))
							{
								//Must hide sub elements to allow click on elements above it
								setTimeout(function()
								{
									subUl2.style.visibility = 'hidden';
								}, 550);
							}
							
							entryDiv2.classList.toggle('geTempTreeCaret-down');
						});
					})(subUl, entryDiv);
				}
				else
				{
					entry.style.cssText = 'display:block;cursor:pointer;padding:6px;white-space:nowrap;margin-bottom:-1px;overflow:hidden;text-overflow:ellipsis;user-select:none;transition: all 0.5s;';
					entry.setAttribute('title', entryTitle);
					mxUtils.write(entry, entryTitle);
				}
				
				if (itemPadding != null)
				{
					entry.style.padding = itemPadding;
				}

				list.appendChild(entry);
			}

			addEntryHandler(cat, clickElem);

			if (currentEntry == null)
			{
				clickElem.click();
			}
		}
		
		addTemplates(false);
	};

	if (!compact)
	{
		outer.appendChild(searchBox);
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
							if (node.nodeName == 'parsererror')
							{
								if (window.console != null)
								{
									console.log('Parser error in ' +
										templateFile + ': ' +
										node.textContent);
								}
							}
							else if (node.nodeName == 'clibs')
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
									var subCategory = node.getAttribute('subsection');
									
									if (category == null)
									{
										var slash = url.indexOf('/');
										category = url.substring(0, slash);
										
										if (subCategory == null)
										{
											var nextSlash = url.indexOf('/', slash + 1);
											
											if (nextSlash > -1)
											{
												subCategory = url.substring(slash + 1, nextSlash);
											}
										}
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
									
									var tempObj = {url: node.getAttribute('url'), libs: node.getAttribute('libs'),
										title: node.getAttribute('title'), tooltip: node.getAttribute('name') || node.getAttribute('url'),
										preview: node.getAttribute('preview'), clibs: tempLibs, tags: node.getAttribute('tags')};
									list.push(tempObj);
										
									if (subCategory != null)
									{
										var subCats = subCategories[category];
										
										if (subCats == null)
										{
											subCats = {};
											subCategories[category] = subCats;
										}
										
										var subCatList = subCats[subCategory];
										
										if (subCatList == null)
										{
											subCatList = [];
											subCats[subCategory] = subCatList;
										}
										
										subCatList.push(tempObj);
									}
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

	if (!compact && urlParams['embed'] != '1' && !createOnly && !mxClient.IS_ANDROID &&
		!mxClient.IS_IOS && urlParams['noDevice'] != '1')
	{
		var fromTmpBtn = mxUtils.button(mxResources.get('fromTemplateUrl'), function()
		{
			var dlg = new FilenameDialog(editorUi, '', mxResources.get('create'), function(fileUrl)
			{
				if (fileUrl != null && fileUrl.length > 0)
				{
					editorUi.editor.loadUrl(editorUi.editor.getProxiedUrl(fileUrl), function(data)
					{
						templateXml = data;
						templateLibs = null;
						templateRealURl = fileUrl;

						editorUi.hideDialog();
						create();
					}, function(err)
					{
						editorUi.handleError(err);
					});
				}
			}, mxResources.get('url'), null, null, null, false);
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

NewDialog.tagsList = {};

/**
 * 
 */
var SaveDialog = function(editorUi, title, saveFn, disabledModes, data, mimeType,
	base64Encoded, defaultMode, folderPickerMode, enabledModes, saveBtnLabel)
{
	var div = document.createElement('div');
	div.style.display = 'flex';
	div.style.flexWrap = 'wrap';
	div.style.whiteSpace = 'nowrap';

	var table = document.createElement('div');
	table.style.display = 'grid';
	table.style.gap = '5px 8px';
	table.style.gridAutoRows = 'auto auto 44px';
	table.style.gridAutoColumns = '0fr minmax(0,1fr)';
	table.style.width = '100%';

	var preview = null;
	var copyBtn = null;

	// Disables SVG preview if SVG is not supported in browser
	if (data != null && mimeType != null && (mimeType.substring(0, 6) == 'image/' &&
		(mimeType.substring(0, 9) != 'image/svg' || mxClient.IS_SVG)))
	{
		table.style.display = 'inline-grid';
		table.style.flexBasis = '75%';

		preview = document.createElement('div');
		preview.style.display = 'inline-block';
		preview.style.height = 'auto';
		preview.style.maxWidth = '25%';
		preview.style.margin = 'auto';

		var img = document.createElement('img');
		var temp = (base64Encoded) ? data : btoa(unescape(encodeURIComponent(data)));
		var dataUri = 'data:' + mimeType + ';base64,' + temp;
		img.setAttribute('src', dataUri);
		img.style.boxSizing = 'border-box';
		img.style.maxHeight = '50px';
		img.style.maxWidth = '100%';
		img.style.paddingLeft = '10px';
		preview.appendChild(img);

		if ((mimeType == 'image/png' || mimeType == 'image/svg+xml') &&
			typeof window.ClipboardItem === 'function' &&
			navigator.clipboard != null)
		{
			copyBtn = mxUtils.button(mxResources.get('copy'), function()
			{
				editorUi.writeImageToClipboard(dataUri, null, null, mimeType,
					mxUtils.bind(this, function()
					{
						if (defaultMode == 'copy')
						{
							editorUi.hideDialog();
						}
						else
						{
							editorUi.alert(mxResources.get('copiedToClipboard'));
						}
					}),
					mxUtils.bind(this, function(e)
					{
						editorUi.handleError(e);
					}));
			}, null, 'geBtn');
		}

		if (Editor.popupsAllowed && (disabledModes == null ||
			mxUtils.indexOf(disabledModes, '_blank') < 0))
		{
			preview.setAttribute('title', mxResources.get('openInNewWindow'));
			preview.style.cursor = 'pointer';
			
			mxEvent.addGestureListeners(preview, null, null, function(evt)
			{
				if (!mxEvent.isPopupTrigger(evt))
				{
					editorUi.openInNewWindow(data, mimeType, base64Encoded);
				}
			});
		}
		else
		{
			preview.setAttribute('title', mxResources.get('preview'));
		}
	}
	
	var left = document.createElement('div');
	left.style.display = 'flex';
	left.style.padding = '1px';
	left.style.alignItems = 'center';
	left.style.justifyContent = 'flex-end';
	left.style.gridColumn = '1';
	left.style.whiteSpace = 'nowrap';

	var right = document.createElement('div');
	right.style.display = 'grid';
	right.style.padding = '1px';
	right.style.alignItems = 'center';
	right.style.gridColumn = '2';
	right.style.gridAutoColumns = 'minmax(0,1fr) auto';
	right.style.gap = '6px';
	
	mxUtils.write(left, mxResources.get('saveAs') + ':');

	var saveAsInput = document.createElement('input');
	saveAsInput.setAttribute('type', 'text');
	saveAsInput.setAttribute('value', title);
	saveAsInput.style.boxSizing = 'border-box';
	saveAsInput.style.width = '100%';
	right.appendChild(saveAsInput);

	if (folderPickerMode == null)
	{
		table.appendChild(left);
		table.appendChild(right);
	}

	var typeSelect = null;

	if (editorUi.editor.diagramFileTypes != null && mimeType == null &&
		folderPickerMode == null)
	{
		left = left.cloneNode(false);
		right = right.cloneNode(false);

		mxUtils.write(left, mxResources.get('type') + ':');
		
		typeSelect = FilenameDialog.createFileTypes(editorUi, saveAsInput,
			editorUi.editor.diagramFileTypes);
		typeSelect.style.boxSizing = 'border-box';
		typeSelect.style.width = '100%';
		right.appendChild(typeSelect);

		table.appendChild(left);
		table.appendChild(right);
	}
	
	left = left.cloneNode(false);
	right = right.cloneNode(false);

	mxUtils.write(left, mxResources.get('where') + ':');

	var storageSelect = document.createElement('select');
	storageSelect.style.textOverflow = 'ellipsis';
	storageSelect.style.gridColumn = '1';

	var localServices = ['browser', 'device', 'download', '_blank'];
	var dash = '&nbsp;&nbsp;&#8211&nbsp;&nbsp;';
	
	function addStorageEntry(mode, path, id, selected, title, entryType)
	{
		var option = null;

		if ((disabledModes == null || mxUtils.indexOf(disabledModes, mode) < 0) &&
			(folderPickerMode == null || mode == folderPickerMode) &&
			(enabledModes == null || mxUtils.indexOf(enabledModes, mode) >= 0))
		{
			title = (title != null) ? title : editorUi.getTitleForService(mode);
			var isLocal = mxUtils.indexOf(localServices, mode) >= 0;

			if (isLocal || editorUi.getServiceForName(mode) != null)
			{
				option = document.createElement('option');
				var state = '';

				if (!isLocal && editorUi.isOffline(mode == App.MODE_GOOGLE &&
					urlParams['gapi-stealth'] == '1'))
				{
					option.setAttribute('disabled', 'disabled');
					state = ' (' + mxResources.get('offline') + ')';
				}

				if (entryType == 'pick')
				{
					option.innerHTML = mxUtils.htmlEntities(title) + dash +
						mxUtils.htmlEntities(mxResources.get('pickFolder')) +
						'...' + state;
					option.setAttribute('value', 'pickFolder-' + mode);
					option.setAttribute('title', title + ' - ' +
						mxResources.get('pickFolder') + '...');
				}
				else
				{
					var entryId = mode + ((id != null) ? ('-' + id) : '');
					var entry = entries[entryId];

					if (entry != null && entry.option != null)
					{
						entry.option.parentNode.removeChild(entry.option);
					}

					var shortPath = null;

					if (path != null)
					{
						if (path.charAt(path.length - 1) == '/')
						{
							path = path.substring(0, path.length - 1);
						}

						if (path.charAt(0) == '/')
						{
							path = path.substring(1);
						}

						shortPath = path;

						if (mode != App.MODE_GITHUB && mode == App.MODE_GITLAB)
						{
							var idx = shortPath.lastIndexOf('/');

							if (idx >= 0)
							{
								shortPath = shortPath.substring(idx + 1);
							}
						}
						
						if (shortPath.length > 40)
						{
							shortPath = shortPath.substring(0, 20) + '...' +
								shortPath.substring(shortPath.length - 20);
						}
					}

					option.innerHTML = mxUtils.htmlEntities(title) + ((shortPath != null) ?
						dash + mxUtils.htmlEntities(shortPath) : '') + state;
					option.setAttribute('title', title + ((path != null) ? ' (' + path + ')' : '') +
						((id != null && decodeURIComponent(id) != path) ? ' [' + id + ']' : ''));
					option.setAttribute('value', entryId);
					entries[entryId] = {option: option, mode: mode, path: path, id: id};

					if (SaveDialog.lastValue == entryId && defaultMode == null &&
						!option.getAttribute('disabled') == 'disabled')
					{
						selected = true;
					}
					else if (selected == null)
					{
						if (entryType == 'root')
						{
							selected = (defaultMode == null && editorUi.mode == mode) ||
								(mode != null && mode == defaultMode);
						}
						else if (storageSelect.value.substring(0, 11) == 'pickFolder-')
						{
							selected = true;
						}
					}

					if (selected)
					{
						option.setAttribute('selected', 'selected');
					}
				}

				storageSelect.appendChild(option);
			}
		}

		return option;
	};

	var defaultValue = null;

	function pickFolder(mode)
	{
		editorUi.pickFolder(mode, function(result)
		{
			var entry = null;

			if (mode == App.MODE_GOOGLE && result.docs != null && result.docs.length > 0)
			{
				entry = {mode: mode, path: result.docs[0].name, id: result.docs[0].id};
			}
			else if (mode == App.MODE_ONEDRIVE && result.value != null && result.value.length > 0)
			{
				entry = {mode: mode, path: result.value[0].name,
					id: OneDriveFile.prototype.getIdOf(result.value[0])};
			}
			else if (mode == App.MODE_M365 && result.value != null && result.value.length > 0) {
				entry = {
					mode: mode, path: result.value[0].name,
					id: OneDriveFile.prototype.getIdOf(result.value[0])
				};
			}
			else if ((mode == App.MODE_GITHUB || mode == App.MODE_GITLAB) &&
				result != null && result.length > 0)
			{
				entry = {mode: mode, path: decodeURIComponent(result), id: result};
			}

			if (entry != null)
			{
				editorUi.addRecent(entry, 'Folders', 5);

				var option = addStorageEntry(entry.mode, entry.path, entry.id, true);
				storageSelect.innerHTML = '';
				entries = {};
				addStorageEntries();

				// Selects new entry
				var prev = storageSelect.selectedIndex;
				storageSelect.value = option.value;

				// Checks if entry exists
				// LATER: Pass value to select to addStorageEntries
				if (storageSelect.selectedIndex < 0)
				{
					storageSelect.selectedIndex = prev;
				}
			}
		}, true, true, true, true);
	};

	var entries = {};
	
	function checkExtension()
	{
		if (typeSelect != null &&  entries[storageSelect.value] != null &&
			editorUi.editor.diagramFileTypes != null &&
			editorUi.editor.diagramFileTypes[typeSelect.value].extension == 'drawio')
		{
			var ext = editorUi.getExtensionForService(entries[storageSelect.value].mode);
			var name = saveAsInput.value;

			if (ext != null && title.indexOf('.') < 0 &&
				name.indexOf('.') < 0)
			{
				saveAsInput.value = name + ext;
			}
		}
	};

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		saveAsInput.value = title;
		saveAsInput.dispatchEvent(new Event('change'));
		editorUi.resetRecent('Folders');
		storageSelect.innerHTML = '';
		storageSelect.value = '';
		pickFolderOption = null;
		entries = {};
		addStorageEntries();
	}, null, 'geBtn');

	function addStorageEntries()
	{
		var recent = editorUi.getRecent('Folders');
		var recentCount = 0;

		if (recent != null && recent.length > 0)
		{
			for (var i = 0; i < recent.length; i++)
			{
				if (addStorageEntry(recent[i].mode, recent[i].path, recent[i].id) != null)
				{
					recentCount++;
				}
			}
		}

		addStorageEntry(App.MODE_GOOGLE, mxResources.get('myDrive'),
			'root', null, null, 'root');
		addStorageEntry(App.MODE_GOOGLE, null, null, null, null, 'pick');

		if (editorUi.oneDrive != null)
		{
			addStorageEntry(App.MODE_ONEDRIVE, mxResources.get('myFiles'),
				OneDriveFile.prototype.getIdOf(editorUi.oneDrive.rootId),
				null, null, 'root');
			addStorageEntry(App.MODE_ONEDRIVE, null, null, null, null, 'pick');
		}

		if (editorUi.m365 != null)
		{
			addStorageEntry(App.MODE_M365, null, null, null, null, 'pick');
		}

		if (editorUi.dropbox != null)
		{
			addStorageEntry(App.MODE_DROPBOX, 'Apps' + editorUi.dropbox.appPath);
		}

		addStorageEntry(App.MODE_GITHUB, null, null, null, null, 'pick');
		addStorageEntry(App.MODE_GITLAB, null, null, null, null, 'pick');

		addStorageEntry(App.MODE_TRELLO);

		var allowDevice = !Editor.useLocalStorage || urlParams['storage'] == 'device' ||
			(editorUi.getCurrentFile() != null && urlParams['noDevice'] != '1');

		if (EditorUi.nativeFileSupport && allowDevice)
		{
			addStorageEntry(App.MODE_DEVICE, null, null, editorUi.mode == App.MODE_DEVICE ||
				(disabledModes != null && mxUtils.indexOf(disabledModes,
					App.MODE_BROWSER) >= 0) ? true : null);
		}
		
		if (isLocalStorage && urlParams['browser'] != '0')
		{
			addStorageEntry(App.MODE_BROWSER);
		}

		if (allowDevice)
		{
			addStorageEntry('download');
		}
		
		if (Editor.popupsAllowed)
		{
			addStorageEntry('_blank', null, null, null, mxResources.get('openInNewWindow'));
		}

		// Adds title to avoid entries that execute an action
		if (storageSelect.value.substring(0, 11) == 'pickFolder-')
		{
			var option = document.createElement('option');
			option.setAttribute('value', '');
			option.setAttribute('selected', 'selected');
			mxUtils.write(option, mxResources.get('pickFolder') + '...');
			storageSelect.insertBefore(option, storageSelect.firstChild);
		}
		
		defaultValue = storageSelect.value;
	};

	// Label is updated below
	var saveBtn = mxUtils.button('', function()
	{
		SaveDialog.lastValue = storageSelect.value;
		var entry = entries[SaveDialog.lastValue];

		if (entry != null)
		{
			saveFn(saveAsInput, entry.mode, entry.id);
		}
	}, null, 'geBtn gePrimaryBtn');

	// Handles enter key
	mxEvent.addListener(saveAsInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			if (defaultMode == 'copy' && copyBtn != null)
			{
				copyBtn.click();
			}
			else
			{
				saveBtn.click();
			}
		}
	});

	function storageChanged()
	{
		if (storageSelect.value.substring(0, 11) == 'pickFolder-')
		{
			var mode = storageSelect.value.substring(11);
			storageSelect.value = defaultValue;
			pickFolder(mode);
		}
		else
		{
			checkExtension();
		}

		saveBtn.innerHTML = '';
		mxUtils.write(saveBtn, (saveBtnLabel != null) ? saveBtnLabel :
			mxResources.get((storageSelect.value == 'download' ||
			storageSelect.value == '_blank' ||
			folderPickerMode != null) ?
				'ok' : 'save'));
		
		if (storageSelect.value == '')
		{
			saveBtn.setAttribute('disabled', 'disabled');
		}
		else
		{
			saveBtn.removeAttribute('disabled');
		}
	};
	
	mxEvent.addListener(storageSelect, 'change', storageChanged);
	addStorageEntries();

	right.appendChild(storageSelect);

	// Selects last entry
	if (SaveDialog.lastValue != null && entries[SaveDialog.lastValue] != null)
	{
		storageSelect.value = SaveDialog.lastValue;
	}

	storageChanged();
	table.appendChild(left);
	table.appendChild(right);
	div.appendChild(table);

	if (preview != null)
	{
		div.appendChild(preview);
	}

	var btns = document.createElement('div');
	btns.style.flexBasis = '100%';
	btns.style.textAlign = 'right';
	btns.style.marginTop = (mimeType != null) ? '16px' : '8px';

	if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP)
	{
		btns.appendChild(editorUi.createHelpIcon(
			'https://www.drawio.com/doc/faq/save-file-formats'));
	}

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	}, null, 'geBtn');

	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	btns.appendChild(resetBtn);

	if (defaultMode == 'copy' && copyBtn != null)
	{
		copyBtn.className = 'geBtn gePrimaryBtn';
		saveBtn.className = 'geBtn';
		btns.appendChild(saveBtn);
		btns.appendChild(copyBtn);
	}
	else
	{
		// Copy
		if (copyBtn != null)
		{
			btns.appendChild(copyBtn);
		}

		// Save
		btns.appendChild(saveBtn);
	}

	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.init = function()
	{
		Editor.selectFilename(saveAsInput);
	};

	this.container = div;
};

/**
 * Constructs a dialog for creating new files from a template URL.
 * Also used for dialog choosing where to save or export resources
 */
var CreateDialog = function(editorUi, title, createFn, cancelFn, dlgTitle, btnLabel, overrideExtension, allowBrowser,
	allowTab, helpLink, showDeviceButton, rowLimit, data, mimeType, base64Encoded, hints, hideDialog)
{
	showDeviceButton = urlParams['noDevice'] == '1'? false : showDeviceButton;
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

	var span = document.createElement('span');
	mxUtils.write(span, mxResources.get('filename') + ':');
	span.style.maxWidth = '106px';
	span.style.overflow = 'hidden';
	span.style.textOverflow = 'ellipsis';
	span.style.display = 'inline-block';
	div.appendChild(span);

	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', title);
	nameInput.style.width = '180px';
	nameInput.style.marginLeft = '10px';
	nameInput.style.marginBottom = '20px';
	nameInput.style.maxWidth = '70%';
	
	this.init = function()
	{
		Editor.selectFilename(nameInput);
	};

	div.appendChild(nameInput);

	if (hints != null && editorUi.editor.diagramFileTypes != null)
	{
		var typeSelect = FilenameDialog.createFileTypes(editorUi, nameInput, editorUi.editor.diagramFileTypes);
		typeSelect.style.marginLeft = '6px';
		typeSelect.style.width = '90px';
		div.appendChild(typeSelect);
	}
	
	var copyBtn = null;
	
	// Disables SVG preview if SVG is not supported in browser
	if (urlParams['noDevice'] != '1' && data != null && mimeType != null && (mimeType.substring(0, 6) == 'image/' &&
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
		
		if (!mxClient.IS_FF  && mimeType == 'image/png' && navigator.clipboard != null &&
			typeof window.ClipboardItem === 'function')
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
				color: 'light-dark(#000000, #C0C0C0)', // #rgb or #rrggbb
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

		if (editorUi.m365 != null)
		{
			var m365Option = document.createElement('option');
			m365Option.setAttribute('value', App.MODE_M365);
			mxUtils.write(m365Option, mxResources.get('m365'));
			serviceSelect.appendChild(m365Option);

			if (editorUi.mode == App.MODE_M365)
			{
				m365Option.setAttribute('selected', 'selected');
			}

			addLogo(IMAGE_PATH + '/onedrive-logo.svg', mxResources.get('m365'), App.MODE_M365, 'm365');
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
		(editorUi.getCurrentFile() != null/* && !mxClient.IS_IOS*/ && urlParams['noDevice'] != '1'))
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
CreateDialog.showDownloadButton = urlParams['noDevice'] != '1';

/**
 * Constructs a new popup dialog.
 */
var PopupDialog = function(editorUi, url, pre, fallback, hideDialog) 
{
	hideDialog = (hideDialog != null) ? hideDialog : true;
	
	var div = document.createElement('div');
	div.style.textAlign = 'center';
	div.style.height = '100%';
	
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
 var ImageDialog = function(editorUi, title, initialValue, fn, ignoreExisting, convertDataUri, withCrop, initClipPath)
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
	linkInput.style.backgroundImage = 'url(\'' + Editor.crossImage + '\')';
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

	var clipPath = initClipPath, cW, cH;

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
					
					fn(newValue, Math.round(Number(img.width) * s), Math.round(Number(img.height) * s), clipPath, cW, cH);
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
				fn(newValue, null, null, clipPath, cW, cH);
			}
		}
		else
		{
			newValue = editorUi.convertDataUri(newValue);
			w = (w == null) ? 120 : w;
			h = (h == null) ? 100 : h;
			
			editorUi.hideDialog();				
			fn(newValue, w, h, clipPath, cW, cH);
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
				if (dropElt == null)
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

	mxEvent.addListener(linkInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			apply(linkInput.value);
		}
	});

	var cropBtn = mxUtils.button(mxResources.get('crop'), function()
	{
		var dlg = new CropImageDialog(editorUi, linkInput.value, clipPath, 
				function(clipPath_p, width, height)
			{
				clipPath = clipPath_p;
				cW = width;
				cH = height;
			});
	   
		editorUi.showDialog(dlg.container, 380, 390, true, true,
			null, null, null, new mxRectangle(0, 0, 440, 450));
	});
	
	if (withCrop)
 	{
 		cropBtn.className = 'geBtn';
		btns.appendChild(cropBtn);
	}
	
	var embedBtn = mxUtils.button(mxResources.get('embed'), function()
	{
		if (linkInput.value.substring(0, 5) != 'data:' && editorUi.spinner.spin(
			document.body, mxResources.get('loading')))
		{
			var converter = editorUi.editor.createImageUrlConverter();
			var src = converter.convert(linkInput.value);
			var img = new Image();

			img.onload = function()
			{
				editorUi.editor.convertImageToDataUri(src, function(uri)
				{
					editorUi.confirmImageResize(function(doResize)
					{
						editorUi.resizeImage(img, uri, mxUtils.bind(this, function(data2, w2, h2)
						{
							editorUi.spinner.stop();

							// Refuses to insert images above a certain size as they kill the app
							if (data2 != null && data2.length < editorUi.maxImageBytes)
							{
								linkInput.value = data2;
								updateButtonStates();
							}
							else
							{
								editorUi.handleError({message: mxResources.get('imageTooBig')});
							}
						}), doResize, editorUi.maxImageSize);
					}, img.width > editorUi.maxImageSize || img.height > editorUi.maxImageSize ||
						uri.length > editorUi.maxImageBytes);
				}, mxUtils.bind(this, function()
				{
					editorUi.handleError({message: mxResources.get('fileNotFound')});
				}));
			};

			img.onerror = function()
			{
				editorUi.spinner.stop();
				editorUi.handleError({message: mxResources.get('fileNotFound')});
			};

			img.src = src;
		}
	});

	function updateButtonStates()
	{
		if (linkInput.value.length > 0)
		{
			cropBtn.removeAttribute('disabled');
		}
		else
		{
			cropBtn.setAttribute('disabled', 'disabled');
		}

		if (linkInput.value.substring(0, 5) != 'data:')
		{
			embedBtn.removeAttribute('disabled');
		}
		else
		{
			embedBtn.setAttribute('disabled', 'disabled');
		}
	};

	embedBtn.className = 'geBtn';

	mxEvent.addListener(linkInput, 'change', function(e)
	{
		clipPath = null;
		updateButtonStates();
	});

	updateButtonStates();
	btns.appendChild(embedBtn);
	
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
	div.style.paddingBottom = '10px';

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get('editLink'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
	div.appendChild(hd);

	var urlRadio = document.createElement('input');
	urlRadio.setAttribute('value', 'url');
	urlRadio.setAttribute('type', 'radio');
	urlRadio.setAttribute('name', 'geLinkDialogOption');

	var pageRadio = document.createElement('input');
	pageRadio.setAttribute('value', 'url');
	pageRadio.setAttribute('type', 'radio');
	pageRadio.setAttribute('name', 'geLinkDialogOption');

	// Third option: a custom action encoded as a data:action/json,... URI.
	// Currently the only editable action kind is "animation"; the picker is
	// shaped to grow (toggle, highlight, etc. can plug in later).
	var actionRadio = document.createElement('input');
	actionRadio.setAttribute('value', 'action');
	actionRadio.setAttribute('type', 'radio');
	actionRadio.setAttribute('name', 'geLinkDialogOption');

	// Holds the current encoded action URL (data:action/json,...). Updated
	// when the user finishes editing via CustomActionDialog.
	var actionValue = (initialValue != null &&
		initialValue.substring(0, 17) == 'data:action/json,') ? initialValue : null;

	var linkInput = document.createElement('input');
	linkInput.setAttribute('placeholder', mxResources.get('dragUrlsHere'));
	linkInput.setAttribute('type', 'text');
	linkInput.style.flex = '1';
	linkInput.style.minWidth = '0';

	var cross = document.createElement('div');
	cross.setAttribute('title', mxResources.get('reset'));
	cross.style.backgroundImage = 'url(' + Editor.crossImage + ')';
	cross.className = 'geAdaptiveAsset';
	cross.style.width = '12px';
	cross.style.height = '14px';
	cross.style.cursor = 'pointer';
	cross.style.flexShrink = '0';
	cross.style.marginLeft = '-20px';
	cross.style.marginRight = '8px';

	mxEvent.addListener(cross, 'click', function()
	{
		linkInput.value = '';
		linkInput.focus();
	});

	var pageSelect = document.createElement('select');
	pageSelect.style.flex = '1';
	pageSelect.style.minWidth = '0';
	pageSelect.style.marginLeft = '0';

	var newWindowCheckbox = document.createElement('input');
	newWindowCheckbox.setAttribute('type', 'checkbox');

	if (linkTarget != null)
	{
		newWindowCheckbox.setAttribute('checked', 'checked');
		newWindowCheckbox.defaultChecked = true;
	}

	linkTarget = (linkTarget != null) ? linkTarget : '_blank';
	newWindowCheckbox.setAttribute('title', linkTarget);

	// Link section
	var linkSection = document.createElement('div');
	linkSection.className = 'geDialogSection';

	if (showPages && editorUi.pages != null)
	{
		if (actionValue != null)
		{
			actionRadio.setAttribute('checked', 'checked');
			actionRadio.defaultChecked = true;
		}
		else if (initialValue != null && Graph.isPageLink(initialValue))
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

		// URL row
		var urlRow = document.createElement('div');
		urlRow.className = 'geDialogCheckRow';
		urlRow.appendChild(urlRadio);
		urlRow.appendChild(linkInput);
		urlRow.appendChild(cross);

		if (showNewWindowOption)
		{
			var nwLabel = document.createElement('label');
			nwLabel.style.display = 'flex';
			nwLabel.style.alignItems = 'center';
			nwLabel.style.gap = '4px';
			nwLabel.style.marginLeft = '8px';
			nwLabel.style.whiteSpace = 'nowrap';
			nwLabel.style.fontSize = '13px';
			nwLabel.appendChild(newWindowCheckbox);
			mxUtils.write(nwLabel, mxResources.get('openInNewWindow'));
			urlRow.appendChild(nwLabel);
		}

		linkSection.appendChild(urlRow);

		// Page row
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

		var pageRow = document.createElement('div');
		pageRow.className = 'geDialogCheckRow';
		pageRow.style.marginTop = '6px';
		pageRow.appendChild(pageRadio);
		pageRow.appendChild(pageSelect);
		linkSection.appendChild(pageRow);

		// Action row — third option. Shows a summary of the current action
		// and an "Edit…" button that opens the CustomActionDialog.
		var actionRow = document.createElement('div');
		actionRow.className = 'geDialogCheckRow';
		actionRow.style.marginTop = '6px';
		actionRow.appendChild(actionRadio);

		var actionSummary = document.createElement('span');
		// line-height keeps descenders (g, y, p) from being cropped by the
		// overflow:hidden that drives the horizontal ellipsis.
		actionSummary.style.cssText = 'flex:1;min-width:0;font-size:13px;' +
			'line-height:1.5;' +
			'color:light-dark(#1d1d1f,#e0e0e0);' +
			'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' +
			'margin-left:8px';

		// Button label flips between Insert (no action yet) and Edit
		// (an action is configured) so we can drop the dedicated
		// noActionYet resource — the empty state is conveyed by the
		// label "Action" + the "Insert" affordance on the button.
		var editActionBtn = mxUtils.button('', function()
		{
			actionRadio.checked = true;

			// editCustomAction hides the LinkDialog modal first, then opens
			// a non-modal CustomActionDialog. Once the user saves there, we
			// go directly through fn() to write the link onto the cell —
			// the LinkDialog is already gone so we can't round-trip back
			// through its OK button.
			LinkDialog.editCustomAction(editorUi, actionValue, function(newValue)
			{
				actionValue = newValue;
				fn(newValue, LinkDialog.selectedDocs,
					(newWindowCheckbox.checked) ? linkTarget : null);
			});
		});
		editActionBtn.className = 'geBtn';

		var updateActionSummary = function()
		{
			actionSummary.textContent = '';

			if (actionValue == null)
			{
				mxUtils.write(actionSummary,
					mxResources.get('action', null, 'Action'));
				editActionBtn.textContent = mxResources.get('insert', null, 'Insert');
				return;
			}

			editActionBtn.textContent = mxResources.get('edit', null, 'Edit');

			try
			{
				var json = JSON.parse(actionValue.substring(17));
				var label;

				// Prefer the user's title — it's set explicitly in the
				// custom-action dialog and tends to be more descriptive
				// than any auto-generated summary.
				if (typeof json.title == 'string' && json.title.trim() != '')
				{
					label = json.title.trim();
				}
				else
				{
					var n = (json.actions != null) ? json.actions.length : 0;
					var first = (n > 0) ? Object.keys(json.actions[0])[0] : '';

					// "Effects (3 steps)" fallback — labels a cell-link
					// custom action whose payload is `{animation:{steps:[…]}}`.
					if (first == 'animation' && json.actions[0].animation.steps != null)
					{
						var sc = json.actions[0].animation.steps.length;
						var name = mxResources.get('effects', null, 'Effects');
						label = name + ' (' + sc + ')';
					}
					else if (first != '')
					{
						// Resolve the action key (e.g. "fadeIn") to its
						// human-readable, capitalized, localized label
						// via the schema catalogue ("Fade In"). Falls
						// back to the raw key only if the schema is
						// unknown for some reason. `schema.labelKey`
						// overrides the default key→resource lookup
						// (used by viewbox → `view`).
						var schema = (CustomActionDialog != null) ?
							CustomActionDialog.SCHEMAS[first] : null;
						var fallback = (schema != null) ? schema.label : first;
						var resKey = (schema != null && schema.labelKey) ?
							schema.labelKey : first;
						label = mxResources.get(resKey, null, fallback);
					}
					else
					{
						label = mxResources.get('action', null, 'Action');
					}
				}

				mxUtils.write(actionSummary, label);
			}
			catch (e)
			{
				mxUtils.write(actionSummary, '(' +
					mxResources.get('invalid', null, 'invalid') + ')');
			}
		};

		updateActionSummary();
		actionRow.appendChild(actionSummary);

		editActionBtn.style.marginLeft = '8px';
		actionRow.appendChild(editActionBtn);

		linkSection.appendChild(actionRow);
	}
	else
	{
		linkInput.setAttribute('value', initialValue);

		var urlRow = document.createElement('div');
		urlRow.className = 'geDialogFormRow';
		urlRow.appendChild(linkInput);
		urlRow.appendChild(cross);
		linkSection.appendChild(urlRow);
	}

	div.appendChild(linkSection);

	var mainBtn = mxUtils.button(btnLabel, function()
	{
		editorUi.hideDialog();

		var value;

		if (actionRadio.checked)
		{
			value = (actionValue != null) ? actionValue : initialValue;
		}
		else if (pageRadio.checked)
		{
			value = (pageSelect.value !== 'pageNotFound') ?
				pageSelect.value : initialValue;
		}
		else
		{
			value = linkInput.value;
		}

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
		if (Graph.fileSupport && div.parentNode != null)
		{
			// Setup the dnd listeners
			var dlg = div.parentNode;
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
				if (dropElt == null)
				{
					dropElt = editorUi.highlightElement(dlg);
				}

				evt.stopPropagation();
				evt.preventDefault();
			}));

			mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function(evt)
			{
				try
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
				}
				catch (e)
				{
					editorUi.handleError(e);
				}

				evt.stopPropagation();
				evt.preventDefault();
			}), false);
		}
	};

	var btns = document.createElement('div');
	btns.style.marginTop = '34px';
	btns.style.textAlign = 'right';

	if (!editorUi.isOffline())
	{
		btns.appendChild(editorUi.createHelpIcon('https://www.drawio.com/doc/faq/custom-links'));
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
				href = 'https://app.diagrams.net/#G' + data.docs[0].id;
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

	var selectDropdown = document.createElement('select');
	selectDropdown.className = 'geBtn';
	selectDropdown.style.position = 'relative';
	selectDropdown.style.top = '1px';
	selectDropdown.style.maxWidth = '120px';
	var selectFn = {};

	var option = document.createElement('option');
	mxUtils.write(option, mxResources.get('select') + '...');
	option.value = '';
	selectDropdown.appendChild(option);

	function addButton(key, fn)
	{
		var option = document.createElement('option');
		mxUtils.write(option, mxResources.get(key));
		option.value = key;
		selectDropdown.appendChild(option);
		selectFn[key] = fn;
	};

	if (typeof(google) != 'undefined' && typeof(google.picker) != 'undefined' && editorUi.drive != null)
	{
		addButton('googleDrive', function()
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
		addButton('dropbox', function()
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
		addButton('oneDrive', function()
		{
			editorUi.oneDrive.pickFile(function(id, files)
			{
				if (files != null && files.value != null && files.value.length > 0)
				{
					linkInput.value = files.value[0].webUrl;
					linkInput.focus();
				}
			}, true);
		});
	}

	if (editorUi.gitHub != null)
	{
		addButton('github', function()
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
		addButton('gitlab', function()
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

	if (selectDropdown.children.length > 1)
	{
		btns.appendChild(selectDropdown);

		mxEvent.addListener(selectDropdown, 'change', function(evt)
		{
			if (selectFn[selectDropdown.value] != null)
			{
				selectFn[selectDropdown.value]();
				selectDropdown.value = '';
			}
		});
	}

	mxEvent.addListener(linkInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			mainBtn.click();
		}
	});

	btns.appendChild(mainBtn);

	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.urlInput = linkInput;
	this.container = div;
};

/**
 * Static helper used by the LinkDialog's "Action" row. Closes the (modal)
 * LinkDialog and opens a CustomActionDialog (non-modal mxWindow) so the
 * user can freely select cells in the canvas while editing the action.
 *
 * The CustomActionDialog calls `onSave(newValue)` with a fully-encoded
 * `data:action/json,...` URL when the user clicks Save. If the user
 * cancels (closes without saving), nothing happens — the cell keeps
 * whatever link it had before Edit Link was opened.
 */
LinkDialog.editCustomAction = function(editorUi, currentValue, onSave)
{
	editorUi.hideDialog();

	// Reuse an already-open action editor instead of stacking a duplicate.
	// The reference is cleared on close (below), so a fresh Edit later opens
	// a new dialog bound to the current cell.
	if (editorUi.actionWindow != null && editorUi.actionWindow.window != null &&
		editorUi.actionWindow.window.isVisible())
	{
		editorUi.actionWindow.window.setVisible(true);
		editorUi.actionWindow.window.activate();
		return;
	}

	editorUi.actionWindow = new CustomActionDialog(editorUi, currentValue, onSave);
	editorUi.actionWindow.window.addListener('hide', function()
	{
		editorUi.actionWindow = null;
	});
};

/**
 * Inline SVG icons used by the selector chips. Single-stroke pictograms
 * sized to render at 14×14 px against the chip's hairline border. The
 * `currentColor` fill picks up the surrounding text color, so the same
 * markup works in light and dark mode.
 */
// End-user manual for the animation / custom-action editors.
var ANIMATION_HELP_URL =
	'https://www.drawio.com/docs/manual/links-tooltips-tags/animations-custom-actions/';

var SELECTOR_ICONS = {
	// Down-arrow into a tray — "use the current canvas selection"
	arrowDown: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" ' +
		'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" ' +
		'stroke-linejoin="round" aria-hidden="true">' +
		'<path d="M8 2v8M4.5 6.5L8 10l3.5-3.5M3 13h10"/></svg>',
	// Crosshair / target — "show these cells on canvas"
	target: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" ' +
		'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" ' +
		'stroke-linejoin="round" aria-hidden="true">' +
		'<circle cx="8" cy="8" r="5"/><circle cx="8" cy="8" r="1.5" ' +
		'fill="currentColor" stroke="none"/><path d="M8 1.5v2M8 12.5v2M' +
		'1.5 8h2M12.5 8h2"/></svg>',
	// Asterisk / wildcard — "match all cells"
	asterisk: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" ' +
		'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" ' +
		'aria-hidden="true">' +
		'<path d="M8 3.5v9M4 5.5l8 5M4 10.5l8-5"/></svg>'
};

/**
 * Polished selector styles (cell-list chip, tag pills, tag picker popover).
 * Installed once on first use, then shared by every dialog that calls
 * `createCellListField` / `createTagListField`.
 */
function installCustomActionStyles()
{
	if (installCustomActionStyles._done) return;
	installCustomActionStyles._done = true;

	var css = [
		// Field (label + chip + buttons grouped together)
		'.geSelField{display:inline-flex;align-items:center;gap:6px;',
			'font:12px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,',
			'Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}',
		'.geSelFieldLabel{color:light-dark(#6e6e73,#9a9aa0);',
			'font-weight:500;letter-spacing:0.01em}',

		// Chip (the count pill itself)
		'.geSelChip{display:inline-flex;align-items:center;gap:4px;',
			'min-height:24px;padding:2px 10px;border-radius:999px;',
			'border:1px solid light-dark(#d2d2d7,#48484a);',
			'background:light-dark(#fafafa,#2c2c2e);',
			'color:light-dark(#1d1d1f,#e5e5e7);font:inherit;font-weight:500;',
			// flex:0 0 auto so the chip never shrinks below its content
			// — when the dialog narrows the row overflows (clipped by
			// row.overflow:hidden) from the right edge instead of the
			// numeric inputs sliding into the chip's space.
			'flex:0 0 auto;max-width:100%;',
			'white-space:nowrap;user-select:none;',
			'transition:background-color .15s,',
			'border-color .15s,box-shadow .15s}',
		'.geSelChipReadOnly{cursor:default}',
		// Tag chip is clickable (opens picker) so it gets hover affordance
		'button.geSelChip,a.geSelChip{cursor:pointer}',
		'button.geSelChip:hover,a.geSelChip:hover{',
			'background:light-dark(#f0f0f2,#3a3a3c);',
			'border-color:light-dark(#b9b9be,#5a5a5e)}',
		'button.geSelChip:focus-visible{outline:2px solid ',
			'light-dark(#0071e3,#0a84ff);outline-offset:1px}',
		'.geSelChipEmpty{color:light-dark(#8e8e93,#7a7a7e);',
			'border-style:dashed;background:transparent}',
		'.geSelChipAll{background:light-dark(#e8f0fe,#10325f);',
			'border-color:light-dark(#a3c4f8,#2a5aa8);',
			'color:light-dark(#0a4bb0,#7eb1ff)}',
		'.geSelChipTags{padding:2px 6px;gap:3px}',
		// Disclosure caret on chips that open a popover
		'.geSelChipExpandable::after{content:"";display:inline-block;',
			'width:5px;height:5px;margin-left:6px;',
			'border:solid currentColor;border-width:0 1.4px 1.4px 0;',
			'transform:translateY(-2px) rotate(45deg);opacity:.55}',

		// Tag pill (inside chip and inside picker)
		'.geTagPill{display:inline-block;max-width:90px;padding:1px 8px;',
			'border-radius:999px;background:light-dark(#e5e5ea,#48484a);',
			'color:light-dark(#1d1d1f,#e5e5e7);',
			'font-size:11px;font-weight:500;line-height:1.4;',
			'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
			'vertical-align:middle}',
		'.geTagPillMore{display:inline-block;padding:1px 6px;',
			'border-radius:999px;background:transparent;',
			'color:light-dark(#6e6e73,#9a9aa0);font-size:11px;font-weight:500}',

		// Icon-only inline buttons (Use Selection / Show on Canvas)
		'.geSelIconBtn{display:inline-flex;align-items:center;justify-content:center;',
			'width:24px;height:24px;padding:0;border-radius:6px;',
			'border:1px solid light-dark(#d2d2d7,#48484a);',
			'background:light-dark(#ffffff,#1c1c1e);',
			'color:light-dark(#3a3a3f,#cfcfd3);cursor:pointer;',
			'transition:background-color .15s,border-color .15s,color .15s}',
		'.geSelIconBtn:hover{background:light-dark(#f5f5f7,#2c2c2e);',
			'border-color:light-dark(#b9b9be,#5a5a5e);',
			'color:light-dark(#0071e3,#0a84ff)}',
		'.geSelIconBtn:focus-visible{outline:2px solid ',
			'light-dark(#0071e3,#0a84ff);outline-offset:1px}',
		'.geSelIconBtn:active{background:light-dark(#e5e5ea,#3a3a3c)}',
		'.geSelIconBtnActive{background:light-dark(#0071e3,#0a84ff);',
			'border-color:light-dark(#0071e3,#0a84ff);',
			'color:#ffffff}',
		'.geSelIconBtnActive:hover{background:light-dark(#0062c4,#1a90ff);',
			'border-color:light-dark(#0062c4,#1a90ff);',
			'color:#ffffff}',
		'.geSelIconBtn svg{display:block}',

		// Tag picker popover — matches the inline-toolbar popover style
		// (12px radius, soft shadow, bouncy scale-in animation with
		// transform-origin pinned to the arrow tip).
		'.geTagPicker{position:fixed;z-index:10000;min-width:220px;max-width:300px;',
			'background:light-dark(#ffffff,#1c1c1e);',
			'border:1px solid light-dark(#d0d0d0,#505050);border-radius:12px;',
			'box-shadow:0 4px 16px rgba(0,0,0,0.15);',
			'font:12px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,',
			'Helvetica,Arial,sans-serif;color:light-dark(#1d1d1f,#e5e5e7);',
			'opacity:0;transform:scale(0);',
			'transition:transform .2s cubic-bezier(0.34,1.56,0.64,1),',
			'opacity .1s ease-out}',
		'.geTagPickerOpen{opacity:1;transform:scale(1)}',
		// Arrow notch — CSS triangle outside the popover. Two stacked
		// triangles give the hairline border without leaving any
		// rotated-square bleed inside the popover's content area.
		'.geTagPickerArrow{position:absolute;top:-7px;width:0;height:0;',
			'border-left:7px solid transparent;border-right:7px solid transparent;',
			'border-bottom:7px solid light-dark(#d2d2d7,#48484a);',
			'pointer-events:none}',
		'.geTagPickerArrow::after{content:"";position:absolute;',
			'top:1px;left:-6px;width:0;height:0;',
			'border-left:6px solid transparent;border-right:6px solid transparent;',
			'border-bottom:6px solid light-dark(#ffffff,#1c1c1e)}',
		'.geTagPickerArrowBottom{top:auto;bottom:-7px;',
			'border-bottom:none;',
			'border-top:7px solid light-dark(#d2d2d7,#48484a)}',
		'.geTagPickerArrowBottom::after{top:auto;bottom:1px;',
			'border-bottom:none;',
			'border-top:6px solid light-dark(#ffffff,#1c1c1e)}',
		'.geTagPickerHeader{padding:10px 14px 6px;font-weight:600;',
			'color:light-dark(#1d1d1f,#e5e5e7);font-size:12px;',
			'letter-spacing:.02em;text-transform:uppercase;opacity:.8}',
		'.geTagPickerEmpty{padding:14px 18px;',
			'color:light-dark(#8e8e93,#7a7a7e);font-style:italic;text-align:center}',
		'.geTagPickerFooter{padding:4px;',
			'border-top:1px solid light-dark(#e5e5ea,#3a3a3c)}',
		// AND/OR mode toggle in the tag picker header
		'.geTagPickerModeBar{display:flex;align-items:center;gap:6px;',
			'padding:6px 10px 4px}',
		'.geTagPickerModeLabel{font-size:11px;font-weight:500;',
			'color:light-dark(#6e6e73,#9a9aa0);margin-right:4px}',
		'.geTagPickerModeBtn{padding:2px 10px;border-radius:999px;',
			'font:inherit;font-size:11px;font-weight:500;cursor:pointer;',
			'border:1px solid light-dark(#d2d2d7,#48484a);',
			'background:transparent;color:light-dark(#3a3a3f,#cfcfd3);',
			'transition:background-color .12s,color .12s,border-color .12s}',
		'.geTagPickerModeBtn:hover{background:light-dark(#f0f0f2,#2c2c2e)}',
		'.geTagPickerModeBtnActive{background:light-dark(#0071e3,#0a84ff);',
			'border-color:light-dark(#0071e3,#0a84ff);color:#ffffff}',
		'.geTagPickerModeBtnActive:hover{',
			'background:light-dark(#0062c4,#1a90ff);',
			'border-color:light-dark(#0062c4,#1a90ff)}',

		// Tag cloud — flowing list of clickable pills inside the popover.
		// max-height caps the list at ~14 rows; anything beyond scrolls.
		// Tested with 500+ tags — the popover stays bounded and the
		// rest is reachable via the inner scrollbar.
		'.geTagPickerCloud{display:flex;flex-wrap:wrap;gap:6px;',
			'padding:8px 10px 12px;max-height:320px;overflow:auto;',
			'max-width:320px}',
		'.geTagCloudPill{display:inline-block;padding:3px 10px;',
			'border-radius:999px;cursor:pointer;font:inherit;',
			'font-size:11px;font-weight:500;line-height:1.4;',
			'background:light-dark(#e5e5ea,#48484a);',
			'color:light-dark(#3a3a3f,#cfcfd3);',
			'border:1px solid transparent;white-space:nowrap;',
			'transition:background-color .12s,color .12s,border-color .12s}',
		'.geTagCloudPill:hover{background:light-dark(#d5d5da,#5a5a5e)}',
		'.geTagCloudPillActive{background:light-dark(#d4f0db,#1c4530);',
			'color:light-dark(#1f7a3e,#86e0a3);',
			'border-color:light-dark(#a8e0b8,#2d6849)}',
		'.geTagCloudPillActive:hover{background:light-dark(#c4e8ce,#235c3d)}',

		// Layer picker — vertical list of checkbox rows. Distinct from
		// the tag cloud (which uses pills) because the user asked for a
		// classic checkbox list, and because layer names are typically
		// longer than tag names and wouldn't pack neatly into pills.
		// max-height caps the list at ~12 rows; anything beyond scrolls.
		'.geLayerPickerList{display:flex;flex-direction:column;gap:2px;',
			'padding:6px 6px 10px;max-height:320px;overflow:auto;',
			'min-width:220px}',
		'.geLayerPickerRow{display:flex;align-items:center;gap:8px;',
			'padding:5px 8px;border-radius:6px;cursor:pointer;',
			'font:inherit;font-size:12px;',
			'color:light-dark(#1d1d1f,#e5e5e7);',
			'transition:background-color .1s}',
		'.geLayerPickerRow:hover{background:light-dark(#f0f0f2,#2c2c2e)}',
		'.geLayerPickerRow input[type="checkbox"]{margin:0;flex:0 0 auto}',
		'.geLayerPickerRowLabel{flex:1;white-space:nowrap;',
			'overflow:hidden;text-overflow:ellipsis}',

		// Destructive picker entry (e.g. "Delete All" at the bottom of
		// the AnimationDialog picker). Most browsers only honor `color`
		// on <option> — that's fine, the red text is the cue.
		'option.geDeleteOpt{color:light-dark(#d70015,#ff453a);font-weight:500}',

		// Inline number inputs (viewbox X/Y/W/H/B, fade delay, opacity,
		// highlight color/duration/opacity, etc). The class:
		//   1) Hides the native spinner buttons (they ate ~16-20px of
		//      declared width on WebKit/Firefox).
		//   2) Pins width to 60px (flex-basis + width + max-width) so
		//      the layout algorithm doesn't reserve the input's much
		//      larger intrinsic content width (~150px from default
		//      size=20) when distributing space — that was making the
		//      cells chip shrink past the input's right edge and
		//      "overlap" visually after clipping.
		// box-sizing:border-box so padding stays inside the budget.
		'.geNoSpin{-moz-appearance:textfield;',
			'flex:0 0 60px;width:60px;max-width:60px;',
			'box-sizing:border-box}',
		'.geNoSpin::-webkit-outer-spin-button,',
		'.geNoSpin::-webkit-inner-spin-button{',
			'-webkit-appearance:none;margin:0}',

		// Action menu (the cell chip popover)
		'.geActionMenuList{padding:4px;min-width:180px}',
		'.geActionMenuItem{display:block;width:100%;padding:6px 12px;',
			'background:none;border:0;border-radius:6px;text-align:left;',
			'font:inherit;font-size:13px;cursor:pointer;',
			'color:light-dark(#1d1d1f,#e5e5e7);',
			'transition:background-color .1s}',
		'.geActionMenuItem:hover{background:light-dark(#f0f0f2,#2c2c2e)}',
		'.geActionMenuItemActive{color:light-dark(#0071e3,#0a84ff);',
			'font-weight:600}',
		'.geActionMenuItemDanger{color:light-dark(#d70015,#ff453a)}',
		'.geActionMenuItemDanger:hover{background:light-dark(#fdf0f0,#3a2020)}',
		'.geActionMenuItemDisabled{color:light-dark(#aeaeb2,#636366);',
			'cursor:default;pointer-events:none}',
		'.geActionMenuSeparator{height:1px;margin:4px 6px;',
			'background:light-dark(#e5e5ea,#3a3a3c)}',

		// Active step highlight — applied by the animation preview to
		// the row whose step is currently executing. Subtle blue tint,
		// no border-shift so the row height stays stable.
		'.geAnimationStepActive{background:',
			'light-dark(rgba(0,113,227,.10),rgba(10,132,255,.18))}'
	].join('');

	var style = document.createElement('style');
	style.setAttribute('data-source', 'customActionDialog');
	style.textContent = css;
	document.head.appendChild(style);
}

/**
 * Calls `installResizeHandler` with `EditorUi.windowed` forced true for
 * the duration of the call. The dock-manager wrap inside
 * `installResizeHandler` is guarded by that flag, which is only set in
 * the sketch/minimal UI — without this override the custom-action and
 * animation dialogs wouldn't snap to viewport edges in the classic UI.
 *
 * The multi-corner / multi-edge resize handles are installed globally
 * by the `mxWindow.prototype.setResizable` override in Editor.js — they
 * apply to every resizable mxWindow, not just these two dialogs.
 */
function installDialogDocking(editorUi, dialog)
{
	var prev = EditorUi.windowed;
	EditorUi.windowed = true;
	try
	{
		editorUi.installResizeHandler(dialog, true);
	}
	finally
	{
		EditorUi.windowed = prev;
	}
}

/**
 * Stops HTML5 drag events from bubbling out of the given list container.
 * Row reorder uses native drag-and-drop, and without this the events
 * reach the mxGraph canvas underneath — which interprets them as a
 * potential cell drop and highlights the container.
 */
function containDragEvents(el)
{
	var events = ['dragstart', 'dragenter', 'dragover',
		'dragleave', 'drop', 'dragend'];

	for (var i = 0; i < events.length; i++)
	{
		el.addEventListener(events[i], function(e)
		{
			e.stopPropagation();
		});
	}
}

/**
 * Reusable selector-chip factory. Call `SelectorChips.create(graph,
 * editorUi)` and use the returned `.cellListField(...)` / `.tagListField(...)`
 * helpers to render polished, count-only chips with inline "Use Selection"
 * / "Show on Canvas" actions and a tag picker popover. Both the
 * CustomActionDialog and the AnimationDialog instantiate one of these
 * so their cell/tag editing UI stays consistent.
 */
var SelectorChips = {};

SelectorChips.create = function(graph, editorUi)
{
	installCustomActionStyles();

	// Returns a small icon-only button rendered with an inline SVG.
	function makeIconButton(iconKey, title, onClick)
	{
		var b = document.createElement('button');
		b.type = 'button';
		b.title = title;
		b.className = 'geSelIconBtn';
		b.innerHTML = SELECTOR_ICONS[iconKey];
		b.addEventListener('click', function(e)
		{
			e.preventDefault();
			onClick(e);
		});
		return b;
	}

	// Renders a chip that opens a menu popover with the available
	// actions: Use Selection, All Cells (when wildcard is allowed),
	// Show on Canvas, Reset. The chip displays a self-describing count
	// like "5 cells" / "5 Excluded", or just the bare noun when
	// empty ("cells" / "Excluded") — no separate label needed.
	// `opts.singularKey` / `opts.pluralKey` pick the noun (defaults
	// 'cell' / 'cells' — match the app's broader terminology even
	// though the chip can also seed layers/tags). `opts.allowWildcard`
	// enables the "All cells" state which preserves the user's
	// explicit IDs in a stash for non-destructive toggling.
	function cellListField(label, getValue, setValue, opts)
	{
		opts = opts || {};
		var singularKey = opts.singularKey || 'cell';
		var pluralKey = opts.pluralKey || 'cells';
		var singularFallback = opts.singularFallback || 'cell';
		var pluralFallback = opts.pluralFallback || 'cells';
		// Empty-state label keeps the call-to-action visible — "select"
		// reads as a verb prompting the user to pick cells, rather than
		// the noun "cells" which can look like a column header.
		var emptyKey = opts.emptyKey || 'select';
		var emptyFallback = opts.emptyFallback || 'Select';

		var field = document.createElement('div');
		field.className = 'geSelField';

		if (label)
		{
			var lbl = document.createElement('span');
			lbl.className = 'geSelFieldLabel';
			mxUtils.write(lbl, label);
			field.appendChild(lbl);
		}

		var chip = document.createElement('button');
		chip.type = 'button';
		chip.className = 'geSelChip geSelChipExpandable';

		var stashedCells = null;

		var isWildcard = function()
		{
			var v = getValue();
			return Array.isArray(v) && v.length == 1 && v[0] === '*';
		};

		var hasCells = function()
		{
			var v = getValue();
			return Array.isArray(v) && v.length > 0;
		};

		var updateChip = function()
		{
			var v = getValue();
			var count = (Array.isArray(v) && !isWildcard()) ? v.length : 0;
			chip.textContent = '';
			chip.classList.remove('geSelChipEmpty', 'geSelChipAll');
			chip.title = '';

			if (isWildcard())
			{
				chip.classList.add('geSelChipAll');
				mxUtils.write(chip, mxResources.get('allCells', null, 'All cells'));
			}
			else if (count == 0)
			{
				// Empty: call-to-action verb ("Select"), no leading "0"
				// — invites a click without shouting "you have nothing
				// here".
				chip.classList.add('geSelChipEmpty');
				mxUtils.write(chip,
					mxResources.get(emptyKey, null, emptyFallback));
			}
			else
			{
				mxUtils.write(chip, count + ' ' + (count == 1 ?
					mxResources.get(singularKey, null, singularFallback) :
					mxResources.get(pluralKey, null, pluralFallback)));
				chip.title = v.join('\n');
			}
		};

		chip.addEventListener('click', function(e)
		{
			e.preventDefault();

			// Click-to-toggle: if our popover is already open, close it
			// instead of reopening. Without this the mousedown-outside
			// handler closes the existing popover, then the click event
			// reopens a fresh one — so the popover never goes away.
			if (openPopover._open != null && openPopover._open.anchor === chip)
			{
				openPopover._open.close();
				return;
			}

			var items = [];

			items.push({
				label: mxResources.get('useSelection', null, 'Use selection'),
				// Function form — re-evaluated when the popover hears a
				// canvas selection change, so this item enables/disables
				// live as the user picks cells without closing the menu.
				disabled: function() { return graph.getSelectionCount() == 0; },
				onClick: function()
				{
					var cells = graph.getSelectionCells();
					if (cells.length == 0) return;
					setValue(cells.map(function(c) { return c.id; }));
					updateChip();
				}
			});

			if (opts.allowWildcard)
			{
				items.push({
					label: mxResources.get('allCells', null, 'All cells'),
					active: isWildcard(),
					onClick: function()
					{
						if (isWildcard())
						{
							setValue(stashedCells);
							stashedCells = null;
						}
						else
						{
							var v = getValue();
							stashedCells = Array.isArray(v) ? v.slice() : null;
							setValue(['*']);
						}
						updateChip();
					}
				});
			}

			if (hasCells())
			{
				items.push({
					label: mxResources.get('selectCellsInDiagram',
					null, 'Select cells in diagram'),
					onClick: function()
					{
						var v = getValue();
						var cells = [];
						for (var i = 0; i < v.length; i++)
						{
							if (v[i] === '*')
							{
								cells = graph.model.getDescendants(
									graph.model.getRoot());
								break;
							}
							var c = graph.model.getCell(v[i]);
							if (c != null) cells.push(c);
						}
						if (cells.length > 0) graph.setSelectionCells(cells);
						else graph.clearSelection();
					}
				});

				items.push({separator: true});

				items.push({
					label: mxResources.get('reset', null, 'Reset'),
					danger: true,
					onClick: function()
					{
						setValue(null);
						stashedCells = null;
						updateChip();
					}
				});
			}

			// Caller-provided extras land at the bottom (with a leading
			// separator unless they bring their own). Used by the cells
			// chip to host "Exclude selected cells", which writes to a
			// sibling field on the same selector object.
			if (Array.isArray(opts.extraMenuItems) && opts.extraMenuItems.length > 0)
			{
				if (items.length > 0 && !items[items.length - 1].separator)
				{
					items.push({separator: true});
				}
				for (var i = 0; i < opts.extraMenuItems.length; i++)
				{
					items.push(opts.extraMenuItems[i]);
				}
			}

			openMenuPopover(chip, items);
		});

		field.appendChild(chip);

		updateChip();
		return field;
	}

	// Renders a field with a leading label and a clickable chip that
	// shows the selected tags as inline pills. Clicking opens a popover
	// with checkboxes for every tag present in the diagram, plus a
	// freeform "+ Add" input.
	function tagListField(label, getValue, setValue, opts)
	{
		opts = opts || {};

		var field = document.createElement('div');
		field.className = 'geSelField';

		if (label)
		{
			var lbl = document.createElement('span');
			lbl.className = 'geSelFieldLabel';
			mxUtils.write(lbl, label);
			field.appendChild(lbl);
		}

		var chip = document.createElement('button');
		chip.type = 'button';
		chip.className = 'geSelChip geSelChipExpandable';

		var updateChip = function()
		{
			var v = getValue();
			var count = Array.isArray(v) ? v.length : 0;
			chip.textContent = '';
			chip.classList.remove('geSelChipEmpty');
			chip.title = '';

			if (count == 0)
			{
				chip.classList.add('geSelChipEmpty');
				mxUtils.write(chip, mxResources.get('tags', null, 'Tags'));
			}
			else
			{
				mxUtils.write(chip, count + ' ' + (count == 1 ?
					mxResources.get('tag', null, 'Tag') :
					mxResources.get('tags', null, 'Tags')));
				chip.title = v.join('\n');
			}
		};

		chip.addEventListener('click', function(e)
		{
			e.preventDefault();

			// Toggle behavior — see the cells chip for the same logic.
			if (openPopover._open != null && openPopover._open.anchor === chip)
			{
				openPopover._open.close();
				return;
			}

			openTagPicker(chip, getValue, function(newTags)
			{
				setValue(newTags);
				updateChip();
			}, opts.getMode, opts.setMode);
		});
		field.appendChild(chip);

		updateChip();
		return field;
	}

	// Renders a chip that opens the layer picker. Mirrors tagListField,
	// but uses the layer-list popover (checkbox rows) and resolves the
	// layer cell name for the tooltip.
	function layerListField(label, getValue, setValue)
	{
		var field = document.createElement('div');
		field.className = 'geSelField';

		if (label)
		{
			var lbl = document.createElement('span');
			lbl.className = 'geSelFieldLabel';
			mxUtils.write(lbl, label);
			field.appendChild(lbl);
		}

		var chip = document.createElement('button');
		chip.type = 'button';
		chip.className = 'geSelChip geSelChipExpandable';

		var updateChip = function()
		{
			var v = getValue();
			var count = Array.isArray(v) ? v.length : 0;
			chip.textContent = '';
			chip.classList.remove('geSelChipEmpty');
			chip.title = '';

			if (count == 0)
			{
				chip.classList.add('geSelChipEmpty');
				mxUtils.write(chip,
					mxResources.get('layers', null, 'Layers'));
			}
			else
			{
				mxUtils.write(chip, count + ' ' + (count == 1 ?
					mxResources.get('layer', null, 'Layer') :
					mxResources.get('layers', null, 'Layers')));

				// Hover title with resolved layer names — same UX as the
				// tags chip, which lists tag values on hover.
				var names = [];
				var model = graph.getModel();
				for (var i = 0; i < v.length; i++)
				{
					var cell = model.getCell(v[i]);
					if (cell != null)
					{
						var n = graph.convertValueToString(cell);
						names.push((n != null && n !== '') ? n : v[i]);
					}
					else names.push(v[i]);
				}
				chip.title = names.join('\n');
			}
		};

		chip.addEventListener('click', function(e)
		{
			e.preventDefault();

			if (openPopover._open != null && openPopover._open.anchor === chip)
			{
				openPopover._open.close();
				return;
			}

			openLayerPicker(chip, getValue, function(newLayers)
			{
				setValue(newLayers);
				updateChip();
			});
		});
		field.appendChild(chip);

		updateChip();
		return field;
	}

	// Tag-cloud popover: the diagram's existing tags rendered as a wrapped
	// row of clickable pills. Active (selected) tags are tinted green;
	// inactive ones are gray. Click toggles. No add-new — the dialog is
	// for filtering against existing tags, not authoring new ones.
	function openTagPicker(anchor, getValue, onChange, getMode, setMode)
	{
		var current = (Array.isArray(getValue()) ? getValue() : []).slice();
		var allTags = (typeof graph.getAllTags == 'function') ?
			graph.getAllTags() : [];
		// Include user-selected tags that aren't in the diagram (yet) so
		// they remain visible/toggle-able in the cloud
		for (var i = 0; i < current.length; i++)
		{
			if (allTags.indexOf(current[i]) < 0) allTags.push(current[i]);
		}
		allTags.sort();

		var body = document.createElement('div');

		if (allTags.length == 0)
		{
			var empty = document.createElement('div');
			empty.className = 'geTagPickerEmpty';
			mxUtils.write(empty, mxResources.get('noTagsInDiagram',
				null, 'No tags in this diagram yet.'));
			body.appendChild(empty);
		}
		else
		{
			// AND/OR toggle — only rendered when the caller supplied
			// getMode/setMode. Sits above the cloud so the user sees the
			// match rule before picking tags.
			var mode = (typeof getMode == 'function') ? (getMode() || 'and') : null;

			if (typeof setMode == 'function')
			{
				var modeBar = document.createElement('div');
				modeBar.className = 'geTagPickerModeBar';

				var modeLabel = document.createElement('span');
				modeLabel.className = 'geTagPickerModeLabel';
				mxUtils.write(modeLabel,
					mxResources.get('match', null, 'Match') + ':');
				modeBar.appendChild(modeLabel);

				var modeAnd = document.createElement('button');
				modeAnd.type = 'button';
				modeAnd.className = 'geTagPickerModeBtn';
				mxUtils.write(modeAnd, mxResources.get('matchAll', null, 'All'));
				modeAnd.title = mxResources.get('matchAllHint', null,
					'Match cells that have every selected tag (AND)');

				var modeOr = document.createElement('button');
				modeOr.type = 'button';
				modeOr.className = 'geTagPickerModeBtn';
				mxUtils.write(modeOr, mxResources.get('matchAny', null, 'Any'));
				modeOr.title = mxResources.get('matchAnyHint', null,
					'Match cells that have at least one selected tag (OR)');

				var refreshMode = function()
				{
					modeAnd.classList.toggle('geTagPickerModeBtnActive',
						mode === 'and');
					modeOr.classList.toggle('geTagPickerModeBtnActive',
						mode === 'or');
				};
				refreshMode();

				modeAnd.addEventListener('click', function(e)
				{
					e.preventDefault();
					mode = 'and';
					setMode('and');
					refreshMode();
				});
				modeOr.addEventListener('click', function(e)
				{
					e.preventDefault();
					mode = 'or';
					setMode('or');
					refreshMode();
				});

				modeBar.appendChild(modeAnd);
				modeBar.appendChild(modeOr);
				body.appendChild(modeBar);
			}

			var cloud = document.createElement('div');
			cloud.className = 'geTagPickerCloud';

			var pillRefreshers = [];

			for (var i = 0; i < allTags.length; i++)
			{
				(function(tag)
				{
					var pill = document.createElement('button');
					pill.type = 'button';
					pill.className = 'geTagCloudPill';
					pill.title = tag;
					pill.textContent = tag;

					var refresh = function()
					{
						pill.classList.toggle('geTagCloudPillActive',
							current.indexOf(tag) >= 0);
					};

					refresh();
					pillRefreshers.push(refresh);

					pill.addEventListener('click', function(e)
					{
						e.preventDefault();
						var idx = current.indexOf(tag);
						if (idx >= 0) current.splice(idx, 1);
						else current.push(tag);
						onChange(current.slice());
						refresh();
						refreshFooter();
					});
					cloud.appendChild(pill);
				})(allTags[i]);
			}

			body.appendChild(cloud);

			// Footer: "Select cells" (only when any tags are active) and
			// "Reset" (clears the whole selection).
			var footer = document.createElement('div');
			footer.className = 'geTagPickerFooter';

			var selectBtn = document.createElement('button');
			selectBtn.type = 'button';
			selectBtn.className = 'geActionMenuItem';
			mxUtils.write(selectBtn,
				mxResources.get('selectCellsInDiagram',
					null, 'Select cells in diagram'));
			selectBtn.addEventListener('click', function(e)
			{
				e.preventDefault();
				if (current.length == 0) return;
				var cells = (typeof graph.getCellsForTags == 'function') ?
					graph.getCellsForTags(current, null, null, true, mode) : [];
				if (cells.length > 0) graph.setSelectionCells(cells);
				else graph.clearSelection();
			});
			footer.appendChild(selectBtn);

			var resetBtn = document.createElement('button');
			resetBtn.type = 'button';
			resetBtn.className = 'geActionMenuItem geActionMenuItemDanger';
			mxUtils.write(resetBtn, mxResources.get('reset', null, 'Reset'));
			resetBtn.addEventListener('click', function(e)
			{
				e.preventDefault();
				current = [];
				onChange([]);
				for (var i = 0; i < pillRefreshers.length; i++)
				{
					pillRefreshers[i]();
				}
				refreshFooter();
			});
			footer.appendChild(resetBtn);
			body.appendChild(footer);

			// Dim Select cells / Reset when nothing's selected — they're
			// no-ops at that point but stay visible so the user can
			// discover the actions even before toggling any tag.
			var refreshFooter = function()
			{
				var empty = current.length == 0;
				selectBtn.classList.toggle('geActionMenuItemDisabled', empty);
				selectBtn.disabled = empty;
				resetBtn.classList.toggle('geActionMenuItemDisabled', empty);
				resetBtn.disabled = empty;
			};
			refreshFooter();
		}

		openPopover(anchor, mxResources.get('tags', null, 'Tags'), body);
	}

	// Returns the layers (top-level children of the model root) along
	// with a display name. Renamed layers store the name as the cell
	// value; the first unnamed layer falls back to "Background" to
	// match the LayersWindow convention.
	function getAllLayers()
	{
		var model = graph.getModel();
		var root = model.getRoot();
		var count = model.getChildCount(root);
		var layers = [];

		for (var i = 0; i < count; i++)
		{
			var layer = model.getChildAt(root, i);
			if (layer == null) continue;
			var name = graph.convertValueToString(layer);
			if (name == null || name === '')
			{
				name = (i == 0) ? mxResources.get('background',
					null, 'Background') :
					mxResources.get('untitledLayer',
					null, 'Untitled Layer');
			}
			layers.push({id: layer.id, name: name, cell: layer});
		}

		return layers;
	}

	// Layer picker popover: vertical list of checkbox rows for every
	// layer (top-level child of the model root). User toggles rows;
	// `onChange` fires on every flip with the new array of layer IDs.
	// Callers are expected to gate entry on "model has at least one
	// layer" (the cells-chip menu's "Select layers" item is disabled
	// when `getChildCount(getRoot()) == 0`) — this function does not
	// handle the empty case.
	function openLayerPicker(anchor, getValue, onChange)
	{
		var current = (Array.isArray(getValue()) ? getValue() : []).slice();
		var allLayers = getAllLayers();

		var body = document.createElement('div');

		var list = document.createElement('div');
		list.className = 'geLayerPickerList';

		var refreshers = [];

		for (var i = 0; i < allLayers.length; i++)
		{
			(function(layer)
			{
				var row = document.createElement('label');
				row.className = 'geLayerPickerRow';
				row.title = layer.name;

				var cb = document.createElement('input');
				cb.type = 'checkbox';
				cb.checked = current.indexOf(layer.id) >= 0;
				row.appendChild(cb);

				var lbl = document.createElement('span');
				lbl.className = 'geLayerPickerRowLabel';
				mxUtils.write(lbl, layer.name);
				row.appendChild(lbl);

				var refresh = function()
				{
					cb.checked = current.indexOf(layer.id) >= 0;
				};
				refreshers.push(refresh);

				cb.addEventListener('change', function()
				{
					var idx = current.indexOf(layer.id);
					if (cb.checked && idx < 0) current.push(layer.id);
					else if (!cb.checked && idx >= 0) current.splice(idx, 1);
					onChange(current.slice());
					refreshFooter();
				});

				list.appendChild(row);
			})(allLayers[i]);
		}

		body.appendChild(list);

		// Footer: "Select cells in diagram" + "Reset". Layers are model
		// containers (mxGraph never selects the layer cell itself), so the
		// select button resolves each picked layer to its descendant cells
		// via getCellsForLayers and selects those — mirroring the tag
		// picker. Disabled when no layer is picked.
		var footer = document.createElement('div');
		footer.className = 'geTagPickerFooter';

		var selectBtn = document.createElement('button');
		selectBtn.type = 'button';
		selectBtn.className = 'geActionMenuItem';
		mxUtils.write(selectBtn,
			mxResources.get('selectCellsInDiagram',
				null, 'Select cells in diagram'));
		selectBtn.addEventListener('click', function(e)
		{
			e.preventDefault();
			if (current.length == 0) return;
			var cells = (typeof graph.getCellsForLayers == 'function') ?
				graph.getCellsForLayers(current) : [];
			if (cells.length > 0) graph.setSelectionCells(cells);
			else graph.clearSelection();
		});
		footer.appendChild(selectBtn);

		var resetBtn = document.createElement('button');
		resetBtn.type = 'button';
		resetBtn.className = 'geActionMenuItem geActionMenuItemDanger';
		mxUtils.write(resetBtn, mxResources.get('reset', null, 'Reset'));
		resetBtn.addEventListener('click', function(e)
		{
			e.preventDefault();
			current = [];
			onChange([]);
			for (var i = 0; i < refreshers.length; i++)
			{
				refreshers[i]();
			}
			refreshFooter();
		});
		footer.appendChild(resetBtn);
		body.appendChild(footer);

		var refreshFooter = function()
		{
			var empty = current.length == 0;
			selectBtn.classList.toggle('geActionMenuItemDisabled', empty);
			selectBtn.disabled = empty;
			resetBtn.classList.toggle('geActionMenuItemDisabled', empty);
			resetBtn.disabled = empty;
		};
		refreshFooter();

		openPopover(anchor, mxResources.get('selectLayers', null, 'Layers'), body);
	}

	// Generic anchored popover. The caller owns the body element; this
	// helper handles positioning (under the anchor, flip up if cramped),
	// the arrow, the open animation, and the close-on-outside-click /
	// resize / scroll lifecycle.
	function openPopover(anchor, header, body)
	{
		if (openPopover._open != null) openPopover._open.close();

		var pop = document.createElement('div');
		pop.className = 'geTagPicker';

		var arrow = document.createElement('div');
		arrow.className = 'geTagPickerArrow';
		pop.appendChild(arrow);

		if (header)
		{
			var headerEl = document.createElement('div');
			headerEl.className = 'geTagPickerHeader';
			mxUtils.write(headerEl, header);
			pop.appendChild(headerEl);
		}

		pop.appendChild(body);

		document.body.appendChild(pop);

		var rect = anchor.getBoundingClientRect();
		// `offsetWidth/Height` give the *layout* box, ignoring the
		// initial `transform: scale(0)` we use for the open animation.
		// `getBoundingClientRect()` would return zeros here and throw
		// the arrow's alignment off.
		var popW = pop.offsetWidth;
		var popH = pop.offsetHeight;
		var top = rect.bottom + 6;
		var flippedAbove = false;

		if (top + popH > window.innerHeight - 12)
		{
			top = Math.max(8, rect.top - popH - 6);
			arrow.classList.add('geTagPickerArrowBottom');
			flippedAbove = true;
		}

		var left = rect.left;

		if (left + popW > window.innerWidth - 8)
		{
			left = Math.max(8, window.innerWidth - popW - 8);
		}

		pop.style.top = top + 'px';
		pop.style.left = left + 'px';

		var arrowLeftPx = Math.min(popW - 24,
			Math.max(12, rect.left + rect.width / 2 - left - 6));
		arrow.style.left = arrowLeftPx + 'px';

		// Scale-in from the arrow tip — matches the inline-toolbar
		// popover effect (a bouncy zoom anchored to the source button).
		pop.style.transformOrigin = (arrowLeftPx + 6) + 'px ' +
			(flippedAbove ? popH + 'px' : '0px');

		requestAnimationFrame(function() { pop.classList.add('geTagPickerOpen'); });

		function close()
		{
			document.removeEventListener('mousedown', onDocDown, true);
			window.removeEventListener('resize', close);
			window.removeEventListener('scroll', close, true);
			if (pop.parentNode) pop.parentNode.removeChild(pop);
			if (openPopover._open === api) openPopover._open = null;
		}

		function onDocDown(e)
		{
			if (pop.contains(e.target) || anchor.contains(e.target)) return;
			// Canvas interaction (selecting cells, panning, etc.) should
			// keep the popover open — the user often opens "Use selected
			// cells" then picks cells in the canvas. Both background and
			// cell clicks land inside the graph container, so a single
			// containment check covers them consistently.
			if (graph.container != null &&
				graph.container.contains(e.target)) return;
			close();
		}

		document.addEventListener('mousedown', onDocDown, true);
		window.addEventListener('resize', close);
		window.addEventListener('scroll', close, true);

		// Expose the anchor so chip click handlers can detect "popover
		// is already open for this chip" and toggle it closed instead
		// of reopening.
		var api = {close: close, anchor: anchor};
		openPopover._open = api;
		return api;
	}

	// Menu popover for the cell chip. Items: [{label, onClick, danger?,
	// active?, separator?}]. A separator entry renders a thin divider.
	// Clicking an item runs its handler and closes the menu.
	function openMenuPopover(anchor, items)
	{
		var body = document.createElement('div');
		body.className = 'geActionMenuList';

		var refreshers = [];
		var api;

		for (var i = 0; i < items.length; i++)
		{
			(function(item)
			{
				if (item.separator)
				{
					var sep = document.createElement('div');
					sep.className = 'geActionMenuSeparator';
					body.appendChild(sep);
					return;
				}

				var btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'geActionMenuItem';
				if (item.danger) btn.classList.add('geActionMenuItemDanger');
				if (item.active) btn.classList.add('geActionMenuItemActive');

				// `item.disabled` may be a boolean OR a getter — getters
				// let the menu reflect live state (e.g. canvas selection)
				// without the popover being closed and reopened.
				var isDisabled = function()
				{
					return (typeof item.disabled == 'function') ?
						!!item.disabled() : !!item.disabled;
				};

				var refresh = function()
				{
					var d = isDisabled();
					btn.classList.toggle('geActionMenuItemDisabled', d);
					btn.disabled = d;
				};
				refresh();
				refreshers.push(refresh);

				mxUtils.write(btn, item.label);
				btn.addEventListener('click', function(e)
				{
					e.preventDefault();
					if (isDisabled()) return;
					if (api) api.close();
					// Pass the chip element so handlers that open a
					// second popover (e.g. "Select by tags") can anchor
					// it on the same chip the user just clicked.
					item.onClick(anchor);
				});
				body.appendChild(btn);
			})(items[i]);
		}

		api = openPopover(anchor, null, body);

		// Keep menu item enabled-state in sync with the canvas selection
		// while the popover is open. Listener is detached on close.
		var onSelChange = function()
		{
			for (var i = 0; i < refreshers.length; i++) refreshers[i]();
		};
		graph.getSelectionModel().addListener(mxEvent.CHANGE, onSelChange);

		var prevClose = api.close;
		api.close = function()
		{
			graph.getSelectionModel().removeListener(onSelChange);
			prevClose();
		};

		return api;
	}

	return {
		cellListField: cellListField,
		tagListField: tagListField,
		layerListField: layerListField,
		iconButton: makeIconButton,
		// Programmatic entry points so callers can pop the tag or
		// layer picker from a different anchor (e.g. the cells chip's
		// "Select by tags" / "Select layers" items, which have no
		// visible chip yet).
		openTagPicker: openTagPicker,
		openLayerPicker: openLayerPicker,
		closePopover: function() {
			if (openPopover._open != null) openPopover._open.close();
		}
	};
};


/**
 * Custom action editor. Thin wrapper around AnimationDialog (kind='action')
 * — translates the cell-link payload (`data:action/json,{title?,actions}`)
 * into / out of AnimationDialog's `{title?, steps}` shape and forwards the
 * save callback. All UI (picker, row rendering, selector chips, preview
 * session, footer buttons) lives in AnimationDialog; the wrapper is just
 * the format adapter.
 */
var CustomActionDialog = function(editorUi, currentValue, onSave)
{
	installCustomActionStyles();

	// Parse the cell-link payload into the AnimationDialog initial shape.
	// `{actions: […]}` → `{steps: […]}`. Nested `{animation: {steps: […]}}`
	// wrappers inside `actions` are flattened so the user edits the inner
	// steps inline alongside any other actions.
	var initial = {steps: []};

	if (currentValue != null && currentValue.substring(0, 17) == 'data:action/json,')
	{
		try
		{
			var parsed = JSON.parse(currentValue.substring(17));

			if (Array.isArray(parsed.actions))
			{
				var flat = [];
				for (var i = 0; i < parsed.actions.length; i++)
				{
					var a = parsed.actions[i];
					if (a && a.animation && Array.isArray(a.animation.steps))
					{
						for (var s = 0; s < a.animation.steps.length; s++)
						{
							flat.push(a.animation.steps[s]);
						}
					}
					else
					{
						flat.push(a);
					}
				}
				initial.steps = flat;
			}

			if (typeof parsed.title == 'string' && parsed.title !== '')
			{
				initial.title = parsed.title;
			}
		}
		catch (e)
		{
			// Malformed — open with an empty editor.
		}
	}

	// Read previously-saved window position / size. Falls back to a
	// centered 700×560 box. Same pattern as the animation window in
	// Menus.js — `installWindowPersistence` below keeps the saved state
	// up to date on every move/resize/dock event.
	var saved = mxSettings.getWindowState('customAction');
	var w = (saved != null && saved.w != null) ? saved.w : 700;
	var h = (saved != null && saved.h != null) ? saved.h : 560;
	var x = (saved != null && saved.x != null) ? saved.x :
		Math.max(40, (document.body.offsetWidth - w) / 2);
	var y = (saved != null && saved.y != null) ? saved.y : 80;

	var dialog = new AnimationDialog(editorUi, x, y, w, h, {
		kind: 'action',
		showTitle: true,
		windowTitleKey: 'action',
		windowTitleFallback: 'Action',
		initial: initial,
		save: function(data)
		{
			// Strip empty title to keep the JSON tight.
			var out = {actions: data.steps};
			if (data.title) out.title = data.title;
			onSave('data:action/json,' + JSON.stringify(out));
		}
	});

	editorUi.installWindowPersistence('customAction', dialog);

	if (saved != null)
	{
		editorUi.restoreWindowState('customAction', dialog);

		// restoreWindowState applies the saved `visible` flag too — which is
		// `false` if the previous session closed the dialog via Cancel — so we
		// would re-open hidden. Force visible again to match the user's intent
		// (they just clicked Edit). Mirrors the same setVisible(true) call
		// the animation window does in Menus.js after restoring.
		dialog.window.setVisible(true);
	}

	return dialog;
};


/**
 * Schema describing the form fields each action type needs in the dialog.
 * `selector: true` means the action carries cells/tags/excludeCells.
 * `fields` is a list of inline inputs for action-specific params, rendered
 * inside the row after the selector (or instead of it when `noSelector`).
 * `primary` is a single value-bearing field used by actions that aren't
 * objects (e.g. `wait: 1000` or `open: "https://..."`).
 */
// `allowLayers: true` adds the "Select layers" item to the cells-chip
// popover. It's set on every cell-targeting (selector) action; the layer
// resolves to the cells *within* it at playback (getCellsForLayers). The
// one exception is the visibility actions (toggle/show/hide) with
// transient:false, where the engine flips the layer cell's own `visible`
// (cascading) instead — see the layerCells branch in getCellsForAction.
CustomActionDialog.SCHEMAS = {
	toggle:      {label: 'Toggle',        icon: '⇄', selector: true, allowLayers: true},
	show:        {label: 'Show',          icon: '✓', selector: true, allowLayers: true},
	hide:        {label: 'Hide',          icon: '✗', selector: true, allowLayers: true},
	select:      {label: 'Select',        icon: '☑', selector: true, allowLayers: true},
	scroll:      {label: 'Scroll To',     icon: '↓', selector: true, allowLayers: true,
		fields: [{name: 'border', type: 'number', placeholder: '0', width: 36, label: '',
			titleKey: 'border', title: 'Border'},
		         {name: 'smooth', type: 'checkbox',
			labelKey: 'transition', label: 'Transition'}]},
	opacity:     {label: 'Set Opacity',   icon: '◐', selector: true, allowLayers: true,
		fields: [{name: 'value', type: 'number', min: 0, max: 1, step: 0.1, def: '1',
			width: 50, label: '', titleKey: 'opacity', title: 'Opacity'}]},
	fadeIn:      {label: 'Fade In',       icon: '↗', selector: true, allowLayers: true,
		fields: [{name: 'delay', type: 'number', min: 0, step: 100, width: 50,
			placeholder: '400', label: 'ms',
			titleKey: 'duration', title: 'Duration (ms)'}]},
	fadeOut:     {label: 'Fade Out',      icon: '↘', selector: true, allowLayers: true,
		fields: [{name: 'delay', type: 'number', min: 0, step: 100, width: 50,
			placeholder: '400', label: 'ms',
			titleKey: 'duration', title: 'Duration (ms)'}]},
	fadeTo:      {label: 'Fade To',       icon: '◐', selector: true, allowLayers: true,
		fields: [{name: 'value', type: 'number', min: 0, max: 1, step: 0.1, def: '0.5',
			width: 50, label: '', titleKey: 'opacity', title: 'Opacity'},
		         {name: 'delay', type: 'number', min: 0, step: 100, width: 50,
			placeholder: '400', label: 'ms',
			titleKey: 'duration', title: 'Duration (ms)'}]},
	wipeIn:      {label: 'Wipe In',       icon: '→', selector: true, allowLayers: true},
	wipeOut:     {label: 'Wipe Out',      icon: '←', selector: true, allowLayers: true},
	popIn:       {label: 'Pop In',        icon: '✨', selector: true, allowLayers: true},
	popOut:      {label: 'Pop Out',       icon: '💨', selector: true, allowLayers: true},
	highlight:   {label: 'Highlight',     icon: '🌟', selector: true, allowLayers: true,
		// Native <input type="color"> can't be empty / placeholder, so
		// we pre-fill with mxGraph's default highlight color
		// (DEFAULT_VALID_COLOR — lime green). The runtime's
		// graph.highlightCells() falls back to the same value when the
		// field is absent, so the picker mirrors the runtime default.
		fields: [{name: 'color',    type: 'color',  def: '#00FF00', width: 36, label: '',
			title: 'Color'},
		         {name: 'duration', type: 'number', min: 0, step: 100, width: 50,
			placeholder: '1000', label: 'ms',
			titleKey: 'duration', title: 'Duration (ms)'},
		         {name: 'opacity',  type: 'number', min: 0, max: 100, step: 10,
			placeholder: '100', width: 50, label: '%',
			titleKey: 'opacity', title: 'Opacity'}]},
	style:       {label: 'Set Style',     icon: '🎨', selector: true, allowLayers: true,
		fields: [{name: 'key',   type: 'text', placeholder: 'flowAnimation',
			width: 90, label: '', title: 'Key'},
		         {name: 'value', type: 'text', placeholder: '1',
			width: 50, label: '', title: 'Value'}]},
	toggleStyle: {label: 'Toggle Style',  icon: '🔀', selector: true, allowLayers: true,
		fields: [{name: 'key',          type: 'text', placeholder: 'flowAnimation',
			width: 90, label: '', title: 'Key'},
		         {name: 'defaultValue', type: 'text', placeholder: '0',
			width: 50, label: '', title: 'Default value'}]},
	flow:        {label: 'Flow',          icon: '➡', selector: true, allowLayers: true,
		fields: [{name: 'start', type: 'select', options: [
			{value: '', label: '(toggle)'},
			{value: 'true', label: 'On'},
			{value: 'false', label: 'Off'}], label: ''}]},
	wait:        {label: 'Wait',          icon: '⏱', noSelector: true,
		primary: {name: 'value', type: 'number', min: 0, step: 100, width: 60,
			def: '1000', label: 'ms', titleKey: 'wait', title: 'Wait'}},
	open:        {label: 'Open Link',     icon: '🔗', noSelector: true,
		primary: {name: 'value', type: 'text',
			placeholder: 'https://… or data:page/id,…', label: '', title: 'URL'}},
	// labelKey reroutes the action label to the generic `view` resource
	// so we don't need to ship a dedicated `viewbox` translation across
	// every locale — the picker, step list, and link summary all honor
	// `schema.labelKey` when present.
	viewbox:     {label: 'View',          labelKey: 'view',
		icon: '⊞', noSelector: true,
		fields: [{name: 'x',      type: 'number', placeholder: 'x', width: 36, label: '',
			title: 'X'},
		         {name: 'y',      type: 'number', placeholder: 'y', width: 36, label: '',
			title: 'Y'},
		         {name: 'width',  type: 'number', placeholder: 'w', width: 36, label: '',
			titleKey: 'width', title: 'Width'},
		         {name: 'height', type: 'number', placeholder: 'h', width: 36, label: '',
			titleKey: 'height', title: 'Height'},
		         {name: 'border', type: 'number', placeholder: 'b', width: 36, label: '',
			titleKey: 'border', title: 'Border'},
		         {name: 'smooth', type: 'checkbox',
			labelKey: 'transition', label: 'Transition'}]},
	tags:        {label: 'Toggle Tags',   icon: '🏷', noSelector: true,
		fields: [{name: 'toggle',  type: 'tagList',
			labelKey: 'toggle', label: 'Toggle',
			modeField: 'toggleMatch'},
		         {name: 'hidden',  type: 'tagList',
			labelKey: 'hide',   label: 'Hide',
			modeField: 'hiddenMatch'},
		         {name: 'visible', type: 'tagList',
			labelKey: 'show',   label: 'Show',
			modeField: 'visibleMatch'}]}
};


/**
 * Constructs a new revision dialog
 */
var RevisionDialog = function(editorUi, revs, restoreFn)
{
	var div = document.createElement('div');
	
	var title = document.createElement('h3');
	title.style.marginTop = '3px';
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
	container.style.left = '200px';
	container.style.width = '470px';
	container.style.height = '376px';
	container.style.overflow = 'hidden';
	container.style.borderWidth = '1px';
	container.style.borderStyle = 'solid';

	// Contains possible error messages
	var errorNode = document.createElement('div');
	errorNode.style.position = 'absolute',
	errorNode.style.display = 'none';
	errorNode.style.textAlign = 'center';
	errorNode.style.padding = '8px';
	errorNode.style.borderRadius = '8px';
	errorNode.style.left = '50%';
	errorNode.style.top = '50%';
	errorNode.style.whiteSpace = 'nowrap';
	errorNode.style.transform = 'translate(-50%, -50%)';
	errorNode.style.background = 'inherit';
	errorNode.style.border = '1px solid';
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

	var opts = {
	  lines: 11, // The number of lines to draw
	  length: 15, // The length of each line
	  width: 6, // The line thickness
	  radius: 10, // The radius of the inner circle
	  corners: 1, // Corner roundness (0..1)
	  rotate: 0, // The rotation offset
	  direction: 1, // 1: clockwise, -1: counterclockwise
	  color: 'light-dark(#000000, #C0C0C0)', // #rgb or #rrggbb
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

	var zoomInBtn = editorUi.createToolbarButton(Editor.zoomInImage, mxResources.get('zoomIn'), function()
	{
		if (currentDoc != null)
		{
			graph.zoomIn();
		}
	}, 20);

	zoomInBtn.setAttribute('disabled', 'disabled');

	var zoomOutBtn = editorUi.createToolbarButton(Editor.zoomOutImage, mxResources.get('zoomOut'), function()
	{
		if (currentDoc != null)
		{
			graph.zoomOut();
		}
	}, 20);

	zoomOutBtn.setAttribute('disabled', 'disabled');

	var zoomFitBtn = editorUi.createToolbarButton(Editor.zoomFitImage, mxResources.get('fit'), function()
	{
		if (currentDoc != null)
		{
			if (graph.view.scale == 1)
			{
				graph.maxFitScale = 8;
				graph.fit(8);
			}
			else
			{
				graph.zoomActual();
			}

			graph.center();
		}
	}, 20);

	zoomFitBtn.setAttribute('disabled', 'disabled');

	// Gesture listener added below to handle pressed state
	var compareBtn = editorUi.createToolbarButton(Editor.compareImage, mxResources.get('compare'));
	compareBtn.setAttribute('disabled', 'disabled');

	var mergeBtn = editorUi.createToolbarButton(Editor.thinDataImage, mxResources.get('merge'));
	mergeBtn.setAttribute('disabled', 'disabled');
	
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

	var fileInfo = document.createElement('div');
	fileInfo.style.textAlign = 'left';
	fileInfo.style.color = 'gray';
	fileInfo.style.backgroundColor = 'transparent';
	fileInfo.style.overflow = 'hidden';
	fileInfo.style.textOverflow = 'ellipsis';
	fileInfo.style.whiteSpace = 'nowrap';
	fileInfo.style.cursor = 'default';
	fileInfo.style.height = '100%';
	fileInfo.style.display = 'inline-flex';
	fileInfo.style.alignItems = 'center';
	fileInfo.style.flexGrow = '1';

	mxEvent.addListener(fileInfo, 'click', function()
	{
		var textContent = mxUtils.getTextContent(fileInfo);

		if (textContent != '')
		{
			editorUi.alert(textContent);
		}
	});

	var prevFileInfo = null;

	mxEvent.addGestureListeners(compareBtn, function(e)
	{
		// Gets current state of page with given ID
		try
		{
			var curr = (diagrams[currentPage] != null) ? currentDiagrams[
				diagrams[currentPage].getAttribute('id')] : null;
			mxUtils.setOpacity(compareBtn, 20);
			errorNode.innerText = '';

			if (curr == null)
			{
				errorNode.style.display = 'inline-block';
				mxUtils.write(errorNode, mxResources.get('pageNotFound'));
			}
			else
			{
				prevFileInfo = fileInfo.innerHTML;
				fileInfo.innerHTML = mxResources.get('current');
				container.style.display = 'none';
				cmpContainer.style.display = '';
				cmpContainer.style.backgroundColor = container.style.backgroundColor;

				var tempNode = Editor.parseDiagramNode(curr);
				var codec = new mxCodec(tempNode.ownerDocument);
				codec.decode(tempNode, cmpGraph.getModel());
				cmpGraph.view.scaleAndTranslate(graph.view.scale,
					graph.view.translate.x, graph.view.translate.y);
				cmpGraph.mathEnabled = tempNode.getAttribute('math') == '1';
				cmpGraph.setAdaptiveColors(tempNode.getAttribute('adaptiveColors'));
				
				if (Editor.MathJaxRender && cmpGraph.mathEnabled)
				{
					Editor.MathJaxRender(cmpGraph.container);
				}
			}
		}
		catch (e)
		{
			errorNode.style.display = 'inline-block';
			errorNode.innerText = '';
			mxUtils.write(errorNode, mxResources.get('pageNotFound') + ': ' + e.message);
		}
	}, null, function()
	{
		mxUtils.setOpacity(compareBtn, 60);
		errorNode.style.display = 'none';
		errorNode.innerText = '';

		if (container.style.display == 'none')
		{
			container.style.display = '';
			fileInfo.innerHTML = prevFileInfo;
			cmpContainer.style.display = 'none';
		}
	});

	mxEvent.addListener(mergeBtn, 'click', mxUtils.bind(this, function(e)
	{
		if (currentDoc != null)
		{
			var pages = editorUi.getPagesForNode(currentDoc.documentElement);
			var patch = editorUi.diffPages(editorUi.pages, pages);

			var dlg = new TextareaDialog(editorUi, mxResources.get('merge') + ':',
				JSON.stringify(patch, null, 2), function(newValue)
			{
				try
				{
					if (newValue.length > 0 && editorUi.editor.graph.isEnabled())
					{
						var patches = [JSON.parse(newValue)];

						editorUi.confirm(mxResources.get('areYouSure'), function()
						{
							try
							{
								file.patch(patches, null, true, true);

								// Hides compare dialog
								editorUi.hideDialog();

								// Hides revision history dialog
								editorUi.hideDialog();
							}
							catch (e)
							{
								editorUi.handleError(e);
							}
						});
					}
					else
					{
						// Hides compare dialog
						editorUi.hideDialog();
					}
				}
				catch (e)
				{
					editorUi.handleError(e);
				}
			}, null, null, null, null, function(buttons, input)
			{
				// Adds a checkbox to only use the current page diff
				if (patch[EditorUi.DIFF_UPDATE] != null)
				{
					var patchSelect = document.createElement('select');
					var option = document.createElement('option');
					mxUtils.write(option, mxResources.get('allPages'));
					option.setAttribute('value', 'allPages');
					patchSelect.appendChild(option);

					for (var pageId in patch[EditorUi.DIFF_UPDATE])
					{
						var option = document.createElement('option');
						var page = editorUi.getPageById(pageId);

						if (page != null)
						{
							mxUtils.write(option, page.getName());
							option.setAttribute('value', 'page-' + pageId);
							patchSelect.appendChild(option);
						}
					}

					patchSelect.style.marginRight = '8px';
					patchSelect.style.order = '-1';

					mxEvent.addListener(patchSelect, 'change', function(evt)
					{
						var pagePatch = null;

						if (patchSelect.value != 'allPages')
						{
							var pageId = patchSelect.value.substring(5);

							if (patch[EditorUi.DIFF_UPDATE][pageId] != null)
							{
								pagePatch = new Object();
								pagePatch[EditorUi.DIFF_UPDATE] = new Object();
								pagePatch[EditorUi.DIFF_UPDATE][pageId] =
									patch[EditorUi.DIFF_UPDATE][pageId];
							}
						}

						input.value = JSON.stringify((pagePatch == null) ?
							patch : pagePatch, null, 2);
					});

					if (patchSelect.children.length > 2)
					{
						buttons.appendChild(patchSelect);
					}
				}
			}, true, null, mxResources.get(editorUi.editor.graph.isEnabled() ?
				'merge' : 'close'));
			
			editorUi.showDialog(dlg.container, 620, 460, true, true, null, null, null, new mxRectangle(0, 0, 440, 280));
			dlg.init();
		}
	}));

	var restoreBtn = mxUtils.button(mxResources.get('restore'), function(e)
	{
		if (currentDoc != null && currentXml != null)
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
						restoreBtn.setAttribute('disabled', 'disabled');
				
						file.save(true, function(resp)
						{
							editorUi.spinner.stop();
							restoreBtn.removeAttribute('disabled');
							editorUi.replaceFileData(currentXml);
							editorUi.hideDialog();
						}, function(resp)
						{
							editorUi.spinner.stop();
							restoreBtn.removeAttribute('disabled');
							editorUi.clearStatus();
							editorUi.handleError(resp, (resp != null) ? mxResources.get('errorSavingFile') : null);
						});
					}
				}
			});
		}
	});

	restoreBtn.className = 'geBtn gePrimaryBtn';
	restoreBtn.setAttribute('disabled', 'disabled');
	
	var pageSelect = document.createElement('select');
	pageSelect.setAttribute('disabled', 'disabled');
	pageSelect.style.userSelect = 'none';
	pageSelect.style.maxWidth = '100px';
	pageSelect.style.marginLeft = '10px';
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
	
	var newBtn = mxUtils.button(mxResources.get('open'), function()
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

	var createBtn = mxUtils.button(mxResources.get('createRevision'), function()
	{
		editorUi.actions.get('save').funct(false);
	});

	createBtn.className = 'geBtn';
	createBtn.setAttribute('disabled', 'disabled');
	
	if (restoreFn != null)
	{
		newBtn.style.display = 'none';
	}
	
	var buttons = document.createElement('div');
	buttons.style.position = 'absolute';
	buttons.style.top = '482px';
	buttons.style.right = '28px';
	buttons.style.left = '32px';
	buttons.style.justifyContent = 'end';
	buttons.style.display = 'flex';

	var tb = document.createElement('div');
	tb.className = 'geToolbarContainer';
	tb.style.backgroundColor = 'transparent';
	tb.style.left = '32px';
	tb.style.right = '32px';
	tb.style.border = 'none';
	tb.style.top = '442px';

	var currentElt = null;
	
	if (revs != null && revs.length > 0)
	{
		container.style.cursor = 'move';
		
		var table = document.createElement('table');
		table.style.borderWidth = '1px';
		table.style.borderStyle = 'solid';
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
					row.style.borderBottomWidth = '1px';
					row.style.borderBottomStyle = 'solid';
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
						ts.toLocaleTimeString() + ((item.fileSize != null)? ' ' +
						editorUi.formatFileSize(parseInt(item.fileSize)) : '') +
						((item.lastModifyingUserName != null) ? ' ' +
						item.lastModifyingUserName : ''));

					function updateGraph(xml)
					{
						spinner.stop();
						errorNode.innerText = '';
						var doc = mxUtils.parseXml(xml);
						var node = editorUi.editor.extractGraphModel(doc.documentElement, true);

						if (node != null)
						{
							pageSelect.style.display = 'none';
							pageSelect.innerText = '';
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
								
								container.style.backgroundColor = mxUtils.getLightDarkColor(bg);
								
								var codec = new mxCodec(dataNode.ownerDocument);
								codec.decode(dataNode, graph.getModel());
								graph.maxFitScale = 1;
								graph.fit(8);
								graph.center();
								graph.mathEnabled = dataNode.getAttribute('math') == '1';
								graph.setAdaptiveColors(dataNode.getAttribute('adaptiveColors'));

								if (Editor.MathJaxRender && graph.mathEnabled)
								{
									Editor.MathJaxRender(graph.container);
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

							if (node.nodeName == 'mxfile')
							{
								// Workaround for "invalid calling object" error in IE
								var tmp = node.getElementsByTagName('diagram');
								var newPages = {};
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
										pageOption.setAttribute('title', name + ' (' +
											diagrams[i].getAttribute('id') + ')');
										pageOption.setAttribute('value', i);
										var name = diagrams[i].getAttribute('name') ||
											mxResources.get('pageWithNumber', [i + 1]);
										var localPage = editorUi.getPageById(diagrams[i].getAttribute('id'));
										var state = '';
										
										if (localPage != null)
										{
											var newPage = new DiagramPage(diagrams[i]);

											if (editorUi.getHashValueForPages([localPage]) != editorUi.getHashValueForPages([newPage]))
											{
												state = ' (M)';
											}
										}
										else
										{
											state = ' (X)';
										}

										mxUtils.write(pageOption, name + state);
										
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
							
							fileInfo.innerText = '';
							mxUtils.write(fileInfo, ((shortUser != null) ?
								(shortUser + ' ') : '') + ts.toLocaleDateString() +
								' ' + ts.toLocaleTimeString());
							
							fileInfo.setAttribute('title', row.getAttribute('title'));
							zoomInBtn.removeAttribute('disabled');
							zoomOutBtn.removeAttribute('disabled');
							zoomFitBtn.removeAttribute('disabled');
							compareBtn.removeAttribute('disabled');
							mergeBtn.removeAttribute('disabled');
							
							if (file == null || !file.isRestricted())
							{
								if (editorUi.editor.graph.isEnabled())
								{
									restoreBtn.removeAttribute('disabled');
								}

								newBtn.removeAttribute('disabled');
								createBtn.removeAttribute('disabled');
							}
							
							mxUtils.setOpacity(zoomInBtn, 60);
							mxUtils.setOpacity(zoomOutBtn, 60);
							mxUtils.setOpacity(zoomFitBtn, 60);
							mxUtils.setOpacity(compareBtn, 60);
							mxUtils.setOpacity(mergeBtn, 60);
						}
						else
						{
							pageSelect.style.display = 'none';
							pageSelect.innerText = '';
							fileInfo.innerText = '';
							errorNode.innerText = '';
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
							currentRow.style.backgroundColor = 'light-dark(#ebf2f9, #000000)';
							currentDoc = null;
							currentXml = null;

							fileInfo.removeAttribute('title');
							fileInfo.innerText = mxResources.get('loading') + '...';
							container.style.backgroundColor = graph.defaultPageBackgroundColor;
							errorNode.innerText = '';
							graph.getModel().clear();
							
							restoreBtn.setAttribute('disabled', 'disabled');
							zoomInBtn.setAttribute('disabled', 'disabled');
							zoomOutBtn.setAttribute('disabled', 'disabled');
							zoomFitBtn.setAttribute('disabled', 'disabled');
							compareBtn.setAttribute('disabled', 'disabled');
							mergeBtn.setAttribute('disabled', 'disabled');

							newBtn.setAttribute('disabled', 'disabled');
							pageSelect.setAttribute('disabled', 'disabled');
							
							mxUtils.setOpacity(zoomInBtn, 20);
							mxUtils.setOpacity(zoomOutBtn, 20);
							mxUtils.setOpacity(zoomFitBtn, 20);
							mxUtils.setOpacity(compareBtn, 20);
							mxUtils.setOpacity(mergeBtn, 20);

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
										fileInfo.innerText = mxResources.get('error') + ': ' + e.message;
									}
								}
				   			}, function(err)
				   			{
				   				spinner.stop();
								pageSelect.style.display = 'none';
								pageSelect.innerText = '';
				   				fileInfo.innerText = '';
								mxUtils.write(fileInfo, mxResources.get('errorLoadingFile'));
								mxUtils.write(errorNode, mxResources.get('errorLoadingFile'));
				   			});

							mxEvent.consume(evt);
						}
					});
					
					mxEvent.addListener(row, 'dblclick', function(evt)
					{
						newBtn.click();
						
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

	var closeBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	closeBtn.className = 'geBtn';

	tb.appendChild(fileInfo);
	tb.appendChild(compareBtn);
	tb.appendChild(zoomOutBtn);
	tb.appendChild(zoomFitBtn);
	tb.appendChild(zoomInBtn);
	tb.appendChild(pageSelect);
	tb.appendChild(mergeBtn);

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(closeBtn);
	}

	buttons.appendChild(newBtn);

	if (file != null && file.constructor == DriveFile)
	{
		buttons.appendChild(createBtn);
	}

	buttons.appendChild(restoreBtn);

	if (!editorUi.editor.cancelFirst)
	{
		buttons.appendChild(closeBtn);
	}

	div.appendChild(buttons);
	div.appendChild(tb);

	this.container = div;
};

/**
 * Constructs a dialog that lets the user choose among best-effort recovery
 * candidates for a file that failed to load. okFn(candidate) is called with the
 * chosen candidate; each opens as a new unsaved copy (the original is never
 * overwritten). Used when two or more candidates are available (eg. a prior
 * version/backup and an in-memory repair).
 */
var RecoveryDialog = function(editorUi, candidates, okFn, cancelFn)
{
	var div = document.createElement('div');
	div.style.paddingBottom = '10px';

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get('recoverTitle'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
	div.appendChild(hd);

	var addCandidate = function(candidate)
	{
		var row = document.createElement('div');
		row.className = 'geDialogSection';
		row.style.cursor = 'pointer';
		row.style.marginBottom = '8px';
		row.style.padding = '10px';

		var label = document.createElement('div');
		label.style.fontWeight = '600';
		label.style.marginBottom = '4px';
		mxUtils.write(label, candidate.label);
		row.appendChild(label);

		if (candidate.description != null)
		{
			var desc = document.createElement('div');
			desc.style.fontSize = '12px';
			desc.style.opacity = '0.75';
			mxUtils.write(desc, candidate.description);
			row.appendChild(desc);
		}

		mxEvent.addListener(row, 'click', function()
		{
			okFn(candidate);
		});

		div.appendChild(row);
	};

	for (var i = 0; i < candidates.length; i++)
	{
		addCandidate(candidates[i]);
	}

	var btns = document.createElement('div');
	btns.style.marginTop = '34px';
	btns.style.textAlign = 'right';

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		if (cancelFn != null)
		{
			cancelFn();
		}
	});

	cancelBtn.className = 'geBtn';
	btns.appendChild(cancelBtn);
	div.appendChild(btns);

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
		if (select.value == '-1')
		{
			select.value = select.options[0].value;
			draftSelected();

			// Discard all drafts
			editorUi.confirm(mxResources.get('areYouSure'), null, mxUtils.bind(this, async function()
			{
				for (var i = 0; i < drafts.length; i++)
				{
					discardFn.apply(this, [i, mxUtils.bind(this, function()
					{
						// Do nothing
					})]);
				}

				editorUi.hideDialog(true);
			}), mxResources.get('no'), mxResources.get('yes'));
		}
		else
		{
			doc = mxUtils.parseXml(drafts[select.value].data);
			node = editorUi.editor.extractGraphModel(doc.documentElement, true);
			currentPage = 0;
				
			this.init();
		}
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

		// Delete all option
		var opt = document.createElement('option');
		opt.setAttribute('value', '-1');
		mxUtils.write(opt, mxResources.get('deleteAll'));
		select.appendChild(opt);
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
	graph.shapeBackgroundColor = 'light-dark(#ffffff, #2a252f)';
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
	
	var zoomInBtn = editorUi.createToolbarButton(Editor.zoomInImage, mxResources.get('zoomIn'), function()
	{
		graph.zoomIn();
	}, 20);

	var zoomOutBtn = editorUi.createToolbarButton(Editor.zoomOutImage, mxResources.get('zoomOut'), function()
	{
		graph.zoomOut();
	}, 20);

	var zoomFitBtn = editorUi.createToolbarButton(Editor.zoomFitImage, mxResources.get('fit'), function()
	{
		if (graph.view.scale == 1)
		{
			graph.maxFitScale = 8;
			graph.fit(8);
		}
		else
		{
			graph.zoomActual();
		}

		graph.center();
	}, 20);

	var restoreBtn = mxUtils.button(discardLabel || mxResources.get('discard'), function()
	{
		editorUi.confirm(mxResources.get('areYouSure'), null, mxUtils.bind(this, async function()
		{
			discardFn.apply(this, [select.value, mxUtils.bind(this, function()
			{
				if (select.parentNode != null)
				{
					select.options[select.selectedIndex].parentNode.removeChild(select.options[select.selectedIndex]);
					
					if (select.options.length > 1)
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
		}), mxResources.get('no'), mxResources.get('yes'));
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
					bg = 'light-dark(#ffffff, transparent)';
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
				try
				{
					diagramNode = parseGraphModel(Editor.parseDiagramNode(diagramNode));
				}
				catch (e)
				{
					editorUi.handleError(e);
				}
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

			pageSelect.innerText = '';
			
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
	
    var help = ui.menus.createHelpLink('https://www.drawio.com/doc/faq/find-shapes');
    help.style.position = 'relative';
    help.style.marginLeft = '6px';
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
	
	function testMeta(re, cell, search)
	{
		if (typeof cell.value === 'object' && cell.value.attributes != null)
		{
			var attrs = cell.value.attributes;
			
			for (var i = 0; i < attrs.length; i++)
			{
				if (attrs[i].nodeName != 'label')
				{
					var value = mxUtils.trim(attrs[i].nodeValue.replace(/[\x00-\x1F\x7F-\x9F]|\s+/g, ' ')).toLowerCase();
					
					if ((re == null && value.indexOf(search) >= 0) ||
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
		if (lastSearchSuccessful)
		{
			replaceFindBtn.removeAttribute('disabled');
			replaceBtn.removeAttribute('disabled');
		}
		else
		{
			replaceFindBtn.setAttribute('disabled', 'disabled');
			replaceBtn.setAttribute('disabled', 'disabled');
		}
		
		if (searchInput.value)
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
		replAllNotif.innerText = '';
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
				if (trySameCell)
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
					
					if (trySameCell && withReplace && state == lastFound)
					{
						label = label.substr(lblMatchPos);
						lblPosShift = lblMatchPos;
					}
					
					var checkMeta = replaceInput == null || replaceInput.value == '';
					
					if ((re == null && ((label.indexOf(searchStr) >= 0) ||
						(checkMeta && testMeta(re, state.cell, searchStr)))) ||
						(re != null && (re.test(label) || (checkMeta &&
						testMeta(re, state.cell, searchStr)))))
					{
						if (withReplace)
						{
							if (re != null)
							{
								var result = label.match(re);

								if (result != null && result.length > 0)
								{
									lblMatch = result[0].toLowerCase();
									lblMatchPos = lblPosShift + result.index + lblMatch.length;
								}
							}
							else
							{
								lblMatch = searchStr;
								lblMatchPos = lblPosShift + label.indexOf(searchStr) + lblMatch.length;
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
			
			if (graph.isEnabled() && !graph.isCellLocked(lastFound.cell))
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
	div.appendChild(btnsCont);

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		replAllNotif.innerText = '';
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
				'light-dark(#ffcfcf, #ff0000)';
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
		btnsCont.style.display = 'flex';
		btnsCont.style.alignItems = 'center';
		resetBtn.style.width = '';	
		btn.style.width = '';
	}
	else
	{
		btnsCont.style.textAlign = 'center';

		function replaceInLabel(str, substr, newSubstr, startIndex, style)
		{
			if (style == null || style['html'] != '1')
			{
				var replStart = str.toLowerCase().indexOf(substr, startIndex);
				return replStart < 0? str : str.substr(0, replStart) + newSubstr + str.substr(replStart + substr.length);
			}
			
			var origStr = str;
			substr = mxUtils.htmlEntities(substr, false, false, false);
			var tagPos = [], p = -1;
			
			//Original position (startIndex) counts for \n which is removed when tags are removed, so handle <br> separately
			// The same for block level elements which are replaced by \n
			str = str.replace(/<br>/ig, '\n').replace(/(\s|\S)(<(BLOCKQUOTE|DIV|H1|H2|H3|H4|H5|H6|OL|P|PRE|TABLE|UL)[^>]*>)/ig, '$1\n$2');

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
			
			return newStr.replace(/\n(<(BLOCKQUOTE|DIV|H1|H2|H3|H4|H5|H6|OL|P|PRE|TABLE|UL)[^>]*>)/ig, '$1').replace(/\n/g, '<br>');
		};
		
		var replaceFindBtn = mxUtils.button(mxResources.get('replFind'), function()
		{
			try
			{
				if (lblMatch != null && lastFound != null)
				{
					var cell = lastFound.cell, lbl = graph.getLabel(cell);
					
					if (graph.isCellEditable(cell))
					{
						graph.model.setValue(cell, replaceInLabel(lbl, lblMatch, replaceInput.value,
							lblMatchPos - lblMatch.length, graph.getCurrentCellStyle(cell)));
					}
					
					searchInput.style.backgroundColor = search(false, true) ? '' :
						'light-dark(#ffcfcf, #ff0000)';
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
				if (lblMatch != null && lastFound != null)
				{
					var cell = lastFound.cell, lbl = graph.getLabel(cell);
					
					graph.model.setValue(cell, replaceInLabel(lbl, lblMatch, replaceInput.value,
						lblMatchPos - lblMatch.length, graph.getCurrentCellStyle(cell)));
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
			replAllNotif.innerText = '';
			
			lastSearch = null; // Reset last search to check all matches
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
					
					if (graph.isCellEditable(cell))
					{
						graph.model.setValue(cell, replaceInLabel(lbl, lblMatch, replaceInput.value,
							lblMatchPos - lblMatch.length, graph.getCurrentCellStyle(cell)));
						safeguard++;
					}
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
					'light-dark(#ffcfcf, #ff0000)';
			}
			catch (e)
			{
				searchInput.style.backgroundColor = 'light-dark(#ffcfcf, #ff0000)';
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
			
			if (mxClient.IS_GC || mxClient.IS_FF)
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
	
	ui.installResizeHandler(this, false);

	this.doSearch = function(searchTerms)
	{
		searchInput.focus();
		searchInput.value = searchTerms;
		btn.click();
	};
};

/**
 * 
 */
var FreehandWindow = function(editorUi, x, y, w, h, withBrush)
{
	var graph = editorUi.editor.graph;

	var div = document.createElement('div');
	div.style.textAlign = 'center';
	div.style.userSelect = 'none';
	div.style.overflow = 'hidden';
	div.style.height = '100%';
	
	if (withBrush)
	{
		var brushInput = document.createElement('input');
		brushInput.setAttribute('id', 'geFreehandBrush');
		brushInput.setAttribute('type', 'checkbox');
		brushInput.checked = graph.freehand.isPerfectFreehandMode();
		brushInput.style.margin = '10px 5px 0px 10px';
		brushInput.style.float = 'left';
		div.appendChild(brushInput);
		
		// Used to retrieve default styles
		graph.freehand.setPerfectFreehandMode(brushInput.checked);
		
		var brushLabel = document.createElement('label');
		brushLabel.setAttribute('for', 'geFreehandBrush');
		brushLabel.style.float = 'left';
		brushLabel.style.marginTop = '10px';
		div.appendChild(brushLabel);
		mxUtils.write(brushLabel, mxResources.get('brush'));
		div.appendChild(brushLabel);

		var tempDiv = document.createElement('tempDiv');
		tempDiv.style.display = 'block';
		tempDiv.style.width = '100%';
		tempDiv.style.height = '100%';
		tempDiv.style.borderRadius = '2px';
		tempDiv.style.boxSizing = 'border-box';
		tempDiv.style.border = '1px solid black';
		tempDiv.style.backgroundColor = graph.freehand.getStrokeColor();

		function updateName()
		{
			var color = graph.freehand.getStrokeColor(true);

			if (color != null && color != mxConstants.NONE &&
				color.length > 1 && typeof color === 'string')
			{
				var name = null;

				if (color == 'default')
				{
					name = mxResources.get('useBlackAndWhite');
				}
				else
				{
					var clr = (color.charAt(0) == '#') ?
						color.substring(1).toUpperCase() : color;
					name = ColorDialog.prototype.colorNames[clr];
				}

				if (name != null)
				{
					tempDiv.setAttribute('title', name);
				}
			}
		};

		editorUi.addListener('darkModeChanged', function()
		{
			tempDiv.style.backgroundColor = graph.freehand.getStrokeColor();
		});
		
		updateName();

		var btn = mxUtils.button('', mxUtils.bind(this, function(evt)
		{
			editorUi.pickColor(graph.freehand.getStrokeColor(true), function(newColor)
			{
				graph.freehand.setStrokeColor(newColor);
				tempDiv.style.backgroundColor = graph.freehand.getStrokeColor();
				updateName();
			}, 'default');
			
			mxEvent.consume(evt);
		}));
		
		btn.style.position = 'absolute';
		btn.style.boxSizing = 'border-box';
		btn.style.padding = '2px';
		btn.style.top = '8px';
		btn.style.right = '8px';
		btn.style.width = '28px';
		btn.style.height = '18px';
		btn.className = 'geColorBtn';
		btn.innerText = '';
		btn.appendChild(tempDiv);
		div.appendChild(btn);

		var settings = document.createElement('img');
		settings.setAttribute('title', mxResources.get('settings'));
		settings.setAttribute('src', Editor.gearImage);
		settings.className = 'geButton';
		settings.style.position = 'absolute';
		settings.style.boxSizing = 'border-box';
		settings.style.padding = '2px';
		settings.style.top = '8px';
		settings.style.right = '38px';
		settings.style.width = '18px';
		settings.style.height = '18px';
		settings.style.opacity = '0.6';
		div.appendChild(settings);

		mxEvent.addListener(settings, 'click', mxUtils.bind(this, function(evt)
		{
			var smoothing = graph.freehand.getSmoothing();

			editorUi.prompt(mxResources.get('smoothing') + ' (1-20)', smoothing, function(newValue)
			{
				if (!isNaN(newValue) && newValue > 0 && newValue <= 20)
				{
					graph.freehand.setSmoothing(parseInt(newValue));
				}
			});
		}));

		mxUtils.br(div);

		var brushSize = document.createElement('input');
		brushSize.setAttribute('type', 'range');
		brushSize.setAttribute('min', '2');
		brushSize.setAttribute('max', '30');
		brushSize.setAttribute('value', graph.freehand.getBrushSize());
		brushSize.style.width = '90%';
		brushSize.style.visibility = 'hidden';
		div.appendChild(brushSize);
		mxUtils.br(div);

		var updateBrushState = function()
		{
			graph.freehand.setPerfectFreehandMode(brushInput.checked)
			brushSize.style.visibility = brushInput.checked? 'visible' : 'hidden';
		};

		mxEvent.addListener(brushInput, 'change', updateBrushState);
		updateBrushState();

		mxEvent.addListener(brushSize, 'change', function()
		{
			graph.freehand.setBrushSize(parseInt(this.value));
		});
	}
	
	var startBtn = mxUtils.button(mxResources.get('startDrawing'), function()
	{
		if (graph.freehand.isDrawing())
		{
			graph.freehand.stopDrawing();
		}
		else
		{
			graph.freehand.startDrawing();
		}
	});
	
	startBtn.setAttribute('title', mxResources.get('startDrawing') + ' (X)');
	startBtn.style.width = '90%';
	startBtn.style.marginLeft = '0px';
	startBtn.style.position = 'relative';
	startBtn.className = 'geBtn gePrimaryBtn';
	
	div.appendChild(startBtn);

	this.window = new mxWindow(mxResources.get('freehand'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(false);
	this.window.setClosable(true);
	
	graph.addListener('freehandStateChanged', mxUtils.bind(this, function()
	{
		startBtn.innerText = '';
		mxUtils.write(startBtn, mxResources.get(graph.freehand.isDrawing() ? 'stopDrawing' : 'startDrawing'));

		var shortcut = document.createElement('span');
		shortcut.className = 'geShortcutKey';
		shortcut.style.margin = '0 2px 4px 0';
		mxUtils.write(shortcut, 'X');
		startBtn.appendChild(shortcut);

		startBtn.setAttribute('title', mxResources.get(graph.freehand.isDrawing() ? 'stopDrawing' : 'startDrawing') + ' (X)');
		startBtn.className = 'geBtn' + (graph.freehand.isDrawing() ? ' gePrimaryBtn' : '');
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
	
	editorUi.installResizeHandler(this, false);
};

/**
 * 
 */
var AdaptiveColorsWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;

	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.overflow = 'hidden';
	div.style.height = '100%';

	var section = document.createElement('div');
	section.style.display = 'flex';
	section.style.alignItems = 'center';
	section.style.justifyContent = 'center';
	section.style.paddingTop = '20px';

	var labelCheckbox = document.createElement('input');
	labelCheckbox.setAttribute('type', 'checkbox');
	labelCheckbox.style.marginRight = '4px';
	labelCheckbox.checked = true;

	var backgroundCheckbox = document.createElement('input');
	backgroundCheckbox.setAttribute('type', 'checkbox');
	backgroundCheckbox.style.marginRight = '4px';
	backgroundCheckbox.checked = true;

	var btn = mxUtils.button(mxResources.get('removeIt', [mxResources.get('userDefined')]), mxUtils.bind(this, function()
	{
		editorUi.removeUserDefinedDarkColors((graph.isSelectionEmpty()) ?
			graph.getVerticesAndEdges() : graph.getSelectionCells(),
			labelCheckbox.checked, backgroundCheckbox.checked);
	}));

	btn.setAttribute('title', 'Convert Colors');
	btn.className = 'geBtn gePrimaryBtn';
	section.appendChild(btn);
	div.appendChild(section);

	section = section.cloneNode(false);
	section.appendChild(backgroundCheckbox);
	section.style.paddingTop = '8px';

	mxUtils.write(section, mxResources.get('background'));
	div.appendChild(section);

	section = section.cloneNode(false);
	section.appendChild(labelCheckbox);
	section.style.paddingTop = '8px';
	
	mxUtils.write(section, mxResources.get('labels'));
	div.appendChild(section);
	
	this.window = new mxWindow(mxResources.get('adaptiveColors'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMinimizable(false);
	this.window.setMaximizable(false);
	this.window.setResizable(false);
	this.window.setClosable(true);
	
	this.window.addListener('show', mxUtils.bind(this, function()
	{
		this.window.fit();
	}));
	
	editorUi.installResizeHandler(this, false);
};

/**
 * 
 */
var ChatWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;

	// Backends selectable in the model dropdown: the configured BYO-key
	// models, the hosted draw.io service and a manual clipboard transport
	// that copies the request for use with an external AI and pastes the
	// response back. There is no mode dropdown - the action is derived
	// from the attachment (context attached -> update, otherwise create).
	var backends = [];

	if (mxUtils.indexOf(Editor.aiActions, 'create') >= 0 ||
		mxUtils.indexOf(Editor.aiActions, 'update') >= 0 ||
		mxUtils.indexOf(Editor.aiActions, 'assist') >= 0)
	{
		for (var i = 0; i < Editor.aiModels.length; i++)
		{
			var temp = Editor.aiModels[i];

			if (Editor.aiConfigs[temp.config] != null && Editor.aiGlobals[
				Editor.aiConfigs[temp.config].apiKey] != null)
			{
				backends.push({id: 'model-' + temp.name, kind: 'model',
					label: temp.name, model: temp});
			}
		}
	}

	// The hosted service pays draw.io's API bill so it is only listed when
	// no BYO model is configured (or in test mode) and its requests are
	// capped at Editor.maxPublicPromptLength characters
	if (editorUi.isExternalDataComms() && EditorUi.isMermaidSupported() &&
		mxUtils.indexOf(Editor.aiActions, 'createPublic') >= 0 &&
		(backends.length == 0 || urlParams['test'] == 1))
	{
		backends.push({id: 'public', kind: 'public',
			label: mxResources.get('draw.io')});
	}

	backends.push({id: 'clipboard', kind: 'clipboard',
		label: mxResources.get('clipboard')});

	var div = document.createElement('div');
	div.style.display = 'flex';
	div.style.overflow = 'hidden';
	div.style.height = '100%';
	div.style.boxSizing = 'border-box';

	mxEvent.addGestureListeners(div, function(evt)
	{
		if (editorUi.sidebar != null)
		{
			editorUi.sidebar.hideTooltip();
		}
	}, null, null);

	// Conversation list on the left, kept in memory only (session-scoped)
	var convBar = document.createElement('div');
	convBar.style.display = 'flex';
	convBar.style.flexDirection = 'column';
	convBar.style.flexShrink = '0';
	convBar.style.width = '130px';
	convBar.style.boxSizing = 'border-box';
	convBar.style.padding = '8px 6px 20px 6px';
	convBar.style.borderRight = '1px solid light-dark(#e5e5e5, #505050)';
	convBar.style.overflow = 'hidden';
	div.appendChild(convBar);

	var convList = document.createElement('div');
	convList.style.flexGrow = '1';
	convList.style.overflow = 'auto';
	convList.style.marginTop = '6px';

	var main = document.createElement('div');
	main.style.display = 'flex';
	main.style.flexDirection = 'column';
	main.style.flexGrow = '1';
	main.style.minWidth = '0';
	main.style.boxSizing = 'border-box';
	main.style.padding = '10px 12px 20px 12px';
	div.appendChild(main);

	var hist = document.createElement('div');
	hist.style.flexGrow = '1';
	hist.style.overflow = 'auto';
	hist.style.fontSize = '12px';
	hist.style.marginRight = '-8px';
	hist.style.paddingRight = '8px';
	main.appendChild(hist);

	mxEvent.addListener(hist, 'scroll', function()
	{
		if (editorUi.sidebar != null)
		{
			editorUi.sidebar.hideTooltip();
		}
	});

	var conversations = [];
	var currentConv = null;

	var itemActiveBg = 'light-dark(#e0e0e0, #3a3a3a)';
	var itemHoverBg = 'light-dark(#ececec, #333333)';

	var updateConvItems = function()
	{
		for (var i = 0; i < conversations.length; i++)
		{
			var conv = conversations[i];
			conv.active = (conv == currentConv);
			conv.item.style.backgroundColor = (conv.active) ?
				itemActiveBg : 'transparent';
		}
	};

	var selectConversation = function(conv)
	{
		currentConv = conv;
		hist.innerHTML = '';
		hist.appendChild(conv.el);
		hist.scrollTop = hist.scrollHeight;
		updateConvItems();
		updateCounter();
		inp.focus();
	};

	var setConversationTitle = function(conv, title)
	{
		conv.title = title;
		conv.label.innerHTML = '';
		mxUtils.write(conv.label, (title != null) ?
			title : mxResources.get('newChat'));
		conv.label.style.fontStyle = (title != null) ? '' : 'italic';
		conv.item.setAttribute('title', (title != null) ?
			title : mxResources.get('newChat'));
	};

	var removeConversation = function(conv)
	{
		var idx = mxUtils.indexOf(conversations, conv);

		if (idx >= 0)
		{
			conversations.splice(idx, 1);
		}

		if (conv.item.parentNode != null)
		{
			conv.item.parentNode.removeChild(conv.item);
		}

		if (conv == currentConv)
		{
			if (conversations.length > 0)
			{
				selectConversation(conversations[Math.min(idx,
					conversations.length - 1)]);
			}
			else
			{
				selectConversation(createConversation());
			}
		}
	};

	function createConversation()
	{
		var conv = {
			title: null,
			turns: [],
			el: document.createElement('div'),
			lastContext: null
		};

		var item = document.createElement('a');
		item.style.display = 'flex';
		item.style.alignItems = 'center';
		item.style.gap = '4px';
		item.style.padding = '5px 6px';
		item.style.borderRadius = '8px';
		item.style.fontSize = '11px';
		item.style.cursor = 'default';
		item.style.overflow = 'hidden';
		conv.item = item;

		var label = document.createElement('span');
		label.style.flexGrow = '1';
		label.style.overflow = 'hidden';
		label.style.textOverflow = 'ellipsis';
		label.style.whiteSpace = 'nowrap';
		item.appendChild(label);
		conv.label = label;

		var del = document.createElement('img');
		del.className = 'geAdaptiveAsset';
		del.setAttribute('src', Editor.trashImage);
		del.setAttribute('title', mxResources.get('delete'));
		del.style.width = '13px';
		del.style.flexShrink = '0';
		del.style.cursor = 'pointer';
		del.style.opacity = '0';
		item.appendChild(del);

		mxEvent.addListener(item, 'mouseenter', function()
		{
			del.style.opacity = '0.6';

			if (!conv.active)
			{
				item.style.backgroundColor = itemHoverBg;
			}
		});

		mxEvent.addListener(item, 'mouseleave', function()
		{
			del.style.opacity = '0';

			if (!conv.active)
			{
				item.style.backgroundColor = 'transparent';
			}
		});

		mxEvent.addListener(item, 'click', function(evt)
		{
			if (mxEvent.getSource(evt) == del)
			{
				editorUi.confirm(mxResources.get('areYouSure'), function()
				{
					removeConversation(conv);
				});
			}
			else if (conv != currentConv)
			{
				selectConversation(conv);
			}

			mxEvent.consume(evt);
		});

		setConversationTitle(conv, null);
		convList.insertBefore(item, convList.firstChild);
		conversations.splice(0, 0, conv);

		return conv;
	};

	var newChatBtn = document.createElement('a');
	newChatBtn.style.display = 'flex';
	newChatBtn.style.alignItems = 'center';
	newChatBtn.style.gap = '5px';
	newChatBtn.style.flexShrink = '0';
	newChatBtn.style.padding = '5px 6px';
	newChatBtn.style.borderRadius = '8px';
	newChatBtn.style.fontSize = '11px';
	newChatBtn.style.fontWeight = 'bold';
	newChatBtn.style.cursor = 'pointer';
	newChatBtn.style.overflow = 'hidden';
	newChatBtn.style.whiteSpace = 'nowrap';

	var newChatIcon = document.createElement('img');
	newChatIcon.className = 'geAdaptiveAsset';
	newChatIcon.setAttribute('src', Editor.plusImage);
	newChatIcon.style.width = '13px';
	newChatIcon.style.flexShrink = '0';
	newChatBtn.appendChild(newChatIcon);

	var newChatLabel = document.createElement('span');
	newChatLabel.style.overflow = 'hidden';
	newChatLabel.style.textOverflow = 'ellipsis';
	mxUtils.write(newChatLabel, mxResources.get('newChat'));
	newChatBtn.appendChild(newChatLabel);

	mxEvent.addListener(newChatBtn, 'mouseenter', function()
	{
		newChatBtn.style.backgroundColor = itemHoverBg;
	});

	mxEvent.addListener(newChatBtn, 'mouseleave', function()
	{
		newChatBtn.style.backgroundColor = 'transparent';
	});

	mxEvent.addListener(newChatBtn, 'click', function()
	{
		// Reuses the current conversation while it is still empty
		if (currentConv == null || currentConv.el.firstChild != null)
		{
			selectConversation(createConversation());
		}
		else
		{
			inp.focus();
		}
	});

	convBar.appendChild(newChatBtn);
	convBar.appendChild(convList);

	// Composer: attachment chip, growing input and a controls row with the
	// plus (attach) menu, paste (clipboard transport) and model selector
	var user = document.createElement('div');
	user.style.borderRadius = '12px';
	user.style.backgroundColor = 'light-dark(#e0e0e0, #3a3a3a)';
	user.style.padding = '8px 10px';
	user.style.marginTop = '8px';
	user.style.flexShrink = '0';

	var chipRow = document.createElement('div');
	chipRow.style.display = 'none';
	chipRow.style.flexWrap = 'wrap';
	chipRow.style.gap = '4px';
	chipRow.style.marginBottom = '6px';
	user.appendChild(chipRow);

	var pendingChip = null;

	var renderChip = function()
	{
		chipRow.innerHTML = '';

		if (pendingChip != null)
		{
			var pill = document.createElement('div');
			pill.style.display = 'flex';
			pill.style.alignItems = 'center';
			pill.style.gap = '5px';
			pill.style.fontSize = '11px';
			pill.style.padding = '2px 8px';
			pill.style.borderRadius = '10px';
			pill.style.backgroundColor = 'light-dark(#cfcfcf, #4a4a4a)';
			mxUtils.write(pill, pendingChip.label);

			var close = document.createElement('img');
			close.className = 'geAdaptiveAsset';
			close.setAttribute('src', Editor.closeImage);
			close.setAttribute('title', mxResources.get('remove'));
			close.style.width = '10px';
			close.style.cursor = 'pointer';
			close.style.opacity = '0.6';
			pill.appendChild(close);

			mxEvent.addListener(close, 'click', function(evt)
			{
				pendingChip = null;
				renderChip();
				mxEvent.consume(evt);
			});

			chipRow.appendChild(pill);
			chipRow.style.display = 'flex';
		}
		else
		{
			chipRow.style.display = 'none';
		}

		updateCounter();
	};

	// Captures the given context as the pending attachment. The XML (and
	// the encoded node later used for apply-diffs) is snapshotted here so
	// selection or diagram changes before send do not alter it.
	var attachContext = function(kind)
	{
		try
		{
			var chip = {kind: kind, page: editorUi.currentPage};

			if (kind == 'file')
			{
				chip.label = mxResources.get('file');
				chip.data = editorUi.getFileData(true, null, null, null,
					true, false, null, null, null, true);
			}
			else
			{
				var enc = new mxCodec(mxUtils.createXmlDocument());

				if (kind == 'selection')
				{
					chip.label = mxResources.get('selection');

					enc.isObjectIgnored = function(obj)
					{
						return obj.constructor == mxCell &&
							(!graph.model.isRoot(obj) &&
							!graph.model.isLayer(obj) &&
							!graph.isCellSelected(obj) &&
							!graph.isAncestorSelected(obj));
					};
				}
				else
				{
					chip.label = mxResources.get('page');
				}

				var node = enc.encode(graph.getModel());

				// Sets node.ownerDocument.documentElement == node so
				// that forward references work correctly
				node.ownerDocument.appendChild(node);
				chip.xmlNode = node;
				chip.data = mxUtils.getXml(node);
			}

			pendingChip = chip;
			renderChip();
			inp.focus();
		}
		catch (e)
		{
			editorUi.handleError(e);
		}
	};

	var inp = document.createElement('textarea');
	inp.setAttribute('rows', '1');
	inp.setAttribute('placeholder', mxResources.get('askMeAnything'));
	inp.style.width = '100%';
	inp.style.outline = 'none';
	inp.style.border = 'none';
	inp.style.resize = 'none';
	inp.style.background = 'transparent';
	inp.style.fontFamily = 'inherit';
	inp.style.fontSize = '12px';
	inp.style.padding = '4px 2px';
	inp.style.margin = '0';
	inp.style.boxSizing = 'border-box';
	inp.style.maxHeight = '92px';
	inp.style.overflow = 'auto';
	user.appendChild(inp);

	// Grows the input with its content (up to maxHeight)
	var updateInputHeight = function()
	{
		inp.style.height = 'auto';
		inp.style.height = Math.min(92, inp.scrollHeight) + 'px';
	};

	mxEvent.addListener(inp, 'input', function()
	{
		updateInputHeight();
		updateCounter();
	});

	var controls = document.createElement('div');
	controls.style.display = 'flex';
	controls.style.alignItems = 'center';
	controls.style.gap = '6px';
	controls.style.marginTop = '2px';
	user.appendChild(controls);

	var plusBtn = document.createElement('img');
	plusBtn.className = 'geAdaptiveAsset';
	plusBtn.setAttribute('src', Editor.thinAddCircleImage);
	plusBtn.setAttribute('title', mxResources.get('add'));
	plusBtn.style.width = '18px';
	plusBtn.style.cursor = 'pointer';
	plusBtn.style.opacity = '0.7';
	plusBtn.style.flexShrink = '0';
	controls.appendChild(plusBtn);

	mxEvent.addListener(plusBtn, 'click', function(evt)
	{
		var offset = mxUtils.getOffset(plusBtn);

		editorUi.showPopupMenu(function(menu, parent)
		{
			menu.addItem(mxResources.get('file'), null, function()
			{
				attachContext('file');
			}, parent, null, (editorUi.pages != null &&
				editorUi.pages.length > 1) || !editorUi.isDiagramEmpty());

			menu.addItem(mxResources.get('page'), null, function()
			{
				attachContext('page');
			}, parent, null, !editorUi.isDiagramEmpty());

			menu.addItem(mxResources.get('selection'), null, function()
			{
				attachContext('selection');
			}, parent, null, !graph.isSelectionEmpty());
		}, offset.x, offset.y + plusBtn.offsetHeight + 4, evt);
	});

	var pasteBtn = mxUtils.button(mxResources.get('paste'), function()
	{
		pasteStandalone(currentConv);
	});
	pasteBtn.className = 'geBtn';
	pasteBtn.setAttribute('title', mxResources.get('pasteResponse'));
	pasteBtn.style.margin = '0';
	pasteBtn.style.fontSize = '11px';
	pasteBtn.style.minWidth = '0';
	pasteBtn.style.padding = '2px 8px';
	controls.appendChild(pasteBtn);

	var spacer = document.createElement('div');
	spacer.style.flexGrow = '1';
	controls.appendChild(spacer);

	var modelSelect = document.createElement('select');
	modelSelect.style.borderColor = 'transparent';
	modelSelect.style.background = 'transparent';
	modelSelect.style.textOverflow = 'ellipsis';
	modelSelect.style.fontSize = '11px';
	modelSelect.style.opacity = '0.8';
	modelSelect.style.maxWidth = '60%';
	modelSelect.style.minWidth = '0';
	modelSelect.style.padding = '2px';

	for (var i = 0; i < backends.length; i++)
	{
		var option = document.createElement('option');
		option.setAttribute('value', backends[i].id);
		mxUtils.write(option, backends[i].label);
		modelSelect.appendChild(option);
	}

	modelSelect.value = backends[0].id;
	controls.appendChild(modelSelect);

	var currentBackend = function()
	{
		for (var i = 0; i < backends.length; i++)
		{
			if (backends[i].id == modelSelect.value)
			{
				return backends[i];
			}
		}

		return backends[backends.length - 1];
	};

	var updateControls = function()
	{
		pasteBtn.style.display = (currentBackend().kind == 'clipboard') ?
			'' : 'none';
		updateCounter();
	};

	mxEvent.addListener(modelSelect, 'change', updateControls);

	// Dictation via the Web Speech API where the browser provides it
	// (Chrome/Edge/Safari, secure context only); recognized text is
	// appended to the prompt. No button is added when unavailable.
	var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
	var stopDictation = null;

	if (SpeechRec != null)
	{
		var micBtn = document.createElement('img');
		micBtn.className = 'geAdaptiveAsset';
		micBtn.setAttribute('src', Editor.micImage);
		micBtn.setAttribute('title', mxResources.get('dictate'));
		micBtn.style.width = '18px';
		micBtn.style.cursor = 'pointer';
		micBtn.style.opacity = '0.7';
		micBtn.style.flexShrink = '0';
		micBtn.style.borderRadius = '50%';
		controls.appendChild(micBtn);

		var recognition = null;

		stopDictation = function()
		{
			if (recognition != null)
			{
				var temp = recognition;
				recognition = null;

				try
				{
					temp.stop();
				}
				catch (e)
				{
					// ignore
				}
			}

			micBtn.style.backgroundColor = '';
			micBtn.style.opacity = '0.7';
		};

		mxEvent.addListener(micBtn, 'click', function()
		{
			if (recognition != null)
			{
				stopDictation();

				return;
			}

			try
			{
				var rec = new SpeechRec();
				rec.continuous = true;
				rec.interimResults = true;

				// Recognized text is appended to what was already typed
				var base = inp.value;

				rec.onresult = function(evt)
				{
					var text = '';

					for (var i = 0; i < evt.results.length; i++)
					{
						text += evt.results[i][0].transcript;
					}

					inp.value = base + ((base != '' && text != '' &&
						base.charAt(base.length - 1) != ' ') ? ' ' : '') + text;
					updateInputHeight();
				};

				// Fires on permission denial, no-speech timeout and network
				// errors; onend covers recognition stopping by itself
				rec.onerror = function(evt)
				{
					if (recognition == rec)
					{
						stopDictation();

						if (evt != null && (evt.error == 'not-allowed' ||
							evt.error == 'service-not-allowed'))
						{
							editorUi.alert(mxResources.get('error') +
								': ' + evt.error);
						}
					}
				};

				rec.onend = function()
				{
					if (recognition == rec)
					{
						stopDictation();
					}
				};

				recognition = rec;
				micBtn.style.backgroundColor = 'light-dark(#fbd2d2, #7a3a3a)';
				micBtn.style.opacity = '1';
				rec.start();
			}
			catch (e)
			{
				stopDictation();
				editorUi.handleError(e);
			}
		});
	}

	// Builds the single-shot prompt sent to the hosted backend: the whole
	// conversation followed by the new request. Not trimmed - the caller
	// enforces Editor.maxPublicPromptLength on the full result so the ring
	// counter and the send both measure exactly what is sent.
	var buildPublicPrompt = function(turns, current)
	{
		var lines = [];

		for (var i = 0; i < turns.length; i++)
		{
			lines.push(((turns[i].role == 'assistant') ? 'Assistant: ' :
				'User: ') + turns[i].content);
		}

		return (lines.length > 0) ? 'Previous conversation:\n\n' +
			lines.join('\n\n') + '\n\nRequest: ' + current : current;
	};

	// Length of the payload the hosted backend would receive for the
	// current draft (message + attachment + conversation history).
	var publicPromptLength = function()
	{
		var draft = mxUtils.trim(inp.value) + ((pendingChip != null) ?
			'\n\nDiagram XML:\n' + pendingChip.data : '');

		return (currentConv != null) ?
			buildPublicPrompt(currentConv.turns, draft).length : draft.length;
	};

	// Character-budget dial for the hosted (free) backend: a small ring
	// (grey track, coloured fill) showing how much of
	// Editor.maxPublicPromptLength the payload about to be sent uses.
	// Hover shows a summary, click opens a details popover. Hidden for BYO
	// models and the clipboard transport (not capped).
	var svgNs = 'http://www.w3.org/2000/svg';
	var counter = document.createElement('span');
	counter.style.display = 'none';
	counter.style.alignItems = 'center';
	counter.style.justifyContent = 'center';
	counter.style.flexShrink = '0';
	counter.style.cursor = 'pointer';
	counter.style.padding = '3px';
	counter.style.borderRadius = '50%';
	counter.style.lineHeight = '0';

	mxEvent.addListener(counter, 'mouseenter', function()
	{
		counter.style.backgroundColor = 'light-dark(#0000000f, #ffffff24)';
	});

	mxEvent.addListener(counter, 'mouseleave', function()
	{
		counter.style.backgroundColor = '';
	});

	var counterSvg = document.createElementNS(svgNs, 'svg');
	counterSvg.setAttribute('width', '15');
	counterSvg.setAttribute('height', '15');
	counterSvg.setAttribute('viewBox', '0 0 36 36');
	counterSvg.style.display = 'block';

	var counterTrack = document.createElementNS(svgNs, 'circle');
	counterTrack.setAttribute('cx', '18');
	counterTrack.setAttribute('cy', '18');
	counterTrack.setAttribute('r', '15.915');
	counterTrack.setAttribute('fill', 'none');
	counterTrack.setAttribute('stroke', 'light-dark(#d8d8d8, #555555)');
	counterTrack.setAttribute('stroke-width', '4');
	counterSvg.appendChild(counterTrack);

	var counterArc = document.createElementNS(svgNs, 'circle');
	counterArc.setAttribute('cx', '18');
	counterArc.setAttribute('cy', '18');
	counterArc.setAttribute('r', '15.915');
	counterArc.setAttribute('fill', 'none');
	counterArc.setAttribute('stroke-width', '4');
	counterArc.setAttribute('stroke-linecap', 'round');
	counterArc.setAttribute('transform', 'rotate(-90 18 18)');
	counterSvg.appendChild(counterArc);

	counter.appendChild(counterSvg);
	controls.appendChild(counter);

	// Details popover, appended to the document body so the dialog's
	// overflow does not clip it. Toggled by clicking the dial, dismissed
	// on an outside click.
	var counterPopover = document.createElement('div');
	counterPopover.style.position = 'fixed';
	counterPopover.style.display = 'none';
	counterPopover.style.zIndex = '10000';
	counterPopover.style.width = '210px';
	counterPopover.style.boxSizing = 'border-box';
	counterPopover.style.padding = '10px 12px';
	counterPopover.style.borderRadius = '8px';
	counterPopover.style.fontSize = '11px';
	counterPopover.style.lineHeight = '1.5';
	counterPopover.style.background = 'light-dark(#ffffff, #2a2a2a)';
	counterPopover.style.color = 'light-dark(#000000, #f0f0f0)';
	counterPopover.style.border = '1px solid light-dark(#d0d0d0, #505050)';
	counterPopover.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.25)';
	document.body.appendChild(counterPopover);

	var hidePopover = null;

	var buildPopover = function()
	{
		var maxLen = Editor.maxPublicPromptLength;
		var len = publicPromptLength();
		var pct = Math.round((len / maxLen) * 100);
		var remaining = maxLen - len;

		counterPopover.innerHTML = '';

		var title = document.createElement('div');
		title.style.fontWeight = 'bold';
		title.style.marginBottom = '2px';
		mxUtils.write(title, mxResources.get('draw.io'));
		counterPopover.appendChild(title);

		var usage = document.createElement('div');
		usage.style.fontVariantNumeric = 'tabular-nums';
		mxUtils.write(usage, len.toLocaleString() + ' / ' +
			maxLen.toLocaleString() + ' (' + pct + '%)');
		counterPopover.appendChild(usage);

		var rem = document.createElement('div');
		rem.style.color = (remaining < 0) ? '#e53935' : '';
		mxUtils.write(rem, mxResources.get('charactersRemaining',
			[remaining.toLocaleString()]));
		counterPopover.appendChild(rem);

		var hint = document.createElement('div');
		hint.style.marginTop = '6px';
		hint.style.opacity = '0.7';
		mxUtils.write(hint, mxResources.get('aiFreeModelHint'));
		counterPopover.appendChild(hint);
	};

	var outsideHandler = function(evt)
	{
		var t = mxEvent.getSource(evt);

		if (t != counter && !counter.contains(t) &&
			t != counterPopover && !counterPopover.contains(t))
		{
			hidePopover();
		}
	};

	hidePopover = function()
	{
		if (counterPopover.style.display != 'none')
		{
			counterPopover.style.display = 'none';
			mxEvent.removeListener(document, 'mousedown', outsideHandler);
		}
	};

	var showPopover = function()
	{
		buildPopover();
		counterPopover.style.display = 'block';

		// Anchor the popover above the dial (below it if there is no room)
		var r = counter.getBoundingClientRect();
		var pr = counterPopover.getBoundingClientRect();
		counterPopover.style.left = Math.max(8, r.right - pr.width) + 'px';
		counterPopover.style.top = ((r.top - pr.height - 8 < 8) ?
			(r.bottom + 8) : (r.top - pr.height - 8)) + 'px';

		mxEvent.addListener(document, 'mousedown', outsideHandler);
	};

	mxEvent.addListener(counter, 'click', function(evt)
	{
		if (counterPopover.style.display == 'none')
		{
			showPopover();
		}
		else
		{
			hidePopover();
		}

		mxEvent.consume(evt);
	});

	var updateCounter = function()
	{
		var maxLen = Editor.maxPublicPromptLength;

		if (currentBackend().kind != 'public' || maxLen <= 0)
		{
			counter.style.display = 'none';
			hidePopover();

			return;
		}

		var len = publicPromptLength();

		if (len == 0)
		{
			counter.style.display = 'none';
			hidePopover();

			return;
		}

		var frac = len / maxLen;
		counterArc.setAttribute('stroke-dasharray',
			(Math.max(0, Math.min(1, frac)) * 100) + ' 100');

		// Blue fill normally, amber approaching the cap, red once over
		counterArc.setAttribute('stroke', (frac > 1) ? '#e53935' :
			((frac >= 0.8) ? '#f9a825' : '#4d90fe'));

		counter.setAttribute('title', mxResources.get('charactersRemaining',
			[(maxLen - len).toLocaleString()]) + ' — ' +
			len.toLocaleString() + '/' + maxLen.toLocaleString() +
			' (' + Math.round(frac * 100) + '%)');
		counter.style.display = 'flex';

		// Keep an open popover in sync as the draft changes
		if (counterPopover.style.display != 'none')
		{
			buildPopover();
		}
	};

	var sendImg = document.createElement('img');
	sendImg.setAttribute('src', Editor.sendImage);
	sendImg.setAttribute('title', mxResources.get('sendMessage'));
	sendImg.className = 'geAdaptiveAsset';
	sendImg.style.cursor = 'pointer';
	sendImg.style.opacity = '0.6';
	sendImg.style.height = '19px';
	sendImg.style.flexShrink = '0';
	controls.appendChild(sendImg);

	main.appendChild(user);
	updateControls();

	function createBubble()
	{
		var bubble = document.createElement('div');
		bubble.style.textAlign = 'left';
		bubble.style.padding = '6px';
		bubble.style.margin = '6px 0';

		return bubble;
	};

	function parseAIMarkup(text)
	{
		return mxUtils.htmlEntities(text, false)
			// Headings (consume surrounding newlines)
			.replace(/\n*^##### (.+)$\n*/gm, '<h5>$1</h5>')
			.replace(/\n*^#### (.+)$\n*/gm, '<h4>$1</h4>')
			.replace(/\n*^### (.+)$\n*/gm, '<h3>$1</h3>')
			.replace(/\n*^## (.+)$\n*/gm, '<h2>$1</h2>')
			.replace(/\n*^# (.+)$\n*/gm, '<h1>$1</h1>')
			// Bold
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			// Italic
			.replace(/\*(.+?)\*/g, '<em>$1</em>')
			// Inline code
			.replace(/`([^`]+)`/g, '<code>$1</code>')
	};

	function createDivForText(text)
	{
		var wrapper = document.createElement('div');
		wrapper.style.whiteSpace = 'pre-wrap';
		wrapper.style.overflow = 'auto';
		wrapper.innerHTML = Graph.sanitizeHtml(parseAIMarkup(text));

		return wrapper;
	};

	function createRetryButton(fn, title)
	{
		var buttons = document.createElement('div');
		buttons.style.display = 'flex';

		var btn = document.createElement('img');
		btn.className = 'geAdaptiveAsset geLibraryButton';
		btn.setAttribute('src', Editor.refreshImage);
		btn.setAttribute('title', (title != null) ? title :
			mxResources.get('tryAgain'));
		buttons.appendChild(btn);
		mxEvent.addListener(btn, 'click', fn);

		return buttons;
	};

	function createError(err, retryFn)
	{
		var title = mxResources.get('error') + ': ';
		var wrapper = document.createElement('div');
		wrapper.style.whiteSpace = 'pre-wrap';

		// Error can be an Error/object with a message, a plain string
		// (e.g. mxscript's "Failed to load ..." on script load failure)
		// or null, so the message is derived defensively here
		var message = (err != null && err.message != null) ? err.message :
			((typeof err === 'string') ? err : mxResources.get('unknownError'));

		// Coerces to string in case message is a non-string (e.g. a
		// parsed JSON error object assigned to e.message)
		if (typeof message !== 'string')
		{
			message = String(message);
		}

		if (message.substring(0, title.length) != title)
		{
			message = title + message;
		}

		mxUtils.write(wrapper, message);

		if (retryFn != null)
		{
			wrapper.appendChild(createRetryButton(retryFn));
		}

		return wrapper;
	};

	// Renders a parsed response ([textBefore, diagramXml, textAfter], see
	// Editor.extractGraphModelFromText) into the given bubble. opts:
	// prompt (drag/tooltip label), applyCtx ({xmlNode, page} snapshot,
	// {fresh: true} for a diff against the current page, or null for
	// insert-only), retryFn (re-runs the request) and infoLabel.
	var renderResponseData = function(target, data, opts)
	{
		var cells = null;

		if (data != null && data.length > 1 && data[1].length > 0)
		{
			try
			{
				cells = editorUi.stringToCells(data[1]);
			}
			catch (e)
			{
				throw new Error(e.toString() + '\n\n' + data[1]);
			}
		}

		target.innerHTML = '';

		if (cells != null && cells.length > 0)
		{
			var bbox = graph.getBoundingBoxFromGeometry(cells);
			editorUi.sidebar.graph.moveCells(cells, -bbox.x, -bbox.y);
			var sentModel = null;

			var insertCells = function()
			{
				var pt = graph.getFreeInsertPoint();
				graph.setSelectionCells(graph.importCells(cells, pt.x, pt.y));
			};

			var insertFn = function(e)
			{
				if (editorUi.sidebar != null)
				{
					editorUi.sidebar.hideTooltip();
				}

				graph.model.beginUpdate();
				try
				{
					insertCells();
				}
				finally
				{
					graph.model.endUpdate();
				}

				if (graph.getSelectionCell() != null)
				{
					graph.scrollCellToVisible(graph.getSelectionCell());
				}

				if (e != null)
				{
					mxEvent.consume(e);
				}
			};

			// Applies the response as a diff against the context that was
			// sent (or the current page for pasted responses) so concurrent
			// changes are not lost; falls back to insert if the page is gone
			var applyFn = (opts.applyCtx == null) ? null : function(e)
			{
				if (editorUi.sidebar != null)
				{
					editorUi.sidebar.hideTooltip();
				}

				try
				{
					var page = null;
					var base = null;

					if (opts.applyCtx.fresh)
					{
						var enc = new mxCodec(mxUtils.createXmlDocument());
						var node = enc.encode(graph.getModel());
						node.ownerDocument.appendChild(node);
						var dec = new mxCodec(node.ownerDocument);
						base = new mxGraphModel();
						dec.decode(node, base);
						page = editorUi.currentPage;
					}
					else
					{
						if (sentModel == null)
						{
							var dec2 = new mxCodec(opts.applyCtx.xmlNode.ownerDocument);
							sentModel = new mxGraphModel();
							dec2.decode(opts.applyCtx.xmlNode, sentModel);
						}

						base = sentModel;
						page = opts.applyCtx.page;
					}

					graph.model.beginUpdate();
					try
					{
						if (base != null && page != null &&
							editorUi.getPageIndex(page) != null)
						{
							editorUi.selectPage(page);
							var doc = mxUtils.parseXml(data[1]);
							var codec = new mxCodec(doc);
							var receivedModel = new mxGraphModel();
							codec.decode(doc.documentElement, receivedModel);

							// Diff of the sent and received diagrams to patch
							// the page without losing concurrent changes
							var patch = editorUi.diffCells(base.root,
								receivedModel.root);
							editorUi.patchPage(page, patch, null, true);
							EditorUi.debug('EditorUi.ChatWindow.apply',
								'base', base, 'receivedModel', receivedModel,
								'patch', patch);
						}
						else
						{
							insertCells();
						}
					}
					finally
					{
						graph.model.endUpdate();
					}

					if (graph.getSelectionCell() != null)
					{
						graph.scrollCellToVisible(graph.getSelectionCell());
					}
				}
				catch (err)
				{
					editorUi.handleError(err);
				}

				if (e != null)
				{
					mxEvent.consume(e);
				}
			};

			if (data[0].length > 0)
			{
				target.appendChild(createDivForText(data[0]));
			}

			var svg = editorUi.getSvgForXml(data[1]);
			svg.style.overflow = 'visible';
			svg.style.padding = '1px';
			svg.style.cursor = 'move';
			svg.style.width = '160px';
			svg.style.height = 'auto';
			svg.style.maxHeight = '460px';

			var item = document.createElement('a');
			item.className = 'geItem';
			item.style.padding = '4px';
			item.style.borderRadius = '10px';
			item.appendChild(svg);
			target.appendChild(item);
			editorUi.sidebar.createItem(cells, opts.prompt, true, true,
				bbox.width, bbox.height, true, true, (applyFn != null) ?
				applyFn : insertFn, null, null, null, null, null, item);

			if (opts.infoLabel != null)
			{
				item.setAttribute('title', opts.infoLabel);
			}

			var buttons = document.createElement('div');
			buttons.style.display = 'flex';

			var btn = document.createElement('img');
			btn.className = 'geAdaptiveAsset geLibraryButton';

			if (opts.retryFn != null)
			{
				btn.setAttribute('src', Editor.refreshImage);
				btn.setAttribute('title', mxResources.get('refresh'));
				buttons.appendChild(btn);
				mxEvent.addListener(btn, 'click', opts.retryFn);
				btn = btn.cloneNode();
			}

			btn.setAttribute('src', Editor.copyImage);
			btn.setAttribute('title', mxResources.get('copy'));
			buttons.appendChild(btn);

			mxEvent.addListener(btn, 'click', function()
			{
				editorUi.writeTextToClipboard(data[1], function(e)
				{
					editorUi.handleError(e);
				});
			});

			if (editorUi.getServiceName() == 'draw.io')
			{
				btn = btn.cloneNode();
				btn.setAttribute('src', Editor.shareImage);
				btn.setAttribute('title', mxResources.get(!editorUi.isStandaloneApp() ?
					'openInNewWindow' : 'export'));
				buttons.appendChild(btn);

				mxEvent.addListener(btn, 'click', function(evt)
				{
					if (!editorUi.isStandaloneApp())
					{
						// Serializes the normalized cells (moved to start at
						// (0,0) above) so the wrapper group opens at the origin
						// instead of carrying the response's original offset
						editorUi.editor.editAsNew(mxUtils.getXml(
							graph.encodeCells(cells)));
					}
					else
					{
						editorUi.saveData('export.xml', 'xml', data[1], 'text/xml');
					}
				});
			}

			btn = btn.cloneNode();
			btn.setAttribute('src', Editor.magnifyImage);
			btn.setAttribute('title', mxResources.get('preview'));
			buttons.appendChild(btn);

			mxEvent.addListener(btn, 'click', function(evt)
			{
				var ww = window.innerWidth || document.documentElement.clientWidth ||
					document.body.clientWidth;
				var wh = window.innerHeight || document.documentElement.clientHeight ||
					document.body.clientHeight;

				editorUi.sidebar.createTooltip(target, cells,
					Math.min(ww - 120, 1600), Math.min(wh - 120, 1200),
					opts.prompt, true, new mxPoint(mxEvent.getClientX(evt),
					mxEvent.getClientY(evt)), true, null, true, false);
			});

			btn = btn.cloneNode();
			btn.setAttribute('src', Editor.plusImage);
			btn.setAttribute('title', mxResources.get('insert'));
			buttons.appendChild(btn);
			mxEvent.addListener(btn, 'click', insertFn);

			if (applyFn != null)
			{
				btn = btn.cloneNode();
				btn.setAttribute('src', Editor.checkImage);
				btn.setAttribute('title', mxResources.get('apply'));
				buttons.appendChild(btn);
				mxEvent.addListener(btn, 'click', applyFn);
			}

			target.appendChild(buttons);

			if (data[2].length > 0)
			{
				target.appendChild(createDivForText(data[2]));
			}
		}
		else if (data == null)
		{
			mxUtils.write(target, mxResources.get('errShowingDiag'));
		}
		else
		{
			target.style.whiteSpace = 'pre-wrap';
			target.appendChild(createDivForText(data[0]));

			// Surfaces the response body when it carried content that
			// could not be turned into a diagram (e.g. a truncated or
			// malformed XML reply), so the chat shows the result and a
			// retry instead of an empty bubble
			if (data[1] != null && data[1].length > 0)
			{
				target.appendChild(createDivForText(data[1]));
			}

			target.appendChild(createDivForText(data[2]));

			if (opts.retryFn != null)
			{
				target.appendChild(createRetryButton(opts.retryFn,
					mxResources.get('refresh')));
			}
		}

		target.scrollIntoView({behavior: 'smooth',
			block: 'end', inline: 'nearest'});
	};

	// Handles raw model output: a mermaid declaration is converted to
	// draw.io XML via the native parser, everything else goes through
	// Editor.extractGraphModelFromText. On success the exchange is recorded
	// via opts.recordTurn; for a mermaid response the recorded turn contains
	// both the mermaid source and the converted XML so a follow-up request
	// lets the model iterate on the XML.
	var renderModelText = function(target, text, opts, onError)
	{
		var mermaid = editorUi.extractMermaidDeclaration(text);

		if (mermaid == null)
		{
			renderResponseData(target, Editor.extractGraphModelFromText(text), opts);

			if (opts.recordTurn != null)
			{
				opts.recordTurn(text);
			}
		}
		else
		{
			editorUi.parseMermaidDiagram(mermaid, null, function(xml)
			{
				try
				{
					// Wraps in an editable mermaid group (carries the source
					// for double-click edit), as the insert dialog does
					renderResponseData(target, ['', mxMermaidToDrawio.wrapGroup(
						xml, mermaid, null), ''], opts);

					if (opts.recordTurn != null)
					{
						opts.recordTurn('```mermaid\n' + mermaid + '\n```\n\n' +
							'The same diagram as draw.io XML, use this as the ' +
							'basis for changes:\n\n```xml\n' + xml + '\n```');
					}
				}
				catch (e)
				{
					onError(e);
				}
			}, onError);
		}
	};

	// Records the exchange in the conversation history once a response
	// arrives; a retry updates the assistant turn in place instead of
	// appending a duplicate
	var createTurnRecorder = function(conv, waiting, userContent)
	{
		var userTurn = null;
		var assistantTurn = null;

		return {
			record: function(assistantContent)
			{
				// Skip if the conversation's response bubble was detached
				// mid-flight so an in-flight response cannot leave an orphan
				// turn in the history
				if (waiting.parentNode == null)
				{
					return;
				}

				if (assistantTurn == null)
				{
					userTurn = {role: 'user', content: userContent};
					assistantTurn = {role: 'assistant', content: assistantContent};
					conv.turns.push(userTurn, assistantTurn);
				}
				else
				{
					assistantTurn.content = assistantContent;
				}

				// History grew - refresh the ring for the next message
				updateCounter();
			}
		};
	};

	// Clones all properties of the given object and replaces placeholders
	// in string properties recursively
	var populateTemplate = function(obj, resolver)
	{
		var result = new obj.constructor();

		for (var key in obj)
		{
			var value = obj[key];

			if (typeof value === 'object')
			{
				result[key] = populateTemplate(value, resolver);
			}
			else if (typeof value === 'string')
			{
				result[key] = Editor.replacePlaceholders(value, resolver);
			}
			else
			{
				result[key] = value;
			}
		}

		return result;
	};

	// Prepends the recorded conversation turns to the request so the model
	// can refine its previous answer. Provider request shapes differ, so the
	// two known shapes are handled explicitly (OpenAI/Claude 'messages',
	// Gemini 'contents'); an unknown shape falls back to a single-shot
	// request.
	var threadHistory = function(params, turns)
	{
		if (params != null && turns != null && turns.length > 0)
		{
			if (Array.isArray(params.messages) && params.messages.length > 0)
			{
				var current = params.messages[params.messages.length - 1];
				var head = params.messages.slice(0, params.messages.length - 1);
				var histMsgs = [];

				for (var i = 0; i < turns.length; i++)
				{
					histMsgs.push({role: turns[i].role,
						content: turns[i].content});
				}

				params.messages = head.concat(histMsgs, [current]);
			}
			else if (Array.isArray(params.contents) && params.contents.length > 0)
			{
				var currentC = params.contents[params.contents.length - 1];
				currentC.role = 'user';
				var headC = params.contents.slice(0, params.contents.length - 1);
				var histContents = [];

				for (var i = 0; i < turns.length; i++)
				{
					histContents.push({role: (turns[i].role == 'assistant') ?
						'model' : 'user', parts: [{text: turns[i].content}]});
				}

				params.contents = headC.concat(histContents, [currentC]);
			}
		}
	};

	// Renders clipboard content as a response bubble in the given
	// conversation (replaces the old insert/update-from-clipboard
	// commands): the result can be inserted or applied as a diff
	// against the current page
	var pasteStandalone = function(conv)
	{
		var waiting = createBubble();
		waiting.className = 'geSidebar';
		conv.el.appendChild(waiting);

		var fail = function(e)
		{
			waiting.innerHTML = '';
			waiting.appendChild(createError(e, null));
			waiting.scrollIntoView({behavior: 'smooth',
				block: 'end', inline: 'nearest'});
		};

		try
		{
			navigator.clipboard.readText().then(function(text)
			{
				try
				{
					renderModelText(waiting, mxUtils.trim(text),
						{prompt: mxResources.get('paste'),
						applyCtx: {fresh: true}}, fail);
				}
				catch (e)
				{
					fail(e);
				}
			})['catch'](fail);
		}
		catch (e)
		{
			fail(e);
		}
	};

	// Adds a user message and its asynchronous response to the given
	// conversation. chip is the attached context (or null) and backend
	// the selected transport.
	var addExchange = function(conv, prompt, chip, backend)
	{
		var bubble = createBubble();
		bubble.style.whiteSpace = 'pre-wrap';
		bubble.style.marginBottom = '2px';
		bubble.style.marginLeft = '40%';
		bubble.style.borderRadius = '10px';
		bubble.style.backgroundColor = 'light-dark(#e0e0e0, #3a3a3a)';
		mxUtils.write(bubble, (prompt != '') ? prompt : chip.label);
		conv.el.appendChild(bubble);

		if (chip != null && prompt != '')
		{
			var chipEcho = document.createElement('div');
			chipEcho.style.fontSize = '10px';
			chipEcho.style.opacity = '0.7';
			chipEcho.style.marginTop = '4px';
			mxUtils.write(chipEcho, '+ ' + chip.label);
			bubble.appendChild(chipEcho);
		}

		// Copy and edit actions for the user prompt. There is no per-message
		// delete - the whole conversation is deleted from the sidebar.
		if (prompt != '')
		{
			var buttons = document.createElement('div');
			buttons.className = 'geInlineButtons';
			buttons.style.display = 'flex';
			buttons.style.justifyContent = 'end';
			conv.el.appendChild(buttons);

			var btn = document.createElement('img');
			btn.className = 'geAdaptiveAsset geLibraryButton';
			btn.setAttribute('src', Editor.copyImage);
			btn.setAttribute('title', mxResources.get('copy'));
			buttons.appendChild(btn);

			mxEvent.addListener(btn, 'click', function()
			{
				editorUi.writeTextToClipboard(prompt, function(e)
				{
					editorUi.handleError(e);
				}, function()
				{
					editorUi.alert(mxResources.get('copiedToClipboard'));
				});
			});

			btn = btn.cloneNode();
			btn.setAttribute('src', Editor.editImage);
			btn.setAttribute('title', mxResources.get('edit'));
			buttons.appendChild(btn);

			mxEvent.addListener(btn, 'click', function()
			{
				inp.value = prompt;
				updateInputHeight();
				inp.focus();

				if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
				{
					inp.select();
				}
				else
				{
					document.execCommand('selectAll', false, null);
				}
			});
		}

		var waiting = createBubble();
		waiting.className = 'geSidebar';
		waiting.style.marginTop = '2px';
		conv.el.appendChild(waiting);

		// The recorded user turn embeds the attached diagram so follow-up
		// requests keep the context without re-attaching it
		var userContent = (chip == null) ? prompt :
			((prompt != '') ? prompt + '\n\n' : '') +
			'Diagram XML:\n```xml\n' + chip.data + '\n```';

		var recorder = createTurnRecorder(conv, waiting, userContent);

		// Context for the apply diff: a page/selection chip creates a new
		// snapshot which also becomes the conversation default so follow-up
		// responses without a chip remain applicable; a file attachment has
		// no page-level snapshot to diff against
		var applyCtx = null;

		if (chip != null)
		{
			if (chip.kind == 'file')
			{
				conv.lastContext = null;
			}
			else
			{
				applyCtx = {xmlNode: chip.xmlNode, page: chip.page};
				conv.lastContext = applyCtx;
			}
		}
		else
		{
			applyCtx = conv.lastContext;
		}

		var historyTurns = conv.turns.slice();
		var t0 = Date.now();
		var processMessage = null;

		var handleError = function(e)
		{
			waiting.innerHTML = '';
			waiting.appendChild(createError(e, processMessage));
			waiting.scrollIntoView({behavior: 'smooth',
				block: 'end', inline: 'nearest'});
			EditorUi.debug('EditorUi.ChatWindow.handleError', 'error', e);

			if (window.console != null)
			{
				console.error(e);
			}
		};

		var showWaiting = function()
		{
			waiting.innerHTML = '';

			var wrapper = document.createElement('div');
			wrapper.style.display = 'flex';
			wrapper.style.alignItems = 'center';
			mxUtils.write(wrapper, mxResources.get('loading') + '...');

			var img = document.createElement('img');
			img.className = 'geAdaptiveAsset';
			img.setAttribute('src', Editor.svgSpinImage);
			img.style.width = '16px';
			img.style.height = '16px';
			img.style.marginLeft = '6px';
			wrapper.appendChild(img);
			waiting.appendChild(wrapper);

			waiting.scrollIntoView({behavior: 'smooth',
				block: 'end', inline: 'nearest'});
		};

		if (backend.kind == 'model')
		{
			var aiModel = backend.model;
			var config = Editor.aiConfigs[aiModel.config];

			var resolver = function(name)
			{
				var value = null;

				if (name == 'prompt')
				{
					value = prompt;
				}
				else if (name == 'data' && chip != null)
				{
					value = chip.data;
				}
				else if (name == 'model')
				{
					value = aiModel.model;
				}
				else if (name == 'apiKey')
				{
					name = config.apiKey;
				}
				else if (name == 'action')
				{
					// No mode dropdown: an attached context makes this an
					// update request, otherwise create (which also answers
					// plain questions as text)
					name = (chip != null) ? 'update' : 'create';
				}

				if (value == null)
				{
					value = Editor.replacePlaceholders(Editor.aiGlobals[name], resolver);
				}

				return value;
			};

			var params = populateTemplate(config.request, resolver);
			threadHistory(params, historyTurns);

			processMessage = function()
			{
				showWaiting();

				editorUi.createTimeout(editorUi.editor.generateTimeout, function(timeout)
				{
					var handleErrorWithTimeout = function(e)
					{
						timeout.clear();
						handleError(e);
					};

					var url = Editor.replacePlaceholders(config.endpoint, resolver);
					var req = new mxXmlRequest(url, JSON.stringify(params), 'POST');

					req.setRequestHeaders = function(request, params)
					{
						request.setRequestHeader('Content-Type', 'application/json');

						for (var key in config.requestHeaders)
						{
							request.setRequestHeader(key, Editor.replacePlaceholders(
								config.requestHeaders[key], resolver));
						}
					};

					EditorUi.debug('EditorUi.ChatWindow.send', 'url', url,
						'params', params, 'aiModel', aiModel, 'config', config);

					req.send(function(req)
					{
						if (timeout.clear())
						{
							try
							{
								if (req.getStatus() >= 200 && req.getStatus() <= 299)
								{
									var response = JSON.parse(req.getText());
									var result = Editor.executeSimpleJsonPath(
										response, config.responsePath);
									var text = mxUtils.trim((result.length > 0) ?
										result[0] : req.getText());
									var dt = Date.now() - t0;
									EditorUi.debug('EditorUi.ChatWindow.response',
										'params', params, 'response', response,
										'text', [text], 'time', dt);

									renderModelText(waiting, text, {prompt: prompt,
										applyCtx: applyCtx, retryFn: processMessage,
										recordTurn: recorder.record,
										infoLabel: (urlParams['test'] == 1) ?
											backend.label + ' (' + dt + ' ms)' : null},
										handleErrorWithTimeout);
								}
								else
								{
									var result = 'Error: ' + req.getStatus();

									try
									{
										var resp = JSON.parse(req.getText());

										if (resp != null && resp.error != null &&
											resp.error.message != null)
										{
											result = resp.error.message;
										}
									}
									catch (e)
									{
										// ignore
									}

									handleError({message: result});
								}
							}
							catch (e)
							{
								handleErrorWithTimeout(e);
							}
						}
					}, handleErrorWithTimeout);
				}, handleError);
			};

			processMessage();
		}
		else if (backend.kind == 'public')
		{
			// The hosted service is free for the user and paid for by
			// draw.io, so the entire payload sent to it (the message, the
			// attached diagram and the conversation history) is capped at
			// Editor.maxPublicPromptLength characters
			var current = prompt + ((chip != null) ?
				'\n\nDiagram XML:\n' + chip.data : '');
			var full = buildPublicPrompt(historyTurns, current);

			processMessage = function()
			{
				var maxLen = Editor.maxPublicPromptLength;

				if (maxLen > 0 && full.length > maxLen)
				{
					waiting.innerHTML = '';
					waiting.appendChild(createError({message:
						mxResources.get('promptTooLarge', [maxLen])}, null));
					waiting.scrollIntoView({behavior: 'smooth',
						block: 'end', inline: 'nearest'});

					return;
				}

				showWaiting();

				editorUi.generateOpenAiMermaidDiagram(full,
					function(xml)
					{
						try
						{
							var dt = Date.now() - t0;
							renderResponseData(waiting, ['', xml, ''],
								{prompt: prompt, applyCtx: applyCtx,
								retryFn: processMessage,
								infoLabel: (urlParams['test'] == 1) ?
									backend.label + ' (' + dt + ' ms)' : null});
							recorder.record(xml);
						}
						catch (e)
						{
							handleError(e);
						}
					}, handleError);
			};

			processMessage();
		}
		else
		{
			// Manual transport: copies the request (instructions, context
			// and prompt) for an external AI; the response is pasted back
			// into this exchange and rendered like a normal reply
			var text = null;

			if (prompt == '' && chip != null)
			{
				// Bare context copy for pasting into an external chat
				text = chip.data;
			}
			else
			{
				var sys = Editor.aiGlobals[(chip != null) ? 'update' : 'create'];

				text = Editor.replacePlaceholders(sys, function(name)
				{
					return (name == 'data' && chip != null) ? chip.data : null;
				}) + '\n\n' + prompt;
			}

			var pasteFailed = null;

			var addPasteButton = function()
			{
				var pasteResp = mxUtils.button(mxResources.get('pasteResponse'), function()
				{
					try
					{
						navigator.clipboard.readText().then(function(respText)
						{
							try
							{
								waiting.innerHTML = '';
								renderModelText(waiting, mxUtils.trim(respText),
									{prompt: (prompt != '') ? prompt : chip.label,
									applyCtx: applyCtx,
									recordTurn: recorder.record}, pasteFailed);
							}
							catch (e)
							{
								pasteFailed(e);
							}
						})['catch'](pasteFailed);
					}
					catch (e)
					{
						pasteFailed(e);
					}
				});
				pasteResp.className = 'geBtn';
				pasteResp.style.margin = '6px 0 0 0';
				waiting.appendChild(pasteResp);
			};

			// Re-offers the paste button so a failed paste (e.g. text that
			// is neither a diagram nor mermaid yet) can be retried
			pasteFailed = function(e)
			{
				waiting.innerHTML = '';
				waiting.appendChild(createError(e, null));
				addPasteButton();
				waiting.scrollIntoView({behavior: 'smooth',
					block: 'end', inline: 'nearest'});
			};

			editorUi.writeTextToClipboard(text, function(e)
			{
				handleError(e);
			}, function()
			{
				waiting.innerHTML = '';

				var wrapper = document.createElement('div');
				mxUtils.write(wrapper, mxResources.get('copiedToClipboard'));
				waiting.appendChild(wrapper);
				addPasteButton();
				waiting.scrollIntoView({behavior: 'smooth',
					block: 'end', inline: 'nearest'});
			});
		}
	};

	function send()
	{
		if (stopDictation != null)
		{
			stopDictation();
		}

		var prompt = mxUtils.trim(inp.value);
		var backend = currentBackend();

		// A bare attachment can be sent to the clipboard (copies the
		// diagram for an external chat), all other backends need a prompt
		if (prompt == '' && !(backend.kind == 'clipboard' && pendingChip != null))
		{
			return;
		}

		try
		{
			var chip = pendingChip;
			pendingChip = null;
			renderChip();

			if (currentConv.title == null && prompt != '')
			{
				setConversationTitle(currentConv, (prompt.length > 40) ?
					prompt.substring(0, 40) + '…' : prompt);
			}

			addExchange(currentConv, prompt, chip, backend);
			inp.value = '';
			updateInputHeight();
			updateCounter();
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.ChatWindow.send', 'error', e);
		}
	};

	mxEvent.addListener(sendImg, 'click', send);

	mxEvent.addListener(inp, 'keydown', function(evt)
	{
		if (evt.keyCode == 13 && !mxEvent.isShiftDown(evt))
		{
			send();
			mxEvent.consume(evt);
		}
	});

	this.generate = mxUtils.bind(this, function(prompt)
	{
		// External entry point (e.g. smart templates): starts a fresh
		// conversation when the current one already has content
		if (currentConv == null || currentConv.el.firstChild != null)
		{
			selectConversation(createConversation());
		}

		inp.value = prompt;
		updateInputHeight();
		send();
	});

	selectConversation(createConversation());

	this.window = new mxWindow(mxResources.get('generate'),
		div, x, y, w, h, true, true);
	this.window.minimumSize = new mxRectangle(0, 0, 260, 200);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);

	// Adds help icon to title bar
	if (!editorUi.isOffline())
	{
		var icon = editorUi.createHelpIcon('https://www.drawio.com/doc/faq/configure-ai-options');
		icon.style.cursor = 'help';
		icon.style.opacity = '0.5';
		this.window.buttons.insertBefore(icon, this.window.buttons.firstChild);
	}

	this.window.addListener('show', mxUtils.bind(this, function()
	{
		this.window.fit();
		inp.focus();
	}));

	// Dismiss the counter details popover when the dialog is hidden, and
	// remove it from the document body if the window is ever destroyed
	this.window.addListener('hide', function()
	{
		hidePopover();
	});

	this.window.addListener(mxEvent.DESTROY, function()
	{
		hidePopover();

		if (counterPopover.parentNode != null)
		{
			counterPopover.parentNode.removeChild(counterPopover);
		}
	});

	editorUi.installResizeHandler(this, true);
};

/**
 * 
 */
var TagsWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;
	var helpButton = null;

	if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP)
	{
		helpButton = editorUi.menus.createHelpLink('https://www.drawio.com/blog/tags-in-diagrams');
	}

	var tagsComponent = editorUi.editor.graph.createTagsDialog(mxUtils.bind(this, function()
	{
		return this.window.isVisible();
	}), null, function(allTags, updateFn)
	{
		if (graph.isEnabled())
		{
			var dlg = new FilenameDialog(editorUi, '', mxResources.get('add'), function(newValue)
			{
				editorUi.hideDialog();
				
				if (newValue != null && newValue.length > 0)
				{
					var temp = newValue.split(' ');
					var newTags = [];
					var tags = [];

					for (var i = 0; i < temp.length; i++)
					{
						var token = mxUtils.trim(temp[i]);

						if (token != '')
						{
							tags.push(token);

							if (mxUtils.indexOf(allTags, token) < 0)
							{
								newTags.push(token);
							}
						}
					}

					if (graph.isSelectionEmpty())
					{
						updateFn(allTags.concat(newTags));
					}
					else
					{
						graph.addTagsForCells(graph.getSelectionCells(), tags);
					}
				}
			}, mxResources.get('tags'), null, null, 'https://www.drawio.com/blog/tags-in-diagrams');
			
			editorUi.showDialog(dlg.container, 320, 80, true, true);
			dlg.init();
		}
	}, helpButton);

	var div = tagsComponent.div;
	this.window = new mxWindow(mxResources.get('tags'), div, x, y, w, h, true, true);
	this.window.minimumSize = new mxRectangle(0, 0, 212, 120);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);

	this.window.addListener('show', mxUtils.bind(this, function()
	{
		tagsComponent.refresh();
		this.window.fit();
	}));

	editorUi.installResizeHandler(this, true);
};

/**
 * Step-based animation editor. Non-modal floating window so the user can
 * select cells in the main canvas while building the script.
 *
 * The script is stored as an 'animation' attribute on each page's model
 * root, so each page has its own animation. Switching pages reloads the
 * script for the new page and persists any unsaved changes from the old one.
 *
 * The animation engine is Editor.AnimationPlayer — see Editor.js.
 */
/**
 * Step-based animation editor. Edits a JSON {steps: [...]} array directly —
 * the same structure used in {animation: {steps: [...]}} custom-link actions
 * and on the model root's `animation` attribute (after legacy text conversion).
 *
 * Two operating modes:
 *   - kind 'page' (default): reads/writes the model root's animation
 *     attribute. Auto-converts legacy text on read; always writes JSON.
 *   - kind 'action': operates on the steps array passed in via opts.initial
 *     and hands the edited array back to opts.save(steps) on Apply. Used by
 *     the LinkDialog's "Custom action" option.
 */
var AnimationDialog = function(editorUi, x, y, w, h, opts)
{
	opts = opts || {};
	var kind = opts.kind || 'page';
	var graph = editorUi.editor.graph;
	var selectorChips = SelectorChips.create(graph, editorUi);

	// Initialized up-front so `makeStepRow` — called via the initial
	// `renderList()` further below — can safely call `.has(idx)` on it.
	// `var` hoisting alone isn't enough: the value would still be
	// `undefined` until the assignment lower in the function runs.
	var playingSteps = new Set();

	// Static label refreshers — registered closures get re-run when the
	// active language changes, so the dialog re-localizes without close /
	// reopen. (Dynamic row labels re-localize for free via renderList.)
	var staticRefreshers = [];

	var resolveWindowTitle = function()
	{
		if (opts.windowTitleKey)
		{
			return mxResources.get(opts.windowTitleKey, null,
				opts.windowTitleFallback || 'Animation');
		}
		// Default title — page-mode opens via Edit > Page Setup > Edit;
		// the section there is labelled "Lightbox animation", so reuse
		// that resource to keep the wording consistent.
		return mxResources.get('lightboxAnimation', null, 'Lightbox animation');
	};

	var div = document.createElement('div');
	div.style.cssText = 'padding:18px;box-sizing:border-box;height:100%;' +
		'display:flex;flex-direction:column;font-size:13px;overflow:hidden;' +
		'color:light-dark(#1d1d1f,#e0e0e0)';

	// Optional title row — only rendered for action mode (opts.showTitle).
	// Lets the user attach a human-readable label to a custom action, which
	// the host (e.g. Edit Link dialog) shows in place of the action chip's
	// generic summary.
	var titleInput = null;
	var titleLabel = null;
	if (opts.showTitle)
	{
		var titleRow = document.createElement('div');
		titleRow.style.cssText = 'display:flex;align-items:center;gap:8px;' +
			'margin-bottom:8px;flex:0 0 auto';

		titleLabel = document.createElement('span');
		titleLabel.style.cssText = 'font-weight:600;flex:0 0 auto';
		var applyTitleLabel = function()
		{
			titleLabel.textContent = '';
			mxUtils.write(titleLabel,
				mxResources.get('title', null, 'Title') + ':');
		};
		applyTitleLabel();
		staticRefreshers.push(applyTitleLabel);
		titleRow.appendChild(titleLabel);

		titleInput = document.createElement('input');
		titleInput.type = 'text';
		titleInput.style.cssText = 'flex:1;padding:4px 6px;' +
			'border:1px solid light-dark(#d2d2d7,#48484a);border-radius:4px;' +
			'background:light-dark(#ffffff,#1c1c1e);' +
			'color:light-dark(#1d1d1f,#e0e0e0)';
		var applyTitlePlaceholder = function()
		{
			titleInput.placeholder = mxResources.get('optional', null, 'optional');
			titleInput.title = mxResources.get('title', null, 'Title');
		};
		applyTitlePlaceholder();
		staticRefreshers.push(applyTitlePlaceholder);

		titleRow.appendChild(titleInput);
		div.appendChild(titleRow);
	}

	// Header row layout (page mode):
	//   Loop (left) | Enabled (centered) | Edit Text (right)
	// Action mode (custom links) has only Edit Text on the right with a
	// leading spacer — the other two controls don't apply.
	var listHeader = document.createElement('div');
	listHeader.style.cssText = 'display:flex;align-items:center;' +
		'justify-content:space-between;margin-bottom:6px;flex:0 0 auto';

	// Shared style for the three header checkbox labels.
	var headerLabelCss = 'display:flex;align-items:center;gap:4px;' +
		'cursor:pointer;font-size:12px;color:light-dark(#6e6e73,#a0a0a0)';

	// Loop checkbox — only meaningful in page mode (chromeless playback
	// reads the loop flag from the file). Action mode (custom links) is
	// always one-shot — adding loop there would loop forever once a user
	// clicks the link, which is never what they want.
	var loopCheckbox = null;
	// Disabled checkbox — gates chromeless autoplay. Checked = the steps
	// stay attached to the page but don't autoplay (a temporary off-switch
	// without deleting the script). The JSON field is `enabled` (default
	// true); this checkbox is its inverse, reusing the pre-existing
	// `disabled` resource. Unchecked by default.
	var disabledCheckbox = null;

	if (kind == 'page')
	{
		var loopLabel = document.createElement('label');
		loopLabel.style.cssText = headerLabelCss;
		loopCheckbox = document.createElement('input');
		loopCheckbox.type = 'checkbox';
		loopCheckbox.style.margin = '0';
		loopLabel.appendChild(loopCheckbox);
		var loopText = document.createElement('span');
		var applyLoopText = function()
		{
			loopText.textContent = '';
			mxUtils.write(loopText, mxResources.get('loop', null, 'Loop'));
		};
		applyLoopText();
		staticRefreshers.push(applyLoopText);
		loopLabel.appendChild(loopText);
		listHeader.appendChild(loopLabel);

		// Disabled checkbox — centered between Loop and Edit Text. Wrapped
		// in flex:1 + justify-content:center so it sits in the middle
		// regardless of the side labels' widths.
		var disabledWrap = document.createElement('span');
		disabledWrap.style.cssText = 'flex:1;display:flex;' +
			'justify-content:center';
		var disabledLabel = document.createElement('label');
		disabledLabel.style.cssText = headerLabelCss;
		disabledCheckbox = document.createElement('input');
		disabledCheckbox.type = 'checkbox';
		disabledCheckbox.style.margin = '0';
		disabledLabel.appendChild(disabledCheckbox);
		var disabledText = document.createElement('span');
		var applyDisabledText = function()
		{
			disabledText.textContent = '';
			mxUtils.write(disabledText, mxResources.get('disabled',
				null, 'Disabled'));
		};
		applyDisabledText();
		staticRefreshers.push(applyDisabledText);
		disabledLabel.appendChild(disabledText);
		disabledWrap.appendChild(disabledLabel);
		listHeader.appendChild(disabledWrap);
	}
	else
	{
		// Pad the left side so the right-aligned Edit Text checkbox keeps
		// its position (flex justify-content: space-between needs at least
		// two children to look right).
		var spacer = document.createElement('span');
		listHeader.appendChild(spacer);
	}

	var advancedLabel = document.createElement('label');
	advancedLabel.style.cssText = headerLabelCss;
	var advancedCheckbox = document.createElement('input');
	advancedCheckbox.type = 'checkbox';
	advancedCheckbox.style.margin = '0';
	advancedLabel.appendChild(advancedCheckbox);
	var advancedText = document.createElement('span');
	var applyAdvancedText = function()
	{
		advancedText.textContent = '';
		mxUtils.write(advancedText, mxResources.get('editText',
			null, 'Edit Text'));
	};
	applyAdvancedText();
	staticRefreshers.push(applyAdvancedText);
	advancedLabel.appendChild(advancedText);
	listHeader.appendChild(advancedLabel);

	div.appendChild(listHeader);

	// Structured step list view (default). flex:1 1 0 with min-height:0 lets
	// it expand to fill the available space without being capped — the
	// dialog gets a real resize handle and this is the area that absorbs it.
	var stepList = document.createElement('div');
	stepList.style.cssText = 'flex:1 1 0;min-height:0;' +
		// overflow:auto (not just overflow-y) so a horizontal scrollbar
		// appears when rows are wider than the dialog — keeps the chip
		// and the right-aligned inputs both visible instead of letting
		// the inputs slide into the chip's space.
		'overflow:auto;padding:4px;box-sizing:border-box;' +
		'border:1px solid light-dark(#d2d2d7,#48484a);border-radius:6px;' +
		'background:light-dark(#ffffff,#1c1c1e)';
	// Contain row-reorder drag events — otherwise dragover bubbles to
	// the mxGraph canvas, which highlights as if a cell were being dropped.
	containDragEvents(stepList);
	div.appendChild(stepList);

	// Raw textarea (toggled via advanced checkbox). Same flex behavior.
	var list = document.createElement('textarea');
	list.spellcheck = false;
	list.style.cssText = 'display:none;width:100%;flex:1 1 0;min-height:0;' +
		'resize:none;font-family:monospace;font-size:12px;' +
		'padding:8px;box-sizing:border-box;' +
		'border:1px solid light-dark(#d2d2d7,#48484a);border-radius:6px;' +
		'background:light-dark(#ffffff,#1c1c1e);' +
		'color:light-dark(#1d1d1f,#e0e0e0)';
	div.appendChild(list);

	// Inline validation message for advanced (raw JSON) mode. Shown when the
	// textarea fails to parse so an invalid edit is visibly rejected instead
	// of being silently dropped — parseAnimationData now throws on malformed
	// JSON, and without this the user gets no feedback at all.
	var jsonError = document.createElement('div');
	jsonError.style.cssText = 'display:none;flex:0 0 auto;margin-top:6px;' +
		'padding:6px 8px;border-radius:6px;font-size:12px;' +
		'background:light-dark(#fde7e9,#3a1d1f);' +
		'color:light-dark(#b3261e,#ffb4ab);' +
		'border:1px solid light-dark(#f1aeb5,#7a2e2e);' +
		'white-space:pre-wrap;word-break:break-word';
	div.appendChild(jsonError);

	// True while the advanced-mode textarea last parsed cleanly. Save is
	// blocked when false so we never silently commit the last valid state
	// behind a textarea showing something different.
	var jsonValid = true;

	var showJsonError = function(msg)
	{
		jsonValid = (msg == null);
		jsonError.style.display = (msg == null) ? 'none' : 'block';
		if (msg != null) jsonError.textContent = msg;
	};

	// Validates the current textarea content and updates the inline error.
	var validateTextarea = function()
	{
		try
		{
			Editor.parseAnimationData(list.value);
			showJsonError(null);
		}
		catch (e)
		{
			showJsonError(mxResources.get('error', null, 'Error') +
				': ' + e.message);
		}
	};

	// Internal state: the canonical JSON {steps:[...]} array. The textarea
	// (advanced mode) shows a pretty-printed copy of this; mutations always
	// go through setData() which re-renders and syncs the textarea.
	var data = {steps: []};
	var currentRoot = graph.getModel().getRoot();

	var clone = function(o)
	{
		return JSON.parse(JSON.stringify(o));
	};

	// Loads initial data from the right source for our editing mode.
	var loadFromContext = function()
	{
		if (kind == 'page')
		{
			var raw = graph.getAttributeForCell(currentRoot, 'animation');

			try
			{
				data = Editor.parseAnimationData(raw);
			}
			catch (e)
			{
				// Malformed JSON in the stored attribute — start empty
				// rather than failing to open the dialog.
				data = Editor.parseAnimationData(null);
			}
		}
		else
		{
			// 'action' mode — caller supplies the initial state as either
			// a bare steps array (legacy) or a `{title?, steps}` object.
			var init = opts.initial;
			if (Array.isArray(init))
			{
				data = {steps: clone(init)};
			}
			else if (init != null && typeof init == 'object')
			{
				data = clone(init);
			}
			else
			{
				data = {steps: []};
			}
		}

		if (data.steps == null)
		{
			data.steps = [];
		}

		// Action mode has no Loop / Disabled checkboxes (custom links are
		// one-shot triggers and don't have an autoplay gate) — strip any
		// stray values that may have leaked in via the host so the saved
		// payload stays clean.
		if (kind != 'page')
		{
			if (data.loop != null) delete data.loop;
			if (data.enabled != null) delete data.enabled;
		}

		list.value = JSON.stringify(data, null, 2);
		if (titleInput != null) titleInput.value = data.title || '';
		// Sync the Loop and Disabled checkboxes to the loaded state.
		// parseAnimationData normalizes both to booleans (true when
		// missing); for hand-built JSON without normalization, treat
		// undefined as enabled. The Disabled checkbox is the inverse of
		// the `enabled` field.
		if (loopCheckbox != null)
		{
			loopCheckbox.checked = (data.loop == null) ? true : !!data.loop;
		}
		if (disabledCheckbox != null)
		{
			disabledCheckbox.checked = (data.enabled == null) ? false :
				!data.enabled;
		}
	};

	loadFromContext();

	// Dirty tracking — any mutation flips the flag; Apply / Share clears it.
	// When dirty, Apply gets the primary-button style as a visual nudge.
	var dirty = false;
	var applyBtn = null;
	var previewBtn = null;

	var setDirty = function(value)
	{
		dirty = value;

		if (applyBtn != null)
		{
			applyBtn.className = 'geBtn' + (dirty ? ' gePrimaryBtn' : '');
		}

		if (previewBtn != null)
		{
			previewBtn.className = 'geBtn' + (dirty ? '' : ' gePrimaryBtn');
		}
	};

	// Disabled checkbox change handler — same pattern as Loop below. The
	// checkbox is the inverse of the `enabled` field (checked = disabled).
	if (disabledCheckbox != null)
	{
		disabledCheckbox.addEventListener('change', function()
		{
			data.enabled = !disabledCheckbox.checked;
			list.value = JSON.stringify(data, null, 2);
			setDirty(true);
		});
	}

	// Loop checkbox change handler — wired after setDirty is defined so it
	// can flip the dirty flag without a forward reference.
	if (loopCheckbox != null)
	{
		loopCheckbox.addEventListener('change', function()
		{
			data.loop = !!loopCheckbox.checked;
			// Keep the raw textarea in sync — `setData` doesn't fire for
			// this checkbox since it isn't a step mutation.
			list.value = JSON.stringify(data, null, 2);
			setDirty(true);
		});
	}

	// Title input change handler — wired after setDirty is defined so the
	// input flips the dirty flag without a forward reference.
	if (titleInput != null)
	{
		titleInput.addEventListener('input', function()
		{
			if (titleInput.value) data.title = titleInput.value;
			else delete data.title;
			setDirty(true);
		});

		// Enter in the title input = Save. `applyBtn` is created later
		// in the function; by the time the user actually hits Enter,
		// the click() call resolves to the real button (which runs
		// applyChanges + closes the window). Shift+Enter / IME composing
		// keystrokes are ignored.
		titleInput.addEventListener('keydown', function(e)
		{
			if (e.keyCode === 13 && !e.shiftKey && !e.isComposing &&
				applyBtn != null)
			{
				e.preventDefault();
				applyBtn.click();
			}
		});
	}

	// ============================================================
	// Step / selector helpers
	// ============================================================

	// Recognized action keys, in the order we check for them when deciding
	// how to render a step. A step is allowed to have multiple keys (= parallel
	// effects within that step), but the UI keys its display off the first one.
	// Same vocabulary as CustomActionDialog.SCHEMAS so every custom-action
	// type works as an animation step.
	var STEP_KEYS = ['wait', 'fadeIn', 'fadeOut', 'fadeTo', 'opacity',
		'wipeIn', 'wipeOut', 'popIn', 'popOut', 'flow',
		'toggle', 'show', 'hide', 'select', 'style', 'toggleStyle',
		'highlight', 'scroll', 'viewbox', 'open', 'tags'];

	var getStepKey = function(step)
	{
		for (var i = 0; i < STEP_KEYS.length; i++)
		{
			if (step[STEP_KEYS[i]] !== undefined) return STEP_KEYS[i];
		}

		return null;
	};

	// Returns the selector sub-object (cells/tags/excludeCells/params) for the
	// step's primary action key. null for wait (no cell parameter) and for
	// unknown shapes.
	var getStepSel = function(step)
	{
		var key = getStepKey(step);

		if (key == null || key == 'wait') return null;

		return step[key];
	};

	// Display name + icon for a step. fadeTo with value 1 or 0 is shown as
	// Fade In / Fade Out so common cases get familiar labels.
	var stepLabel = function(step)
	{
		var key = getStepKey(step);
		var T = function(k, dflt) { return mxResources.get(k, null, dflt); };

		// fadeTo collapses to Fade In / Fade Out at the boundary values so
		// merged step labels stay consistent with what the engine produces.
		if (key == 'fadeTo')
		{
			var v = step.fadeTo.value;
			if (v === 1) return {icon: '↗', text: T('fadeIn', 'Fade In')};
			if (v === 0) return {icon: '↘', text: T('fadeOut', 'Fade Out')};
			return {icon: '◐', text: T('fadeTo', 'Fade To')};
		}

		// Flow direction surfaces in the label so the row is readable
		// without inspecting the inline select control.
		if (key == 'flow')
		{
			if (step.flow.start === true) return {icon: '➡', text: T('flowOn', 'Flow On')};
			if (step.flow.start === false) return {icon: '⏸', text: T('flowOff', 'Flow Off')};
			return {icon: '➡', text: T('flowOn', 'Flow Toggle')};
		}

		if (key == 'opacity') return {icon: '◐', text: T('setOpacity', 'Set Opacity')};

		// Generic fallback: read icon/label from the SCHEMAS catalogue so
		// any action type (highlight, viewbox, scroll, etc.) renders with
		// the same visual identity it has in the CustomActionDialog. If
		// the schema declares a `labelKey`, that resource is looked up
		// instead of the action key — lets actions share a generic label
		// (e.g. viewbox → `view`) without shipping a dedicated string.
		var schema = (key != null) ? CustomActionDialog.SCHEMAS[key] : null;
		if (schema != null)
		{
			return {icon: schema.icon || '?',
				text: T(schema.labelKey || key, schema.label || key)};
		}

		return {icon: '?', text: key || '?'};
	};

	var cellLabel = function(ref)
	{
		// "*" matches every animatable cell. "all" was the legacy keyword and
		// still works unless a real cell is literally named "all".
		if (ref == '*' || (ref == 'all' && graph.getModel().getCell('all') == null))
		{
			return mxResources.get('allCells', null, 'All cells');
		}

		var cell = graph.getModel().getCell(ref);

		if (cell == null)
		{
			return ref + ' (?)';
		}

		var label = graph.convertValueToString(cell);
		label = (label || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

		return label != '' ? label : ref;
	};

	// Renders the selector (cells + tags) as a compact human-readable string.
	// Truncates the cell list at 3 names; tag chips are shown as "tag: foo".
	var formatSelectorText = function(sel)
	{
		if (sel == null) return '';

		var parts = [];

		if (Array.isArray(sel.cells) && sel.cells.length > 0)
		{
			var hasWildcard = false;
			var ids = [];

			for (var i = 0; i < sel.cells.length; i++)
			{
				if (sel.cells[i] == '*' ||
					(sel.cells[i] == 'all' && graph.getModel().getCell('all') == null))
				{
					hasWildcard = true;
				}
				else
				{
					ids.push(sel.cells[i]);
				}
			}

			if (hasWildcard)
			{
				parts.push(mxResources.get('allCells', null, 'All cells'));
			}

			if (ids.length > 0)
			{
				var names = [];
				for (var i = 0; i < Math.min(ids.length, 3); i++)
				{
					names.push(cellLabel(ids[i]));
				}
				var s = names.join(', ');
				if (ids.length > 3) s += ', … +' + (ids.length - 3);
				parts.push(s);
			}
		}

		if (Array.isArray(sel.tags) && sel.tags.length > 0)
		{
			parts.push(mxResources.get('tag', null, 'Tag') + ': ' +
				sel.tags.join(', '));
		}

		if (Array.isArray(sel.layers) && sel.layers.length > 0)
		{
			var layerNames = [];
			for (var i = 0; i < sel.layers.length; i++)
			{
				var cell = graph.getModel().getCell(sel.layers[i]);
				if (cell != null)
				{
					var n = graph.convertValueToString(cell);
					layerNames.push((n != null && n !== '') ? n : sel.layers[i]);
				}
				else layerNames.push(sel.layers[i]);
			}
			parts.push(mxResources.get('layer', null, 'Layer') + ': ' +
				layerNames.join(', '));
		}

		return parts.join(', ') || '—';
	};

	// ============================================================
	// State accessors / mutations
	// ============================================================

	// Pretty-prints the current state into the textarea (advanced mode).
	var syncTextarea = function()
	{
		list.value = JSON.stringify(data, null, 2);
	};

	// Refreshes both views after mutating data.steps directly. Use this
	// for structural changes (add/remove/reorder steps, chip visibility
	// changes) where the row DOM needs to be rebuilt.
	var refresh = function()
	{
		syncTextarea();
		setDirty(true);
		renderList();
	};

	// Lighter-weight variant: syncs the textarea and dirty flag but
	// does NOT rebuild the row list. Use for inline field edits so the
	// active input doesn't get destroyed mid-keystroke (which would
	// otherwise drop focus — e.g. typing in highlight's opacity field).
	var syncOnly = function()
	{
		syncTextarea();
		setDirty(true);
	};

	// Convenience: append a step and scroll into view.
	var appendStep = function(step)
	{
		data.steps.push(step);
		refresh();
		stepList.scrollTop = stepList.scrollHeight;
	};

	// ============================================================
	// Drag-and-drop
	// ============================================================

	// Drag state — sourceIndex into data.steps. Cleared on dragend.
	var dragState = null;

	var makeDragHandle = function(row, index)
	{
		var handle = document.createElement('span');
		handle.style.cssText = 'flex:0 0 14px;text-align:center;font-size:14px;' +
			'line-height:1;color:light-dark(#86868b,#86868b);cursor:grab;' +
			'user-select:none';
		handle.title = mxResources.get('reorder', null, 'Drag to reorder');
		handle.textContent = '⋮⋮';

		handle.addEventListener('mousedown', function()
		{
			row.draggable = true;
		});

		handle.addEventListener('mouseup', function()
		{
			row.draggable = false;
		});

		row.addEventListener('dragstart', function(e)
		{
			dragState = {sourceIndex: index};
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', 'animstep');
			row.style.opacity = '0.4';
		});

		row.addEventListener('dragend', function()
		{
			row.draggable = false;
			row.style.opacity = '';
			var rows = stepList.querySelectorAll('div');
			for (var i = 0; i < rows.length; i++)
			{
				rows[i].style.borderTop = '';
				rows[i].style.borderBottom = '';
			}
			dragState = null;
		});

		return handle;
	};

	var attachDropTarget = function(row, targetIndex)
	{
		row.addEventListener('dragover', function(e)
		{
			if (dragState == null) return;

			var rect = row.getBoundingClientRect();
			var insertAfter = e.clientY > rect.top + rect.height / 2;
			var insertAt = insertAfter ? targetIndex + 1 : targetIndex;
			var s = dragState.sourceIndex;

			// No-op zone: dropping in the slot the source already occupies.
			if (insertAt == s || insertAt == s + 1)
			{
				row.style.borderTop = '';
				row.style.borderBottom = '';
				return;
			}

			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';
			row._dropInsertAt = insertAt;

			var color = 'light-dark(#007aff,#0a84ff)';

			if (insertAfter)
			{
				row.style.borderTop = '';
				row.style.borderBottom = '2px solid ' + color;
			}
			else
			{
				row.style.borderBottom = '';
				row.style.borderTop = '2px solid ' + color;
			}
		});

		row.addEventListener('dragleave', function()
		{
			row.style.borderTop = '';
			row.style.borderBottom = '';
		});

		row.addEventListener('drop', function(e)
		{
			if (dragState == null) return;
			e.preventDefault();
			e.stopPropagation();
			row.style.borderTop = '';
			row.style.borderBottom = '';

			var s = dragState.sourceIndex;
			var insertAt = (row._dropInsertAt != null) ?
				row._dropInsertAt : targetIndex;

			if (insertAt == s || insertAt == s + 1) return;

			var step = data.steps.splice(s, 1)[0];
			if (s < insertAt) insertAt--;
			data.steps.splice(insertAt, 0, step);
			refresh();
		});
	};

	// Shared button factory — keeps row icons consistent. enabled=false renders
	// a dimmed non-clickable button (used for ↑ on the first row, ↓ on the last).
	var makeIconButton = function(label, title, enabled, fn)
	{
		var b = document.createElement('button');
		b.type = 'button';
		b.title = title;
		b.style.cssText = 'flex:0 0 22px;height:22px;line-height:1;padding:0;' +
			'border:1px solid light-dark(#d2d2d7,#48484a);border-radius:3px;' +
			'background:transparent;cursor:pointer;font-size:14px;' +
			'color:light-dark(#1d1d1f,#e0e0e0)';

		if (!enabled)
		{
			b.disabled = true;
			b.style.opacity = '0.3';
			b.style.cursor = 'default';
		}

		mxUtils.write(b, label);

		if (enabled)
		{
			b.addEventListener('click', fn);
		}

		return b;
	};

	// Image-icon variant of makeIconButton (uses <img> child).
	var makeImgButton = function(src, title, fn)
	{
		var b = makeIconButton('', title, true, fn);
		var img = document.createElement('img');
		img.className = 'geAdaptiveAsset';
		img.setAttribute('src', src);
		img.style.cssText = 'width:14px;height:14px;vertical-align:middle';
		b.appendChild(img);
		return b;
	};

	// Common number-input styling for inline parameter editing.
	var inlineNumberInput = function(value, opts)
	{
		opts = opts || {};
		var inp = document.createElement('input');
		inp.type = 'number';
		if (opts.min != null) inp.min = opts.min;
		if (opts.max != null) inp.max = opts.max;
		if (opts.step != null) inp.step = opts.step;
		if (opts.placeholder != null) inp.placeholder = opts.placeholder;
		if (value != null) inp.value = value;
		// Hide the native spinner buttons — they ate ~16-20px of the
		// declared width on WebKit/Firefox, making the visible editable
		// area uselessly small. The .geNoSpin class (installed in
		// installCustomActionStyles) zeroes the appearance on both engines.
		inp.className = 'geNoSpin';
		// No inline width — .geNoSpin caps everything at 60px and lets
		// the browser size to the natural content. Per-field `opts.width`
		// hints from the schemas are ignored.
		inp.style.cssText = 'padding:2px 4px;' +
			'border:1px solid light-dark(#d2d2d7,#48484a);border-radius:3px;' +
			'background:light-dark(#ffffff,#1c1c1e);' +
			'color:light-dark(#1d1d1f,#e0e0e0)';

		return inp;
	};

	// Appends a "select cells" button. Resolves the step's selector against
	// the graph (cells/tags/excludeCells / wildcard) and selects those cells.
	// Renders the step's cells + tags as polished chips with inline
	// Use Selection / Show on Canvas buttons. Replaces both the old
	// text-only target label and the standalone select-cells button.
	var appendStepSelectors = function(row, idx, key, sel)
	{
		if (sel == null) return;

		var wrap = document.createElement('span');
		wrap.style.cssText = 'display:inline-flex;align-items:center;' +
			'flex:1 1 auto;min-width:0;gap:6px';

		// Helper: getter/setter pair for a specific field on this step's
		// selector object. Mirrors how CustomActionDialog binds chips.
		var bind = function(field)
		{
			return {
				get: function()
				{
					var s = data.steps[idx] && data.steps[idx][key];
					return (s && Array.isArray(s[field])) ? s[field] : null;
				},
				set: function(v)
				{
					var s = data.steps[idx][key];
					if (!s || typeof s != 'object')
					{
						s = data.steps[idx][key] = {};
					}
					if (!v || !v.length) delete s[field];
					else s[field] = v;
					refresh();
				}
			};
		};

		var tagsBind = bind('tags');
		var tagsGetMode = function()
		{
			var s = data.steps[idx] && data.steps[idx][key];
			return (s && s.tagsMatch === 'or') ? 'or' : 'and';
		};
		var tagsSetMode = function(m)
		{
			var s = data.steps[idx][key];
			if (!s || typeof s != 'object')
			{
				s = data.steps[idx][key] = {};
			}
			if (m === 'or') s.tagsMatch = 'or';
			else delete s.tagsMatch;
			refresh();
		};

		var layersBind = bind('layers');

		// "Select layers" shows for every cell-targeting action (allowLayers
		// in SCHEMAS); the layer resolves to its contained cells at playback.
		var keySchema = CustomActionDialog.SCHEMAS[key];
		var extraItems = [];

		if (keySchema != null && keySchema.allowLayers)
		{
			extraItems.push({
				// "…" suffix marks items that open a follow-up dialog
				// (the layer picker popover), matching the UI convention
				// used elsewhere in drawio. Appended at the call site so
				// the resource string ("Select layers") can be reused as
				// a popover title without the ellipsis.
				label: mxResources.get('selectLayers',
					null, 'Select layers') + '…',
				disabled: function()
				{
					return graph.getModel().getChildCount(
						graph.getModel().getRoot()) == 0;
				},
				onClick: function(chipEl)
				{
					selectorChips.openLayerPicker(chipEl,
						layersBind.get, layersBind.set);
				}
			});
		}

		extraItems.push({
			// "…" suffix — opens the tag picker popover. Same convention
			// as selectLayers above.
			label: mxResources.get('selectByTags',
				null, 'Select by tags') + '…',
			onClick: function(chipEl)
			{
				selectorChips.openTagPicker(chipEl,
					tagsBind.get, tagsBind.set,
					tagsGetMode, tagsSetMode);
			}
		});

		extraItems.push({
			label: mxResources.get('excludeSelection',
				null, 'Exclude selected cells'),
			disabled: function()
			{
				return graph.getSelectionCount() == 0;
			},
			onClick: function()
			{
				var cells = graph.getSelectionCells();
				if (cells.length == 0) return;
				var s = data.steps[idx][key];
				if (!s || typeof s != 'object')
				{
					s = data.steps[idx][key] = {};
				}
				var existing = Array.isArray(s.excludeCells) ?
					s.excludeCells.slice() : [];
				var seen = {};
				for (var i = 0; i < existing.length; i++)
				{
					seen[existing[i]] = true;
				}
				for (var i = 0; i < cells.length; i++)
				{
					if (!seen[cells[i].id])
					{
						existing.push(cells[i].id);
						seen[cells[i].id] = true;
					}
				}
				s.excludeCells = existing;
				refresh();
			}
		});

		// Cells chip — hosts "Select layers" (when supported), "Select
		// by tags", and "Exclude selected cells" so the secondary
		// chips stay hidden until populated.
		var cellsBind = bind('cells');
		wrap.appendChild(selectorChips.cellListField('',
			cellsBind.get, cellsBind.set,
			{allowWildcard: true, extraMenuItems: extraItems}));

		// Layers chip only when populated.
		var layersValue = layersBind.get();
		if (Array.isArray(layersValue) && layersValue.length > 0)
		{
			wrap.appendChild(selectorChips.layerListField('',
				layersBind.get, layersBind.set));
		}

		// Tags chip only when populated.
		var tagsValue = tagsBind.get();
		if (Array.isArray(tagsValue) && tagsValue.length > 0)
		{
			wrap.appendChild(selectorChips.tagListField('',
				tagsBind.get, tagsBind.set,
				{getMode: tagsGetMode, setMode: tagsSetMode}));
		}

		// Exclude chip only when populated.
		var excludeBind = bind('excludeCells');
		var excludeValue = excludeBind.get();
		if (Array.isArray(excludeValue) && excludeValue.length > 0)
		{
			wrap.appendChild(selectorChips.cellListField('',
				excludeBind.get, excludeBind.set,
				{allowWildcard: false,
				 singularKey: 'excluded', pluralKey: 'excluded',
				 singularFallback: 'Excluded', pluralFallback: 'Excluded'}));
		}

		row.appendChild(wrap);
	};

	// Each JSON step renders as one row — the "cells" array inside a step is
	// inherently parallel, so multi-cell picks already collapse into one entry.
	var renderList = function()
	{
		stepList.innerHTML = '';

		if (data.steps.length == 0)
		{
			var empty = document.createElement('div');
			empty.style.cssText = 'padding:12px;text-align:center;' +
				'color:light-dark(#86868b,#86868b);font-size:12px';
			mxUtils.write(empty, mxResources.get('noStepsYet', null,
				'No steps yet. Add the first step below.'));
			stepList.appendChild(empty);
			return;
		}

		for (var i = 0; i < data.steps.length; i++)
		{
			stepList.appendChild(makeStepRow(data.steps[i], i,
				i == data.steps.length - 1));
		}
	};

	var rowBase = function(isLast)
	{
		var row = document.createElement('div');
		// min-width:max-content makes the row as wide as its content
		// when content exceeds the stepList width — the stepList then
		// shows a horizontal scrollbar (overflow:auto). When stepList
		// is wide, the spacer between chips and inputs grows to push
		// inputs to the right edge. No overflow:hidden so nothing
		// clips; the scrollbar keeps everything reachable.
		row.style.cssText = 'display:flex;align-items:center;gap:6px;' +
			'min-width:max-content;' +
			'padding:6px 4px;border-radius:4px;' +
			'border-bottom:1px solid light-dark(rgba(0,0,0,0.05),rgba(255,255,255,0.05))';

		if (isLast)
		{
			row.style.borderBottom = 'none';
		}

		return row;
	};

	// Inserted between the action label / selector chips (left side)
	// and the input fields (right side). flex:1 grabs all leftover
	// width when the row is wider than its content; collapses to 0
	// when the row is at min-width:max-content (narrow stepList).
	var appendSpacer = function(row)
	{
		var sp = document.createElement('span');
		sp.style.cssText = 'flex:1 1 auto;min-width:0';
		row.appendChild(sp);
	};

	var appendIcon = function(row, ch)
	{
		var icon = document.createElement('span');
		icon.style.cssText = 'flex:0 0 18px;text-align:center;font-size:14px';
		mxUtils.write(icon, ch);
		row.appendChild(icon);
		return icon;
	};

	var appendActionLabel = function(row, text)
	{
		var action = document.createElement('span');
		// Fixed 70px slot — long localized labels get truncated with
		// an ellipsis instead of wrapping; full text stays in tooltip.
		action.style.cssText = 'flex:0 0 70px;font-weight:500;font-size:12px;' +
			'white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
		action.title = text;
		mxUtils.write(action, text);
		row.appendChild(action);
	};

	var appendTargetLabel = function(row, sel)
	{
		var target = document.createElement('span');
		target.style.cssText = 'flex:1 1 auto;min-width:0;' +
			'color:light-dark(#1d1d1f,#e0e0e0);' +
			'overflow:hidden;text-overflow:ellipsis;white-space:nowrap';

		var refs = [];
		if (sel != null)
		{
			if (Array.isArray(sel.cells)) refs = refs.concat(sel.cells);
			if (Array.isArray(sel.tags)) refs = refs.concat(sel.tags.map(function(t) { return 'tag:' + t; }));
			if (Array.isArray(sel.layers)) refs = refs.concat(sel.layers.map(function(l) { return 'layer:' + l; }));
		}
		target.title = refs.join(', ');
		mxUtils.write(target, formatSelectorText(sel));
		row.appendChild(target);
	};

	// Resolves a tooltip from a field spec (titleKey > title > placeholder).
	// Same priority as appendField in CustomActionDialog.
	var resolveFieldTitle = function(spec)
	{
		if (spec.titleKey != null)
		{
			return mxResources.get(spec.titleKey, null, spec.title || '');
		}
		if (spec.title != null) return spec.title;
		if (spec.placeholderKey != null)
		{
			return mxResources.get(spec.placeholderKey,
				null, spec.placeholder || '');
		}
		if (spec.placeholder != null) return spec.placeholder;
		return null;
	};

	// Renders one schema field into the step row. Mirrors appendField in
	// CustomActionDialog but uses the AnimationDialog's inline styling so
	// the row layout stays tight and consistent with existing step types.
	var renderStepField = function(row, idx, key, spec, isPrimary)
	{
		// getter/setter for nested {key: {field: value}} (object actions)
		// or top-level (primary actions like wait). Uses syncOnly() (not
		// refresh()) so inline edits don't tear down the row mid-keystroke
		// — keeps focus alive when typing into number/text/color inputs.
		var get, set;

		if (isPrimary)
		{
			get = function() { return data.steps[idx][key]; };
			set = function(v)
			{
				if (v == null || v === '')
				{
					// Numbers fall back to 0 (matches the legacy wait
					// input — never store '' as a numeric primary).
					data.steps[idx][key] = (spec.type == 'number') ? 0 : '';
				}
				else
				{
					data.steps[idx][key] = v;
				}
				syncOnly();
			};
		}
		else
		{
			get = function()
			{
				var s = data.steps[idx][key];
				return (s != null && typeof s == 'object') ? s[spec.name] : undefined;
			};
			set = function(v)
			{
				var s = data.steps[idx][key];
				if (s == null || typeof s != 'object')
				{
					s = data.steps[idx][key] = {};
				}
				if (v == null || v === '') delete s[spec.name];
				else s[spec.name] = v;
				syncOnly();
			};
		}

		var title = resolveFieldTitle(spec);

		// Checkbox — boolean field, set to `true` when checked, removed
		// from the JSON when not (so the action stays tidy).
		if (spec.type == 'checkbox')
		{
			var wrap = document.createElement('label');
			wrap.style.cssText = 'flex:0 0 auto;display:inline-flex;' +
				'align-items:center;gap:4px;cursor:pointer;font-size:12px;' +
				'color:light-dark(#1d1d1f,#e0e0e0);user-select:none';
			if (title) wrap.title = title;

			var cb = document.createElement('input');
			cb.type = 'checkbox';
			cb.checked = !!get();
			cb.style.cssText = 'margin:0;accent-color:' +
				'light-dark(#0071e3,#0a84ff)';
			cb.addEventListener('change', function()
			{
				if (cb.checked) set(true);
				else set(undefined);
			});
			wrap.appendChild(cb);

			if (spec.labelKey || spec.label)
			{
				var txt = document.createElement('span');
				mxUtils.write(txt, spec.labelKey ?
					mxResources.get(spec.labelKey, null, spec.label || '') :
					(spec.label || ''));
				wrap.appendChild(txt);
			}
			row.appendChild(wrap);
			return;
		}

		// TagList — uses selectorChips to render a chip + popover.
		if (spec.type == 'tagList')
		{
			var lblText = spec.labelKey ?
				mxResources.get(spec.labelKey, null, spec.label || '') :
				(spec.label || '');
			var modeBinding = spec.modeField ? {
				getMode: function()
				{
					var s = data.steps[idx][key];
					return (s && s[spec.modeField] === 'or') ? 'or' : 'and';
				},
				setMode: function(m)
				{
					var s = data.steps[idx][key];
					if (s == null || typeof s != 'object')
					{
						s = data.steps[idx][key] = {};
					}
					if (m === 'or') s[spec.modeField] = 'or';
					else delete s[spec.modeField];
					syncOnly();
				}
			} : null;
			row.appendChild(selectorChips.tagListField(lblText, get,
				function(v)
				{
					if (!Array.isArray(v) || v.length == 0) set(undefined);
					else set(v);
				}, modeBinding || undefined));
			return;
		}

		// Select dropdown
		if (spec.type == 'select')
		{
			var sel = document.createElement('select');
			sel.style.cssText = 'flex:0 0 auto;padding:2px 4px;' +
				'border:1px solid light-dark(#d2d2d7,#48484a);border-radius:3px;' +
				'background:light-dark(#ffffff,#1c1c1e);' +
				'color:light-dark(#1d1d1f,#e0e0e0)';
			for (var i = 0; i < spec.options.length; i++)
			{
				var o = document.createElement('option');
				o.value = spec.options[i].value;
				o.textContent = spec.options[i].label;
				sel.appendChild(o);
			}
			var cur = get();
			if (cur != null) sel.value = String(cur);
			if (title) sel.title = title;
			sel.addEventListener('change', function()
			{
				var v = sel.value;
				if (v === '') set(undefined);
				else if (v === 'true') set(true);
				else if (v === 'false') set(false);
				else set(v);
			});
			row.appendChild(sel);
			if (spec.label)
			{
				var lbl = document.createElement('span');
				lbl.style.cssText = 'flex:0 0 auto;color:light-dark(#6e6e73,#a0a0a0);font-size:11px';
				mxUtils.write(lbl, spec.label);
				row.appendChild(lbl);
			}
			return;
		}

		// Number / text / color — share the same inline input shape, but
		// number gets the existing inlineNumberInput visual treatment.
		var inp;

		if (spec.type == 'number')
		{
			var placeholder = (spec.placeholderKey != null) ?
				mxResources.get(spec.placeholderKey,
					null, spec.placeholder || '') :
				spec.placeholder;
			inp = inlineNumberInput(get(),
				{min: spec.min, max: spec.max, step: spec.step,
				 width: spec.width || 55, placeholder: placeholder});
		}
		else
		{
			inp = document.createElement('input');
			inp.type = spec.type || 'text';
			// Default widths kept tight so step rows stay one-line at
			// typical dialog widths; schemas can override per field.
			var w = spec.width || (spec.type == 'color' ? 36 : 80);

			if (spec.type == 'color')
			{
				inp.style.cssText = 'flex:0 0 ' + w + 'px;min-width:0;' +
					'height:22px;padding:1px;cursor:pointer;' +
					'border:1px solid light-dark(#d2d2d7,#48484a);border-radius:3px;' +
					'background:light-dark(#ffffff,#1c1c1e)';
			}
			else
			{
				inp.style.cssText = 'flex:0 0 ' + w + 'px;min-width:0;padding:2px 4px;' +
					'border:1px solid light-dark(#d2d2d7,#48484a);border-radius:3px;' +
					'background:light-dark(#ffffff,#1c1c1e);' +
					'color:light-dark(#1d1d1f,#e0e0e0)';
			}

			var placeholder = (spec.placeholderKey != null) ?
				mxResources.get(spec.placeholderKey,
					null, spec.placeholder || '') :
				spec.placeholder;
			if (placeholder) inp.placeholder = placeholder;
			var cur = get();
			if (cur != null) inp.value = String(cur);
		}

		if (title) inp.title = title;

		var commit = function()
		{
			var v = inp.value;
			if (spec.type == 'number')
			{
				if (v === '') { set(undefined); return; }
				var n = parseFloat(v);
				if (isNaN(n)) { set(undefined); return; }
				set(n);
			}
			else
			{
				set(v === '' ? undefined : v);
			}
		};
		inp.addEventListener('change', commit);
		inp.addEventListener('input', commit);
		row.appendChild(inp);

		if (spec.label)
		{
			var lbl = document.createElement('span');
			lbl.style.cssText = 'flex:0 0 auto;color:light-dark(#6e6e73,#a0a0a0);font-size:11px';
			mxUtils.write(lbl, spec.label);
			row.appendChild(lbl);
		}
	};

	// Renders one JSON step as a row. Each step is its own row — multi-cell
	// parallel effects are encoded as one step with cells: [A,B,C], so no
	// grouping/expanding logic is needed in the UI.
	var makeStepRow = function(step, idx, isLast)
	{
		var info = stepLabel(step);
		var key = getStepKey(step);
		var schema = (key != null) ? CustomActionDialog.SCHEMAS[key] : null;
		var sel = getStepSel(step);
		var row = rowBase(isLast);

		// Carry the step index so setPlayingStep() can find this row
		// and toggle the active-step highlight without a full re-render.
		// `playingSteps` is a Set so all rows in a parallel batch (the
		// current step + any consecutive `immediate: true` followers) can
		// highlight simultaneously while their effects play.
		row.setAttribute('data-step-idx', idx);
		if (playingSteps.has(idx)) row.classList.add('geAnimationStepActive');

		row.appendChild(makeDragHandle(row, idx));
		attachDropTarget(row, idx);

		// "Immediate" toggle — when active, this step runs in parallel
		// with the previous step (sets `immediate: true` at the step root).
		// The default is sequential (this step waits for the previous step's
		// blocking effects to finish). Hidden on the first step via
		// visibility:hidden so the row layout stays consistent — there's
		// nothing to be parallel with at idx 0. The button's icon AND
		// tooltip swap to reflect state: ⏩ + "Immediate" when on (this
		// step skips the wait), ⏱ + "Wait" when off (this step waits
		// for the previous one to finish). Both glyphs carry the U+FE0E
		// variation selector to force monochrome text presentation —
		// otherwise the system font renders them as colorful emoji,
		// which clashes with the surrounding monochrome UI.
		var immediateBtn = document.createElement('button');
		immediateBtn.type = 'button';
		var applyImmediateIcon = function()
		{
			immediateBtn.textContent = '';
			if (step.immediate === true)
			{
				mxUtils.write(immediateBtn, '⏩︎');
				immediateBtn.title = mxResources.get('immediate',
					null, 'Immediate');
			}
			else
			{
				mxUtils.write(immediateBtn, '⏱︎');
				immediateBtn.title = mxResources.get('wait',
					null, 'Wait');
			}
		};
		// Force monochrome rendering for the ⏩ / ⏱ glyphs:
		//   1. `font-variant-emoji: text` + the U+FE0E text-variation
		//      selector in the string ask the browser for text rendering.
		//   2. The "Segoe UI Symbol" / "Apple Symbols" font-family list
		//      prefers the monochrome symbol fonts on each platform.
		//   3. `filter: grayscale(1)` is the safety net — Windows Chrome
		//      ignores the variation selector for ⏩ specifically (it
		//      always pulls Segoe UI Emoji's blue colour-glyph), so we
		//      desaturate the rendered pixels as a last resort. Harmless
		//      for already-monochrome glyphs.
		immediateBtn.style.cssText = 'flex:0 0 22px;height:22px;line-height:1;' +
			'padding:0;border:1px solid light-dark(#d2d2d7,#48484a);' +
			'border-radius:3px;background:transparent;cursor:pointer;' +
			'font-size:14px;color:light-dark(#1d1d1f,#e0e0e0);' +
			'font-family:"Segoe UI Symbol","Apple Symbols",sans-serif;' +
			'font-variant-emoji:text;filter:grayscale(1) contrast(2)';
		applyImmediateIcon();
		if (idx === 0)
		{
			immediateBtn.style.visibility = 'hidden';
		}
		immediateBtn.addEventListener('click', function()
		{
			if (step.immediate === true)
			{
				delete data.steps[idx].immediate;
				step.immediate = undefined;
			}
			else
			{
				data.steps[idx].immediate = true;
				step.immediate = true;
			}
			applyImmediateIcon();
			syncOnly();
		});
		row.appendChild(immediateBtn);

		appendIcon(row, info.icon);
		appendActionLabel(row, info.text);

		if (schema != null && schema.primary != null)
		{
			// Primary-value action (wait, open). Spacer pushes the
			// single input over to the right edge of the row, in line
			// with the input column of object-shaped actions below.
			appendSpacer(row);
			renderStepField(row, idx, key, schema.primary, true);
		}
		else
		{
			// Object-shaped action. Render selector chips first (left
			// side); insert a spacer; then render the schema fields
			// (right side) — so chips and inputs occupy opposite ends
			// of the row regardless of how many fields exist.
			if (schema == null || schema.selector)
			{
				appendStepSelectors(row, idx, key, sel);
			}

			appendSpacer(row);

			if (schema != null && Array.isArray(schema.fields))
			{
				for (var f = 0; f < schema.fields.length; f++)
				{
					renderStepField(row, idx, key, schema.fields[f], false);
				}
			}

			// Fallback duration input for animated effects whose schema
			// has no `delay` field — keeps wipeIn/wipeOut/popIn/popOut/
			// flow rows actionable without forcing the user into raw
			// JSON mode. fadeIn/fadeOut/fadeTo already have a `delay`
			// field in their schema so this branch skips them.
			if (schema != null && schema.selector &&
				(key == 'wipeIn' || key == 'wipeOut' ||
				 key == 'popIn'  || key == 'popOut'))
			{
				// Wipe/pop engine default is 30 frames × 30ms ≈ 900ms
				// (see Graph.prototype.executeAnimations).
				var durInput = inlineNumberInput(sel.delay,
					{min: 0, step: 100, width: 55, placeholder: '900'});
				durInput.title = mxResources.get('duration', null, 'Duration (ms)');
				durInput.addEventListener('change', function()
				{
					var ms = parseFloat(durInput.value);
					var d = (durInput.value === '' || isNaN(ms) || ms < 0) ? undefined : ms;
					if (d == null) delete data.steps[idx][key].delay;
					else data.steps[idx][key].delay = d;
					syncOnly();
				});
				row.appendChild(durInput);

				var msLbl = document.createElement('span');
				msLbl.style.cssText = 'flex:0 0 auto;color:light-dark(#6e6e73,#a0a0a0);font-size:11px';
				mxUtils.write(msLbl, 'ms');
				row.appendChild(msLbl);
			}

			// "Use Current" affordance for viewbox — re-captures the
			// current canvas viewport into the action's x/y/width/height.
			// Picker-time defaults already pre-fill these, but the user
			// often pans/zooms after adding the step and wants to update
			// without retyping. The button updates the stored values and
			// re-renders so the inputs show the new numbers.
			if (key == 'viewbox')
			{
				var useCurrentBtn = document.createElement('button');
				useCurrentBtn.type = 'button';
				useCurrentBtn.className = 'geBtn';
				useCurrentBtn.style.cssText = 'flex:0 0 auto;' +
					'padding:2px 8px;font-size:11px;min-width:0';
				useCurrentBtn.textContent = mxResources.get('useCurrent', null, 'Use Current');
				useCurrentBtn.title = useCurrentBtn.textContent;
				useCurrentBtn.addEventListener('click', function(e)
				{
					e.preventDefault();
					var vp = captureCurrentViewport();
					var s = data.steps[idx].viewbox;
					if (s == null || typeof s != 'object')
					{
						s = data.steps[idx].viewbox = {};
					}
					s.x = vp.x;
					s.y = vp.y;
					s.width = vp.width;
					s.height = vp.height;
					if (s.border == null) s.border = vp.border;
					refresh();  // re-render so inputs reflect the new numbers
				});
				row.appendChild(useCurrentBtn);
			}
		}

		// Preview — execute just this one step inside the shared
		// preview session, so the original opacity stays captured for
		// Reset to restore. (No margin-left:auto needed — the spacer
		// inserted between selector chips and fields already pushes
		// the right side of the row out to the edge.)
		var previewIconBtn = makeIconButton('▶',
			mxResources.get('preview', null, 'Preview'),
			true, function()
			{
				startPreviewSession();
				var single = JSON.parse(JSON.stringify(
					Graph.flattenAnimationActions([step])));
				graph.executeCustomActions(single);
			});
		row.appendChild(previewIconBtn);

		row.appendChild(makeImgButton(Editor.trashImage,
			mxResources.get('delete'), function()
			{
				data.steps.splice(idx, 1);
				refresh();
			}));

		return row;
	};

	// Toggle between list and textarea
	advancedCheckbox.addEventListener('change', function()
	{
		if (advancedCheckbox.checked)
		{
			stepList.style.display = 'none';
			list.style.display = 'block';
			// Re-check validity so the error reflects the visible textarea.
			validateTextarea();
		}
		else
		{
			list.style.display = 'none';
			stepList.style.display = 'block';
			// The list view is driven by the (always valid) data, so a
			// stale textarea parse error is irrelevant while it's hidden.
			showJsonError(null);
			renderList();
		}
	});

	// In advanced (raw JSON) mode, every keystroke re-parses the textarea and
	// updates the canonical state. Invalid JSON is held in the textarea until
	// it parses cleanly — the list view stays on the last good state.
	list.addEventListener('input', function()
	{
		setDirty(true);

		try
		{
			var parsed = Editor.parseAnimationData(list.value);

			if (parsed != null && Array.isArray(parsed.steps))
			{
				data = parsed;
				showJsonError(null);

				// Sync the Loop / Disabled checkboxes if the user edited
				// the raw JSON. parseAnimationData normalizes both to
				// booleans (defaulting to true); the Disabled checkbox is
				// the inverse of `enabled`.
				if (loopCheckbox != null)
				{
					loopCheckbox.checked = !!data.loop;
				}
				if (disabledCheckbox != null)
				{
					disabledCheckbox.checked = !data.enabled;
				}

				if (!advancedCheckbox.checked)
				{
					renderList();
				}
			}
		}
		catch (e)
		{
			// Surface the parse error and mark invalid (Save is blocked).
			// data is intentionally left at the last valid state so an
			// in-progress typo doesn't wipe the user's steps.
			showJsonError(mxResources.get('error', null, 'Error') +
				': ' + e.message);
		}
	});

	renderList();

	// "Add step" section — single grouped dropdown of every available
	// action type. Mirrors the CustomActionDialog picker so both dialogs
	// share the same look. No radio for "Selection / All cells" — the
	// picker handler defaults to the current canvas selection if one
	// exists, otherwise to the wildcard `*` (all cells).
	var addSection = document.createElement('div');
	addSection.className = 'geDialogSection';
	addSection.style.cssText = 'margin-top:10px;margin-bottom:0;flex:0 0 auto;' +
		'display:flex;flex-direction:column;gap:8px';

	var pickRow = document.createElement('div');
	pickRow.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap';
	addSection.appendChild(pickRow);

	var pickSelect = document.createElement('select');
	pickSelect.style.cssText = 'flex:1 1 200px;min-width:180px;padding:5px 6px;' +
		'border:1px solid light-dark(#d2d2d7,#48484a);border-radius:4px;' +
		'background:light-dark(#ffffff,#1c1c1e);' +
		'color:light-dark(#1d1d1f,#e0e0e0);font-size:13px';

	// Placeholder option — selected by default, can't be picked as a real
	// step. After picking a real option we reset back to this. Localized
	// labels register a refresher so the picker re-localizes on language
	// change (collected at the bottom of the picker construction).
	var pickerL10n = [];

	var placeholderOpt = document.createElement('option');
	placeholderOpt.value = '';
	placeholderOpt.disabled = true;
	placeholderOpt.selected = true;
	// Placeholder reads "Add…" (Unicode ellipsis) — the resource is
	// reused from elsewhere in drawio without the trailing dots, so we
	// append the ellipsis here. A dedicated refresher rebuilds the
	// label on language change instead of going through the generic
	// pickerL10n array (which only does a plain assignment).
	var applyAddPlaceholder = function()
	{
		placeholderOpt.textContent =
			mxResources.get('add', null, 'Add') + '…';
	};
	applyAddPlaceholder();
	staticRefreshers.push(applyAddPlaceholder);
	pickSelect.appendChild(placeholderOpt);

	// Same grouping as the CustomActionDialog picker so both dialogs offer
	// the same vocabulary in the same order. Every action type listed in
	// SCHEMAS is available — including viewbox, scroll, highlight, etc.
	var pickerGroups = [
		{labelKey: 'visibilityActions', label: 'Visibility',
			keys: ['toggle', 'show', 'hide']},
		{labelKey: 'effects',           label: 'Effects',
			keys: ['fadeIn', 'fadeOut', 'fadeTo',
			       'wipeIn', 'wipeOut', 'popIn', 'popOut']},
		{labelKey: 'style',             label: 'Style',
			keys: ['opacity', 'style', 'toggleStyle', 'highlight', 'flow']},
		{labelKey: 'navigation',        label: 'Navigation',
			keys: ['select', 'scroll', 'viewbox', 'open']},
		{labelKey: 'tags',              label: 'Tags',
			keys: ['tags']},
		{labelKey: 'timing',            label: 'Timing',
			keys: ['wait']}
	];

	for (var gi = 0; gi < pickerGroups.length; gi++)
	{
		var og = document.createElement('optgroup');
		og.label = mxResources.get(pickerGroups[gi].labelKey,
			null, pickerGroups[gi].label);
		pickerL10n.push({el: og, prop: 'label',
			key: pickerGroups[gi].labelKey,
			fallback: pickerGroups[gi].label});

		for (var ki = 0; ki < pickerGroups[gi].keys.length; ki++)
		{
			var pk = pickerGroups[gi].keys[ki];
			var schema = CustomActionDialog.SCHEMAS[pk];
			if (schema == null) continue;
			var o = document.createElement('option');
			o.value = pk;
			// schema.labelKey overrides the default key→resource lookup
			// (used by viewbox → `view`).
			var resKey = schema.labelKey || pk;
			o.textContent = mxResources.get(resKey, null, schema.label);
			pickerL10n.push({el: o, prop: 'textContent',
				key: resKey, fallback: schema.label});
			og.appendChild(o);
		}
		pickSelect.appendChild(og);
	}

	// Destructive entry: clears every step. Lives in its own divider
	// optgroup so it sits below all the action types. The CSS class
	// `geDeleteOpt` paints it red.
	var dangerGroup = document.createElement('optgroup');
	dangerGroup.label = '──────';
	var deleteAllOpt = document.createElement('option');
	deleteAllOpt.value = '__deleteAll__';
	deleteAllOpt.className = 'geDeleteOpt';
	deleteAllOpt.textContent = mxResources.get('deleteAll', null, 'Delete All');
	pickerL10n.push({el: deleteAllOpt, prop: 'textContent',
		key: 'deleteAll', fallback: 'Delete All'});
	dangerGroup.appendChild(deleteAllOpt);
	pickSelect.appendChild(dangerGroup);

	staticRefreshers.push(function()
	{
		for (var i = 0; i < pickerL10n.length; i++)
		{
			var b = pickerL10n[i];
			b.el[b.prop] = mxResources.get(b.key, null, b.fallback);
		}
	});

	pickRow.appendChild(pickSelect);

	div.appendChild(addSection);

	// Reads the visible canvas window in graph coordinates — same math as
	// the CustomActionDialog's Use Current button, used to pre-fill a
	// viewbox step with the current viewport on pick.
	var captureCurrentViewport = function()
	{
		var view = graph.view;
		var container = graph.container;
		var scale = view.scale;
		var t = view.translate;

		return {
			x: Math.round(container.scrollLeft / scale - t.x),
			y: Math.round(container.scrollTop  / scale - t.y),
			width: Math.round(container.clientWidth  / scale),
			height: Math.round(container.clientHeight / scale),
			border: 0
		};
	};

	// Builds one JSON step for the picked action key, driven by SCHEMAS.
	// Multi-cell picks collapse into one step with cells: [A, B, C] —
	// inherently parallel.
	var buildStepObject = function(key, cellRefs)
	{
		var schema = CustomActionDialog.SCHEMAS[key];
		if (schema == null) return null;

		var step = {};

		if (schema.primary != null)
		{
			// Standalone scalar action (e.g. wait, open).
			var def = schema.primary.def;
			step[key] = (def != null) ?
				(schema.primary.type == 'number' ? parseFloat(def) : def) :
				(schema.primary.type == 'number' ? 0 : '');
		}
		else
		{
			var sel = {};

			if (schema.selector && Array.isArray(cellRefs) && cellRefs.length > 0)
			{
				sel.cells = cellRefs.slice();
			}

			if (Array.isArray(schema.fields))
			{
				for (var i = 0; i < schema.fields.length; i++)
				{
					var f = schema.fields[i];
					if (f.def != null)
					{
						sel[f.name] = f.type == 'number' ?
							parseFloat(f.def) : f.def;
					}
				}
			}

			// Viewbox defaults to the current viewport — same UX as the
			// CustomActionDialog picker, so picking "Viewbox" is a
			// one-click snapshot of what you see right now.
			if (key == 'viewbox')
			{
				var vp = captureCurrentViewport();
				if (sel.x == null) sel.x = vp.x;
				if (sel.y == null) sel.y = vp.y;
				if (sel.width == null) sel.width = vp.width;
				if (sel.height == null) sel.height = vp.height;
				if (sel.border == null) sel.border = vp.border;
			}

			step[key] = sel;
		}

		return step;
	};

	pickSelect.addEventListener('change', function()
	{
		var key = pickSelect.value;
		pickSelect.value = '';

		if (!key) return;

		// Destructive "Delete All" entry — guarded by editorUi.confirm
		// since it can't be undone (the dialog's data is the source of
		// truth; once cleared, the previous list is gone).
		if (key == '__deleteAll__')
		{
			if (data.steps.length == 0) return;
			editorUi.confirm(mxResources.get('areYouSure', null,
				'Are you sure?'), function()
			{
				data.steps = [];
				refresh();
			});
			return;
		}

		var schema = CustomActionDialog.SCHEMAS[key];
		if (schema == null) return;

		// Cell-targeting actions default to the current canvas selection
		// if any cells are picked, else to the "*" wildcard (all cells).
		// No alert when selection is empty — the wildcard fallback makes
		// the picker always succeed.
		var refs = null;

		if (schema.selector)
		{
			var selectionCells = graph.getSelectionCells();
			refs = (selectionCells.length > 0) ?
				selectionCells.map(function(c) { return c.id; }) :
				[Editor.ANIMATION_ALL];
		}

		var step = buildStepObject(key, refs);
		if (step != null) appendStep(step);
	});

	var player = null;

	// Preview "session" — captures the pre-preview opacity of every
	// referenced cell on the first preview click and persists across
	// follow-up step previews so the user can stack multiple previews
	// without losing the original state. Reset wipes the session and
	// restores opacity in one shot.
	var previewSession = null;

	// Reset button is enabled only when a preview session is open.
	// Same pattern as the CustomActionDialog footer.
	var resetBtnRef = null;
	var updateResetBtn = function()
	{
		if (resetBtnRef == null) return;
		var enabled = previewSession != null;
		resetBtnRef.disabled = !enabled;
		resetBtnRef.style.opacity = enabled ? '' : '0.4';
		resetBtnRef.style.cursor = enabled ? '' : 'default';
	};

	var startPreviewSession = function()
	{
		if (previewSession != null) return;
		previewSession = new Editor.AnimationPlayer(graph, data);
		previewSession.snapshotOpacity();
		updateResetBtn();
	};

	var endPreviewSession = function()
	{
		if (previewSession == null) return;
		previewSession.restoreOpacity();

		// Stop flow animation on any edges that may have been touched —
		// restoreOpacity only resets opacity, not the mxEdgeFlow class.
		var refs = previewSession.collectReferencedCells();
		var edges = [];
		for (var i = 0; i < refs.length; i++)
		{
			if (graph.getModel().isEdge(refs[i])) edges.push(refs[i]);
		}
		if (edges.length > 0)
		{
			Editor.toggleFlowAnimation(graph, edges, 'stop');
		}

		// Refresh to revert any transient style mutations from the
		// state-changing actions (toggle / show / hide / style /
		// toggleStyle in transient mode mutate `state.style` and
		// `shape.apply/redraw` without touching the model — only a
		// re-validate clears them). restoreOpacity already wrote the
		// snapshot back into the DOM, so the inline opacity attributes
		// survive the refresh (shape.clear strips child SVG nodes but
		// not the parent group's style attribute).
		graph.refresh();

		previewSession = null;
		updateResetBtn();
	};

	var stopPlayer = function()
	{
		if (player != null)
		{
			player.stop();
			player = null;
		}
	};

	// Bottom action row — generous margin-top per docs/dialog-style-guide.md
	// (CustomDialog uses 34px; we use 20px because mxWindow already has
	// its own title-bar chrome above the content). No flex-wrap here —
	// the spacer's behavior gets undefined when buttons wrap; the
	// minimum dialog size (360px) keeps all buttons on one line.
	var actions = document.createElement('div');
	actions.style.cssText = 'margin-top:20px;display:flex;gap:6px;flex:0 0 auto';

	// `playingSteps` is hoisted to the top of the function — see comment
	// there. It tracks the currently-playing step(s) as a Set so a parallel
	// batch of `immediate: true` steps lights up together (the player calls
	// `setPlayingStep(startIdx, endIdx)` and every row in that half-open
	// range gets the active class).
	var setPlayingStep = function(start, end)
	{
		// start === -1 (or any negative value) clears the highlight.
		var nextSet = new Set();
		if (start != null && start >= 0)
		{
			// end defaults to start+1 (single-step highlight). Callers
			// running a parallel batch pass the exclusive end so the
			// whole batch lights up at once.
			var stop = (end != null) ? end : start + 1;
			for (var i = start; i < stop; i++) nextSet.add(i);
		}

		// Skip the DOM walk if the active set is unchanged — avoids
		// thrashing the row classes on every player tick.
		if (nextSet.size === playingSteps.size)
		{
			var same = true;
			for (var v of nextSet) if (!playingSteps.has(v)) { same = false; break; }
			if (same) return;
		}

		playingSteps = nextSet;
		var rows = stepList.querySelectorAll('[data-step-idx]');
		for (var i = 0; i < rows.length; i++)
		{
			var rowIdx = parseInt(rows[i].getAttribute('data-step-idx'), 10);
			rows[i].classList.toggle('geAnimationStepActive',
				playingSteps.has(rowIdx));
		}
	};

	// Help button — opens the end-user manual in a new window.
	actions.appendChild(editorUi.createHelpIcon(ANIMATION_HELP_URL));

	var thisDialog = this;

	// Persists state for the current mode. Page mode writes JSON to the
	// model root's animation attribute (omitting it entirely when empty
	// so the attribute doesn't bloat the file). Action mode calls back
	// to the host with the full `{title?, steps}` object so the host can
	// serialize it however it stores the link.
	var applyChanges = function()
	{
		if (kind == 'page')
		{
			var root = graph.getModel().getRoot();
			// Page-level animations don't carry a title — strip it so
			// the stored JSON stays clean even if the user typed one
			// before switching to page mode (defensive — page mode
			// doesn't show the title input).
			var payload = {steps: data.steps};
			// Only persist `loop` / `enabled` when they differ from the
			// default (true). Most diagrams use the defaults; emitting
			// the field only for opt-outs keeps file size and noise down.
			if (data.loop === false)
			{
				payload.loop = false;
			}
			if (data.enabled === false)
			{
				payload.enabled = false;
			}
			var value = (payload.steps.length > 0) ?
				JSON.stringify({animation: payload}) : null;
			graph.setAttributeForCell(root, 'animation', value);
			// Legacy attribute — cleared since hideInitial is no longer
			// a runtime concept (the converter prepended explicit
			// setOpacity steps instead).
			graph.setAttributeForCell(root, 'animationHideInitial', null);
		}
		else if (typeof opts.save == 'function')
		{
			opts.save(data);
		}

		setDirty(false);
	};

	// Footer layout: secondary actions on the left (Preview, then Reset),
	// and primary intent on the right (Cancel next to Save) — mirrors
	// the convention used elsewhere in drawio and avoids "Cancel" being
	// far from its companion "Save". Preview comes first because it's
	// the action you take BEFORE Reset (you preview, then optionally
	// reset to clear the canvas).

	previewBtn = mxUtils.button(mxResources.get('preview'), function()
	{
		stopPlayer();
		startPreviewSession();
		player = new Editor.AnimationPlayer(graph, data);
		// The session owns the snapshot. Suppress the player's own
		// restore-on-done so the canvas stays at the final state until
		// the user clicks Reset.
		player.snapshot = [];
		player.play({
			done: function() { player = null; setPlayingStep(-1); },
			// Player calls onStep(start, end) — end is the exclusive
			// upper bound of the parallel batch, so two-step batches
			// light up both rows at once. Single-step (sequential)
			// dispatches have end = start + 1.
			onStep: function(start, end) { setPlayingStep(start, end); }
		});
	});
	previewBtn.className = 'geBtn';
	staticRefreshers.push(function()
	{
		previewBtn.textContent = mxResources.get('preview');
		previewBtn.title = mxResources.get('preview');
	});
	previewBtn.title = mxResources.get('preview');
	actions.appendChild(previewBtn);

	// Reset — restores the canvas to its pre-preview state and stops
	// any running playback. Disabled until a preview session is open.
	var resetBtn = mxUtils.button(mxResources.get('reset', null, 'Reset'),
		function()
		{
			stopPlayer();
			setPlayingStep(-1);
			endPreviewSession();
		});
	resetBtn.className = 'geBtn';
	staticRefreshers.push(function()
	{
		var t = mxResources.get('reset', null, 'Reset');
		resetBtn.textContent = t;
		resetBtn.title = t;
	});
	resetBtn.title = mxResources.get('reset', null, 'Reset');
	resetBtnRef = resetBtn;
	updateResetBtn();
	actions.appendChild(resetBtn);

	var spacer = document.createElement('span');
	spacer.style.flex = '1 1 auto';
	actions.appendChild(spacer);

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		// Cancel button: if there are unsaved changes, prompt before
		// closing (default action is to stay open). If clean, close
		// immediately. The close X (mxWindow title bar) bypasses this
		// and auto-saves via the setVisible override below.
		if (dirty)
		{
			showUnsavedPrompt();
		}
		else
		{
			thisDialog.window.setVisible(false);
		}
	});
	cancelBtn.className = 'geBtn';
	staticRefreshers.push(function()
	{
		cancelBtn.textContent = mxResources.get('cancel');
		cancelBtn.title = mxResources.get('cancel');
	});
	cancelBtn.title = mxResources.get('cancel');
	actions.appendChild(cancelBtn);

	applyBtn = mxUtils.button(mxResources.get('save'), function()
	{
		// Block save while the advanced-mode textarea holds invalid JSON —
		// otherwise applyChanges would silently persist the last valid
		// state behind a textarea showing something different.
		if (advancedCheckbox.checked && !jsonValid)
		{
			validateTextarea();
			list.focus();
			return;
		}

		applyChanges();
		thisDialog.window.setVisible(false);
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	staticRefreshers.push(function()
	{
		applyBtn.textContent = mxResources.get('save');
		applyBtn.title = mxResources.get('save');
	});
	applyBtn.title = mxResources.get('save');
	actions.appendChild(applyBtn);

	div.appendChild(actions);

	this.window = new mxWindow(resolveWindowTitle(),
		div, x, y, w, h, true, true);
	this.window.minimumSize = new mxRectangle(0, 0, 360, 360);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);

	// Close any open chip popover when the window moves or resizes —
	// popovers are positioned fixed at open time and don't follow.
	var closeOpenPopover = function()
	{
		if (typeof selectorChips.closePopover == 'function')
		{
			selectorChips.closePopover();
		}
	};
	this.window.addListener(mxEvent.MOVE, closeOpenPopover);
	this.window.addListener(mxEvent.RESIZE, closeOpenPopover);

	// Refresh on language change so row labels pick up new translations
	// even while the (stateful, non-modal) dialog stays open. Also
	// re-applies the registered static label refreshers and updates the
	// window's mxWindow title.
	var onLanguageChanged = function()
	{
		for (var i = 0; i < staticRefreshers.length; i++)
		{
			try { staticRefreshers[i](); } catch (e) {}
		}
		if (thisDialog.window != null && thisDialog.window.title != null)
		{
			thisDialog.window.title.innerHTML = mxUtils.htmlEntities(
				resolveWindowTitle());
		}
		renderList();
	};
	editorUi.addListener('languageChanged', onLanguageChanged);
	this.window.addListener(mxEvent.DESTROY, function()
	{
		editorUi.removeListener(onLanguageChanged);
	});

	// Unsaved-changes prompt — delegates to the shared confirm dialog (the
	// same "All changes will be lost!" prompt shown on file close) so every
	// dialog is consistent. The primary "Cancel" keeps this dialog open; the
	// secondary "Discard Changes" discards and closes the window. The close X
	// auto-saves and skips this entirely.
	var showUnsavedPrompt = function()
	{
		editorUi.confirm(mxResources.get('allChangesLost'), null, function()
		{
			// User chose Discard — clear dirty so the setVisible override's
			// auto-save branch doesn't fire, then hide the AnimationDialog.
			setDirty(false);
			thisDialog.window.setVisible(false);
		}, mxResources.get('cancel'), mxResources.get('discardChanges'));
	};

	// Auto-save on close-X. mxWindow's close X calls setVisible(false)
	// without going through our footer buttons; intercept here so that
	// path saves first. Save / Cancel buttons drive their own flow
	// (Save calls applyChanges; Cancel either calls setDirty(false) via
	// the prompt's Discard button, or shows the prompt). By the time
	// origSetVisible runs, dirty is always false in those branches, so
	// applyChanges is a no-op.
	var origSetVisible = thisDialog.window.setVisible.bind(thisDialog.window);
	thisDialog.window.setVisible = function(visible)
	{
		if (visible === false && dirty)
		{
			applyChanges();
		}
		origSetVisible(visible);
	};

	// 'hide' fires once the window is actually hiding — clean up the
	// player and preview snapshot then.
	this.window.addListener('hide', function()
	{
		stopPlayer();
		setPlayingStep(-1);
		// Restore any leftover preview state so closing the dialog
		// doesn't leave cells faded out on the canvas.
		endPreviewSession();
	});

	// Page-switch handling only applies when we're editing the page-level
	// animation — action mode operates on a single in-memory steps array
	// independent of which page is active.
	if (kind == 'page')
	{
		graph.addListener(mxEvent.ROOT, function()
		{
			var newRoot = graph.getModel().getRoot();

			if (newRoot != currentRoot)
			{
				// Persist any unsaved changes for the page we're leaving.
				// Use the same payload shape as applyChanges — omit
				// `loop` / `enabled` when at their default (true) to
				// keep stored JSON minimal.
				if (dirty)
				{
					var payload = {steps: data.steps};
					if (data.loop === false) payload.loop = false;
					if (data.enabled === false) payload.enabled = false;
					var value = (data.steps.length > 0) ?
						JSON.stringify({animation: payload}) : null;
					graph.setAttributeForCell(currentRoot, 'animation', value);
				}

				currentRoot = newRoot;
				loadFromContext();
				setDirty(false);
				renderList();
				stopPlayer();
			}
		});
	}

	// Close this dialog when a different file is loaded — its cells and
	// page animation belong to the previous document. Clearing dirty first
	// makes hiding skip the auto-save override (which would otherwise write
	// to the outgoing file or a now-removed cell).
	var onFileLoaded = function()
	{
		setDirty(false);
		thisDialog.window.setVisible(false);
	};
	editorUi.editor.addListener('fileLoaded', onFileLoaded);
	this.window.addListener(mxEvent.DESTROY, function()
	{
		editorUi.editor.removeListener(onFileLoaded);
	});

	installDialogDocking(editorUi, this);

	// Make sure the window is visible — action-mode dialogs are opened
	// fresh from another dialog and never go through `setVisible(true)`
	// via the menu/persistence path.
	this.window.setVisible(true);

	// Clamp into the viewport after layout settles. setVisible() (and the
	// page-mode restoreWindowState that runs right after construction) place
	// the window at a fixed position/size without checking the viewport, so
	// opening in a short browser window can leave it partly off-screen — the
	// installResizeHandler clamp otherwise only fires on a browser 'resize'.
	// Deferred so the flex content has its final height before we measure
	// (the height drives the clamp), addressing the "fit runs before the
	// content is sized" ordering. setLocation() re-applies the resize
	// handler's position + size clamp and is a no-op when already in view.
	window.setTimeout(mxUtils.bind(this, function()
	{
		if (this.window != null && this.window.div != null &&
			!this.window.minimized && this.window.dockState == null)
		{
			this.window.setLocation(this.window.getX(), this.window.getY());
		}
	}), 0);
};

/**
 * Warning dialog shown when the GitLab server URL has been overridden via the
 * ?gitlab= URL parameter but the deployment has not opted in to custom GitLab
 * hosts via DRAWIO_CONFIG.enableCustomGitLabUrl. See issue #493.
 */
var CustomGitLabUrlWarningDialog = function(editorUi, requestedUrl)
{
	var div = document.createElement('div');

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get('customGitlabUrlTitle'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
	div.appendChild(hd);

	var p = document.createElement('p');
	mxUtils.write(p, mxResources.get('customGitlabUrlWarning'));
	div.appendChild(p);

	var urlRow = document.createElement('p');
	var lbl = document.createElement('strong');
	mxUtils.write(lbl, mxResources.get('customGitlabUrlServer') + ' ');
	urlRow.appendChild(lbl);
	var urlCode = document.createElement('code');
	mxUtils.write(urlCode, requestedUrl);
	urlRow.appendChild(urlCode);
	div.appendChild(urlRow);

	var linkRow = document.createElement('p');
	var link = document.createElement('a');
	link.setAttribute('href', 'https://github.com/jgraph/drawio/issues/493');
	link.setAttribute('target', '_blank');
	link.setAttribute('rel', 'noopener noreferrer');
	mxUtils.write(link, mxResources.get('customGitlabUrlLearnMore'));
	linkRow.appendChild(link);
	div.appendChild(linkRow);

	var dlg = new CustomDialog(editorUi, div, null, null,
		mxResources.get('close'), null, null, true);
	this.container = dlg.container;
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
	else if (peer == editorUi.m365)
	{
		service = mxResources.get('m365');
		img.src = IMAGE_PATH + '/onedrive-logo-white.svg';
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
			var section = editorUi.sidebar.customEntries[i] || {};
			var tmp = {title: editorUi.getResource(section.title), entries: []};
			
			for (var j = 0; section.entries != null && j < section.entries.length; j++)
			{
				var entry = section.entries[j];
				tmp.entries.push({id: entry.id, title:
					editorUi.getResource(entry.title),
					desc: editorUi.getResource(entry.desc),
					image: entry.preview});
			}
			
			if (tmp.entries.length > 0)
			{
				newEntries.push(tmp);
			}
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
					var title = document.createElement('div');
					title.className = 'geMoreShapesSectionHeader';
					mxUtils.write(title, section.title);
					list.appendChild(title);
		
					for (var j = 0; j < section.entries.length; j++)
					{
						(function(entry)
						{
							var option = document.createElement('div');
							option.className = 'geMoreShapesItem';
							option.setAttribute('title', entry.title + ' (' + entry.id + ')');

							var checkbox = document.createElement('input');
							checkbox.setAttribute('type', 'checkbox');
							checkbox.checked = editorUi.sidebar.isEntryVisible(entry.id);
							checkbox.defaultChecked = checkbox.checked;
							option.appendChild(checkbox);
							var label = document.createElement('span');
							mxUtils.write(label, entry.title);
							option.appendChild(label);
		
							list.appendChild(option);
							
							var itemClicked = function(evt)
							{
								if (evt == null || mxEvent.getSource(evt).nodeName != 'INPUT')
								{
									preview.style.textAlign = 'center';
									preview.style.padding = '0px';
									preview.style.color = '';
									preview.innerText = '';
									
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
										var img = document.createElement('img');
										img.setAttribute('border', '0');
										img.style.maxWidth = '100%';
										img.setAttribute('src', entry.image);
										preview.appendChild(img);
									}
									else if (entry.desc == null)
									{
										preview.style.padding = '20px';
										preview.style.color = 'rgb(179, 179, 179)';
										mxUtils.write(preview, mxResources.get('noPreview'));
									}
									
									if (currentListItem != null)
									{
										currentListItem.classList.remove('geMoreShapesItemSelected');
									}

									currentListItem = option;
									currentListItem.classList.add('geMoreShapesItemSelected');
									
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
		list.style.width = '220px';
		list.style.bottom = '70px';
		list.style.overflow = 'auto';

		preview.className = 'geMoreShapesPreview';
		preview.style.position = 'absolute';
		preview.style.left = '220px';
		preview.style.right = '0px';
		preview.style.top = '40px';
		preview.style.bottom = '70px';
		preview.style.overflow = 'auto';
		preview.style.textAlign = 'center';

		var currentListItem = null;
		var applyFunctions = [];

		addEntries(entries);
		
		div.appendChild(hd);
		div.appendChild(list);
		div.appendChild(preview);
		
		var buttons = document.createElement('div');
		buttons.className = 'geDialogFooter';
		buttons.style.position = 'absolute';
		buttons.style.display = 'flex';
		buttons.style.alignItems = 'center';
		buttons.style.paddingRight = '16px';
		buttons.style.paddingLeft = '16px';
		buttons.style.left = '0px';
		buttons.style.right = '0px';
		buttons.style.bottom = '0px';
		buttons.style.height = '70px';

		var checksDiv = document.createElement('div');
		checksDiv.className = 'geMoreShapesFooterChecks';

		var labelsLabel = document.createElement('label');
		labelsLabel.className = 'geMoreShapesFooterCheck';
		var labels = document.createElement('input');
		labels.setAttribute('type', 'checkbox');
		labels.checked = editorUi.sidebar.sidebarTitles;
		labels.defaultChecked = labels.checked;
		labelsLabel.appendChild(labels);
		var labelsText = document.createElement('span');
		mxUtils.write(labelsText, mxResources.get('labels'));
		labelsLabel.appendChild(labelsText);
		checksDiv.appendChild(labelsLabel);

		var cb = document.createElement('input');
		cb.setAttribute('type', 'checkbox');

		if (isLocalStorage || mxClient.IS_CHROMEAPP)
		{
			var rememberLabel = document.createElement('label');
			rememberLabel.className = 'geMoreShapesFooterCheck';
			cb.checked = true;
			cb.defaultChecked = true;
			rememberLabel.appendChild(cb);
			var rememberText = document.createElement('span');
			mxUtils.write(rememberText, mxResources.get('rememberThisSetting'));
			rememberLabel.appendChild(rememberText);
			checksDiv.appendChild(rememberLabel);
		}

		buttons.appendChild(checksDiv);
		
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

			// Redirects scratchpad and search entries
			if ((Editor.currentTheme == 'simple' ||
				Editor.currentTheme == 'sketch' ||
				Editor.currentTheme == 'min') &&
				Editor.isSettingsEnabled())
			{
				var idx = mxUtils.indexOf(libs, '.scratchpad');

				if ((editorUi.scratchpad != null) != (idx >= 0 && libs.splice(idx, 1).length > 0))
				{
					editorUi.toggleScratchpad();
				}

				// Handles search after scratchpad
				idx = mxUtils.indexOf(libs, 'search');
				mxSettings.settings.search = (idx >= 0 && libs.splice(idx, 1).length > 0);
				editorUi.sidebar.showPalette('search', mxSettings.settings.search);

				if (cb.checked)
				{
					mxSettings.save();
				}
			}
			
			editorUi.sidebar.showEntries(libs.join(';'), cb.checked, true);
			editorUi.setSidebarTitles(labels.checked, cb.checked);
		});
		applyBtn.className = 'geBtn gePrimaryBtn';

		var btnsRight = document.createElement('div');
		btnsRight.style.flex = '1';
		btnsRight.style.textAlign = 'right';

		if (editorUi.editor.cancelFirst)
		{
			btnsRight.appendChild(cancelBtn);
			btnsRight.appendChild(applyBtn);
		}
		else
		{
			btnsRight.appendChild(applyBtn);
			btnsRight.appendChild(cancelBtn);
		}

		buttons.appendChild(btnsRight);

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

var PluginsDialog = function(editorUi, addFn, delFn, closeOnly)
{
	var div = document.createElement('div');

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get('plugins'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
	div.appendChild(hd);

	var inner = document.createElement('div');
	inner.className = 'geDialogSection';
	inner.style.height = '160px';
	inner.style.overflow = 'auto';
	inner.style.fontSize = '13px';

	var plugins = mxSettings.getPlugins().slice();
	var changed = false;

	function refresh()
	{
		changed = true;

		if (plugins.length == 0)
		{
			inner.innerText = '';
			inner.style.color = 'light-dark(#6e6e73, #a0a0a0)';
			mxUtils.write(inner, mxResources.get('noPlugins'));
		}
		else
		{
			inner.innerText = '';
			inner.style.color = '';

			for (var i = 0; i < plugins.length; i++)
			{
				var span = document.createElement('span');
				span.style.display = 'flex';
				span.style.alignItems = 'center';
				span.style.whiteSpace = 'nowrap';
				span.style.minHeight = '26px';

				var img = document.createElement('img');
				img.src = Editor.trashImage;
				img.style.cursor = 'pointer';
				img.style.marginRight = '8px';
				img.style.width = '16px';
				img.style.flexShrink = '0';
				img.setAttribute('title', mxResources.get('delete'));
				span.appendChild(img);

				var nameSpan = document.createElement('span');
				nameSpan.style.overflow = 'hidden';
				nameSpan.style.textOverflow = 'ellipsis';
				mxUtils.write(nameSpan, plugins[i]);
				span.appendChild(nameSpan);

				inner.appendChild(span);

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
	changed = false;

	// Inline "add built-in" row (webapp only). Desktop overrides addFn to
	// pick a file from disk, so we keep the legacy bottom Add button there.
	var pluginsSelect = null;
	var inlineAddBtn = null;

	if (addFn == null)
	{
		var addRow = document.createElement('div');
		addRow.style.display = 'flex';
		addRow.style.alignItems = 'center';
		addRow.style.gap = '8px';
		addRow.style.marginTop = '10px';

		pluginsSelect = document.createElement('select');
		pluginsSelect.style.flex = '1';
		pluginsSelect.style.minWidth = '0';
		addRow.appendChild(pluginsSelect);

		inlineAddBtn = mxUtils.button(mxResources.get('add'), function()
		{
			var key = pluginsSelect.value;

			if (key == '')
			{
				return;
			}

			var url = App.pluginRegistry[key];

			if (url != null && mxUtils.indexOf(plugins, url) < 0)
			{
				plugins.push(url);
				refresh();
			}
		});
		inlineAddBtn.className = 'geBtn';
		inlineAddBtn.style.margin = '0';
		inlineAddBtn.disabled = true;
		addRow.appendChild(inlineAddBtn);

		mxEvent.addListener(pluginsSelect, 'change', function()
		{
			inlineAddBtn.disabled = (pluginsSelect.value == '');
		});

		if (ALLOW_CUSTOM_PLUGINS)
		{
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
			customBtn.style.margin = '0';
			addRow.appendChild(customBtn);
		}

		div.appendChild(addRow);
	}

	// Rebuilds the dropdown so already-loaded plugins are disabled but visible
	function refreshAddOptions()
	{
		if (pluginsSelect == null)
		{
			return;
		}

		pluginsSelect.innerText = '';

		var placeholder = document.createElement('option');
		placeholder.value = '';
		mxUtils.write(placeholder, mxResources.get('chooseAnOption') || 'Choose…');
		pluginsSelect.appendChild(placeholder);

		for (var i = 0; i < App.publicPlugin.length; i++)
		{
			var key = App.publicPlugin[i];
			var url = App.pluginRegistry[key];
			var option = document.createElement('option');
			mxUtils.write(option, key);
			option.value = key;

			if (url == null || mxUtils.indexOf(plugins, url) >= 0)
			{
				option.disabled = true;
			}

			pluginsSelect.appendChild(option);
		}

		if (inlineAddBtn != null)
		{
			inlineAddBtn.disabled = true;
		}
	}

	// Hook the dropdown refresh into the existing list refresh path
	var refreshList = refresh;

	refresh = function()
	{
		refreshList();
		refreshAddOptions();
	};

	refreshAddOptions();

	// Desktop keeps a bottom Add button driven by addFn (file picker etc.)
	var addBtn = null;

	if (addFn != null)
	{
		addBtn = mxUtils.button(mxResources.get('add'), function()
		{
			addFn(function(newPlugin)
			{
				if (newPlugin && mxUtils.indexOf(plugins, newPlugin) < 0)
				{
					plugins.push(newPlugin);
				}

				refresh();
			});
		});
		addBtn.className = 'geBtn';
	}

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});

	cancelBtn.className = 'geBtn';

	var applyBtn = mxUtils.button(closeOnly? mxResources.get('close') : mxResources.get('apply'), function()
	{
		if (changed)
		{
			mxSettings.setPlugins(plugins);
			mxSettings.save();
			editorUi.hideDialog();
			editorUi.alert(mxResources.get('restartForChangeRequired'));
		}
		else
		{
			editorUi.hideDialog();
		}
	});

	applyBtn.className = 'geBtn gePrimaryBtn';

	var buttons = document.createElement('div');
	buttons.style.marginTop = '14px';
	buttons.style.textAlign = 'right';

	if (!editorUi.isOffline())
	{
		buttons.appendChild(editorUi.createHelpIcon('https://www.drawio.com/doc/faq/plugins'));
	}

	if (editorUi.editor.cancelFirst)
	{
		if (!closeOnly)
		{
			buttons.appendChild(cancelBtn);
		}

		if (addBtn != null)
		{
			buttons.appendChild(addBtn);
		}

		buttons.appendChild(applyBtn);
	}
	else
	{
		if (addBtn != null)
		{
			buttons.appendChild(addBtn);
		}

		buttons.appendChild(applyBtn);

		if (!closeOnly)
		{
			buttons.appendChild(cancelBtn);
		}
	}

	div.appendChild(buttons);

	this.container = div;
};

var CropImageDialog = function(editorUi, image, clipPath, fn)
{
	var div = document.createElement('div');
	div.style.display = 'flex';
	div.style.flexDirection = 'column';
	div.style.height = '100%';

	var croppingDiv = document.createElement('div');
	croppingDiv.style.flex = '1';
	croppingDiv.style.minHeight = '0';
	croppingDiv.style.overflow = 'auto';
	croppingDiv.style.border = '1px solid';
	
	div.appendChild(croppingDiv);

	var imageUrl = image.replace(';base64', '');
	var cropGraph = null, bgCell = null, initGeo = null,
		arcSizeVal = 5, cropCell = new mxCell('', new mxGeometry(0, 0, 1, 1), ''),
		imgW = 0, imgH = 0,
		commonStyle = 'shape=image;fillColor=none;rotatable=0;cloneable=0;deletable=0;image=' +
						imageUrl + ';clipPath=',
		bgDimStyle = 'shape=image;fillColor=none;movable=0;resizable=0;editable=0;' +
			'connectable=0;rotatable=0;deletable=0;opacity=40;image=' + imageUrl + ';',
		bgFullStyle = 'shape=image;fillColor=none;movable=0;resizable=0;editable=0;' +
			'connectable=0;rotatable=0;deletable=0;image=' + imageUrl + ';';

	function fitGraph()
	{
		if (cropGraph != null)
		{
			croppingDiv.style.overflow = 'hidden';
			cropGraph.maxFitScale = null;
			cropGraph.fit(8);
			cropGraph.center();
			croppingDiv.style.overflow = 'auto';
		}
	};

	var imgObj = new Image();
	imgObj.onload = init;
	imgObj.onerror = function()
	{
		imgObj.onload = null;
		imgObj.src = Editor.errorImage;
	};
	imgObj.src = image;

	function init()
	{
		imgW = imgObj.naturalWidth;
		imgH = imgObj.naturalHeight;

		initGeo = new mxGeometry(imgW * 0.15, imgH * 0.15,
			imgW * 0.7, imgH * 0.7);
		cropCell.geometry = initGeo.clone();

		cropGraph = new Graph(croppingDiv);
		cropGraph.autoExtend = false;
		cropGraph.autoScroll = false;
		cropGraph.setGridEnabled(false);
		cropGraph.setEnabled(true);
		cropGraph.setPanning(true);
		cropGraph.setConnectable(false);
		cropGraph.getRubberband().setEnabled(false);
		cropGraph.graphHandler.allowLivePreview = false;
		cropGraph.centerZoom = true;
		cropGraph.background = '#ffffff';

		var origCreateVertexHandler = cropGraph.createVertexHandler;

		cropGraph.createVertexHandler = function()
		{
			var handler = origCreateVertexHandler.apply(this, arguments);
			handler.livePreview = false;
			return handler;
		};

		var origIsCellSelectable = cropGraph.isCellSelectable;

		cropGraph.isCellSelectable = function(cell)
		{
			return cell === cropCell && origIsCellSelectable.apply(this, arguments);
		};

		bgCell = new mxCell('', new mxGeometry(0, 0, imgW, imgH), bgDimStyle);
		bgCell.vertex = true;
		cropGraph.addCell(bgCell);

		if (clipPath != null)
		{
			//Find position and size of cropCell
			try
			{
				if (clipPath.substring(0, 5) == 'inset')
				{
					var geo = cropCell.geometry;
					var tokens = clipPath.match(/\(([^)]+)\)/)[1].split(/[ ,]+/);

					var top = parseFloat(tokens[0]);
					var right = parseFloat(tokens[1]);
					var bottom = parseFloat(tokens[2]);
					var left = parseFloat(tokens[3]);

					if (isFinite(top) && isFinite(right) && isFinite(bottom) && isFinite(left))
					{
						geo.x = left / 100 * imgW;
						geo.y = top / 100 * imgH;
						geo.width = (100 - right) / 100 * imgW - geo.x;
						geo.height = (100 - bottom) / 100 * imgH - geo.y;

						if (tokens[4] == 'round')
						{
							if (tokens[5] == '50%')
							{
								ellipseInput.setAttribute('checked', 'checked');
							}
							else
							{
								arcSizeVal = parseInt(tokens[5]);
								arcSize.value = arcSizeVal;
								roundedInput.setAttribute('checked', 'checked');
								arcSizeDiv.style.visibility = 'visible';
							}
						}
						else
						{
							rectInput.setAttribute('checked', 'checked');
						}
					}
					else //Invalid clipPath
					{
						clipPath = null;
					}
				}
				else //The dialog supports inset only
				{
					clipPath = null;
				}
			}
			catch (e){} //Ignore
		}

		cropCell.style = getCropCellStyle(clipPath);
		cropCell.vertex = true;
		cropGraph.addCell(cropCell);
		cropGraph.selectAll();

		function updateCropCell()
		{
			cropGraph.model.setStyle(cropCell, getCropCellStyle());
			updateInputs();
		};

		cropGraph.addListener(mxEvent.CELLS_MOVED, updateCropCell);
		cropGraph.addListener(mxEvent.CELLS_RESIZED, updateCropCell);

		var origMouseUp = cropGraph.graphHandler.mouseUp;
		var origMouseDown = cropGraph.graphHandler.mouseDown;

		cropGraph.graphHandler.mouseUp = function()
		{
			origMouseUp.apply(this, arguments);

			if (bgCell != null)
			{
				cropGraph.model.setStyle(bgCell, bgDimStyle);
			}
		};

		cropGraph.graphHandler.mouseDown = function()
		{
			origMouseDown.apply(this, arguments);

			if (bgCell != null)
			{
				cropGraph.model.setStyle(bgCell, bgFullStyle);
			}
		};

		cropGraph.dblClick = function(){} //Disable text adding

		var origChangeSelection = cropGraph.getSelectionModel().changeSelection;

		//Prevent deselection
		cropGraph.getSelectionModel().changeSelection = function()
		{
			origChangeSelection.call(this, [cropCell], [cropCell]);
		};

		updateInputs();
		fitGraph();
	};

	// Zoom buttons
	var zoomBtns = document.createElement('div');
	zoomBtns.style.display = 'flex';
	zoomBtns.style.flexShrink = '0';
	zoomBtns.style.alignItems = 'center';
	zoomBtns.style.justifyContent = 'center';
	zoomBtns.style.paddingTop = '6px';

	var zoomInBtn = editorUi.createToolbarButton(Editor.zoomInImage,
		mxResources.get('zoomIn'), function()
	{
		if (cropGraph != null)
		{
			cropGraph.zoomIn()
		}
	});

	var zoomOutBtn = editorUi.createToolbarButton(Editor.zoomOutImage,
		mxResources.get('zoomOut'), function()
	{
		if (cropGraph != null)
		{
			cropGraph.zoomOut();
		}
	});

	var zoomFitBtn = editorUi.createToolbarButton(Editor.zoomFitImage,
		mxResources.get('fit'), function()
	{
		fitGraph();
	});

	zoomBtns.appendChild(zoomInBtn);
	zoomBtns.appendChild(zoomOutBtn);
	zoomBtns.appendChild(zoomFitBtn);

	var inputStyle = 'width:46px;margin:0 2px;text-align:right;';

	function createInput(label)
	{
		var lbl = document.createElement('span');
		lbl.style.marginLeft = '6px';
		lbl.style.fontSize = '11px';
		mxUtils.write(lbl, label);
		zoomBtns.appendChild(lbl);

		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.style.cssText = inputStyle;
		zoomBtns.appendChild(input);

		return input;
	};

	var xInput = createInput('X');
	var yInput = createInput('Y');
	var wInput = createInput('W');
	var hInput = createInput('H');

	function updateInputs()
	{
		var geo = cropCell.geometry;
		xInput.value = Math.round(geo.x);
		yInput.value = Math.round(geo.y);
		wInput.value = Math.round(geo.width);
		hInput.value = Math.round(geo.height);
	};

	function applyInputs()
	{
		if (cropGraph == null) return;

		var x = parseFloat(xInput.value);
		var y = parseFloat(yInput.value);
		var w = parseFloat(wInput.value);
		var h = parseFloat(hInput.value);

		if (isFinite(x) && isFinite(y) && isFinite(w) && isFinite(h) && w > 0 && h > 0)
		{
			var geo = cropCell.geometry.clone();
			geo.x = x;
			geo.y = y;
			geo.width = w;
			geo.height = h;
			cropGraph.model.setGeometry(cropCell, geo);
			cropGraph.model.setStyle(cropCell, getCropCellStyle());
			cropGraph.selectAll();
		}
	};

	mxEvent.addListener(xInput, 'change', applyInputs);
	mxEvent.addListener(yInput, 'change', applyInputs);
	mxEvent.addListener(wInput, 'change', applyInputs);
	mxEvent.addListener(hInput, 'change', applyInputs);

	div.appendChild(zoomBtns);

	var radioDiv = document.createElement('div');
	radioDiv.style.whiteSpace = 'nowrap';
	radioDiv.style.display = 'flex';
	radioDiv.style.flexShrink = '0';
	radioDiv.style.alignItems = 'center';
	radioDiv.style.justifyContent = 'center';

	var rectInput = document.createElement('input');
	rectInput.setAttribute('type', 'radio');
	rectInput.setAttribute('id', 'croppingRect');
	rectInput.setAttribute('name', 'croppingShape');
	rectInput.setAttribute('checked', 'checked');
	rectInput.style.margin = '5px';
	radioDiv.appendChild(rectInput);

	var rectLbl = document.createElement('label');
	rectLbl.setAttribute('for', 'croppingRect');
	rectLbl.style.overflow = 'hidden';
	rectLbl.style.textOverflow = 'ellipsis';
	rectLbl.style.padding = '3px';
	mxUtils.write(rectLbl, mxResources.get('rectangle'));
	radioDiv.appendChild(rectLbl);

	var roundedInput = document.createElement('input');
	roundedInput.setAttribute('type', 'radio');
	roundedInput.setAttribute('id', 'croppingRounded');
	roundedInput.setAttribute('name', 'croppingShape');
	roundedInput.style.margin = '5px';
	radioDiv.appendChild(roundedInput);

	var roundedLbl = document.createElement('label');
	roundedLbl.setAttribute('for', 'croppingRounded');
	roundedLbl.style.overflow = 'hidden';
	roundedLbl.style.textOverflow = 'ellipsis';
	roundedLbl.style.padding = '3px';
	mxUtils.write(roundedLbl, mxResources.get('rounded'));
	radioDiv.appendChild(roundedLbl);

	var ellipseInput = document.createElement('input');
	ellipseInput.setAttribute('type', 'radio');
	ellipseInput.setAttribute('id', 'croppingEllipse');
	ellipseInput.setAttribute('name', 'croppingShape');
	ellipseInput.style.margin = '5px';
	radioDiv.appendChild(ellipseInput);

	var ellipseLbl = document.createElement('label');
	ellipseLbl.setAttribute('for', 'croppingEllipse');
	ellipseLbl.style.overflow = 'hidden';
	ellipseLbl.style.textOverflow = 'ellipsis';
	ellipseLbl.style.padding = '3px';
	mxUtils.write(ellipseLbl, mxResources.get('ellipse'));
	radioDiv.appendChild(ellipseLbl);
	div.appendChild(radioDiv);

	function calcClipPath()
	{
		var isRounded = roundedInput.checked;
		var isEllipse = ellipseInput.checked;

		var geo = cropCell.geometry;

		//prevent coords outside the image
		if (geo.x < 0)
		{
			geo.width += geo.x;
			geo.x = 0;
		}
		else if (geo.x + geo.width > imgW)
		{
			geo.width = imgW - geo.x;
			geo.x = Math.min(geo.x, imgW);
		}

		if (geo.y < 0)
		{
			geo.height += geo.y;
			geo.y = 0;
		}
		else if (geo.y + geo.height > imgH)
		{
			geo.height = imgH - geo.y;
			geo.y = Math.min(geo.y, imgH);
		}

		var left = geo.x / imgW * 100;
		var right = 100 - (geo.x + geo.width) / imgW * 100;
		var top = geo.y / imgH * 100;
		var bottom = 100 - (geo.y + geo.height) / imgH * 100;

		return 'inset(' + mxUtils.format(top) + '% ' + mxUtils.format(right) + '% ' + mxUtils.format(bottom) + '% ' + mxUtils.format(left) + '%' +
							(isRounded? ' round ' + arcSizeVal + '%' : (isEllipse? ' round 50%' : '')) + ')';
	}

	function typeChanged(noGeoReset)
	{
		if (cropGraph == null) return; //Image is not loaded yet

		if (noGeoReset !== true)
		{
			cropGraph.model.setGeometry(cropCell, initGeo.clone());
			arcSizeVal = 5;
			arcSize.value = arcSizeVal;
		}

		cropGraph.model.setStyle(cropCell, getCropCellStyle());
		cropGraph.selectAll();
		updateInputs();
		arcSizeDiv.style.visibility = roundedInput.checked ? 'visible' : 'hidden';
	}

	function getCropCellStyle(clipPath)
	{
		return commonStyle + (clipPath? clipPath : calcClipPath());
	}

	mxEvent.addListener(rectInput, 'change', typeChanged);
	mxEvent.addListener(roundedInput, 'change', typeChanged);
	mxEvent.addListener(ellipseInput, 'change', typeChanged);

	//Arc size slider
	var arcSizeDiv = document.createElement('div');
	arcSizeDiv.style.textAlign = 'center';
	arcSizeDiv.style.flexShrink = '0';
	arcSizeDiv.style.visibility = 'hidden';

	var arcSize = document.createElement('input');
	arcSize.setAttribute('type', 'range');
	arcSize.setAttribute('min', '1');
	arcSize.setAttribute('max', '49');
	arcSize.setAttribute('value', arcSizeVal);
	arcSize.setAttribute('title', mxResources.get('arcSize'));
	arcSizeDiv.appendChild(arcSize);

	div.appendChild(arcSizeDiv);

	mxEvent.addListener(arcSize, 'change', function()
	{
		arcSizeVal = this.value;
		typeChanged(true);
	});

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});

	cancelBtn.className = 'geBtn';

	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		fn(calcClipPath(), cropCell.geometry.width, cropCell.geometry.height);
		editorUi.hideDialog();
	});

	applyBtn.className = 'geBtn gePrimaryBtn';

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		fn(null, imgW, imgH);
		editorUi.hideDialog();
	});

	resetBtn.className = 'geBtn';

	var buttons = document.createElement('div');
	buttons.style.flexShrink = '0';
	buttons.style.marginTop = '10px';
	buttons.style.whiteSpace = 'nowrap';
	buttons.style.display = 'flex';
	buttons.style.justifyContent = 'flex-end';

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
		buttons.appendChild(resetBtn);
		buttons.appendChild(applyBtn);
	}
	else
	{
		buttons.appendChild(resetBtn);
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

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get('editGeometry'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
	div.appendChild(hd);

	// Helper to create an inline field with label and input
	function createInlineField(labelText, value)
	{
		var field = document.createElement('div');
		field.className = 'geDialogInlineField';

		var lbl = document.createElement('label');
		mxUtils.write(lbl, labelText);
		field.appendChild(lbl);

		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.value = (value != null) ? value : '';
		field.appendChild(input);

		field.input = input;

		return field;
	}

	// Position section
	var posSection = document.createElement('div');
	posSection.className = 'geDialogSection';

	var relRow = document.createElement('div');
	relRow.className = 'geDialogCheckRow';

	var relInput = document.createElement('input');
	relInput.setAttribute('type', 'checkbox');
	relInput.setAttribute('id', 'geEditGeoRelative');

	if (geo != null && geo.relative)
	{
		relInput.setAttribute('checked', 'checked');
		relInput.defaultChecked = true;
	}

	relRow.appendChild(relInput);

	var relLabel = document.createElement('label');
	relLabel.setAttribute('for', 'geEditGeoRelative');
	mxUtils.write(relLabel, mxResources.get('relative'));
	relRow.appendChild(relLabel);

	posSection.appendChild(relRow);

	// Left + Top
	var xyRow = document.createElement('div');
	xyRow.className = 'geDialogInlineFields';

	var xField = createInlineField(mxResources.get('left'),
		(geo != null) ? geo.x : null);
	var xInput = xField.input;
	xyRow.appendChild(xField);

	var yField = createInlineField(mxResources.get('top'),
		(geo != null) ? geo.y : null);
	var yInput = yField.input;
	xyRow.appendChild(yField);

	posSection.appendChild(xyRow);

	// DX + DY
	var dxyRow = document.createElement('div');
	dxyRow.className = 'geDialogInlineFields';
	dxyRow.style.marginTop = '6px';

	var dxField = createInlineField(mxResources.get('dx'),
		(geo != null && geo.offset != null) ? geo.offset.x : null);
	var dxInput = dxField.input;
	dxyRow.appendChild(dxField);

	var dyField = createInlineField(mxResources.get('dy'),
		(geo != null && geo.offset != null) ? geo.offset.y : null);
	var dyInput = dyField.input;
	dxyRow.appendChild(dyField);

	posSection.appendChild(dxyRow);
	div.appendChild(posSection);

	// Size section
	var sizeSection = document.createElement('div');
	sizeSection.className = 'geDialogSection';

	var whRow = document.createElement('div');
	whRow.className = 'geDialogInlineFields';

	var wField = createInlineField(mxResources.get('width'),
		(geo != null) ? geo.width : null);
	var wInput = wField.input;
	whRow.appendChild(wField);

	var hField = createInlineField(mxResources.get('height'),
		(geo != null) ? geo.height : null);
	var hInput = hField.input;
	whRow.appendChild(hField);

	sizeSection.appendChild(whRow);
	div.appendChild(sizeSection);

	// Rotation section
	var rotSection = document.createElement('div');
	rotSection.className = 'geDialogSection';

	var rotRow = document.createElement('div');
	rotRow.className = 'geDialogFormRow';

	var rotLabel = document.createElement('span');
	rotLabel.className = 'geDialogFormLabel';
	mxUtils.write(rotLabel, mxResources.get('rotation') + ':');
	rotRow.appendChild(rotLabel);

	var rotInput = document.createElement('input');
	rotInput.setAttribute('type', 'text');
	rotInput.value = (vertices.length == 1) ? mxUtils.getValue(graph.getCellStyle(vertices[0]),
			mxConstants.STYLE_ROTATION, 0) : '';
	rotRow.appendChild(rotInput);

	rotSection.appendChild(rotRow);
	div.appendChild(rotSection);

	this.init = function()
	{
		xInput.focus();
		xInput.select();
	};

	var applyFn = function()
	{
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
	};

	var dlg = new CustomDialog(editorUi, div, applyFn, null,
		mxResources.get('apply'));
	this.container = dlg.container;

	mxEvent.addListener(this.container, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			applyFn();
			editorUi.hideDialog();
		}
	});
};

/**
 * Constructs a new dialog for creating files from templates.
 */
var LibraryDialog = function(editorUi, name, library, initialImages, file, mode, allowBrowser)
{
	var images = [];
	var graph = editorUi.editor.graph;
	var outer = document.createElement('div');
	outer.style.height = '100%';
	outer.style.display = 'flex';
	outer.style.flexDirection = 'column';

	// Filename section
	var nameSection = document.createElement('div');
	nameSection.className = 'geDialogSection';
	nameSection.style.flexShrink = '0';

	var nameRow = document.createElement('div');
	nameRow.className = 'geDialogFormRow';

	var nameLabel = document.createElement('span');
	nameLabel.className = 'geDialogFormLabel';
	mxUtils.write(nameLabel, mxResources.get('filename') + ':');
	nameRow.appendChild(nameLabel);

	var nameValue = name;

	if (nameValue == null)
	{
		nameValue = editorUi.defaultLibraryName + '.xml';
	}

	var nameInput = document.createElement('input');
	nameInput.setAttribute('type', 'text');
	nameInput.setAttribute('value', nameValue);

	if (file != null && !file.isRenamable())
	{
		nameInput.setAttribute('disabled', 'true');
	}

	nameRow.appendChild(nameInput);
	nameSection.appendChild(nameRow);

	if (Editor.enableUncompressedLibraries)
	{
		var compressedRow = document.createElement('div');
		compressedRow.className = 'geDialogCheckRow';

		var compressedInput = document.createElement('input');
		compressedInput.setAttribute('type', 'checkbox');
		compressedInput.setAttribute('id', 'geLibCompressed');
		compressedRow.appendChild(compressedInput);

		var compressedLabel = document.createElement('label');
		compressedLabel.setAttribute('for', 'geLibCompressed');
		mxUtils.write(compressedLabel, mxResources.get('compressed'));
		compressedRow.appendChild(compressedLabel);

		nameSection.appendChild(compressedRow);
	}

	outer.appendChild(nameSection);

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

	// Content area for images
	var div = document.createElement('div');
	div.style.border = 'light-dark(1px solid rgba(0, 0, 0, 0.15), 1px solid rgba(255, 255, 255, 0.15))';
	div.style.borderRadius = '8px';
	div.style.marginTop = '10px';
	div.style.overflow = 'auto';
	div.style.flex = '1';
	div.style.minHeight = '0';
	div.style.backgroundPosition = 'center center';
	div.style.backgroundRepeat = 'no-repeat';

	if (images.length == 0 && Graph.fileSupport)
	{
		div.style.backgroundImage = 'url(\'' + IMAGE_PATH + '/droptarget.png\')';
	}

	var bg = document.createElement('div');
	bg.style.position = 'absolute';
	bg.style.left = '0';
	bg.style.right = '0';
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
					wrapper.style.padding = '0 12px';
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
						var cells = editorUi.stringToCells((img.xml.charAt(0) == '<') ?
							img.xml : Graph.decompress(img.xml));
						
						if (cells.length > 0)
						{
							editorUi.sidebar.createThumb(cells, ew, eh, wrapper, null,
								true, false, null, null, graph.shapeBackgroundColor);
							
							// Needs inline block on SVG for delete icon to appear on same line
							wrapper.firstChild.style.display = 'inline-block';
							wrapper.firstChild.style.cursor = '';
						}
					}
					
					var rem = document.createElement('img');
					rem.setAttribute('src', Editor.closeBlackImage);
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
					label.style.backgroundColor = 'light-dark(#ffffff, transparent)';
					label.style.overflow = 'hidden';
					label.style.textAlign = 'center';
					label.setAttribute('title', mxResources.get('rename'));
					
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
						label.innerText = '';
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
									label.innerText = '';
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
									entry.title = mxUtils.getTextContent(label);
									updateLabel();
								}
						
								mxEvent.consume(evt);
							}
						}
						else
						{
							var dlg = new FilenameDialog(editorUi, entry.title || '',
								mxResources.get('ok'), function(newTitle)
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
						if (stopEditing != null)
						{
							return;
						}

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
							var xml = Editor.getDiagramNodeXml(pages[i]);
							var cells = editorUi.stringToCells(xml);

							if (cells.length > 0)
							{
								var size = editorUi.editor.graph.getBoundingBoxFromGeometry(cells);

								if (size != null)
								{
									addButton(null, null, 0, 0, 0, 0, {xml: xml, w: size.width, h: size.height});
								}
							}
						}
						
						done = true;
					}
				}
				catch (e)
				{
					if (window.console != null)
					{
						console.error('Error in library dialog: ' + e);
					}
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
			if (window.console != null)
			{
				console.log('Error in library dialog: ' + e);
			}
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
			if (file != null && EditorUi.isVisioFilename(file.name))
			{
				editorUi.importVisio(file, mxUtils.bind(this, function(xml)
				{
		    		addButton(xml, mimeType, x, y, w, h, img, 'fixed', (mxEvent.isAltDown(evt)) ?
		    			null : img.substring(0, img.lastIndexOf('.')).replace(/_/g, ' '));
				}));
			}
			else if (file != null && new XMLHttpRequest().upload && editorUi.isRemoteFileFormat(data, file.name))
			{
				if (editorUi.isExternalDataComms())
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
					editorUi.spinner.stop();
					editorUi.showError(mxResources.get('error'), mxResources.get('notInOffline'));
				}
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
	btns.style.marginTop = '14px';
	btns.style.flexShrink = '0';

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
		// Limits button to libraries which are known to have public URLs
		(file.constructor == DriveLibrary || file.constructor == GitHubLibrary))
	{
		var btn = mxUtils.button(mxResources.get('link'), function()
		{
			editorUi.getPublicUrl(file, function(url)
			{
				if (url != null)
				{
					var search = editorUi.getSearch(['create', 'title', 'mode', 'url', 'drive', 'splash', 'state', 'clibs', 'ui']);
					search += ((search.length == 0) ? '?' : '&') + 'splash=0&clibs=U' + encodeURIComponent(url);
					var dlg = new EmbedDialog(editorUi, window.location.protocol + '//' +
						window.location.host + '/' + search, null, null, null, null,
						'Check out the library I made using @drawio');
					editorUi.showDialog(dlg.container, 450, 270, true, true, null,
						false, null, new mxRectangle(0, 0, 400, 250));
					dlg.init();
				}
				else if (file.constructor == DriveLibrary)
				{
					editorUi.showError(mxResources.get('error'), mxResources.get('diagramIsNotPublic'),
						mxResources.get('share'), mxUtils.bind(this, function()
						{
							editorUi.drive.showPermissions(file.getId(), file);
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
			editorUi.saveLocalFile(data, filename, 'text/xml', null, null, allowBrowser != null? allowBrowser : true, null, 'xml');
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

	var btn = mxUtils.button(mxResources.get('save'), mxUtils.bind(this, function()
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
var EditShapeDialog = function(editorUi, cell, title)
{
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.left = '30px';
	div.style.right = '30px';
	div.style.top = '30px';
	div.style.bottom = '30px';

	var titleDiv = document.createElement('div');
	titleDiv.style.position = 'absolute';
	titleDiv.style.top = '0px';
	mxUtils.write(titleDiv, title);
	div.appendChild(titleDiv);

	var contentDiv = document.createElement('div');
	contentDiv.style.position = 'absolute';
	contentDiv.style.width = '100%';
	contentDiv.style.display = 'flex';
	contentDiv.style.alignItems = 'stretch';
	contentDiv.style.top = '24px';
	contentDiv.style.bottom = '50px';

	var textarea = document.createElement('textarea');
	textarea.style.outline = 'none';
	textarea.style.resize = 'horizontal';
	textarea.style.width = '430px';
	textarea.style.maxWidth = 'calc(100% - 100px)';
	textarea.style.flexShrink = '0';
	textarea.style.borderRadius = '4px';
	textarea.style.marginRight = '4px';
	contentDiv.appendChild(textarea);

	var previewDiv = document.createElement('div');
	previewDiv.style.borderWidth = '1px';
	previewDiv.style.borderStyle = 'solid';
	previewDiv.style.padding = '20px';
	previewDiv.style.flexGrow = '1';
	previewDiv.style.borderRadius = '4px';
	mxEvent.disableContextMenu(previewDiv);
	contentDiv.appendChild(previewDiv);

	var graph = new Graph(previewDiv);
	graph.setEnabled(false);

	var clone = editorUi.editor.graph.cloneCell(cell);
	graph.addCells([clone]);
	
	var state = graph.view.getState(clone);
	var stencil = '';
	
	if (state.shape != null && state.shape.stencil != null)
	{
		stencil = mxUtils.getPrettyXml(state.shape.stencil.desc);
	}
	
	mxUtils.write(textarea, stencil || '');
	div.appendChild(contentDiv);

	var btns = document.createElement('div');
	btns.style.position = 'absolute';
	btns.style.display = 'flex';
	btns.style.alignItems = 'center';
	btns.style.justifyContent = 'end';
	btns.style.bottom = '6px';
	btns.style.height = '30px';
	btns.style.width = '100%';
	
	if (!editorUi.isOffline())
	{
		btns.appendChild(editorUi.createHelpIcon(
			'https://www.drawio.com/doc/faq/shape-complex-create-edit'));
	}
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	var updateShape = function(targetGraph, targetCell, hide)
	{
		var newValue = textarea.value;
		
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
		graph.fit();
	});
	
	previewBtn.className = 'geBtn';	
	btns.appendChild(previewBtn);
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		updateShape(editorUi.editor.graph, cell, true);
	});
	
	applyBtn.className = 'geBtn gePrimaryBtn';	
	btns.appendChild(applyBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.init = function()
	{
		textarea.focus();
		textarea.scrollTop = 0;
		graph.fit();
		previewDiv.style.overflow = 'auto';
		graph.fit();
	};

	this.container = div;
};

var CustomDialog = function(editorUi, content, okFn, cancelFn, okButtonText, helpLink,
		buttonsContent, hideCancel, cancelButtonText, hideAfterOKFn, customButtons,
		marginTop)
{
	// Flex column so the footer buttons stay pinned at the bottom and the
	// content area scrolls if the dialog is capped by viewport max-height.
	var div = document.createElement('div');
	div.style.display = 'flex';
	div.style.flexDirection = 'column';
	div.style.minHeight = '0';
	div.style.paddingBottom = '10px';

	var scrollWrapper = document.createElement('div');
	scrollWrapper.style.flex = '1 1 auto';
	scrollWrapper.style.minHeight = '0';
	scrollWrapper.style.overflowY = 'auto';
	scrollWrapper.appendChild(content);
	div.appendChild(scrollWrapper);

	var btns = document.createElement('div');
	btns.style.flex = '0 0 auto';
	btns.style.marginTop = (marginTop != null) ? marginTop : '34px';
	btns.style.textAlign = 'right';
	
	// Help icon first so it sits leftmost in the button row, before any
	// caller-supplied buttons (e.g. Reset) — same position as in the
	// dialogs that assemble their button row by hand.
	if (!editorUi.isOffline() && helpLink != null)
	{
		btns.appendChild(editorUi.createHelpIcon(helpLink));
	}

	if (buttonsContent != null)
	{
		btns.appendChild(buttonsContent);
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

	if (customButtons != null)
	{
		for (var i = 0; i < customButtons.length; i++)
		{
			(function(label, fn, title)
			{
				var customBtn = mxUtils.button(label, function(e)
				{
					fn(e);
				});

				if (title != null)
				{
					customBtn.setAttribute('title', title);
				}

				customBtn.className = 'geBtn';
				btns.appendChild(customBtn);
			})(customButtons[i][0], customButtons[i][1], customButtons[i][2]);
		}
	}
	
	div.appendChild(btns);

	this.cancelBtn = cancelBtn;
	this.okButton = okBtn;
	this.container = div;
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
	var div = document.createElement('div');

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get('font'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
	div.appendChild(hd);

	function addFormRow(section, labelText, input)
	{
		var row = document.createElement('div');
		row.className = 'geDialogFormRow';
		row.style.paddingLeft = '24px';

		var lbl = document.createElement('span');
		lbl.className = 'geDialogFormLabel';
		mxUtils.write(lbl, labelText + ':');
		row.appendChild(lbl);

		row.appendChild(input);
		section.appendChild(row);

		return row;
	};

	// System fonts section
	var sysSection = document.createElement('div');
	sysSection.className = 'geDialogSection';

	var sysFontRadio = editorUi.addCheckbox(sysSection,
		mxResources.get('sysFonts', null, 'System Fonts'),
		false, null, null, null, true, 'current-fontdialog', true);

	var sysFontInput = document.createElement('input');
	sysFontInput.setAttribute('type', 'text');

	if (curType == 's')
	{
		sysFontInput.setAttribute('value', curFontname);
	}

	sysFontInput.className = 'dlg_fontName_s';

	var datalist = null;

	if (Editor.localFonts != null)
	{
		datalist = document.createElement('datalist');
		datalist.id = 'fontdialog-localfonts';

		for (var i = 0; i < Editor.localFonts.length; i++)
		{
			var option = document.createElement('option');
			option.value = Editor.localFonts[i];
			datalist.appendChild(option);
		}

		sysFontInput.setAttribute('list', 'fontdialog-localfonts');
	}

	var sysFontRow = addFormRow(sysSection,
		mxResources.get('fontname', null, 'Font Name'), sysFontInput);

	if (datalist != null)
	{
		sysFontRow.appendChild(datalist);
	}

	div.appendChild(sysSection);

	// Google fonts section
	var googleSection = document.createElement('div');
	googleSection.className = 'geDialogSection';

	var googleFontRadio = editorUi.addCheckbox(googleSection,
		mxResources.get('googleFonts', null, 'Google Fonts'),
		false, null, null, null, true, 'current-fontdialog', true);

	if (!editorUi.isOffline() || EditorUi.isElectronApp)
	{
		googleFontRadio.checkRow.appendChild(
			editorUi.createHelpIcon('https://fonts.google.com/'));
	}

	var googleFontInput = document.createElement('input');
	googleFontInput.setAttribute('type', 'text');

	if (curType == 'g')
	{
		googleFontInput.setAttribute('value', curFontname);
	}

	googleFontInput.className = 'dlg_fontName_g';
	addFormRow(googleSection,
		mxResources.get('fontname', null, 'Font Name'), googleFontInput);

	if (urlParams['isGoogleFontsEnabled'] != '0')
	{
		div.appendChild(googleSection);
	}

	// Web fonts section
	var webSection = document.createElement('div');
	webSection.className = 'geDialogSection';

	var webFontRadio = editorUi.addCheckbox(webSection,
		mxResources.get('webfonts', null, 'Web Fonts'),
		false, null, null, null, true, 'current-fontdialog', true);

	var webFontInput = document.createElement('input');
	webFontInput.setAttribute('type', 'text');

	if (curType == 'w')
	{
		if (Editor.enableWebFonts)
		{
			webFontInput.setAttribute('value', curFontname);
		}
		else
		{
			sysFontInput.setAttribute('value', curFontname);
		}
	}

	webFontInput.className = 'dlg_fontName_w';
	addFormRow(webSection,
		mxResources.get('fontname', null, 'Font Name'), webFontInput);

	var webFontUrlInput = document.createElement('input');
	webFontUrlInput.setAttribute('type', 'text');
	webFontUrlInput.setAttribute('value', curUrl || '');
	webFontUrlInput.className = 'dlg_fontUrl';
	addFormRow(webSection,
		mxResources.get('fontUrl', null, 'Font URL'), webFontUrlInput);

	if (Editor.enableWebFonts)
	{
		div.appendChild(webSection);
	}

	this.init = function()
	{
		var input = sysFontInput;

		if (curType == 'g')
		{
			input = googleFontInput;
		}
		else if (curType == 'w' && Editor.enableWebFonts)
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

	function validateFn(fontName, fontUrl, type)
	{
		var urlPattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		var elt = div.querySelector('.dlg_fontName_' + type);

		if (elt != null && (fontName == null || fontName.length == 0))
		{
			elt.style.border = '1px solid red';
			return false;
		}

		elt = div.querySelector('.dlg_fontUrl');

		if (elt != null && type == 'w' && !urlPattern.test(fontUrl))
		{
			elt.style.border = '1px solid red';
			return false;
		}

		return true;
	};

	// Manual button row matches CustomDialog spacing (34px top, 10px padding-bottom)
	div.style.paddingBottom = '10px';

	var btns = document.createElement('div');
	btns.style.marginTop = '34px';
	btns.style.textAlign = 'right';
	btns.style.whiteSpace = 'nowrap';

	if (!editorUi.isOffline())
	{
		btns.appendChild(editorUi.createHelpIcon(
			'https://www.drawio.com/blog/external-fonts'));
	}

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		fn();
	});
	cancelBtn.className = 'geBtn';

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

	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
		btns.appendChild(okBtn);
	}
	else
	{
		btns.appendChild(okBtn);
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
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

AspectDialog.prototype.createViewer = function(container, pageNode, layerId, defaultBackground)
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
			bg = (defaultBackground != null) ? defaultBackground : '#ffffff';
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
		this.layersContainer.innerText = '';
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
			
			if (mxUtils.isEmptyObject(this.selectedLayers))
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
var FilePropertiesDialog = function(editorUi, publicLink)
{
	var div = document.createElement('div');

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get('properties'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
	div.appendChild(hd);

	var file = editorUi.getCurrentFile();
	var filename = (file != null && file.getTitle() != null) ?
		file.getTitle() : editorUi.defaultFilename;
	var isPng = /(\.png)$/i.test(filename);
	var isSvg = /(\.svg)$/i.test(filename);
	var apply = function(success, error)
	{
		success();
	};

	function addApply(fn)
	{
		var prevApply = apply;

		apply = function(success, error)
		{
			try
			{
				fn(function()
				{
					prevApply(success, error);
				}, error);
			}
			catch (e)
			{
				error(e);
			}
		};
	};

	function addFormRow(section, labelText, input)
	{
		var row = document.createElement('div');
		row.className = 'geDialogFormRow';

		var lbl = document.createElement('span');
		lbl.className = 'geDialogFormLabel';
		mxUtils.write(lbl, labelText + ':');
		row.appendChild(lbl);

		row.appendChild(input);
		section.appendChild(row);

		return row;
	};

	var initialLocked = (file != null) ? file.isLocked() : false;

	// Settings section: editable toggles and inputs
	var settingsSection = document.createElement('div');
	settingsSection.className = 'geDialogSection';

	var lockedInput = editorUi.addCheckbox(settingsSection, mxResources.get('locked'),
		initialLocked, null, null, null, null, null, true);

	this.init = function()
	{
		lockedInput.focus();
	};

	addApply(function(success, error)
	{
		if (editorUi.fileNode != null && initialLocked != lockedInput.checked)
		{
			window.setTimeout(function()
			{
				if (file != null)
				{
					file.setLocked(lockedInput.checked);
				}

				success();
			}, 0);
		}
		else
		{
			success();
		}
	});

	if (isPng || isSvg)
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

		var zoomInput = document.createElement('input');
		zoomInput.setAttribute('type', 'text');
		zoomInput.setAttribute('value', (scale * 100) + '%');
		addFormRow(settingsSection, mxResources.get('zoom'), zoomInput);

		var borderInput = document.createElement('input');
		borderInput.setAttribute('type', 'text');
		borderInput.setAttribute('value', border);
		addFormRow(settingsSection, mxResources.get('borderWidth'), borderInput);

		this.init = this.init || function()
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

		addApply(function(success, error)
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

			success();
		});
	}
	else if (!/(\.html)$/i.test(filename) &&
		!/(\.svg)$/i.test(filename))
	{
		var initialCompressed = (file != null) ? file.isCompressed() : Editor.defaultCompressed;

		var compressedInput = editorUi.addCheckbox(settingsSection, mxResources.get('compressed'),
			initialCompressed, null, null, null, null, null, true);

		this.init = this.init || function()
		{
			compressedInput.focus();
		};

		addApply(function(success, error)
		{
			if (editorUi.fileNode != null && initialCompressed != compressedInput.checked)
			{
				window.setTimeout(function()
				{
					editorUi.fileNode.setAttribute('compressed',
						(compressedInput.checked) ? 'true' : 'false');

					if (file != null)
					{
						file.compressionChanged(compressedInput.checked);
						file.fileChanged();
					}

					success();
				}, 0);
			}
			else
			{
				success();
			}
		});
	}

	if (file != null && file.isRealtimeOptional())
	{
		var collab = editorUi.drive.getCustomProperty(file.desc, 'collaboration');
		var initialCollab = collab != 'disabled';

		var collabInput = editorUi.addCheckbox(settingsSection, mxResources.get('realtimeCollaboration'),
			initialCollab, null, null, null, null, null, true);
		collabInput.checkRow.appendChild(editorUi.menus.createHelpLink(
			'https://www.drawio.com/docs/manual/collaboration/concurrent-editing/#disable-real-time-collaboration'));

		addApply(function(success, error)
		{
			if (collabInput.checked != initialCollab)
			{
				file.setRealtimeEnabled(collabInput.checked, success, error);
			}
			else
			{
				success();
			}
		});

		this.init = (this.init != null) ? this.init : function()
		{
			collabInput.focus();
		};
	}

	div.appendChild(settingsSection);

	// Info section: read-only fields
	var infoSection = document.createElement('div');
	infoSection.className = 'geDialogSection';
	var infoSectionUsed = false;

	if (file != null && editorUi.getServiceName() == 'draw.io' &&
		file.getSize() > 0 && urlParams['embed'] != '1')
	{
		var temp = editorUi.formatFileSize(file.getSize());

		var sizeInput = document.createElement('input');
		sizeInput.setAttribute('type', 'text');
		sizeInput.setAttribute('title', temp);
		sizeInput.setAttribute('value', temp);
		sizeInput.setAttribute('disabled', 'disabled');
		addFormRow(infoSection, mxResources.get('size'), sizeInput);
		infoSectionUsed = true;
	}

	if (file != null && file.fileObject != null &&
		file.fileObject.path != null)
	{
		var pathInput = document.createElement('input');
		pathInput.setAttribute('type', 'text');
		pathInput.setAttribute('title', file.fileObject.path);
		pathInput.setAttribute('value', file.fileObject.path);
		pathInput.setAttribute('disabled', 'disabled');
		addFormRow(infoSection, mxResources.get('pathFilename'), pathInput);
		infoSectionUsed = true;
	}

	if (publicLink != null)
	{
		var a = document.createElement('a');
		a.setAttribute('href', publicLink);
		a.setAttribute('title', publicLink);
		a.style.flex = '1';
		a.style.minWidth = '0';
		a.style.whiteSpace = 'nowrap';
		a.style.overflow = 'hidden';
		a.style.textOverflow = 'ellipsis';
		mxUtils.write(a, publicLink);

		mxEvent.addListener(a, 'click', function(evt)
		{
			editorUi.openLink(publicLink);
			mxEvent.consume(evt);
		});

		addFormRow(infoSection, mxResources.get('publicDiagramUrl'), a);
		infoSectionUsed = true;
	}

	if (infoSectionUsed)
	{
		div.appendChild(infoSection);
	}

	this.init = (this.init != null) ? this.init : function() { };

	// Manual button row matches CustomDialog spacing (34px top, 10px padding-bottom)
	div.style.paddingBottom = '10px';

	var btns = document.createElement('div');
	btns.style.marginTop = '34px';
	btns.style.textAlign = 'right';
	btns.style.whiteSpace = 'nowrap';

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';

	var genericBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		if (editorUi.spinner.spin(document.body, mxResources.get('updatingDocument')))
		{
			apply(function()
			{
				editorUi.spinner.stop();
				editorUi.hideDialog();
			}, function(e)
			{
				editorUi.spinner.stop();
				editorUi.handleError(e, mxResources.get('error'));
			});
		}
	});
	genericBtn.className = 'geBtn gePrimaryBtn';

	var varsBtn = null;

	if (editorUi.fileNode != null)
	{
		varsBtn = mxUtils.button(mxResources.get('editData') + '...', function()
		{
			editorUi.hideDialog();

			// Parse current vars from fileNode
			var vars = {};

			try
			{
				var varsStr = editorUi.fileNode.getAttribute('vars');

				if (varsStr != null && varsStr.length > 0)
				{
					vars = JSON.parse(varsStr);
				}
			}
			catch (e) {}

			// Create temp XML node with vars as attributes
			var doc = mxUtils.createXmlDocument();
			var obj = doc.createElement('object');
			obj.setAttribute('label', '');

			for (var key in vars)
			{
				obj.setAttribute(key, vars[key]);
			}

			// Use a temporary graph so EditDataDialog operates on
			// its own model instead of overriding setValue on the
			// real graph model.
			var tempGraph = editorUi.createTemporaryGraph(
				editorUi.editor.graph.getStylesheet());
			var tempCell = new mxCell(obj);
			tempGraph.getModel().add(tempGraph.getDefaultParent(), tempCell);

			tempGraph.getModel().addListener(mxEvent.CHANGE, function(sender, evt)
			{
				var changes = evt.getProperty('edit').changes;

				for (var i = 0; i < changes.length; i++)
				{
					if (changes[i] instanceof mxValueChange &&
						changes[i].cell === tempCell)
					{
						var value = changes[i].value;
						var newVars = {};
						var attrs = value.attributes;

						for (var j = 0; j < attrs.length; j++)
						{
							if (attrs[j].nodeName != 'label')
							{
								newVars[attrs[j].nodeName] = attrs[j].nodeValue;
							}
						}

						var json = JSON.stringify(newVars);

						if (json == '{}')
						{
							editorUi.fileNode.removeAttribute('vars');
						}
						else
						{
							editorUi.fileNode.setAttribute('vars', json);
						}

						editorUi.updateFileVars();
						editorUi.editor.graph.refresh();

						var currentFile = editorUi.getCurrentFile();

						if (currentFile != null)
						{
							currentFile.fileChanged();
						}
					}
				}
			});

			// Open EditDataDialog with temp graph
			var dlg = new EditDataDialog(editorUi, tempCell, tempGraph);
			editorUi.showDialog(dlg.container, 480, 420, true, false, null,
				false, null, new mxRectangle(0, 0, 440, 220));
			dlg.init();
		});

		varsBtn.className = 'geBtn';
	}

	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);

		if (varsBtn != null)
		{
			btns.appendChild(varsBtn);
		}

		btns.appendChild(genericBtn);
	}
	else
	{
		if (varsBtn != null)
		{
			btns.appendChild(varsBtn);
		}

		btns.appendChild(genericBtn);
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};

var ConnectionPointsDialog = function(editorUi, cell)
{
	var CP_SIZE = 6, CP_HLF_SIZE = 3;
	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.display = 'flex';
	div.style.flexDirection = 'column';
	div.style.height = '100%';
	var keyHandler = null;
	var resizeObserver = null;

	this.init = function()
	{
		var graphDiv = document.createElement('div');
		graphDiv.style.flex = '1';
		graphDiv.style.minHeight = '0';
		graphDiv.style.overflow = 'hidden';
		graphDiv.style.borderStyle = 'solid';
		graphDiv.style.borderWidth = '1px';
		graphDiv.style.boxSizing = 'border-box';
		mxEvent.disableContextMenu(graphDiv);
		div.appendChild(graphDiv);

		var editingGraph = new Graph(graphDiv);
		editingGraph.transparentBackground = false;
		editingGraph.autoExtend = false;
		editingGraph.autoScroll = false;
		editingGraph.setGridEnabled(false);
		editingGraph.setEnabled(true);
		editingGraph.setPanning(true);
		editingGraph.setConnectable(false);
		editingGraph.setTooltips(false);
		editingGraph.minFitScale = null;
		editingGraph.maxFitScale = null;
		editingGraph.centerZoom = true;
		editingGraph.maxFitScale = 2;

		function createCPoint(x, y, constObj)
		{
			var cPointStyle = 'shape=image;points=[];rotatable=0;resizable=0;connectable=0;editable=0;image=' +
				editorUi.convertDataUri(mxConstraintHandler.prototype.pointImage.src) + ';';
			var cPoint = new mxCell('', new mxGeometry(x, y, CP_SIZE, CP_SIZE), cPointStyle);
			cPoint.vertex = true;
			cPoint.cp = true;
			cPoint.constObj = constObj;

			return editingGraph.addCell(cPoint);
		};
	
		// Add cell and current connection points on it
		var geo = cell.geometry;
		var mainCell = new mxCell(cell.value, new mxGeometry(0, 0, geo.width, geo.height),
			cell.style + ';rotatable=0;resizable=0;connectable=0;editable=0;movable=0;opacity=50;');
		mainCell.vertex = true;
		editingGraph.addCell(mainCell);

		// Adding a point via double click
		editingGraph.dblClick = function(evt, cell)
		{
			if (cell != null && cell != mainCell)
			{
				editingGraph.setSelectionCell(cell);
			}
			else
			{
				var pt = mxUtils.convertPoint(editingGraph.container, mxEvent.getClientX(evt), mxEvent.getClientY(evt));
				mxEvent.consume(evt);
				var scale = editingGraph.view.scale;
				var tr = editingGraph.view.translate;
				editingGraph.setSelectionCell(createCPoint((pt.x - CP_HLF_SIZE * scale) / scale - tr.x,
					(pt.y - CP_HLF_SIZE * scale) / scale - tr.y));
			}
		}

		keyHandler = new mxKeyHandler(editingGraph);
		
		function removeCPoints(evt)
		{
			var cells = editingGraph.getSelectionCells();
			editingGraph.deleteCells(cells);
		};

		keyHandler.bindKey(46, removeCPoints);
		keyHandler.bindKey(8, removeCPoints);

		// Force rubberband inside the cell
		editingGraph.getRubberband().isForceRubberbandEvent = function(event)
		{
			// Left click and not a click on a connection point
			return event.evt.button == 0 &&
				(event.getCell() == null ||
				event.getCell() == mainCell);
		};
		// Force panning inside the cell
		editingGraph.panningHandler.isForcePanningEvent = function(event)
		{
			return event.evt.button == 2;
		};

		var origIsCellSelectable = editingGraph.isCellSelectable;
		editingGraph.isCellSelectable = function(cell)
		{
			if (cell == mainCell)
			{
				return false;
			}
			else
			{
				return origIsCellSelectable.apply(this, arguments);
			}
		};

		// Disables hyperlinks
		editingGraph.getLinkForCell = function()
		{
			return null;
		};

		var state = editingGraph.view.getState(mainCell);
		var constraints = editingGraph.getAllConnectionConstraints(state);
		
		for (var i = 0; constraints != null && i < constraints.length; i++)
		{
			var cp = editingGraph.getConnectionPoint(state, constraints[i]);
			createCPoint(cp.x - CP_HLF_SIZE, cp.y - CP_HLF_SIZE, constraints[i]);
		}

		var zoomInBtn = editorUi.createToolbarButton(Editor.zoomInImage,
			mxResources.get('zoomIn'), function()
		{
			editingGraph.zoomIn();
		});
	
		var zoomOutBtn = editorUi.createToolbarButton(Editor.zoomOutImage,
			mxResources.get('zoomOut'), function()
		{
			editingGraph.zoomOut();
		});
	
		var zoomFitBtn = editorUi.createToolbarButton(Editor.zoomFitImage,
			mxResources.get('fit'), function()
		{
			if (editingGraph.view.scale == 1)
			{
				editingGraph.maxFitScale = 8;
				editingGraph.fit(8);
			}
			else
			{
				editingGraph.zoomActual();
			}

			editingGraph.center();
		});

		var changeGridSize = function()
		{
			editorUi.prompt(mxResources.get('gridSize'), editingGraph.gridSize, function(newValue)
			{
				if (!isNaN(newValue) && newValue > 0)
				{
					editingGraph.setGridSize(newValue);
					editingGraph.setGridEnabled(true);
					editingGraph.refresh();
				}
			});
		};

		var gridBtn = editorUi.createToolbarButton(Editor.thinGridImage,
			mxResources.get('grid'), function(evt)
		{
			if (mxEvent.isShiftDown(evt))
			{
				changeGridSize();
			}
			else
			{
				editingGraph.setGridEnabled(!editingGraph.isGridEnabled());
				editingGraph.refresh();
			}
		});

		mxEvent.addListener(gridBtn, 'dblclick', changeGridSize);

		var deleteBtn = editorUi.createToolbarButton(Editor.trashImage,
			mxResources.get('delete'), removeCPoints);
		mxUtils.setOpacity(deleteBtn, 10); //Disabled
		
		var zoomBtns = document.createElement('div');
		zoomBtns.style.display = 'flex';
		zoomBtns.style.flexShrink = '0';
		zoomBtns.style.alignItems = 'center';
		zoomBtns.style.paddingTop = '6px';

		zoomBtns.appendChild(zoomInBtn);
		zoomBtns.appendChild(zoomOutBtn);
		zoomBtns.appendChild(zoomFitBtn);
		zoomBtns.appendChild(gridBtn);
		zoomBtns.appendChild(deleteBtn);

		div.appendChild(zoomBtns);

		var pCount = document.createElement('input');
		pCount.setAttribute('type', 'number');
		pCount.setAttribute('min', '1');
		pCount.setAttribute('value', '1');
		pCount.style.width = '45px';
		pCount.style.position = 'relative';
		pCount.style.margin = '0 4px 0 4px';

		var sideSelect = document.createElement('select');
		sideSelect.style.position = 'relative';
		var sides = ['left', 'right', 'top', 'bottom'];

		for (var i = 0; i < sides.length; i++)
		{
			var side = sides[i];
			var option = document.createElement('option');
			mxUtils.write(option, mxResources.get(side));
			option.value = side;
			sideSelect.appendChild(option);
		}

		var addBtn = mxUtils.button(mxResources.get('add'), function()
		{
			var count = parseInt(pCount.value);
			count = count < 1? 1 : (count > 100? 100 : count);
			pCount.value = count;
			var side = sideSelect.value;
			var geo = mainCell.geometry;
			var cells = [];

			for (var i = 0; i < count; i++)
			{
				var x, y;

				switch(side)
				{
					case 'left':
						x = geo.x;
						y = geo.y + (i + 1) * geo.height / (count + 1);
						break;
					case 'right':
						x = geo.x + geo.width;
						y = geo.y + (i + 1) * geo.height / (count + 1);
						break;
					case 'top':
						x = geo.x + (i + 1) * geo.width / (count + 1);
						y = geo.y;
						break;
					case 'bottom':
						x = geo.x + (i + 1) * geo.width / (count + 1);
						y = geo.y + geo.height;
						break;
				}

				cells.push(createCPoint(x - CP_HLF_SIZE, y - CP_HLF_SIZE));
			}

			editingGraph.setSelectionCells(cells);
		});

		addBtn.style.marginLeft = 'auto';
		zoomBtns.appendChild(addBtn);
		zoomBtns.appendChild(pCount);
		zoomBtns.appendChild(sideSelect);
		
		//Point properties
		var pointPropsDiv = document.createElement('div');
		pointPropsDiv.style.flexShrink = '0';
		pointPropsDiv.style.margin = '4px 0px 8px 0px';
		pointPropsDiv.style.whiteSpace = 'nowrap';
		pointPropsDiv.style.height = '24px';
		var xSpan = document.createElement('span');
		mxUtils.write(xSpan, mxResources.get('dx'));
		pointPropsDiv.appendChild(xSpan);
		var xInput = document.createElement('input');
		xInput.setAttribute('type', 'number');
		xInput.setAttribute('min', '0');
		xInput.setAttribute('max', '100');
		xInput.style.width = '45px';
		xInput.style.margin = '0 4px 0 4px';
		pointPropsDiv.appendChild(xInput);
		mxUtils.write(pointPropsDiv, '%');

		var dxInput = document.createElement('input');
		dxInput.setAttribute('type', 'number');
		dxInput.style.width = '45px';
		dxInput.style.margin = '0 4px 0 4px';
		pointPropsDiv.appendChild(dxInput);
		mxUtils.write(pointPropsDiv, 'pt');

		var ySpan = document.createElement('span');
		mxUtils.write(ySpan, mxResources.get('dy'));
		ySpan.style.marginLeft = '12px';
		pointPropsDiv.appendChild(ySpan);
		var yInput = document.createElement('input');
		yInput.setAttribute('type', 'number');
		yInput.setAttribute('min', '0');
		yInput.setAttribute('max', '100');
		yInput.style.width = '45px';
		yInput.style.margin = '0 4px 0 4px';
		pointPropsDiv.appendChild(yInput);
		mxUtils.write(pointPropsDiv, '%');

		var dyInput = document.createElement('input');
		dyInput.setAttribute('type', 'number');
		dyInput.style.width = '45px';
		dyInput.style.margin = '0 4px 0 4px';
		pointPropsDiv.appendChild(dyInput);
		mxUtils.write(pointPropsDiv, 'pt');
		div.appendChild(pointPropsDiv);

		function applyPointProp()
		{
			var x = parseInt(xInput.value) || 0;
			x = x < 0? 0 : (x > 100? 100 : x);
			xInput.value = x;

			var y = parseInt(yInput.value) || 0;
			y = y < 0? 0 : (y > 100? 100 : y);
			yInput.value = y;

			var dx = parseInt(dxInput.value) || 0;
			var dy = parseInt(dyInput.value) || 0;
			var constObj = new mxConnectionConstraint(new mxPoint(x/100, y/100), false, null, dx, dy);
			var cp = editingGraph.getConnectionPoint(state, constObj);

			var cell = editingGraph.getSelectionCell();

			if (cell != null)
			{
				cell.constObj = constObj;
				var geo = cell.geometry.clone();
				var scale = editingGraph.view.scale;
				var tr = editingGraph.view.translate;
				geo.x = (cp.x - CP_HLF_SIZE * scale) / scale - tr.x;
				geo.y = (cp.y - CP_HLF_SIZE * scale) / scale - tr.y;
				editingGraph.model.setGeometry(cell, geo);
			}
		};

		function getConstraintFromCPoint(cp)
		{
			if (cp.constObj)
			{
				return {x: cp.constObj.point.x, y: cp.constObj.point.y, dx: cp.constObj.dx, dy: cp.constObj.dy};
			}

			var dx = 0, dy = 0, mGeo = mainCell.geometry;
			var x = mxUtils.format((cp.geometry.x + CP_HLF_SIZE - mGeo.x) / mGeo.width);
			var y = mxUtils.format((cp.geometry.y + CP_HLF_SIZE - mGeo.y) / mGeo.height);

			if (x < 0)
			{
				dx = x * mGeo.width;
				x = 0;
			}
			else if (x > 1)
			{
				dx = (x - 1) * mGeo.width;
				x = 1;
			}

			if (y < 0)
			{
				dy = y * mGeo.height;
				y = 0;
			}
			else if (y > 1)
			{
				dy = (y - 1) * mGeo.height;
				y = 1;
			}

			return {x: x, y: y, dx: parseInt(dx), dy: parseInt(dy)};
		};

		function fillCPointProp(evt)
		{
			if (editingGraph.getSelectionCount() == 1)
			{
				var cell = editingGraph.getSelectionCell();

				// On move events, exact constraint is lost
				if (evt)
				{
					cell.constObj = null;
				}
				
				var constraint = getConstraintFromCPoint(cell);
				xInput.value = constraint.x * 100;
				yInput.value = constraint.y * 100;
				dxInput.value = constraint.dx;
				dyInput.value = constraint.dy;
				pointPropsDiv.style.visibility = '';
			}
			else
			{
				pointPropsDiv.style.visibility = 'hidden';
			}
		};

		fillCPointProp();

		editingGraph.getSelectionModel().addListener(mxEvent.CHANGE, function()
		{
			if (editingGraph.getSelectionCount() > 0)
			{
				mxUtils.setOpacity(deleteBtn, 60); //Enabled
			}
			else
			{
				mxUtils.setOpacity(deleteBtn, 10); //Disabled
			}

			fillCPointProp();
		}); 
		editingGraph.addListener(mxEvent.CELLS_MOVED, fillCPointProp);

		mxEvent.addListener(xInput, 'change', applyPointProp);
		mxEvent.addListener(yInput, 'change', applyPointProp);
		mxEvent.addListener(dxInput, 'change', applyPointProp);
		mxEvent.addListener(dyInput, 'change', applyPointProp);

		var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
		{
			destroy();
			editorUi.hideDialog();
		});

		cancelBtn.className = 'geBtn';
		
		var applyBtn = mxUtils.button(mxResources.get('apply'), function()
		{
			var cells = editingGraph.model.cells, points = [], constraints = [];

			for (var id in cells)
			{
				var cp = cells[id];

				if (!cp.cp) continue;

				constraints.push(getConstraintFromCPoint(cp));
			}

			//Find and remove identical points
			constraints.sort(function(a, b) 
			{
				return (a.x != b.x) ? a.x - b.x : ((a.y != b.y) ? a.y - b.y : 
						((a.dx != b.dx) ? a.dx - b.dx : a.dy - b.dy)); //Sort based on x then y, dx and dy
			});

			for (var i = 0; i < constraints.length; i++)
			{
				if (i > 0 && constraints[i].x == constraints[i - 1].x && constraints[i].y == constraints[i - 1].y 
						  && constraints[i].dx == constraints[i - 1].dx && constraints[i].dy == constraints[i - 1].dy)
				{
					continue; //Skip this identical point
				}

				points.push('[' + constraints[i].x + ',' + constraints[i].y + ',0,' + 
					constraints[i].dx + ',' + constraints[i].dy + ']');
			}

			editorUi.editor.graph.setCellStyles('points', '[' + points.join(',') + ']', [cell]);
			destroy();
			editorUi.hideDialog();
		});
		
		applyBtn.className = 'geBtn gePrimaryBtn';
		
		var resetBtn = mxUtils.button(mxResources.get('reset'), function()
		{
			editorUi.editor.graph.setCellStyles('points', null, [cell]);
			destroy();
			editorUi.hideDialog();
		});
		
		resetBtn.className = 'geBtn';
		
		var buttons = document.createElement('div');
		buttons.style.flexShrink = '0';
		buttons.style.marginTop = '10px';
		buttons.style.textAlign = 'right';

		if (!editorUi.isOffline())
		{
			buttons.appendChild(editorUi.createHelpIcon(
				'https://www.drawio.com/doc/faq/shape-connection-points-customise'));
		}

		if (editorUi.editor.cancelFirst)
		{
			buttons.appendChild(cancelBtn);
		}
		
		buttons.appendChild(resetBtn);
		buttons.appendChild(applyBtn);

		if (!editorUi.editor.cancelFirst)
		{
			buttons.appendChild(cancelBtn);
		}

		div.appendChild(buttons);

		editingGraph.fit(8);
		editingGraph.center();
	};

	function destroy()
	{
		if (keyHandler != null)
		{
			keyHandler.destroy();
		}
	};

	this.destroy = destroy;

	this.container = div;
};

/**
 * Constructs a new polygon editing dialog for mxgraph.basic.polygon shapes.
 */
var PolygonDialog = function(editorUi, cell, insertFn)
{
	var graph = editorUi.editor.graph;
	var CANVAS_SIZE = 400;
	var VERTEX_RADIUS = 5;
	var SNAP_SIZE = 20;

	var points = [];
	var selectedIndex = -1;
	var closePath = true;
	var snapToGrid = true;
	var undoStack = [];
	var redoStack = [];
	var dragIndex = -1;
	var dragType = null;
	var isDragging = false;
	var dragStarted = false;

	var viewX = 0, viewY = 0;
	var viewW = CANVAS_SIZE, viewH = CANVAS_SIZE;
	var zoom = 1;
	var isPanning = false;
	var panStartX = 0, panStartY = 0;
	var panStartViewX = 0, panStartViewY = 0;
	var spacePressed = false;
	var MIN_ZOOM = 0.05;
	var MAX_ZOOM = 5;

	var listDragSource = null;

	// Load current polygon data from cell style
	var state = graph.view.getState(cell);

	if (state != null)
	{
		try
		{
			var coords = JSON.parse(mxUtils.getValue(state.style, 'polyCoords', '[]'));
			var curves = JSON.parse(mxUtils.getValue(state.style, 'polyCurves', '[]'));
			var polyline = mxUtils.getValue(state.style, 'polyline', 0);
			closePath = !(polyline == 1 || polyline === true ||
				polyline === 'true' || polyline === '1');

			for (var i = 0; i < coords.length; i++)
			{
				var pt = {x: Math.round(coords[i][0] * CANVAS_SIZE),
					y: Math.round(coords[i][1] * CANVAS_SIZE), type: 'L'};

				if (i > 0 && curves.length > i - 1 && curves[i - 1] != null &&
					curves[i - 1].length >= 3 && curves[i - 1][0] === 'Q')
				{
					pt.type = 'Q';
					pt.cx = Math.round(curves[i - 1][1] * CANVAS_SIZE);
					pt.cy = Math.round(curves[i - 1][2] * CANVAS_SIZE);
				}

				points.push(pt);
			}

			// Check closing segment curve
			if (closePath && coords.length > 2 && curves.length >= coords.length &&
				curves[coords.length - 1] != null && curves[coords.length - 1].length >= 3 &&
				curves[coords.length - 1][0] === 'Q')
			{
				points[0].type = 'Q';
				points[0].cx = Math.round(curves[coords.length - 1][1] * CANVAS_SIZE);
				points[0].cy = Math.round(curves[coords.length - 1][2] * CANVAS_SIZE);
			}
		}
		catch (e)
		{
			// ignore
		}
	}

	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.setAttribute('tabindex', '0');
	div.style.outline = 'none';
	div.style.position = 'absolute';
	div.style.left = '30px';
	div.style.right = '30px';
	div.style.top = '30px';
	div.style.bottom = '30px';

	// Main content area - flex layout
	var contentDiv = document.createElement('div');
	contentDiv.style.display = 'flex';
	contentDiv.style.gap = '10px';
	contentDiv.style.position = 'absolute';
	contentDiv.style.left = '0px';
	contentDiv.style.right = '0px';
	contentDiv.style.top = '0px';
	contentDiv.style.bottom = '40px';
	div.appendChild(contentDiv);

	// Left: SVG canvas
	var svgContainer = document.createElement('div');
	svgContainer.style.border = '1px solid';
	svgContainer.style.borderColor = 'inherit';
	svgContainer.style.borderRadius = '4px';
	svgContainer.style.flexGrow = '1';
	svgContainer.style.flexShrink = '1';
	svgContainer.style.minWidth = '200px';
	svgContainer.style.position = 'relative';
	svgContainer.style.overflow = 'hidden';
	contentDiv.appendChild(svgContainer);

	var svgNS = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgNS, 'svg');
	svg.setAttribute('width', '100%');
	svg.setAttribute('height', '100%');
	svg.setAttribute('viewBox', '0 0 ' + CANVAS_SIZE + ' ' + CANVAS_SIZE);
	svg.style.display = 'block';
	svg.style.cursor = 'crosshair';

	// Grid pattern
	var defs = document.createElementNS(svgNS, 'defs');
	var pattern = document.createElementNS(svgNS, 'pattern');
	var gridPatternId = 'polygonGrid_' + Date.now();
	pattern.setAttribute('id', gridPatternId);
	pattern.setAttribute('width', SNAP_SIZE);
	pattern.setAttribute('height', SNAP_SIZE);
	pattern.setAttribute('patternUnits', 'userSpaceOnUse');

	var gridPath = document.createElementNS(svgNS, 'path');
	gridPath.setAttribute('d', 'M ' + SNAP_SIZE + ' 0 L 0 0 0 ' + SNAP_SIZE);
	gridPath.setAttribute('fill', 'none');
	gridPath.setAttribute('stroke', '#e0e0e0');
	gridPath.setAttribute('stroke-width', '0.5');
	pattern.appendChild(gridPath);
	defs.appendChild(pattern);
	svg.appendChild(defs);

	var gridRect = document.createElementNS(svgNS, 'rect');
	gridRect.setAttribute('x', '-5000');
	gridRect.setAttribute('y', '-5000');
	gridRect.setAttribute('width', '10000');
	gridRect.setAttribute('height', '10000');
	gridRect.setAttribute('fill', 'url(#' + gridPatternId + ')');
	svg.appendChild(gridRect);

	// Polygon path element
	var polyPath = document.createElementNS(svgNS, 'path');
	polyPath.setAttribute('fill', 'rgba(66, 133, 244, 0.1)');
	polyPath.setAttribute('stroke', '#4285f4');
	polyPath.setAttribute('stroke-width', '2');
	svg.appendChild(polyPath);

	// Group for control point guide lines
	var controlGuideGroup = document.createElementNS(svgNS, 'g');
	svg.appendChild(controlGuideGroup);

	// Group for vertex circles
	var vertexGroup = document.createElementNS(svgNS, 'g');
	svg.appendChild(vertexGroup);

	// Group for control point handles
	var controlPointGroup = document.createElementNS(svgNS, 'g');
	svg.appendChild(controlPointGroup);

	svgContainer.appendChild(svg);

	// Scrollbar constants
	var SCROLLBAR_SIZE = 12;
	var SCROLL_MIN = -CANVAS_SIZE;
	var SCROLL_MAX = 2 * CANVAS_SIZE;
	var SCROLL_RANGE = SCROLL_MAX - SCROLL_MIN;

	// Horizontal scrollbar
	var hScrollbar = document.createElement('div');
	hScrollbar.style.position = 'absolute';
	hScrollbar.style.bottom = '0px';
	hScrollbar.style.left = '0px';
	hScrollbar.style.right = SCROLLBAR_SIZE + 'px';
	hScrollbar.style.height = SCROLLBAR_SIZE + 'px';
	hScrollbar.style.backgroundColor = 'rgba(128,128,128,0.08)';

	var hThumb = document.createElement('div');
	hThumb.style.position = 'absolute';
	hThumb.style.top = '2px';
	hThumb.style.height = (SCROLLBAR_SIZE - 4) + 'px';
	hThumb.style.borderRadius = '4px';
	hThumb.style.backgroundColor = 'rgba(128,128,128,0.35)';
	hThumb.style.cursor = 'pointer';
	hThumb.style.minWidth = '20px';
	hScrollbar.appendChild(hThumb);
	svgContainer.appendChild(hScrollbar);

	// Vertical scrollbar
	var vScrollbar = document.createElement('div');
	vScrollbar.style.position = 'absolute';
	vScrollbar.style.top = '0px';
	vScrollbar.style.right = '0px';
	vScrollbar.style.bottom = SCROLLBAR_SIZE + 'px';
	vScrollbar.style.width = SCROLLBAR_SIZE + 'px';
	vScrollbar.style.backgroundColor = 'rgba(128,128,128,0.08)';

	var vThumb = document.createElement('div');
	vThumb.style.position = 'absolute';
	vThumb.style.left = '2px';
	vThumb.style.width = (SCROLLBAR_SIZE - 4) + 'px';
	vThumb.style.borderRadius = '4px';
	vThumb.style.backgroundColor = 'rgba(128,128,128,0.35)';
	vThumb.style.cursor = 'pointer';
	vThumb.style.minHeight = '20px';
	vScrollbar.appendChild(vThumb);
	svgContainer.appendChild(vScrollbar);

	function zoomTo(newZoom)
	{
		var rect = svg.getBoundingClientRect();

		if (rect.width > 0 && rect.height > 0)
		{
			var cx = viewX + viewW / 2;
			var cy = viewY + viewH / 2;
			zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
			viewW = rect.width * zoom;
			viewH = rect.height * zoom;
			viewX = cx - viewW / 2;
			viewY = cy - viewH / 2;
			updateViewBox();
		}
	};

	// Scrollbar state
	var hScrollDragging = false;
	var vScrollDragging = false;
	var scrollDragStart = 0;
	var scrollDragStartView = 0;

	function updateScrollbars()
	{
		var containerRect = svgContainer.getBoundingClientRect();

		if (containerRect.width <= 0 || containerRect.height <= 0)
		{
			return;
		}

		// Horizontal
		var trackW = containerRect.width - SCROLLBAR_SIZE;
		var thumbRatio = Math.min(1, viewW / SCROLL_RANGE);
		var thumbW = Math.max(20, trackW * thumbRatio);
		var maxScroll = SCROLL_RANGE - viewW;
		var scrollFrac = maxScroll > 0 ? (viewX - SCROLL_MIN) / maxScroll : 0.5;
		scrollFrac = Math.max(0, Math.min(1, scrollFrac));
		hThumb.style.width = thumbW + 'px';
		hThumb.style.left = (scrollFrac * (trackW - thumbW)) + 'px';

		// Vertical
		var trackH = containerRect.height - SCROLLBAR_SIZE;
		var thumbRatioV = Math.min(1, viewH / SCROLL_RANGE);
		var thumbH = Math.max(20, trackH * thumbRatioV);
		var maxScrollV = SCROLL_RANGE - viewH;
		var scrollFracV = maxScrollV > 0 ? (viewY - SCROLL_MIN) / maxScrollV : 0.5;
		scrollFracV = Math.max(0, Math.min(1, scrollFracV));
		vThumb.style.height = thumbH + 'px';
		vThumb.style.top = (scrollFracV * (trackH - thumbH)) + 'px';
	};

	// Scrollbar thumb drag handlers
	mxEvent.addListener(hThumb, 'mousedown', function(evt)
	{
		hScrollDragging = true;
		scrollDragStart = evt.clientX;
		scrollDragStartView = viewX;
		evt.preventDefault();
		evt.stopPropagation();
	});

	mxEvent.addListener(vThumb, 'mousedown', function(evt)
	{
		vScrollDragging = true;
		scrollDragStart = evt.clientY;
		scrollDragStartView = viewY;
		evt.preventDefault();
		evt.stopPropagation();
	});

	// Scrollbar track click handlers
	mxEvent.addListener(hScrollbar, 'mousedown', function(evt)
	{
		if (evt.target === hScrollbar)
		{
			var trackW = hScrollbar.getBoundingClientRect().width;
			var clickX = evt.clientX - hScrollbar.getBoundingClientRect().left;
			var maxScroll = SCROLL_RANGE - viewW;

			if (maxScroll > 0)
			{
				viewX = SCROLL_MIN + (clickX / trackW) * maxScroll;
				updateViewBox();
			}

			evt.preventDefault();
			evt.stopPropagation();
		}
	});

	mxEvent.addListener(vScrollbar, 'mousedown', function(evt)
	{
		if (evt.target === vScrollbar)
		{
			var trackH = vScrollbar.getBoundingClientRect().height;
			var clickY = evt.clientY - vScrollbar.getBoundingClientRect().top;
			var maxScroll = SCROLL_RANGE - viewH;

			if (maxScroll > 0)
			{
				viewY = SCROLL_MIN + (clickY / trackH) * maxScroll;
				updateViewBox();
			}

			evt.preventDefault();
			evt.stopPropagation();
		}
	});

	var scrollMoveHandler = function(evt)
	{
		if (hScrollDragging)
		{
			var trackW = svgContainer.getBoundingClientRect().width - SCROLLBAR_SIZE;
			var thumbW = parseFloat(hThumb.style.width) || 20;
			var maxScroll = SCROLL_RANGE - viewW;

			if (trackW > thumbW && maxScroll > 0)
			{
				var dx = evt.clientX - scrollDragStart;
				viewX = scrollDragStartView + (dx / (trackW - thumbW)) * maxScroll;
				updateViewBox();
			}

			evt.preventDefault();
		}

		if (vScrollDragging)
		{
			var trackH = svgContainer.getBoundingClientRect().height - SCROLLBAR_SIZE;
			var thumbH = parseFloat(vThumb.style.height) || 20;
			var maxScroll = SCROLL_RANGE - viewH;

			if (trackH > thumbH && maxScroll > 0)
			{
				var dy = evt.clientY - scrollDragStart;
				viewY = scrollDragStartView + (dy / (trackH - thumbH)) * maxScroll;
				updateViewBox();
			}

			evt.preventDefault();
		}
	};

	var scrollUpHandler = function(evt)
	{
		hScrollDragging = false;
		vScrollDragging = false;
	};

	mxEvent.addListener(document, 'mousemove', scrollMoveHandler);
	mxEvent.addListener(document, 'mouseup', scrollUpHandler);

	function updateViewBox()
	{
		svg.setAttribute('viewBox', viewX + ' ' + viewY + ' ' + viewW + ' ' + viewH);
		updateScrollbars();
	};

	function syncViewBoxToContainer()
	{
		var rect = svg.getBoundingClientRect();

		if (rect.width > 0 && rect.height > 0)
		{
			var cx = viewX + viewW / 2;
			var cy = viewY + viewH / 2;
			viewW = rect.width * zoom;
			viewH = rect.height * zoom;
			viewX = cx - viewW / 2;
			viewY = cy - viewH / 2;
			updateViewBox();
		}
	};

	if (typeof ResizeObserver !== 'undefined')
	{
		new ResizeObserver(function() { syncViewBoxToContainer(); }).observe(svgContainer);
	}

	// Right: Point list panel
	var listPanel = document.createElement('div');
	listPanel.style.width = '200px';
	listPanel.style.flexShrink = '0';
	listPanel.style.overflowY = 'auto';
	listPanel.style.border = '1px solid';
	listPanel.style.borderColor = 'inherit';
	listPanel.style.borderRadius = '4px';
	listPanel.style.padding = '4px';
	contentDiv.appendChild(listPanel);

	function snapValue(val, ignoreGrid)
	{
		if (snapToGrid && !ignoreGrid)
		{
			return Math.round(val / SNAP_SIZE) * SNAP_SIZE;
		}

		return Math.round(val);
	};

	function getSvgPoint(evt)
	{
		var rect = svg.getBoundingClientRect();
		var clientX = evt.touches != null ? evt.touches[0].clientX : evt.clientX;
		var clientY = evt.touches != null ? evt.touches[0].clientY : evt.clientY;
		var x = viewX + ((clientX - rect.left) / rect.width) * viewW;
		var y = viewY + ((clientY - rect.top) / rect.height) * viewH;
		// Holding Alt (Option) temporarily ignores the grid, as on the main canvas
		var ignoreGrid = mxEvent.isAltDown(evt);

		return {x: snapValue(x, ignoreGrid), y: snapValue(y, ignoreGrid)};
	};

	function getDefaultControlPoint(prevPt, pt)
	{
		var midX = (prevPt.x + pt.x) / 2;
		var midY = (prevPt.y + pt.y) / 2;
		var dx = pt.x - prevPt.x;
		var dy = pt.y - prevPt.y;
		var len = Math.sqrt(dx * dx + dy * dy);

		if (len === 0)
		{
			return {x: midX, y: midY};
		}

		var px = -dy / len;
		var py = dx / len;
		var offset = len * 0.25;

		return {x: Math.round(midX + px * offset), y: Math.round(midY + py * offset)};
	};

	function hitTestPoint(evt)
	{
		var rect = svg.getBoundingClientRect();
		var clientX = evt.touches != null ? evt.touches[0].clientX : evt.clientX;
		var clientY = evt.touches != null ? evt.touches[0].clientY : evt.clientY;
		var rawX = viewX + ((clientX - rect.left) / rect.width) * viewW;
		var rawY = viewY + ((clientY - rect.top) / rect.height) * viewH;
		var hitRadius = (VERTEX_RADIUS + 4) * (viewW / CANVAS_SIZE);

		// Check closing segment control point
		if (closePath && points.length > 2 && points[0].type === 'Q')
		{
			var dx = points[0].cx - rawX;
			var dy = points[0].cy - rawY;

			if (Math.sqrt(dx * dx + dy * dy) <= hitRadius)
			{
				return {type: 'control', index: 0};
			}
		}

		// Check control points first (they render on top)
		for (var i = 1; i < points.length; i++)
		{
			if (points[i].type === 'Q')
			{
				var dx = points[i].cx - rawX;
				var dy = points[i].cy - rawY;

				if (Math.sqrt(dx * dx + dy * dy) <= hitRadius)
				{
					return {type: 'control', index: i};
				}
			}
		}

		for (var i = 0; i < points.length; i++)
		{
			var dx = points[i].x - rawX;
			var dy = points[i].y - rawY;

			if (Math.sqrt(dx * dx + dy * dy) <= hitRadius)
			{
				return {type: 'vertex', index: i};
			}
		}

		return null;
	};

	function pushUndo()
	{
		undoStack.push(JSON.stringify(points));
		redoStack = [];
		updateUndoButtons();
	};

	function undo()
	{
		if (undoStack.length > 0)
		{
			redoStack.push(JSON.stringify(points));
			points = JSON.parse(undoStack.pop());
			selectedIndex = Math.min(selectedIndex, points.length - 1);
			renderPolygon();
			updateUndoButtons();
		}
	};

	function redo()
	{
		if (redoStack.length > 0)
		{
			undoStack.push(JSON.stringify(points));
			points = JSON.parse(redoStack.pop());
			selectedIndex = Math.min(selectedIndex, points.length - 1);
			renderPolygon();
			updateUndoButtons();
		}
	};

	function updateUndoButtons()
	{
		if (undoBtn != null)
		{
			undoBtn.style.opacity = undoStack.length > 0 ? '1' : '0.3';
			undoBtn.style.pointerEvents = undoStack.length > 0 ? '' : 'none';
		}

		if (redoBtn != null)
		{
			redoBtn.style.opacity = redoStack.length > 0 ? '1' : '0.3';
			redoBtn.style.pointerEvents = redoStack.length > 0 ? '' : 'none';
		}
	};

	function renderPolygon()
	{
		// Update SVG path
		var d = '';

		for (var i = 0; i < points.length; i++)
		{
			if (i === 0)
			{
				d += 'M' + points[i].x + ' ' + points[i].y;
			}
			else if (points[i].type === 'Q')
			{
				d += 'Q' + points[i].cx + ' ' + points[i].cy +
					' ' + points[i].x + ' ' + points[i].y;
			}
			else
			{
				d += 'L' + points[i].x + ' ' + points[i].y;
			}
		}

		if (closePath && points.length > 2)
		{
			if (points[0].type === 'Q')
			{
				d += 'Q' + points[0].cx + ' ' + points[0].cy +
					' ' + points[0].x + ' ' + points[0].y;
			}

			d += 'Z';
		}

		polyPath.setAttribute('d', d);
		polyPath.setAttribute('fill', closePath && points.length > 2 ?
			'rgba(66, 133, 244, 0.1)' : 'none');

		// Update control point guide lines
		while (controlGuideGroup.firstChild)
		{
			controlGuideGroup.removeChild(controlGuideGroup.firstChild);
		}

		for (var i = 1; i < points.length; i++)
		{
			if (points[i].type === 'Q')
			{
				var guideLine = document.createElementNS(svgNS, 'polyline');
				guideLine.setAttribute('points',
					points[i - 1].x + ',' + points[i - 1].y + ' ' +
					points[i].cx + ',' + points[i].cy + ' ' +
					points[i].x + ',' + points[i].y);
				guideLine.setAttribute('fill', 'none');
				guideLine.setAttribute('stroke', '#f0a030');
				guideLine.setAttribute('stroke-width', '1');
				guideLine.setAttribute('stroke-dasharray', '4,3');
				controlGuideGroup.appendChild(guideLine);
			}
		}

		if (closePath && points.length > 2 && points[0].type === 'Q')
		{
			var closingGuide = document.createElementNS(svgNS, 'polyline');
			closingGuide.setAttribute('points',
				points[points.length - 1].x + ',' + points[points.length - 1].y + ' ' +
				points[0].cx + ',' + points[0].cy + ' ' +
				points[0].x + ',' + points[0].y);
			closingGuide.setAttribute('fill', 'none');
			closingGuide.setAttribute('stroke', '#f0a030');
			closingGuide.setAttribute('stroke-width', '1');
			closingGuide.setAttribute('stroke-dasharray', '4,3');
			controlGuideGroup.appendChild(closingGuide);
		}

		// Update vertex circles
		while (vertexGroup.firstChild)
		{
			vertexGroup.removeChild(vertexGroup.firstChild);
		}

		for (var i = 0; i < points.length; i++)
		{
			var circle = document.createElementNS(svgNS, 'circle');
			circle.setAttribute('cx', points[i].x);
			circle.setAttribute('cy', points[i].y);
			circle.setAttribute('r', VERTEX_RADIUS);
			circle.setAttribute('fill', i === selectedIndex ? '#ff4444' : '#4285f4');
			circle.setAttribute('stroke', '#fff');
			circle.setAttribute('stroke-width', '1.5');
			circle.style.cursor = 'move';
			vertexGroup.appendChild(circle);
		}

		// Update control point handles
		while (controlPointGroup.firstChild)
		{
			controlPointGroup.removeChild(controlPointGroup.firstChild);
		}

		for (var i = 1; i < points.length; i++)
		{
			if (points[i].type === 'Q')
			{
				var handle = document.createElementNS(svgNS, 'rect');
				handle.setAttribute('x', points[i].cx - 5);
				handle.setAttribute('y', points[i].cy - 5);
				handle.setAttribute('width', 10);
				handle.setAttribute('height', 10);
				handle.setAttribute('fill', i === selectedIndex ? '#ff8800' : '#f0a030');
				handle.setAttribute('stroke', '#fff');
				handle.setAttribute('stroke-width', '1.5');
				handle.style.cursor = 'move';
				controlPointGroup.appendChild(handle);
			}
		}

		if (closePath && points.length > 2 && points[0].type === 'Q')
		{
			var closingHandle = document.createElementNS(svgNS, 'rect');
			closingHandle.setAttribute('x', points[0].cx - 5);
			closingHandle.setAttribute('y', points[0].cy - 5);
			closingHandle.setAttribute('width', 10);
			closingHandle.setAttribute('height', 10);
			closingHandle.setAttribute('fill', 0 === selectedIndex ? '#ff8800' : '#f0a030');
			closingHandle.setAttribute('stroke', '#fff');
			closingHandle.setAttribute('stroke-width', '1.5');
			closingHandle.style.cursor = 'move';
			controlPointGroup.appendChild(closingHandle);
		}

		updatePointList();
	};

	function updatePointList()
	{
		listPanel.innerHTML = '';

		if (points.length === 0)
		{
			var hint = document.createElement('div');
			hint.style.padding = '20px 10px';
			hint.style.textAlign = 'center';
			hint.style.opacity = '0.5';
			hint.style.fontSize = '12px';
			mxUtils.write(hint, mxResources.get('clickToAdd'));
			listPanel.appendChild(hint);
			return;
		}

		for (var i = 0; i < points.length; i++)
		{
			(function(idx)
			{
				var row = document.createElement('div');
				row.style.display = 'flex';
				row.style.alignItems = 'center';
				row.style.padding = '2px 4px';
				row.style.gap = '4px';
				row.style.borderRadius = '3px';
				row.style.marginBottom = '2px';
				row.style.fontSize = '12px';
				row.setAttribute('draggable', 'true');
				row.setAttribute('data-idx', idx);

				if (idx === selectedIndex)
				{
					row.style.backgroundColor = 'rgba(66, 133, 244, 0.15)';
				}

				row.style.cursor = 'pointer';

				mxEvent.addListener(row, 'click', function()
				{
					selectedIndex = idx;
					renderPolygon();
				});

				// Drag handle
				var dragHandle = document.createElement('span');
				dragHandle.innerHTML = '&#9776;';
				dragHandle.style.cursor = 'grab';
				dragHandle.style.fontSize = '11px';
				dragHandle.style.opacity = '0.4';
				dragHandle.style.flexShrink = '0';
				row.appendChild(dragHandle);

				var label = document.createElement('span');
				label.style.minWidth = '18px';
				label.style.fontWeight = 'bold';
				mxUtils.write(label, (idx + 1) + '');
				row.appendChild(label);

				var xInput = document.createElement('input');
				xInput.type = 'number';
				xInput.value = Math.round(points[idx].x);
				xInput.style.width = '48px';
				xInput.style.fontSize = '11px';
				xInput.style.padding = '1px 3px';
				xInput.title = 'X';

				mxEvent.addListener(xInput, 'change', function()
				{
					pushUndo();
					points[idx].x = parseInt(this.value) || 0;
					renderPolygon();
				});

				mxEvent.addListener(xInput, 'click', function(e)
				{
					e.stopPropagation();
				});

				row.appendChild(xInput);

				var yInput = document.createElement('input');
				yInput.type = 'number';
				yInput.value = Math.round(points[idx].y);
				yInput.style.width = '48px';
				yInput.style.fontSize = '11px';
				yInput.style.padding = '1px 3px';
				yInput.title = 'Y';

				mxEvent.addListener(yInput, 'change', function()
				{
					pushUndo();
					points[idx].y = parseInt(this.value) || 0;
					renderPolygon();
				});

				mxEvent.addListener(yInput, 'click', function(e)
				{
					e.stopPropagation();
				});

				row.appendChild(yInput);

				// Curve toggle (for closing segment when idx is 0 and path is closed)
				if (idx > 0 || (idx === 0 && closePath && points.length > 2))
				{
					var curveLabel = document.createElement('label');
					curveLabel.style.display = 'flex';
					curveLabel.style.alignItems = 'center';
					curveLabel.style.cursor = 'pointer';
					curveLabel.style.flexShrink = '0';
					curveLabel.title = mxResources.get('curved');

					var curveCb = document.createElement('input');
					curveCb.type = 'checkbox';
					curveCb.checked = points[idx].type === 'Q';
					curveCb.style.margin = '0';

					mxEvent.addListener(curveCb, 'click', function(e)
					{
						e.stopPropagation();
					});

					mxEvent.addListener(curveCb, 'change', function()
					{
						pushUndo();

						if (points[idx].type === 'Q')
						{
							points[idx].type = 'L';
							delete points[idx].cx;
							delete points[idx].cy;
						}
						else
						{
							var prevPt = idx > 0 ? points[idx - 1] : points[points.length - 1];
							var defCp = getDefaultControlPoint(prevPt, points[idx]);
							points[idx].type = 'Q';
							points[idx].cx = defCp.x;
							points[idx].cy = defCp.y;
						}

						renderPolygon();
					});

					curveLabel.appendChild(curveCb);
					row.appendChild(curveLabel);
				}

				// Delete button
				var delBtn = document.createElement('img');
				delBtn.setAttribute('src', Editor.trashImage);
				delBtn.style.cursor = 'pointer';
				delBtn.style.marginLeft = 'auto';
				delBtn.style.width = '14px';
				delBtn.style.height = '14px';
				delBtn.style.opacity = '0.5';
				delBtn.style.flexShrink = '0';
				delBtn.title = mxResources.get('delete');

				if (Editor.isDarkMode())
				{
					delBtn.style.filter = 'invert(1)';
				}

				mxEvent.addListener(delBtn, 'click', function(e)
				{
					e.stopPropagation();
					pushUndo();
					points.splice(idx, 1);

					if (selectedIndex >= points.length)
					{
						selectedIndex = points.length - 1;
					}

					renderPolygon();
				});

				row.appendChild(delBtn);

				// Drag-and-drop handlers
				mxEvent.addListener(row, 'dragstart', function(e)
				{
					listDragSource = idx;
					row.style.opacity = '0.4';
					e.dataTransfer.effectAllowed = 'move';
					e.dataTransfer.setData('text/plain', '' + idx);
					e.stopPropagation();
				});

				mxEvent.addListener(row, 'dragover', function(e)
				{
					e.preventDefault();
					e.stopPropagation();
					e.dataTransfer.dropEffect = 'move';
					var targetIdx = parseInt(row.getAttribute('data-idx'));

					if (listDragSource !== null && targetIdx !== listDragSource)
					{
						row.style.borderTop = targetIdx < listDragSource ?
							'2px solid #4285f4' : '';
						row.style.borderBottom = targetIdx > listDragSource ?
							'2px solid #4285f4' : '';
					}
				});

				mxEvent.addListener(row, 'dragleave', function(e)
				{
					row.style.borderTop = '';
					row.style.borderBottom = '';
				});

				mxEvent.addListener(row, 'drop', function(e)
				{
					e.preventDefault();
					e.stopPropagation();
					row.style.borderTop = '';
					row.style.borderBottom = '';
					var targetIdx = parseInt(row.getAttribute('data-idx'));

					if (listDragSource !== null && targetIdx !== listDragSource)
					{
						pushUndo();
						var movedPoint = points.splice(listDragSource, 1)[0];
						var insertIdx = targetIdx > listDragSource ? targetIdx - 1 : targetIdx;
						points.splice(insertIdx, 0, movedPoint);

						if (selectedIndex === listDragSource)
						{
							selectedIndex = insertIdx;
						}
						else if (listDragSource < selectedIndex && insertIdx >= selectedIndex)
						{
							selectedIndex--;
						}
						else if (listDragSource > selectedIndex && insertIdx <= selectedIndex)
						{
							selectedIndex++;
						}

						renderPolygon();
					}

					listDragSource = null;
				});

				mxEvent.addListener(row, 'dragend', function(e)
				{
					row.style.opacity = '';
					row.style.borderTop = '';
					row.style.borderBottom = '';
					listDragSource = null;
				});

				listPanel.appendChild(row);
			})(i);
		}
	};

	// Mouse handling on SVG canvas
	mxEvent.addGestureListeners(svg, function(evt)
	{
		if (spacePressed || evt.button === 1 || evt.button === 2) return;

		var hit = hitTestPoint(evt);

		if (hit != null)
		{
			// Start dragging an existing point
			dragIndex = hit.index;
			dragType = hit.type;
			isDragging = true;
			dragStarted = false;
			selectedIndex = hit.index;
			renderPolygon();
		}
		else
		{
			var pt = getSvgPoint(evt);
			pushUndo();

			if (points.length < 2)
			{
				// Not enough points for segments, just append
				points.push({x: pt.x, y: pt.y, type: 'L'});
				selectedIndex = points.length - 1;
			}
			else
			{
				// Find nearest segment and insert there
				var bestDist = Infinity;
				var bestSeg = points.length - 1;
				var segCount = closePath ? points.length : points.length - 1;

				for (var si = 0; si < segCount; si++)
				{
					var ni = (si + 1) % points.length;
					var d = mxUtils.ptSegDistSq(points[si].x, points[si].y,
						points[ni].x, points[ni].y, pt.x, pt.y);

					if (d < bestDist)
					{
						bestDist = d;
						bestSeg = si;
					}
				}

				points.splice(bestSeg + 1, 0, {x: pt.x, y: pt.y, type: 'L'});
				selectedIndex = bestSeg + 1;
			}

			dragIndex = selectedIndex;
			dragType = 'vertex';
			isDragging = true;
			dragStarted = true;
			renderPolygon();
		}

		mxEvent.consume(evt);
	},
	function(evt)
	{
		if (isDragging && dragIndex >= 0 && dragIndex < points.length)
		{
			if (!dragStarted)
			{
				pushUndo();
				dragStarted = true;
			}

			var pt = getSvgPoint(evt);

			if (dragType === 'control')
			{
				points[dragIndex].cx = pt.x;
				points[dragIndex].cy = pt.y;
			}
			else
			{
				points[dragIndex].x = pt.x;
				points[dragIndex].y = pt.y;
			}

			renderPolygon();
			mxEvent.consume(evt);
		}
	},
	function(evt)
	{
		if (spacePressed || evt.button === 1 || evt.button === 2) return;

		if (isDragging && dragIndex >= 0)
		{
			isDragging = false;
			dragIndex = -1;
			dragType = null;
			mxEvent.consume(evt);
		}
	});

	// Mouse wheel zoom on SVG
	mxEvent.addListener(svg, 'wheel', function(evt)
	{
		evt.preventDefault();
		var rect = svg.getBoundingClientRect();
		var px = (evt.clientX - rect.left) / rect.width;
		var py = (evt.clientY - rect.top) / rect.height;
		var cursorX = viewX + px * viewW;
		var cursorY = viewY + py * viewH;

		var factor = evt.deltaY > 0 ? 1.15 : 1 / 1.15;
		zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * factor));

		viewW = rect.width * zoom;
		viewH = rect.height * zoom;
		viewX = cursorX - px * viewW;
		viewY = cursorY - py * viewH;
		updateViewBox();
	});

	// Suppress context menu on SVG canvas
	mxEvent.addListener(svg, 'contextmenu', function(evt)
	{
		evt.preventDefault();
	});

	// Pan (middle-click, right-click or Space+left-click)
	mxEvent.addListener(svg, 'mousedown', function(evt)
	{
		if (evt.button === 1 || evt.button === 2 || (evt.button === 0 && spacePressed))
		{
			isPanning = true;
			panStartX = evt.clientX;
			panStartY = evt.clientY;
			panStartViewX = viewX;
			panStartViewY = viewY;
			svg.style.cursor = 'grabbing';
			evt.preventDefault();
		}
	});

	var panMoveHandler = function(evt)
	{
		if (isPanning)
		{
			var rect = svg.getBoundingClientRect();
			viewX = panStartViewX - (evt.clientX - panStartX) / rect.width * viewW;
			viewY = panStartViewY - (evt.clientY - panStartY) / rect.height * viewH;
			updateViewBox();
			evt.preventDefault();
		}
	};

	var panUpHandler = function(evt)
	{
		if (isPanning)
		{
			isPanning = false;
			svg.style.cursor = spacePressed ? 'grab' : 'crosshair';
		}
	};

	mxEvent.addListener(document, 'mousemove', panMoveHandler);
	mxEvent.addListener(document, 'mouseup', panUpHandler);

	// Bottom bar with all controls
	var bottomBar = document.createElement('div');
	bottomBar.style.display = 'flex';
	bottomBar.style.alignItems = 'center';
	bottomBar.style.gap = '6px';
	bottomBar.style.position = 'absolute';
	bottomBar.style.left = '0px';
	bottomBar.style.right = '0px';
	bottomBar.style.bottom = '0px';
	bottomBar.style.height = '34px';

	var undoBtn = editorUi.createToolbarButton(Editor.undoImage,
		mxResources.get('undo'), function() { undo(); });
	bottomBar.appendChild(undoBtn);

	var redoBtn = editorUi.createToolbarButton(Editor.redoImage,
		mxResources.get('redo'), function() { redo(); });
	bottomBar.appendChild(redoBtn);

	var zoomInBtn = editorUi.createToolbarButton(Editor.zoomInImage,
		mxResources.get('zoomIn'), function()
	{
		zoomTo(zoom / 1.15);
	});
	bottomBar.appendChild(zoomInBtn);

	var zoomOutBtn = editorUi.createToolbarButton(Editor.zoomOutImage,
		mxResources.get('zoomOut'), function()
	{
		zoomTo(zoom * 1.15);
	});
	bottomBar.appendChild(zoomOutBtn);

	var zoomFitBtn = editorUi.createToolbarButton(Editor.zoomFitImage,
		mxResources.get('fit'), function()
	{
		var rect = svg.getBoundingClientRect();

		if (rect.width > 0 && rect.height > 0)
		{
			if (zoom == 1)
			{
				// Fit: compute bounding box of points and fit to view
				if (points.length > 0)
				{
					var minX = points[0].x, minY = points[0].y;
					var maxX = points[0].x, maxY = points[0].y;

					for (var i = 1; i < points.length; i++)
					{
						minX = Math.min(minX, points[i].x);
						minY = Math.min(minY, points[i].y);
						maxX = Math.max(maxX, points[i].x);
						maxY = Math.max(maxY, points[i].y);

						if (points[i].type === 'Q')
						{
							minX = Math.min(minX, points[i].cx);
							minY = Math.min(minY, points[i].cy);
							maxX = Math.max(maxX, points[i].cx);
							maxY = Math.max(maxY, points[i].cy);
						}
					}

					var pad = 20;
					var bw = maxX - minX + pad * 2;
					var bh = maxY - minY + pad * 2;
					var sx = rect.width / bw;
					var sy = rect.height / bh;
					zoom = 1 / Math.min(sx, sy);
					viewW = rect.width * zoom;
					viewH = rect.height * zoom;
					viewX = (minX - pad) + (bw - viewW) / 2;
					viewY = (minY - pad) + (bh - viewH) / 2;
				}
				else
				{
					zoom = 1;
					viewW = rect.width;
					viewH = rect.height;
					viewX = (CANVAS_SIZE - viewW) / 2;
					viewY = (CANVAS_SIZE - viewH) / 2;
				}
			}
			else
			{
				// Reset to zoom=1
				zoom = 1;
				viewW = rect.width * zoom;
				viewH = rect.height * zoom;
				viewX = (CANVAS_SIZE - viewW) / 2;
				viewY = (CANVAS_SIZE - viewH) / 2;
			}

			updateViewBox();
		}
	});
	bottomBar.appendChild(zoomFitBtn);

	var deleteAllBtn = mxUtils.button(mxResources.get('deleteAll'), function()
	{
		if (points.length > 0)
		{
			pushUndo();
			points = [];
			selectedIndex = -1;
			renderPolygon();
		}
	});
	deleteAllBtn.className = 'geBtn';
	deleteAllBtn.style.padding = '2px 10px';
	deleteAllBtn.style.fontSize = '12px';
	bottomBar.appendChild(deleteAllBtn);

	// Separator
	var sep = document.createElement('span');
	sep.style.flexGrow = '1';
	bottomBar.appendChild(sep);

	// Snap to grid checkbox
	var snapLabel = document.createElement('label');
	snapLabel.style.display = 'flex';
	snapLabel.style.alignItems = 'center';
	snapLabel.style.gap = '4px';
	snapLabel.style.fontSize = '12px';
	snapLabel.style.cursor = 'pointer';
	snapLabel.style.whiteSpace = 'nowrap';

	var snapCb = document.createElement('input');
	snapCb.type = 'checkbox';
	snapCb.checked = snapToGrid;

	mxEvent.addListener(snapCb, 'change', function()
	{
		snapToGrid = this.checked;
		gridRect.style.display = snapToGrid ? '' : 'none';
	});

	snapLabel.appendChild(snapCb);
	mxUtils.write(snapLabel, mxResources.get('grid'));
	bottomBar.appendChild(snapLabel);

	// Close path checkbox
	var closeLabel = document.createElement('label');
	closeLabel.style.display = 'flex';
	closeLabel.style.alignItems = 'center';
	closeLabel.style.gap = '4px';
	closeLabel.style.fontSize = '12px';
	closeLabel.style.cursor = 'pointer';
	closeLabel.style.whiteSpace = 'nowrap';

	var closeCb = document.createElement('input');
	closeCb.type = 'checkbox';
	closeCb.checked = closePath;

	mxEvent.addListener(closeCb, 'change', function()
	{
		closePath = this.checked;
		renderPolygon();
	});

	closeLabel.appendChild(closeCb);
	mxUtils.write(closeLabel, mxResources.get('closePath'));
	bottomBar.appendChild(closeLabel);

	// Apply/Cancel buttons
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';

	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		if (points.length < 2)
		{
			editorUi.showError(mxResources.get('error'),
				mxResources.get('minTwoPoints'),
				mxResources.get('ok'));
			return;
		}

		// Compute bounding box of all points and control points
		var bminX = points[0].x, bmaxX = points[0].x;
		var bminY = points[0].y, bmaxY = points[0].y;

		for (var i = 0; i < points.length; i++)
		{
			bminX = Math.min(bminX, points[i].x);
			bmaxX = Math.max(bmaxX, points[i].x);
			bminY = Math.min(bminY, points[i].y);
			bmaxY = Math.max(bmaxY, points[i].y);

			if (points[i].type === 'Q')
			{
				bminX = Math.min(bminX, points[i].cx);
				bmaxX = Math.max(bmaxX, points[i].cx);
				bminY = Math.min(bminY, points[i].cy);
				bmaxY = Math.max(bmaxY, points[i].cy);
			}
		}

		var rangeX = bmaxX - bminX;
		var rangeY = bmaxY - bminY;

		// Normalize coordinates to bounding box (0-1 range)
		var nx = function(val)
		{
			return rangeX > 0 ? Math.round(((val - bminX) / rangeX) * 100000) / 100000 : 0.5;
		};

		var ny = function(val)
		{
			return rangeY > 0 ? Math.round(((val - bminY) / rangeY) * 100000) / 100000 : 0.5;
		};

		var newCoords = [];
		var newCurves = [];

		for (var i = 0; i < points.length; i++)
		{
			newCoords.push([nx(points[i].x), ny(points[i].y)]);

			if (i > 0)
			{
				if (points[i].type === 'Q')
				{
					newCurves.push(['Q', nx(points[i].cx), ny(points[i].cy)]);
				}
				else
				{
					newCurves.push([]);
				}
			}
		}

		// Handle closing segment curve
		if (closePath && points.length > 2 && points[0].type === 'Q')
		{
			newCurves.push(['Q', nx(points[0].cx), ny(points[0].cy)]);
		}

		if (insertFn != null)
		{
			var style = 'shape=mxgraph.basic.polygon;polyCoords=' +
				JSON.stringify(newCoords) + ';polyCurves=' +
				JSON.stringify(newCurves) + ';polyline=' +
				(closePath ? '0' : '1') + ';whiteSpace=wrap;html=1;';
			insertFn(style);
		}
		else
		{
			// Update cell geometry to maintain visual position and size
			var geo = graph.getCellGeometry(cell);

			if (geo != null)
			{
				geo = geo.clone();

				if (rangeX > 0)
				{
					geo.x = geo.x + (bminX / CANVAS_SIZE) * geo.width;
					geo.width = (rangeX / CANVAS_SIZE) * geo.width;
				}

				if (rangeY > 0)
				{
					geo.y = geo.y + (bminY / CANVAS_SIZE) * geo.height;
					geo.height = (rangeY / CANVAS_SIZE) * geo.height;
				}
			}

			graph.getModel().beginUpdate();

			try
			{
				if (geo != null)
				{
					graph.getModel().setGeometry(cell, geo);
				}

				graph.setCellStyles('polyCoords', JSON.stringify(newCoords), [cell]);
				graph.setCellStyles('polyCurves', JSON.stringify(newCurves), [cell]);
				graph.setCellStyles('polyline', closePath ? '0' : '1', [cell]);
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}

		editorUi.hideDialog();
	});
	applyBtn.className = 'geBtn gePrimaryBtn';

	if (editorUi.editor.cancelFirst)
	{
		bottomBar.appendChild(cancelBtn);
		bottomBar.appendChild(applyBtn);
	}
	else
	{
		bottomBar.appendChild(applyBtn);
		bottomBar.appendChild(cancelBtn);
	}

	div.appendChild(bottomBar);

	// Keyboard handling
	mxEvent.addListener(div, 'keydown', function(evt)
	{
		if (evt.keyCode === 32) // Space
		{
			if (!spacePressed)
			{
				spacePressed = true;
				svg.style.cursor = 'grab';
			}

			mxEvent.consume(evt);
			return;
		}

		if (evt.keyCode === 46 || evt.keyCode === 8) // Delete/Backspace
		{
			if (selectedIndex >= 0 && selectedIndex < points.length)
			{
				if (evt.target.tagName !== 'INPUT')
				{
					pushUndo();
					points.splice(selectedIndex, 1);

					if (selectedIndex >= points.length)
					{
						selectedIndex = points.length - 1;
					}

					renderPolygon();
					mxEvent.consume(evt);
				}
			}
		}
		else if (evt.keyCode === 90 && (evt.ctrlKey || evt.metaKey)) // Ctrl+Z
		{
			if (evt.shiftKey)
			{
				redo();
			}
			else
			{
				undo();
			}

			mxEvent.consume(evt);
		}
		else if (evt.keyCode === 89 && (evt.ctrlKey || evt.metaKey)) // Ctrl+Y
		{
			redo();
			mxEvent.consume(evt);
		}
	});

	mxEvent.addListener(div, 'keyup', function(evt)
	{
		if (evt.keyCode === 32)
		{
			spacePressed = false;

			if (!isPanning)
			{
				svg.style.cursor = 'crosshair';
			}
		}
	});

	// Initial render
	renderPolygon();
	updateUndoButtons();

	this.init = function()
	{
		div.focus();
		var rect = svg.getBoundingClientRect();

		if (rect.width > 0 && rect.height > 0)
		{
			zoom = 1;
			viewW = rect.width * zoom;
			viewH = rect.height * zoom;
			viewX = (CANVAS_SIZE - viewW) / 2;
			viewY = (CANVAS_SIZE - viewH) / 2;
			updateViewBox();
		}
	};

	this.destroy = function()
	{
		mxEvent.removeListener(document, 'mousemove', scrollMoveHandler);
		mxEvent.removeListener(document, 'mouseup', scrollUpHandler);
		mxEvent.removeListener(document, 'mousemove', panMoveHandler);
		mxEvent.removeListener(document, 'mouseup', panUpHandler);
	};

	this.container = div;
};
