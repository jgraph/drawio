/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * Home screen for Google Drive (App.showHome): the diagrams draw.io can open,
 * newest first, with search, starred and shared views, and one-click ways to
 * add the rest from Google Drive. With drive.file, Drive only lists the files
 * the user created or opened with draw.io, which the hint under the header
 * explains.
 *
 * Names, owners and links all come from Drive, so text is only set with
 * mxUtils.write, file IDs are checked with DriveClient.isFileId and
 * thumbnails must be https links on Google hosts (getThumbnailUrl). Listings
 * are kept in memory only (editorUi.homeCache), never in local storage.
 */
var HomeDialog = function(editorUi, startup)
{
	this.editorUi = editorUi;
	this.drive = editorUi.drive;
	this.startup = startup;
	this.filter = 'recent';
	this.search = '';
	this.files = [];
	this.nextPageToken = null;
	this.requestId = 0;
	this.searchThread = null;
	this.destroyed = false;

	var div = document.createElement('div');
	div.className = 'geHome';

	// Header: storage, search and new diagram
	var header = document.createElement('div');
	header.className = 'geHomeHeader';

	var title = document.createElement('div');
	title.className = 'geHomeTitle';
	var logo = document.createElement('img');
	logo.setAttribute('src', IMAGE_PATH + '/google-drive-logo.svg');
	logo.setAttribute('alt', '');
	title.appendChild(logo);
	var titleText = document.createElement('span');
	mxUtils.write(titleText, mxResources.get('googleDrive'));
	title.appendChild(titleText);
	header.appendChild(title);

	var search = document.createElement('input');
	search.className = 'geHomeSearch';
	search.setAttribute('type', 'search');
	search.setAttribute('autocomplete', 'off');
	search.setAttribute('spellcheck', 'false');
	search.setAttribute('maxlength', String(this.drive.maxSearchLength));
	search.setAttribute('placeholder', this.getString('searchDiagrams', 'Search diagrams'));
	search.setAttribute('aria-label', this.getString('searchDiagrams', 'Search diagrams'));
	header.appendChild(search);
	this.searchInput = search;

	mxEvent.addListener(search, 'input', mxUtils.bind(this, function()
	{
		this.scheduleSearch(300);
	}));

	mxEvent.addListener(search, 'keydown', mxUtils.bind(this, function(evt)
	{
		// Enter and Escape also end an IME composition
		if (evt.isComposing || evt.keyCode == 229)
		{
			return;
		}
		else if (evt.key == 'Enter')
		{
			this.scheduleSearch(0);
			mxEvent.consume(evt);
		}
		// Escape clears the search before it closes the dialog
		else if (evt.key == 'Escape' && search.value.length > 0)
		{
			search.value = '';
			this.scheduleSearch(0);
			mxEvent.consume(evt);
		}
	}));

	var newBtn = mxUtils.button(mxResources.get('newDiagram'), mxUtils.bind(this, function()
	{
		this.createDiagram();
	}));
	newBtn.className = 'geBtn gePrimaryBtn geHomeNewButton';
	header.appendChild(newBtn);
	div.appendChild(header);

	// Body: views on the left, diagrams on the right
	var body = document.createElement('div');
	body.className = 'geHomeBody';

	var nav = document.createElement('div');
	nav.className = 'geHomeNav';
	nav.setAttribute('role', 'navigation');
	this.navItems = {};

	var addNavItem = mxUtils.bind(this, function(label, fn, filter)
	{
		var item = mxUtils.button(label, fn);
		item.className = 'geHomeNavItem';
		item.setAttribute('title', label);
		nav.appendChild(item);

		if (filter != null)
		{
			this.navItems[filter] = item;
		}

		return item;
	});

	addNavItem(mxResources.get('recent'), mxUtils.bind(this, function()
	{
		this.setFilter('recent');
	}), 'recent');

	addNavItem(this.getString('starred', 'Starred'), mxUtils.bind(this, function()
	{
		this.setFilter('starred');
	}), 'starred');

	addNavItem(mxResources.get('sharedWithMe'), mxUtils.bind(this, function()
	{
		this.setFilter('shared');
	}), 'shared');

	var sep = document.createElement('div');
	sep.className = 'geHomeNavSeparator';
	nav.appendChild(sep);

	addNavItem(this.getString('addFromDrive', 'Add from Google Drive'), mxUtils.bind(this, function()
	{
		this.pick({multiple: true});
	}));

	// Changing storage only makes sense before a file is open
	if (startup)
	{
		addNavItem(mxResources.get('changeStorage'), function()
		{
			editorUi.hideDialog(false);
			editorUi.setMode(null);
			editorUi.clearMode();
			editorUi.showSplash(true);
		});
	}

	var user = this.drive.getUser();

	if (user != null && typeof user.email === 'string' && user.email.length > 0)
	{
		var footer = document.createElement('div');
		footer.className = 'geHomeNavFooter geDialogHint';
		mxUtils.write(footer, this.getString('signedInAs', 'Signed in as {1}', [user.email]));
		nav.appendChild(footer);
	}

	body.appendChild(nav);

	var main = document.createElement('div');
	main.className = 'geHomeMain';

	this.hint = document.createElement('p');
	this.hint.className = 'geHomeHint geDialogHint';
	main.appendChild(this.hint);

	// Empty, error and loading states are announced to screen readers
	this.status = document.createElement('div');
	this.status.className = 'geHomeStatus';
	this.status.setAttribute('aria-live', 'polite');
	this.status.style.display = 'none';
	main.appendChild(this.status);

	this.grid = document.createElement('div');
	this.grid.className = 'geHomeGrid';
	main.appendChild(this.grid);

	this.more = document.createElement('div');
	this.more.className = 'geHomeMore';
	this.more.style.display = 'none';
	this.moreButton = mxUtils.button(this.getString('loadMore', 'Load more'), mxUtils.bind(this, function()
	{
		this.load(true);
	}));
	this.moreButton.className = 'geBtn';
	this.more.appendChild(this.moreButton);

	this.moreError = document.createElement('div');
	this.moreError.className = 'geDialogHint';
	this.moreError.setAttribute('aria-live', 'polite');
	this.more.appendChild(this.moreError);
	main.appendChild(this.more);

	body.appendChild(main);
	div.appendChild(body);

	this.container = div;
};

/**
 * Returns the translated string for key, or the given English default while
 * the translations of new keys are pending.
 */
HomeDialog.prototype.getString = function(key, defaultValue, params)
{
	return mxResources.get(key, params, defaultValue);
};

/**
 * Starts loading once the dialog is in the DOM.
 */
HomeDialog.prototype.init = function()
{
	// Narrow dialogs stack the views above the diagrams
	if (this.container.clientWidth < 600)
	{
		this.container.className += ' geHomeNarrow';
	}

	this.setFilter('recent');
};

/**
 * Stops pending work when the dialog closes.
 */
HomeDialog.prototype.destroy = function()
{
	this.destroyed = true;

	if (this.searchThread != null)
	{
		window.clearTimeout(this.searchThread);
		this.searchThread = null;
	}
};

/**
 * Shows the given view (recent, starred or shared) and clears the search.
 */
HomeDialog.prototype.setFilter = function(filter)
{
	this.filter = filter;
	this.search = '';
	this.searchInput.value = '';

	for (var key in this.navItems)
	{
		this.navItems[key].setAttribute('aria-current', (key == filter) ? 'true' : 'false');
	}

	this.load(false);
};

/**
 * Searches for the text in the search field after the given delay.
 */
HomeDialog.prototype.scheduleSearch = function(delay)
{
	if (this.searchThread != null)
	{
		window.clearTimeout(this.searchThread);
	}

	this.searchThread = window.setTimeout(mxUtils.bind(this, function()
	{
		this.searchThread = null;
		var value = this.searchInput.value.trim();

		if (value != this.search)
		{
			this.search = value;
			this.load(false);
		}
	}), delay);
};

/**
 * Returns the key of the current listing in editorUi.homeCache, or null if
 * it isn't cached (searches aren't).
 */
HomeDialog.prototype.getCacheKey = function()
{
	var user = this.drive.getUser();

	return (this.search.length == 0 && user != null) ? user.id + '\n' + this.filter : null;
};

/**
 * Loads the current listing, or its next page if append is true. A cached
 * listing shows at once and is refreshed behind it. Load more waits for
 * that refresh, since the cached next page token may have expired.
 */
HomeDialog.prototype.load = function(append)
{
	if (append && (this.loading || this.nextPageToken == null))
	{
		return;
	}

	var requestId = ++this.requestId;
	var key = this.getCacheKey();
	this.loading = !append;
	this.grid.setAttribute('aria-busy', 'true');
	this.moreError.innerText = '';

	if (!append)
	{
		this.renderHint();

		var cached = (key != null && this.editorUi.homeCache != null) ?
			this.editorUi.homeCache[key] : null;

		if (cached != null)
		{
			this.files = cached.files;
			this.nextPageToken = cached.nextPageToken;
			this.render();
		}
		else
		{
			this.files = [];
			this.nextPageToken = null;
			this.renderSkeleton();
		}
	}
	else
	{
		// Disabling the button drops its focus, which goes to the first new card
		this.focusNewCards = document.activeElement == this.moreButton;
		this.moreButton.setAttribute('disabled', 'disabled');
	}

	this.drive.listDiagrams({filter: this.filter, search: this.search,
		pageToken: (append) ? this.nextPageToken : null}, mxUtils.bind(this, function(result)
	{
		if (!this.destroyed && requestId == this.requestId)
		{
			this.loading = false;
			this.files = (append) ? this.addFiles(this.files, result.files) : result.files;
			this.nextPageToken = result.nextPageToken;

			if (key != null && !append)
			{
				this.editorUi.homeCache = this.editorUi.homeCache || {};
				this.editorUi.homeCache[key] = {files: this.files, nextPageToken: this.nextPageToken};
			}

			this.render(append);
		}
	}), mxUtils.bind(this, function()
	{
		if (!this.destroyed && requestId == this.requestId)
		{
			this.loading = false;
			this.grid.setAttribute('aria-busy', 'false');

			if (append)
			{
				this.moreButton.removeAttribute('disabled');
				mxUtils.write(this.moreError, this.getString('couldNotLoadDiagrams',
					'Couldn\'t load your diagrams'));

				if (this.focusNewCards && this.isFocusLost())
				{
					this.moreButton.focus();
				}
			}
			else
			{
				this.renderError();
			}
		}
	}));
};

/**
 * Returns true if nothing has the keyboard focus, e.g. after the focused
 * element was disabled or removed.
 */
HomeDialog.prototype.isFocusLost = function()
{
	return document.activeElement == null || document.activeElement == document.body;
};

/**
 * Returns the given files followed by the ones in more that aren't in files.
 * A listing that changed between two pages can repeat a file.
 */
HomeDialog.prototype.addFiles = function(files, more)
{
	var result = files.slice();
	var ids = Object.create(null);

	for (var i = 0; i < files.length; i++)
	{
		ids[files[i].id] = true;
	}

	for (var i = 0; i < more.length; i++)
	{
		if (ids[more[i].id] !== true)
		{
			ids[more[i].id] = true;
			result.push(more[i]);
		}
	}

	return result;
};

/**
 * Empties the grid and the status area.
 */
HomeDialog.prototype.clear = function()
{
	this.grid.innerText = '';
	this.status.innerText = '';
	this.status.style.display = 'none';
	this.more.style.display = 'none';
};

/**
 * Shows the hint for the current view. Diagrams shared with the user are
 * only listed once they were opened with draw.io, so Shared with me says
 * how to add one.
 */
HomeDialog.prototype.renderHint = function()
{
	this.hint.innerText = '';

	if (this.isSharedView())
	{
		mxUtils.write(this.hint, this.getString('sharedDiagramMissing',
			'Don\'t see a diagram someone shared with you?') + ' ');

		var link = mxUtils.button(this.getString('findInGoogleDrive', 'Find it in Google Drive'),
			mxUtils.bind(this, function()
		{
			this.pick({multiple: true, shared: true});
		}));
		link.className = 'geHomeLink';
		this.hint.appendChild(link);
	}
	else
	{
		mxUtils.write(this.hint, this.getString('homeFilesHint',
			'Only diagrams you created or opened with draw.io are listed.'));
	}
};

/**
 * Returns true if Shared with me is shown without a search.
 */
HomeDialog.prototype.isSharedView = function()
{
	return this.filter == 'shared' && this.search.length == 0;
};

/**
 * Shows placeholder cards while the first page loads.
 */
HomeDialog.prototype.renderSkeleton = function()
{
	this.clear();

	for (var i = 0; i < 8; i++)
	{
		var card = document.createElement('div');
		card.className = 'geHomeCard geHomeSkeleton';
		card.setAttribute('aria-hidden', 'true');

		var thumb = document.createElement('div');
		thumb.className = 'geHomeThumb';
		card.appendChild(thumb);

		var text = document.createElement('div');
		text.className = 'geHomeCardText';
		var cardTitle = document.createElement('div');
		cardTitle.className = 'geHomeCardTitle';
		text.appendChild(cardTitle);
		var meta = document.createElement('div');
		meta.className = 'geHomeCardMeta';
		text.appendChild(meta);
		card.appendChild(text);

		this.grid.appendChild(card);
	}
};

/**
 * Shows the listing, the card that adds more diagrams for the current view
 * and, if there are more pages, the load more button. Keeps the keyboard
 * focus on the same card, or moves it from load more to the first new card.
 */
HomeDialog.prototype.render = function(append)
{
	var active = document.activeElement;
	var focusKey = (active != null && active.parentNode == this.grid) ? active.homeKey : null;
	var focusIndex = -1;

	// After load more, the first new card is the one after the old cards
	if (append && this.focusNewCards && this.isFocusLost())
	{
		focusIndex = 0;

		for (var i = 0; i < this.grid.children.length; i++)
		{
			if (this.grid.children[i].homeKey != 'add')
			{
				focusIndex++;
			}
		}
	}

	this.focusNewCards = false;
	this.clear();

	if (this.files.length == 0)
	{
		this.renderStatus((this.search.length > 0) ?
			this.getString('noDiagramsFound', 'No diagrams found') :
			this.getString('noDiagramsYet', 'No diagrams yet'),
			this.getString('homeEmptyHint', 'Create a new diagram, or add existing ones from Google Drive.'));
	}

	var addCard = null;

	if (this.search.length > 0)
	{
		addCard = this.createAddCard(this.getString('searchAllOfDrive',
			'Search all of Google Drive'), {multiple: true, search: this.search});
	}
	else if (this.filter == 'shared')
	{
		addCard = this.createAddCard(this.getString('findSharedDiagrams',
			'Find diagrams shared with you'), {multiple: true, shared: true});
	}
	else
	{
		addCard = this.createAddCard(this.getString('addFromDrive',
			'Add from Google Drive'), {multiple: true});
	}

	// Shared diagrams must be added before they are listed, so that comes first
	if (this.isSharedView())
	{
		this.grid.appendChild(addCard);
	}

	for (var i = 0; i < this.files.length; i++)
	{
		this.grid.appendChild(this.createCard(this.files[i]));
	}

	if (addCard.parentNode == null)
	{
		this.grid.appendChild(addCard);
	}

	if (this.loading)
	{
		this.moreButton.setAttribute('disabled', 'disabled');
	}
	else
	{
		this.moreButton.removeAttribute('disabled');
		this.grid.setAttribute('aria-busy', 'false');
	}

	this.more.style.display = (this.nextPageToken != null) ? '' : 'none';

	for (var i = 0, fileIndex = 0; i < this.grid.children.length; i++)
	{
		var card = this.grid.children[i];

		if ((focusKey != null && card.homeKey == focusKey) ||
			(card.homeKey != 'add' && fileIndex++ == focusIndex))
		{
			card.focus();

			break;
		}
	}
};

/**
 * Shows a title and an explanation above the grid.
 */
HomeDialog.prototype.renderStatus = function(titleText, hintText, button)
{
	this.status.innerText = '';

	var statusTitle = document.createElement('div');
	statusTitle.className = 'geHomeStatusTitle';
	mxUtils.write(statusTitle, titleText);
	this.status.appendChild(statusTitle);

	if (hintText != null)
	{
		var hint = document.createElement('div');
		hint.className = 'geDialogHint';
		mxUtils.write(hint, hintText);
		this.status.appendChild(hint);
	}

	if (button != null)
	{
		this.status.appendChild(button);
	}

	this.status.style.display = '';
};

/**
 * Shows that the listing failed, with a retry button. Sign-in problems are
 * handled by DriveClient.execute before this.
 */
HomeDialog.prototype.renderError = function()
{
	this.clear();
	this.grid.setAttribute('aria-busy', 'false');

	var retry = mxUtils.button(mxResources.get('tryAgain'), mxUtils.bind(this, function()
	{
		this.load(false);
	}));
	retry.className = 'geBtn';

	this.renderStatus(this.getString('couldNotLoadDiagrams', 'Couldn\'t load your diagrams'), null, retry);
};

/**
 * Returns a card for the given file.
 */
HomeDialog.prototype.createCard = function(file)
{
	var name = (typeof file.name === 'string' && file.name.length > 0) ?
		file.name : mxResources.get('untitledDiagram');
	var card = mxUtils.button('', mxUtils.bind(this, function(evt)
	{
		this.open(file, evt);
	}));
	card.className = 'geHomeCard';
	card.setAttribute('title', name);
	card.homeKey = file.id;

	// Middle-click opens a new window, like a link
	mxEvent.addListener(card, 'auxclick', mxUtils.bind(this, function(evt)
	{
		if (evt.button == 1)
		{
			this.openInNewWindow(file);
			mxEvent.consume(evt);
		}
	}));

	// Spans, since a button may only hold phrasing content
	var thumb = document.createElement('span');
	thumb.className = 'geHomeThumb';
	var img = document.createElement('img');
	img.setAttribute('alt', '');
	img.setAttribute('loading', 'lazy');
	img.setAttribute('decoding', 'async');
	img.setAttribute('referrerpolicy', 'no-referrer');
	var src = this.getThumbnailUrl(file);

	var showPlaceholder = function()
	{
		img.className = 'geHomePlaceholder';
		img.setAttribute('src', IMAGE_PATH + '/drawlogo48.png');
	};

	if (src != null)
	{
		mxEvent.addListener(img, 'error', function handler()
		{
			mxEvent.removeListener(img, 'error', handler);
			showPlaceholder();
		});

		img.setAttribute('src', src);
	}
	else
	{
		showPlaceholder();
	}

	thumb.appendChild(img);
	card.appendChild(thumb);

	var text = document.createElement('span');
	text.className = 'geHomeCardText';

	var cardTitle = document.createElement('span');
	cardTitle.className = 'geHomeCardTitle';
	mxUtils.write(cardTitle, name.replace(/\.drawio$/i, ''));
	text.appendChild(cardTitle);

	var meta = document.createElement('span');
	meta.className = 'geHomeCardMeta';
	mxUtils.write(meta, this.getMeta(file));
	text.appendChild(meta);

	card.appendChild(text);

	return card;
};

/**
 * Returns a card that opens the Google Picker with the given options.
 */
HomeDialog.prototype.createAddCard = function(label, options)
{
	var card = mxUtils.button('', mxUtils.bind(this, function()
	{
		this.pick(options);
	}));
	card.className = 'geHomeCard geHomeAddCard';
	card.homeKey = 'add';

	var icon = document.createElement('span');
	icon.className = 'geHomeAddIcon';
	icon.setAttribute('aria-hidden', 'true');
	mxUtils.write(icon, '+');
	card.appendChild(icon);

	var text = document.createElement('span');
	mxUtils.write(text, label);
	card.appendChild(text);

	return card;
};

/**
 * Returns the thumbnail link of the file if it is an https link on a Google
 * host, sized for the cards, or null. Drive only hands out short-lived
 * links, and draw.io uploads a thumbnail on every save.
 */
HomeDialog.prototype.getThumbnailUrl = function(file)
{
	var url = file.thumbnailLink;

	if (typeof url === 'string' &&
		/^https:\/\/([a-z0-9-]+\.)*(googleusercontent\.com|google\.com)\//i.test(url))
	{
		return url.replace(/=s\d+$/, '=s400');
	}

	return null;
};

/**
 * Returns the line under the name: when the file last changed and, if the
 * user doesn't own it, who does.
 */
HomeDialog.prototype.getMeta = function(file)
{
	var parts = [];
	var time = this.formatTime(file.modifiedTime);

	if (time != null)
	{
		parts.push(time);
	}

	if (file.ownedByMe === false && Array.isArray(file.owners) && file.owners.length > 0 &&
		file.owners[0] != null && typeof file.owners[0].displayName === 'string')
	{
		parts.push(file.owners[0].displayName);
	}

	return parts.join(' · ');
};

/**
 * Returns the given RFC 3339 time as a relative time in the user's language
 * for the last week, else as a date.
 */
HomeDialog.prototype.formatTime = function(value)
{
	var date = (typeof value === 'string') ? new Date(value) : null;

	if (date == null || isNaN(date.getTime()))
	{
		return null;
	}

	try
	{
		var secs = (date.getTime() - Date.now()) / 1000;
		var abs = Math.abs(secs);

		if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat != null && abs < 7 * 86400)
		{
			var rtf = new Intl.RelativeTimeFormat(mxLanguage || undefined, {numeric: 'auto'});

			if (abs < 60)
			{
				return rtf.format(0, 'second');
			}
			else if (abs < 3600)
			{
				return rtf.format(Math.round(secs / 60), 'minute');
			}
			else if (abs < 86400)
			{
				return rtf.format(Math.round(secs / 3600), 'hour');
			}
			else
			{
				return rtf.format(Math.round(secs / 86400), 'day');
			}
		}

		return date.toLocaleDateString(this.editorUi.getDateLocale(),
			{year: 'numeric', month: 'short', day: 'numeric'});
	}
	catch (e)
	{
		return date.toLocaleDateString();
	}
};

/**
 * Opens the file in this window, or in a new one if a modifier key is down.
 */
HomeDialog.prototype.open = function(file, evt)
{
	if (file != null && DriveClient.isFileId(file.id))
	{
		if (evt != null && (mxEvent.isControlDown(evt) || mxEvent.isMetaDown(evt) ||
			mxEvent.isShiftDown(evt)))
		{
			this.openInNewWindow(file);
		}
		else
		{
			this.editorUi.hideDialog();
			this.editorUi.loadFile('G' + file.id);
		}
	}
};

/**
 * Opens the file in a new window.
 */
HomeDialog.prototype.openInNewWindow = function(file)
{
	if (file != null && DriveClient.isFileId(file.id))
	{
		this.editorUi.openLink(this.editorUi.getUrl() + '#G' + file.id);
	}
};

/**
 * Closes the Home screen and shows the new diagram dialog. Cancelling that
 * dialog with no file open comes back here (App.showSplash).
 */
HomeDialog.prototype.createDiagram = function()
{
	this.editorUi.hideDialog();
	this.editorUi.actions.get('new').funct();
};

/**
 * Shows the Google Picker. Picking one file opens it; picking several adds
 * them to the listing, since drive.file can now see them.
 */
HomeDialog.prototype.pick = function(options)
{
	this.drive.pickDiagrams(options, mxUtils.bind(this, function(docs)
	{
		if (!this.destroyed)
		{
			if (docs.length == 1)
			{
				this.open(docs[0]);
			}
			else if (docs.length > 1)
			{
				this.editorUi.homeCache = null;
				this.setFilter('recent');
			}
		}
	}));
};
