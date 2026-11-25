/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The layout of the sign-in to a storage in every look (the driver, 18
 * November 2026: the Authorize dialog of Fusion in Classic and Simple): the
 * Authorize dialog (AuthDialog: Google Drive, OneDrive, GitHub, GitLab,
 * Trello and Microsoft 365), the end of a sign-in (BtnDialog, "You are now
 * authorized in ...") and the access to a file of Google Drive
 * (App.showDriveAccessDialog) as a message: the headline, the text, Remember
 * Me, the Terms of Use, Cancel and the primary action with the logo of the
 * storage in the footer. The controls of the dialogs keep their listeners
 * and move into the new layout, so every flow (popup and redirect, Remember
 * Me, Cancel, the errors) calls what it called before.
 *
 * The layout takes a skin: the Classic skin (AuthLayout.skins.classic,
 * docs/dialog-style-guide.md, its CSS in grapheditor.css under
 * .geAuthMessage, which takes the colors, the font and the corners of the
 * other dialogs of the theme: a checkbox for Remember Me, the buttons of
 * the theme) for Classic, Simple, Sketch, Minimal and Atlas, behind the
 * feature authDialog of Editor.featureDefaults (Editor.isAuthDialogEnabled),
 * or the skin of Fusion, which SimpleMessages.js adds (AuthLayout.skins.fusion:
 * the Message template, Remember Me as a switch), so the code exists once.
 * Where the feature is off the dialogs are shown as they were.
 */
var AuthLayout = {};

/**
 * Width of the content of the Authorize dialog in the Classic skin (the frame
 * adds 48, so it fits phones from 375 wide); the height is that of its content.
 */
AuthLayout.width = 320;

/**
 * Width of the content of the end of a sign-in in the Classic skin.
 */
AuthLayout.signedInWidth = 300;

/**
 * The skins of the layout: what each look adds to the parts (see
 * AuthLayout.skins.classic).
 */
AuthLayout.skins = {};

/**
 * The Classic skin (docs/dialog-style-guide.md): the classes of the parts,
 * Remember Me as a checkbox row (geDialogCheckRow) and the buttons in the
 * order of the theme (Editor.cancelFirst). Each function gets the EditorUi.
 */
AuthLayout.skins.classic = {
	classes: {
		// The kinds of the layout: Authorize, the end of a sign-in, the access
		// to a file of Google Drive
		auth: ['geAuthMessage', 'geAuthAuthorize'],
		signedIn: ['geAuthMessage', 'geAuthSignedIn'],
		driveAccess: ['geAuthMessage', 'geAuthDriveAccess'],
		// Parts of the dialog of before that the layout replaces
		replaced: 'geAuthReplaced',
		text: 'geAuthText',
		signedInText: 'geAuthText',
		notice: 'geAuthNotice',
		footer: 'geAuthButtons',
		signedInFooter: 'geAuthButtons',
		logo: 'geAuthLogo',
		signedInLogo: 'geAuthLogo',
		// The tertiary actions of the access to a file keep the links of the
		// theme (geHomeLink)
		link: []
	},
	/**
	 * Makes the given content the message of the given kind.
	 */
	prepare: function(ui, elt, kind)
	{
		var classes = this.classes[kind];
		elt.style.textAlign = '';

		for (var i = 0; i < classes.length; i++)
		{
			elt.classList.add(classes[i]);
		}
	},
	/**
	 * Returns a row with the given checkbox and its label.
	 */
	createCheck: function(ui, input, label)
	{
		var row = document.createElement('div');
		row.className = 'geDialogCheckRow geAuthRemember';
		input.id = 'geAuthRemember-' + Editor.guid();
		var elt = document.createElement('label');
		elt.setAttribute('for', input.id);
		mxUtils.write(elt, label);
		row.appendChild(input);
		row.appendChild(elt);

		return row;
	},
	/**
	 * Prepares the logo of the storage in the primary button: 18 with a gap
	 * of 8, no name of its own (the button has the name of the storage).
	 */
	prepareLogo: function(ui, img, kind)
	{
		img.style.marginRight = '';
		img.style.width = '';
		img.removeAttribute('align');
		img.setAttribute('alt', '');
		img.classList.add(this.classes[(kind == 'signedIn') ? 'signedInLogo' : 'logo']);
	},
	/**
	 * Adds the given parts as the subtitle after the given headline.
	 */
	addSubtitle: function(ui, headline, parts)
	{
		var sub = document.createElement('div');
		sub.className = 'geAuthSubtitle';
		mxUtils.write(sub, PreviewDialog.joinList(parts));
		headline.parentNode.insertBefore(sub, headline.nextSibling);

		return sub;
	},
	/**
	 * Puts Cancel and the primary action into the given footer in the order
	 * of the buttons of the theme.
	 */
	arrangeFooter: function(ui, footer, left, cancel, primary)
	{
		var cancelFirst = ui.editor == null || ui.editor.cancelFirst;

		for (var i = 0; i < left.length; i++)
		{
			if (left[i] != null)
			{
				footer.appendChild(left[i]);
			}
		}

		if (cancel != null && cancelFirst)
		{
			footer.appendChild(cancel);
		}

		if (primary != null)
		{
			footer.appendChild(primary);
		}

		if (cancel != null && !cancelFirst)
		{
			footer.appendChild(cancel);
		}
	},
	/**
	 * Gives the focus to the primary action of the given content after it
	 * is shown, if the focus is not in the dialog, so Enter runs it.
	 */
	focusPrimary: function(ui, elt, primary)
	{
		window.setTimeout(function()
		{
			var div = elt.parentNode;

			if (div != null && div.parentNode != null && !div.contains(document.activeElement) &&
				primary != null && !primary.disabled && primary.offsetParent != null)
			{
				primary.focus();
			}
		}, 0);
	}
};

/**
 * Returns true while the theme Fusion is shown, which lays the dialogs out
 * with its own skin (SimpleMessages.js).
 */
AuthLayout.isFusion = function()
{
	return typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern();
};

/**
 * Returns the given height of the given dialog, or null (the height of the
 * content) if the dialog is laid out in the Classic skin.
 */
AuthLayout.getHeight = function(dlg, height)
{
	return (dlg != null && dlg.authLayout != null &&
		dlg.authLayout.skin == AuthLayout.skins.classic) ? null : height;
};

/**
 * Returns the given width of the given dialog, or the width of the Classic
 * skin (AuthLayout.width, AuthLayout.signedInWidth) if the dialog is laid
 * out in that skin.
 */
AuthLayout.getWidth = function(dlg, width)
{
	return (dlg != null && dlg.authLayout != null &&
		dlg.authLayout.skin == AuthLayout.skins.classic) ?
		((dlg.authLayout.kind == 'signedIn') ? AuthLayout.signedInWidth :
		AuthLayout.width) : width;
};

/**
 * Returns true if the sign-in to a storage is shown in the layout of this
 * file: the feature authDialog of Editor.featureDefaults (authDialog in the
 * configuration and the URL), on in Classic, Simple, Sketch and Minimal and
 * in Atlas outside of Confluence and Jira. The theme Fusion always has it.
 */
Editor.isAuthDialogEnabled = function()
{
	return Editor.isFeatureEnabled('authDialog');
};

/**
 * Lays out the given dialog of the given kind (auth: AuthDialog, signedIn:
 * BtnDialog, driveAccess: the content of App.showDriveAccessDialog, with
 * the given content) in the Classic skin where the feature is on (Fusion
 * lays them out in SimpleMessages.js and SimpleFiles.js). Called at the end
 * of the constructors of the dialogs.
 */
EditorUi.prototype.installAuthLayout = function(dlg, kind, content)
{
	if (!AuthLayout.isFusion() && Editor.isAuthDialogEnabled())
	{
		try
		{
			if (kind == 'auth')
			{
				this.createAuthLayout(dlg, AuthLayout.skins.classic);
			}
			else if (kind == 'signedIn')
			{
				this.createSignedInLayout(dlg, AuthLayout.skins.classic);
			}
			else if (kind == 'driveAccess')
			{
				this.createDriveAccessLayout(dlg.container, content,
					AuthLayout.skins.classic, dlg);
			}
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installAuthLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Lays out the given Authorize dialog (AuthDialog) in the given skin: the
 * headline, the text without the colon of the button that was below it,
 * Remember Me, the Terms of Use and the footer with Cancel and Authorize
 * (with the logo of the storage). Authorize is the button of the dialog
 * with its listener; Cancel closes like the close button. Returns null if
 * the dialog has changed, which keeps its layout.
 */
EditorUi.prototype.createAuthLayout = function(dlg, skin)
{
	var div = dlg.container;
	var c = dlg.controls;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.title == null || c.text == null || c.button == null ||
		c.title.parentNode != div || c.button.parentNode != div)
	{
		return null;
	}

	skin.prepare(this, div, 'auth');

	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxUtils.trim(c.title.textContent));
	div.insertBefore(h3, c.title);
	c.title.classList.add(skin.classes.replaced);

	// The text without the colon of the button below it: the ASCII colon,
	// the full-width colon of Chinese (U+FF1A) and the colon before the
	// closing mark of the texts of right-to-left languages (U+202C in Hebrew
	// and Persian), which stays
	var text = mxUtils.trim(c.text.textContent).replace(
		/\s*[:\uFF1A]\s*([\u200E\u200F\u202A-\u202E]*)$/, '$1');
	c.text.textContent = '';
	mxUtils.write(c.text, text);
	c.text.className = skin.classes.text;

	// Remember Me as a checkbox or a switch of the skin
	var remember = null;

	if (c.remember != null && c.rememberRow != null && c.rememberRow.parentNode == div)
	{
		remember = skin.createCheck(this, c.remember, mxResources.get('rememberMe'));
		div.insertBefore(remember, c.rememberRow);
		c.rememberRow.classList.add(skin.classes.replaced);
	}

	if (c.notice != null && c.notice.parentNode == div)
	{
		c.notice.classList.add(skin.classes.notice);
		c.notice.style.margin = '';
	}

	// Cancel closes like the close button, Authorize is the primary action
	var footer = document.createElement('div');
	footer.className = skin.classes.footer;
	var cancel = mxUtils.button(mxResources.get('cancel'), mxUtils.bind(this, function()
	{
		this.hideDialog(true);
	}));
	cancel.className = 'geBtn';

	var btn = c.button;
	btn.className = 'geBtn gePrimaryBtn';
	btn.style.marginTop = '';
	btn.style.fontSize = '';
	btn.style.padding = '';

	// The logo of the storage
	var img = btn.querySelector('img');

	if (img != null)
	{
		skin.prepareLogo(this, img, 'auth');
	}

	skin.arrangeFooter(this, footer, [], cancel, btn);
	div.appendChild(footer);
	skin.focusPrimary(this, div, btn);

	dlg.authLayout = {skin: skin, kind: 'auth', title: h3, remember: remember,
		cancel: cancel, button: btn, footer: footer};

	return dlg.authLayout;
};

/**
 * Lays out the given end of a sign-in (BtnDialog) in the given skin: Done as
 * the headline, the text ("You are now authorized in ...") and the button of
 * the dialog with the logo of the storage as the primary action. Returns
 * null if the dialog has changed, which keeps its layout.
 */
EditorUi.prototype.createSignedInLayout = function(dlg, skin)
{
	var div = dlg.container;
	var btn = div.querySelector('button');
	var ps = div.querySelectorAll('p');

	if (btn == null || ps.length != 2)
	{
		return null;
	}

	var name = mxUtils.trim(ps[1].textContent);
	div.textContent = '';
	div.style.textAlign = '';
	skin.prepare(this, div, 'signedIn');
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('done'));
	div.appendChild(h3);
	var text = document.createElement('div');

	if (skin.classes.signedInText != null)
	{
		text.className = skin.classes.signedInText;
	}

	mxUtils.write(text, name);
	div.appendChild(text);
	var footer = document.createElement('div');

	if (skin.classes.signedInFooter != null)
	{
		footer.className = skin.classes.signedInFooter;
	}

	btn.className = 'geBtn gePrimaryBtn';
	btn.style.marginTop = '';
	btn.style.fontSize = '';
	btn.style.padding = '';

	// The logo of the storage is a picture of the button
	var img = btn.querySelector('img');

	if (img != null)
	{
		skin.prepareLogo(this, img, 'signedIn');
	}

	footer.appendChild(btn);
	div.appendChild(footer);

	if (skin.focusSignedIn !== false)
	{
		skin.focusPrimary(this, div, btn);
	}

	dlg.authLayout = {skin: skin, kind: 'signedIn', title: h3, button: btn, footer: footer};

	return dlg.authLayout;
};

/**
 * Lays out the access to a file of Google Drive (the given content of the
 * dialog of App.showDriveAccessDialog in the given element) in the given
 * skin: Google Drive and the account as the subtitle of the headline, the
 * text, Open in Google Drive and Change User as tertiary actions below it,
 * Cancel and Allow access in the footer of the dialog. The optional dialog
 * gets the layout.
 */
EditorUi.prototype.createDriveAccessLayout = function(elt, content, skin, dlg)
{
	skin.prepare(this, elt, 'driveAccess');
	var h3 = content.querySelector('h3');
	var msg = (h3 != null) ? h3.nextSibling : null;

	if (h3 != null && this.drive != null && typeof this.drive.getUser === 'function')
	{
		var user = this.drive.getUser();
		skin.addSubtitle(this, h3, (user != null && user.email != null) ?
			[mxResources.get('googleDrive'), user.email] : [mxResources.get('googleDrive')]);

		// Fusion styles the line after the headline, the subtitle, as the
		// text, as it did before this layout was shared (see its skin)
		if (skin.subtitleAsText)
		{
			msg = h3.nextSibling;
		}
	}

	if (msg != null && msg.nodeName == 'DIV')
	{
		msg.style.lineHeight = '';
		msg.classList.add(skin.classes.text);
	}

	var links = content.querySelectorAll('.geHomeLink');

	for (var i = 0; i < links.length; i++)
	{
		for (var j = 0; j < skin.classes.link.length; j++)
		{
			links[i].classList.add(skin.classes.link[j]);
		}
	}

	skin.focusPrimary(this, elt, elt.querySelector('.gePrimaryBtn'));
	var layout = {skin: skin, kind: 'driveAccess', title: h3};

	if (dlg != null)
	{
		dlg.authLayout = layout;
	}

	return layout;
};
