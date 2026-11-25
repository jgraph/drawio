/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The page overview: the menu of the page tabs (≡) in Classic, Simple,
 * Sketch, Minimal and Atlas and All Pages of Fusion (the driver, 17 November
 * 2026: the page menu of Fusion with its previews and its search in every
 * theme, the previews optional). It shows the pages as tiles with previews
 * or as a list of their names, with the switch of the view at the top
 * right, the search for more than six pages, Insert Page at the end and the
 * menu of the page (createPageMenu: Rename, Delete, Move, Duplicate, ...)
 * in the … of each page; ⋯ in its head has the other items of the menu
 * Pages (Insert Page, Insert Page Group, Sort Pages, Page Groups, Delete
 * All). The view is the choice of the user in this browser (mxSettings
 * pageOverviewView), else tiles in Fusion and the list in the other themes.
 * The list makes no thumbnails.
 *
 * The overview is the same code in every theme with the parts of a look
 * (EditorUi.pageOverviewSkins): the Classic skin here, whose CSS is in
 * grapheditor.css under .gePageOverview, and the skin of Fusion, which
 * SimplePages.js adds (its classes start with geSm). The menu of the page
 * tabs shows it while the feature pageOverview of Editor.featureDefaults
 * is on (EditorUi.isPageOverviewEnabled), else the menu Pages as before.
 *
 * The thumbnails are SVG images of the pages as the canvas shows them in
 * the mode of the app, on the paper of the page (createPageThumbnail, also
 * used by the page tiles of Edit Link in Fusion), made when their tile is
 * shown, one after the other, kept while the overview is open and made
 * again when dark mode changes.
 *
 * The search changes only the tiles that appear or disappear (filterCards
 * in createPageOverview): a keystroke that finds the same pages changes
 * nothing, so no tile is made again and the previews, the scroll position
 * and the focus in the field stay; the tiles are made again only where
 * the pages, their names, the current page, the view or the lock changed.
 *
 * Load after Pages.js, Menus.js and PreviewDialog.js.
 */
(function()
{
	/**
	 * Maximum number of pages with a thumbnail in Edit Link and the page
	 * overview where the browser has no IntersectionObserver (else the tiles
	 * in view make theirs) and of their cells (larger pages keep the glyph of
	 * a page).
	 */
	EditorUi.simpleLinkThumbs = {pages: 24, cells: 500};

	/**
	 * Returns the number of cells of the given root up to the given maximum
	 * plus one.
	 */
	EditorUi.countSimpleCells = function(root, max)
	{
		var count = 0;
		var stack = [root];

		while (stack.length > 0 && count <= max)
		{
			var cell = stack.pop();
			count++;

			for (var i = 0; cell.children != null && i < cell.children.length; i++)
			{
				stack.push(cell.children[i]);
			}
		}

		return count;
	};

	/**
	 * Returns the number of cells in the given XML of a graph model up to the
	 * given maximum plus one.
	 */
	EditorUi.countSimpleXmlCells = function(node, max)
	{
		var count = 0;
		var root = (node != null) ? node.firstChild : null;

		while (root != null && root.nodeName != 'root')
		{
			root = root.nextSibling;
		}

		for (var child = (root != null) ? root.firstChild : null; child != null &&
			count <= max; child = child.nextSibling)
		{
			if (child.nodeType == mxConstants.NODETYPE_ELEMENT)
			{
				count++;
			}
		}

		return count;
	};

	/**
	 * Returns a data URI of an SVG of the given page for a thumbnail, or null
	 * for empty pages and pages of more than EditorUi.simpleLinkThumbs.cells
	 * (see createPageThumbnail, which also returns the paper of the page).
	 */
	EditorUi.prototype.createSimplePageThumbnail = function(page)
	{
		var thumb = this.createPageThumbnail(page);

		return (thumb != null) ? thumb.src : null;
	};

	/**
	 * Returns the theme of a thumbnail of the given graph as the canvas
	 * shows it: dark in dark mode unless the adaptive colors of the page
	 * are off (adaptiveColors none in the page or Graph.defaultAdaptiveColors
	 * in the configuration), which keeps the page light on the canvas.
	 */
	EditorUi.prototype.getPageThumbnailTheme = function(graph)
	{
		return (Editor.isDarkMode() && graph.getAdaptiveColors() != 'none') ? 'dark' : 'light';
	};

	/**
	 * Returns the CSS color of the paper of a thumbnail of the given graph
	 * as the canvas paints its page (see validateBackgroundStyles): the
	 * background of the page, as it is with the simple adaptive colors, else
	 * the default page background. The background comes from the file, so
	 * only safe colors are used (see Graph.isSafeCssColor).
	 */
	EditorUi.prototype.getPageThumbnailBackground = function(graph)
	{
		var bg = graph.background;

		if (bg != null && bg != mxConstants.NONE && Graph.isSafeCssColor(bg))
		{
			return (graph.getAdaptiveColors() == 'simple') ? mxUtils.trim(bg) :
				mxUtils.getLightDarkColor(bg).cssText;
		}

		return mxUtils.getLightDarkColor(graph.defaultPageBackgroundColor).cssText;
	};

	/**
	 * Returns the thumbnail of the given page as the canvas shows it in the
	 * current mode as {src, theme, background, gradient} (the data URI of an
	 * SVG of the page in the theme, see getPageThumbnailTheme, and the color
	 * and the gradient of its paper, see setPageThumbnailPaper), or null for
	 * empty pages and pages of more than EditorUi.simpleLinkThumbs.cells.
	 */
	EditorUi.prototype.createPageThumbnail = function(page)
	{
		var index = mxUtils.indexOf(this.pages, page);

		if (index < 0)
		{
			return null;
		}

		// Pages that are not decoded yet are counted in their XML, so larger
		// pages are not decoded (and kept) for a thumbnail
		if (page.root == null && EditorUi.countSimpleXmlCells(this.editor.extractGraphModel(page.node),
			EditorUi.simpleLinkThumbs.cells) > EditorUi.simpleLinkThumbs.cells)
		{
			return null;
		}

		this.updatePageRoot(page);
		var count = (page.root != null) ? EditorUi.countSimpleCells(page.root,
			EditorUi.simpleLinkThumbs.cells) : 0;

		// The root and a layer are not shown
		if (count <= 2 || count > EditorUi.simpleLinkThumbs.cells)
		{
			return null;
		}

		var graph = (page == this.currentPage) ? this.editor.graph : this.createPageGraph(page, index);

		try
		{
			// The SVG has no background, the paper of the thumbnail shows it
			var theme = this.getPageThumbnailTheme(graph);
			var svg = graph.getSvg(null, 1, 0, false, null, true, null, null, null, false, null, theme);
			var gradient = graph.getBackgroundGradient();

			return {src: Editor.createSvgDataUri(mxUtils.getXml(svg)), theme: theme,
				background: this.getPageThumbnailBackground(graph),
				gradient: (gradient != null) ? Graph.createBackgroundGradientCss(gradient,
					graph.getAdaptiveColors() != 'simple') : null};
		}
		finally
		{
			if (graph != this.editor.graph && graph.container.parentNode != null)
			{
				graph.container.parentNode.removeChild(graph.container);
			}
		}
	};

	/**
	 * Paints the given element as the paper of the given thumbnail (see
	 * createPageThumbnail): the color and the gradient of the page in the
	 * theme of the thumbnail, so a page that stays light is light in dark
	 * mode. Null restores the paper of the stylesheet (the glyph of a page).
	 */
	EditorUi.setPageThumbnailPaper = function(elt, thumb)
	{
		elt.style.colorScheme = (thumb != null) ? thumb.theme : '';
		elt.style.backgroundColor = (thumb != null) ? thumb.background : '';
		elt.style.backgroundImage = (thumb != null && thumb.gradient != null) ? thumb.gradient : '';
	};

	/**
	 * The glyphs of the overview (outlines of 1.8 on a grid of 24, as the
	 * icons of Fusion): masks over the color of the text, so one asset serves
	 * light and dark mode.
	 */
	EditorUi.pageOverviewIcons = (function()
	{
		var icon = function(content)
		{
			return Editor.createSvgDataUri('<svg xmlns="http://www.w3.org/2000/svg" ' +
				'viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" ' +
				'stroke-linecap="round" stroke-linejoin="round">' + content + '</svg>');
		};

		return {
			tiles: icon('<rect x="4" y="4" width="6.5" height="6.5" rx="1.2"/>' +
				'<rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2"/>' +
				'<rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2"/>' +
				'<rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2"/>'),
			list: icon('<path d="M9 6.5h11M9 12h11M9 17.5h11"/>' +
				'<path d="M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" stroke-width="2.6"/>'),
			more: icon('<path d="M5.5 12h.01M12 12h.01M18.5 12h.01" stroke-width="2.6"/>'),
			close: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
			search: icon('<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>'),
			page: icon('<path d="M6.5 3.5h7l4 4v13h-11z"/><path d="M13.5 3.5v4h4"/>'),
			plus: icon('<path d="M12 5v14M5 12h14"/>')
		};
	})();

	/**
	 * Returns true if the menu of the page tabs shows the page overview: the
	 * feature pageOverview of Editor.featureDefaults (pageOverview=0 in the
	 * URL or pageOverview: false in the configuration bring back the menu).
	 */
	EditorUi.prototype.isPageOverviewEnabled = function()
	{
		return this.isFeatureEnabled('pageOverview');
	};

	/**
	 * Returns the view of the page overview: the choice of the user in this
	 * browser, else tiles in Fusion and list in the other themes (the driver,
	 * 17 November 2026: the list is closer to the menu of before).
	 */
	EditorUi.prototype.getPageOverviewView = function()
	{
		var view = (typeof mxSettings !== 'undefined' && mxSettings.settings != null &&
			typeof mxSettings.getPageOverviewView === 'function') ?
			mxSettings.getPageOverviewView() : null;

		return (view != null) ? view : ((Editor.getFeatureTheme() == 'fusion') ? 'tiles' : 'list');
	};

	/**
	 * Stores the given view of the page overview (tiles or list) in this
	 * browser.
	 */
	EditorUi.prototype.setPageOverviewView = function(view)
	{
		if (typeof mxSettings !== 'undefined' && mxSettings.settings != null &&
			typeof mxSettings.setPageOverviewView === 'function')
		{
			mxSettings.setPageOverviewView(view);
			mxSettings.save();
		}
	};

	/**
	 * The parts of the overview that depend on the look. A skin has the prefix
	 * of its classes, the key of its title, the gap to the page bar, the
	 * glyphs, buttons, search and switch of its look, how it compares names,
	 * changes the case of labels, renames in place (or null for the dialog)
	 * and disables Insert Page. The classic skin is the look of Classic,
	 * Simple, Sketch, Minimal and Atlas, Fusion adds its own (SimplePages.js).
	 */
	EditorUi.pageOverviewSkins = {};

	EditorUi.pageOverviewSkins.classic = {
		prefix: 'ge',
		title: 'pages',
		gap: 4,
		createIcon: function(name)
		{
			var icon = document.createElement('span');
			icon.className = 'gePageOverviewIcon';
			icon.style.setProperty('--ge-ic', 'url(\'' + EditorUi.pageOverviewIcons[name] + '\')');
			icon.setAttribute('aria-hidden', 'true');

			return icon;
		},
		createButton: function(name, title, fn, className)
		{
			var btn = document.createElement('button');
			btn.setAttribute('type', 'button');
			btn.className = 'gePageOverviewBtn' + ((className != null) ? ' ' + className : '');
			btn.setAttribute('title', title);
			btn.setAttribute('aria-label', title);
			btn.appendChild(this.createIcon(name));

			mxEvent.addListener(btn, 'click', function(evt)
			{
				fn(evt);
				mxEvent.consume(evt);
			});

			return btn;
		},
		createSearch: function(placeholder, fn)
		{
			var field = document.createElement('div');
			field.appendChild(this.createIcon('search'));

			var input = document.createElement('input');
			input.setAttribute('type', 'search');
			input.setAttribute('placeholder', placeholder);
			input.setAttribute('aria-label', placeholder);
			input.setAttribute('autocomplete', 'off');
			input.setAttribute('spellcheck', 'false');
			field.appendChild(input);

			mxEvent.addListener(input, 'input', function()
			{
				fn(input.value);
			});

			// Escape clears the search first
			mxEvent.addListener(input, 'keydown', function(evt)
			{
				if (evt.key == 'Escape' && input.value != '')
				{
					input.value = '';
					fn('');
					mxEvent.consume(evt);
				}
			});

			field.input = input;

			return field;
		},
		createViews: function(items, value, fn, label)
		{
			var group = document.createElement('div');
			group.setAttribute('role', 'radiogroup');
			group.setAttribute('aria-label', label);
			var buttons = [];

			var update = function(v)
			{
				for (var i = 0; i < buttons.length; i++)
				{
					var on = items[i].value == v;
					buttons[i].setAttribute('aria-checked', (on) ? 'true' : 'false');
					buttons[i].classList.toggle('geActive', on);
				}
			};

			for (var i = 0; i < items.length; i++)
			{
				(mxUtils.bind(this, function(item)
				{
					var btn = document.createElement('button');
					btn.setAttribute('type', 'button');
					btn.setAttribute('role', 'radio');
					btn.setAttribute('title', item.label);
					btn.setAttribute('aria-label', item.label);
					btn.appendChild(this.createIcon(item.icon));
					buttons.push(btn);
					group.appendChild(btn);

					mxEvent.addListener(btn, 'click', function(evt)
					{
						if (btn.getAttribute('aria-checked') != 'true')
						{
							update(item.value);
							fn(item.value, evt);
						}

						mxEvent.consume(evt);
					});
				}))(items[i]);
			}

			update(value);

			// One stop of Tab, the arrow keys choose
			if (typeof EditorUi.addRovingRadios === 'function')
			{
				EditorUi.addRovingRadios(group);
			}

			group.buttons = buttons;

			return group;
		},
		normalize: function(text)
		{
			text = String((text != null) ? text : '').toLowerCase();

			try
			{
				text = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
			}
			catch (e)
			{
				// ignores missing normalize
			}

			return text;
		},
		sentence: function(text)
		{
			return text;
		},
		startRename: null,
		getDisabledReason: function(ui)
		{
			return null;
		},
		setDisabled: null,
		fadeOut: null
	};

	/**
	 * Returns the skin of the page overview in the current look.
	 */
	EditorUi.prototype.getPageOverviewSkin = function()
	{
		return EditorUi.pageOverviewSkins.classic;
	};

	/**
	 * The menu of the page tabs is a button that shows a dialog where it shows
	 * the page overview.
	 */
	var editorUiCreatePageMenuTab = EditorUi.prototype.createPageMenuTab;

	EditorUi.prototype.createPageMenuTab = function()
	{
		var tab = editorUiCreatePageMenuTab.apply(this, arguments);

		if (this.isPageOverviewEnabled())
		{
			tab.setAttribute('aria-haspopup', 'dialog');
		}

		return tab;
	};

	/**
	 * The new menu tab of a rebuild of the page tabs is the anchor of the open
	 * overview (expanded, the focus returns to it).
	 */
	var editorUiUpdateTabContainer = EditorUi.prototype.updateTabContainer;

	EditorUi.prototype.updateTabContainer = function()
	{
		editorUiUpdateTabContainer.apply(this, arguments);
		var overview = this.pageOverview;

		if (overview != null && overview.anchor != null && overview.anchor.tabKey == 'pages' &&
			this.pageMenuTab != null && this.pageMenuTab != overview.anchor &&
			this.pageMenuTab.parentNode == this.tabContainer)
		{
			overview.anchor = this.pageMenuTab;
			this.pageMenuTab.setAttribute('aria-expanded', 'true');
		}
	};

	/**
	 * Rename of a page closes an overview that does not rename in place
	 * before its dialog shows.
	 */
	var editorUiRenamePage = EditorUi.prototype.renamePage;

	EditorUi.prototype.renamePage = function(page)
	{
		if (this.pageOverview != null && !this.pageOverview.inPlace)
		{
			this.hidePageOverview();
		}

		return editorUiRenamePage.apply(this, arguments);
	};

	/**
	 * Shows the page overview for the given anchor (the menu tab) or hides it
	 * if it is shown for that anchor.
	 */
	EditorUi.prototype.togglePageOverview = function(anchor)
	{
		if (this.pageOverview != null && this.pageOverview.anchor == anchor)
		{
			this.hidePageOverview();
		}
		else
		{
			this.showPageOverview(anchor);
		}
	};

	/**
	 * Hides the page overview. With restoreFocus the focus goes back to its
	 * anchor (also after a rebuild of the page tabs), else to the diagram.
	 */
	EditorUi.prototype.hidePageOverview = function(restoreFocus)
	{
		var overview = this.pageOverview;

		if (overview != null)
		{
			this.pageOverview = null;
			overview.destroy();

			if (overview.anchor != null)
			{
				overview.anchor.removeAttribute('aria-expanded');
			}

			if (restoreFocus)
			{
				if (overview.anchor != null && overview.anchor.parentNode != null)
				{
					overview.anchor.focus();
				}
				else if (overview.anchor != null && overview.anchor.tabKey != null)
				{
					this.focusTabContainerControl(overview.anchor.tabKey);
				}
				else
				{
					this.editor.graph.container.focus();
				}
			}
		}
	};

	/**
	 * Shows the page overview over the page bar, over its anchor where the
	 * page bar is hidden (the footer of Sketch), or as a sheet where neither
	 * is shown, with the focus on the current page.
	 */
	EditorUi.prototype.showPageOverview = function(anchor)
	{
		this.hidePageOverview();

		if (this.pages == null)
		{
			return null;
		}

		var overview = this.createPageOverview();
		overview.anchor = anchor;
		this.pageOverview = overview;
		this.container.appendChild(overview.div);
		overview.place();

		if (anchor != null)
		{
			anchor.setAttribute('aria-expanded', 'true');
		}

		overview.focusCard(this.currentPage);

		return overview;
	};

	/**
	 * Unique IDs of the overview.
	 */
	EditorUi.pageOverviewCounter = 0;

	/**
	 * Creates the page overview in the skin of the current look. Returns
	 * {div, place, refresh, getCard, rename, focusCard, setView, inPlace,
	 * destroy}.
	 */
	EditorUi.prototype.createPageOverview = function()
	{
		var ui = this;
		var graph = this.editor.graph;
		var skin = this.getPageOverviewSkin();
		var p = skin.prefix;
		var lightbox = graph.isLightboxView();
		var view = (this.getPageOverviewView() == 'tiles') ? 'tiles' : 'list';
		var id = p + 'PageOverview' + (++EditorUi.pageOverviewCounter);
		var div = document.createElement('div');
		div.className = p + 'PageOverview';
		div.setAttribute('role', 'dialog');
		div.setAttribute('aria-labelledby', id + '-title');

		var head = document.createElement('div');
		head.className = p + 'PageOverviewHead';
		div.appendChild(head);

		var title = document.createElement('div');
		title.className = p + 'PageOverviewTitle';
		title.setAttribute('id', id + '-title');
		title.setAttribute('role', 'heading');
		title.setAttribute('aria-level', '2');
		mxUtils.write(title, mxResources.get(skin.title));
		head.appendChild(title);

		var count = document.createElement('div');
		count.className = p + 'PageOverviewCount';
		head.appendChild(count);

		// The switch of the view at the top right
		var views = skin.createViews([{value: 'tiles', label: mxResources.get('gridView'), icon: 'tiles'},
			{value: 'list', label: mxResources.get('listView'), icon: 'list'}], view, function(value)
		{
			setView(value);
		}, mxResources.get('view'));
		views.classList.add(p + 'PageOverviewViews');
		head.appendChild(views);

		// The other items of the menu Pages
		if (!lightbox)
		{
			var options = skin.createButton('more', mxResources.get('moreOptions'), function(evt)
			{
				showPopup(function(menu, parent)
				{
					ui.menus.addPageOverviewItems(menu, parent);
				}, options, evt);
			}, p + 'PageOverviewMore');
			options.setAttribute('aria-haspopup', 'menu');
			head.appendChild(options);
		}

		head.appendChild(skin.createButton('close', mxResources.get('close'), function()
		{
			ui.hidePageOverview(true);
		}, p + 'PageOverviewClose'));

		var filter = '';

		// The search shows and hides the cards in place (see filterCards)
		var search = skin.createSearch(mxResources.get('search'), function(value)
		{
			filter = value;
			refresh();
		});
		search.classList.add(p + 'PageOverviewSearch');
		div.appendChild(search);

		var grid = document.createElement('div');
		grid.className = p + 'PageOverviewGrid';
		grid.setAttribute('role', 'list');
		grid.setAttribute('aria-labelledby', id + '-title');
		div.appendChild(grid);

		var empty = document.createElement('div');
		empty.className = ((skin.noteClass != null) ? skin.noteClass + ' ' : '') + p + 'PageOverviewEmpty';

		// Thumbnails of this overview by page (see createPageThumbnail), made
		// when their card is shown and again when dark mode changes
		var thumbs = new Map();
		var queue = [];
		var thread = null;
		var cards = new Map();
		var signature = null;
		var focused = null;

		// The pages of the cards in the grid in their order, the cards that
		// the search hid (kept with their previews for the next keystroke
		// until the cards are made again) and the card Insert Page
		var listed = [];
		var spare = new Map();
		var insertCard = null;
		var builtView = null;

		var observer = (typeof IntersectionObserver !== 'undefined') ?
			new IntersectionObserver(function(entries)
		{
			for (var i = 0; i < entries.length; i++)
			{
				if (entries[i].isIntersecting && entries[i].target.smPage != null)
				{
					observer.unobserve(entries[i].target);
					enqueue(entries[i].target.smPage);
				}
			}
		}, {root: grid}) : null;

		var isOpen = function()
		{
			return ui.pageOverview != null && ui.pageOverview.div == div;
		};

		var paint = function(page)
		{
			var card = cards.get(page);
			var thumb = (card != null) ? card.querySelector('.' + p + 'PageCardThumb') : null;
			var data = thumbs.get(page);

			if (thumb != null && data !== undefined)
			{
				card.smThumb = data;
				thumb.innerText = '';
				thumb.classList.toggle(p + 'PageCardEmpty', data == null);

				// The button is the paper of the page
				EditorUi.setPageThumbnailPaper(thumb.parentNode, data);

				if (data != null)
				{
					var img = document.createElement('img');
					img.setAttribute('alt', '');
					img.setAttribute('src', data.src);
					thumb.appendChild(img);
				}
				else
				{
					thumb.appendChild(skin.createIcon('page'));
				}
			}
		};

		var next = function()
		{
			thread = null;
			var page = queue.shift();

			if (page != null && isOpen())
			{
				if (!thumbs.has(page) && mxUtils.indexOf(ui.pages, page) >= 0)
				{
					var data = null;

					try
					{
						data = ui.createPageThumbnail(page);
					}
					catch (e)
					{
						// keeps the glyph
					}

					thumbs.set(page, data);
				}

				paint(page);

				if (queue.length > 0)
				{
					thread = window.setTimeout(next, 0);
				}
			}
		};

		var enqueue = function(page)
		{
			if (view != 'tiles')
			{
				// The list has no thumbnails
			}
			else if (thumbs.has(page))
			{
				paint(page);
			}
			else if (queue.indexOf(page) < 0)
			{
				queue.push(page);

				if (thread == null)
				{
					thread = window.setTimeout(next, 0);
				}
			}
		};

		// A card of a page with a preview shows it at once, without the glyph
		// in between; the others make it once they are shown
		var watch = function(card, index)
		{
			var page = card.smPage;

			if (view != 'tiles')
			{
				// The list makes no thumbnails
			}
			else if (thumbs.has(page))
			{
				if (card.smThumb !== thumbs.get(page))
				{
					paint(page);
				}
			}
			else if (observer != null)
			{
				observer.observe(card);
			}
			else if (index < EditorUi.simpleLinkThumbs.pages)
			{
				enqueue(page);
			}
		};

		var getPages = function()
		{
			var result = [];

			for (var i = 0; i < ui.pages.length; i++)
			{
				var name = ui.pages[i].getName() || '';

				if (filter == '' || skin.normalize(name).indexOf(skin.normalize(filter)) >= 0)
				{
					result.push(ui.pages[i]);
				}
			}

			return result;
		};

		var getButtons = function()
		{
			return Array.prototype.slice.call(grid.querySelectorAll('.' + p + 'PageCardOpen'));
		};

		// One card in the order of Tab, the arrow keys move between them
		var setFocusable = function(btn)
		{
			var buttons = getButtons();

			for (var i = 0; i < buttons.length; i++)
			{
				buttons[i].setAttribute('tabindex', (buttons[i] == btn) ? '0' : '-1');
			}
		};

		// Shows a menu at the given element (the keyboard) or the pointer
		var showPopup = function(funct, elt, evt)
		{
			graph.popupMenuHandler.hideMenu();
			ui.hideCurrentMenu();

			var keyboard = evt.type == 'keydown' || (evt.type == 'click' && evt.detail == 0);
			var bounds = elt.getBoundingClientRect();
			var x = (keyboard) ? bounds.left : mxEvent.getClientX(evt);
			var y = (keyboard) ? bounds.bottom : mxEvent.getClientY(evt);
			var menu = new mxPopupMenu(funct);
			menu.smartSeparators = true;
			menu.showDisabled = true;
			menu.autoExpand = true;

			menu.hideMenu = function()
			{
				mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
				ui.resetCurrentMenu();
				menu.destroy();
			};

			menu.popup(x, y, null, evt);
			ui.setCurrentMenu(menu, elt);

			// Escape returns to the element (popup resets it), so the next
			// Escape closes the overview
			menu.returnFocus = elt;

			if (keyboard && typeof menu.focusFirstItem === 'function')
			{
				menu.focusFirstItem();
			}
		};

		var showMenu = function(page, elt, evt)
		{
			if (lightbox)
			{
				return;
			}

			// The items of the page menu act on the current page, so the card
			// selects its page first, as the tabs of the page bar do
			if (page != ui.currentPage)
			{
				var selector = (elt.classList.contains(p + 'PageCardMore')) ?
					'.' + p + 'PageCardMore' : '.' + p + 'PageCardOpen';
				ui.selectPage(page);
				var card = cards.get(page);

				// The cards are new after the selection
				if (card != null && card.querySelector(selector) != null)
				{
					elt = card.querySelector(selector);
				}
			}

			showPopup(ui.createPageMenu(page), elt, evt);
		};

		var createCard = function(page, index)
		{
			var card = document.createElement('div');
			card.className = p + 'PageCard';
			card.setAttribute('role', 'listitem');
			card.smPage = page;

			var btn = document.createElement('button');
			btn.setAttribute('type', 'button');
			btn.className = p + 'PageCardOpen';
			btn.setAttribute('tabindex', '-1');
			card.appendChild(btn);

			// Tiles show the page, the list only its name
			if (view == 'tiles')
			{
				var thumb = document.createElement('span');
				thumb.className = p + 'PageCardThumb ' + p + 'PageCardEmpty';
				thumb.setAttribute('aria-hidden', 'true');
				thumb.appendChild(skin.createIcon('page'));
				btn.appendChild(thumb);
			}

			// The name and the number next to the button, where a rename puts
			// its field (no field in a button)
			var foot = document.createElement('div');
			foot.className = p + 'PageCardFoot';
			foot.setAttribute('aria-hidden', 'true');
			card.appendChild(foot);

			var name = document.createElement('span');
			name.className = p + 'PageCardName';
			mxUtils.write(name, page.getName() || mxResources.get('untitled'));
			foot.appendChild(name);

			var number = document.createElement('span');
			number.className = p + 'PageCardNumber';
			mxUtils.write(number, String(index + 1));
			foot.appendChild(number);

			btn.setAttribute('aria-label', (page.getName() || mxResources.get('untitled')) + ', ' +
				mxResources.get('pageOfPages', [index + 1, ui.pages.length]));
			btn.setAttribute('title', page.getName() || mxResources.get('untitled'));

			if (page == ui.currentPage)
			{
				card.classList.add(p + 'PageCardCurrent');
				btn.setAttribute('aria-current', 'page');
			}

			if (!lightbox)
			{
				var more = skin.createButton('more', mxResources.get('options'), function(evt)
				{
					showMenu(page, more, evt);
				}, p + 'PageCardMore');
				more.setAttribute('tabindex', '-1');
				more.setAttribute('aria-haspopup', 'menu');
				card.appendChild(more);
			}

			mxEvent.addListener(btn, 'click', function(evt)
			{
				open(page);
				mxEvent.consume(evt);
			});

			mxEvent.addListener(foot, 'click', function(evt)
			{
				if (foot.querySelector('input') == null)
				{
					open(page);
				}

				mxEvent.consume(evt);
			});

			mxEvent.addListener(card, 'contextmenu', function(evt)
			{
				showMenu(page, btn, evt);
				mxEvent.consume(evt);
			});

			mxEvent.addListener(btn, 'focus', function()
			{
				focused = page;
				setFocusable(btn);
			});

			cards.set(page, card);

			return card;
		};

		var open = function(page)
		{
			ui.hidePageOverview();

			if (mxUtils.indexOf(ui.pages, page) >= 0)
			{
				if (page != ui.currentPage)
				{
					ui.selectPage(page);
				}

				graph.container.focus();
			}
		};

		var rename = function(page)
		{
			var card = cards.get(page);
			var name = (card != null) ? card.querySelector('.' + p + 'PageCardName') : null;

			if (skin.startRename == null)
			{
				// The dialog of the look (the overview closes)
				if (graph.isEnabled())
				{
					ui.hidePageOverview();
					ui.renamePage(page);
				}
			}
			else if (name != null && name.style.display != 'none' && graph.isEnabled())
			{
				var input = skin.startRename(ui, name, page.getName() || '', function(value)
				{
					if (mxUtils.indexOf(ui.pages, page) >= 0)
					{
						graph.model.execute(new RenamePage(ui, page, value));
					}
				}, function()
				{
					if (isOpen())
					{
						// The search has the focus if the filter hides the card with
						// the new name (3ypj F10)
						refresh();
						var shown = cards.get(page);

						if (filter != '' && (shown == null || shown.getClientRects().length == 0))
						{
							search.input.focus();
						}
						else
						{
							ui.pageOverview.focusCard(page);
						}
					}
				});

				// The keys of the field do not move between the cards
				mxEvent.addListener(input, 'keydown', function(evt)
				{
					evt.stopPropagation();
				});
			}
		};

		var addInsertCard = function(reason)
		{
			var card = document.createElement('div');
			card.className = p + 'PageCard ' + p + 'PageCardAdd';
			card.setAttribute('role', 'listitem');

			var btn = document.createElement('button');
			btn.setAttribute('type', 'button');
			btn.className = p + 'PageCardOpen';
			btn.setAttribute('tabindex', '-1');
			card.appendChild(btn);

			var foot = document.createElement('div');
			foot.className = p + 'PageCardFoot';
			foot.setAttribute('aria-hidden', 'true');
			card.appendChild(foot);

			// The plus is the tile or starts the row of the list
			if (view == 'tiles')
			{
				var thumb = document.createElement('span');
				thumb.className = p + 'PageCardThumb ' + p + 'PageCardEmpty';
				thumb.setAttribute('aria-hidden', 'true');
				thumb.appendChild(skin.createIcon('plus'));
				btn.appendChild(thumb);
			}
			else
			{
				foot.appendChild(skin.createIcon('plus'));
			}

			var label = skin.sentence(mxResources.get('insertPage'));
			var name = document.createElement('span');
			name.className = p + 'PageCardName';
			mxUtils.write(name, label);
			foot.appendChild(name);
			btn.setAttribute('aria-label', label);

			// Disabled with the reason in read-only diagrams (the arrow keys
			// still reach it)
			if (reason != null)
			{
				card.classList.add(p + 'PageCardDisabled');

				if (skin.setDisabled != null)
				{
					skin.setDisabled(ui, btn, reason, label);
				}
			}

			mxEvent.addListener(foot, 'click', function(evt)
			{
				btn.click();
				mxEvent.consume(evt);
			});

			mxEvent.addListener(btn, 'click', function(evt)
			{
				var action = ui.actions.get('insertPage');

				if (reason == null && action != null && action.isEnabled())
				{
					action.funct();
					refresh();
					ui.pageOverview.focusCard(ui.currentPage);
				}

				mxEvent.consume(evt);
			});

			mxEvent.addListener(btn, 'focus', function()
			{
				focused = null;
				setFocusable(btn);
			});

			grid.appendChild(card);
			insertCard = card;
		};

		// What the cards show apart from the search (the search changes only
		// which cards are shown, see filterCards)
		var getSignature = function()
		{
			var s = [view, (ui.currentPage != null) ? ui.currentPage.getId() : '', graph.isEnabled()];

			for (var i = 0; i < ui.pages.length; i++)
			{
				s.push(ui.pages[i].getId() + ':' + ui.pages[i].getName());
			}

			return s.join('\n');
		};

		// Makes the cards again where the pages, their names, the current page,
		// the view or the lock changed (or with force), else shows the cards of
		// the search (filterCards)
		var refresh = function(force)
		{
			var sig = getSignature();

			// Waits for the end of a rename (the next change shows the pages)
			if (grid.querySelector('input') != null)
			{
				return;
			}
			else if (!force && sig == signature)
			{
				filterCards();

				return;
			}

			var scroll = (builtView == view) ? grid.scrollTop : 0;
			builtView = view;
			signature = sig;
			var hadFocus = div.contains(document.activeElement) &&
				document.activeElement.classList.contains(p + 'PageCardOpen');

			if (observer != null)
			{
				observer.disconnect();
			}

			queue = [];
			cards = new Map();
			spare = new Map();
			insertCard = null;
			grid.innerText = '';
			var pages = getPages();

			for (var i = 0; i < pages.length; i++)
			{
				var card = createCard(pages[i], mxUtils.indexOf(ui.pages, pages[i]));
				grid.appendChild(card);
				watch(card, i);
			}

			if (!lightbox && ui.isPageInsertTabVisible() && filter == '')
			{
				addInsertCard(skin.getDisabledReason(ui));
			}

			listed = pages;
			updateHead(pages);

			// The cards made again keep the scroll position of the view
			if (scroll > 0)
			{
				grid.scrollTop = scroll;
			}

			var buttons = getButtons();
			var target = (focused != null && cards.get(focused) != null) ?
				cards.get(focused).querySelector('.' + p + 'PageCardOpen') : buttons[0];
			setFocusable(target);

			if (hadFocus && target != null)
			{
				target.focus();
			}
		};

		// The note without results, the search and the number of pages
		var updateHead = function(pages)
		{
			if (pages.length == 0)
			{
				empty.innerText = '';
				mxUtils.write(empty, mxResources.get('noResultsFor', [filter]));

				if (empty.parentNode != div)
				{
					div.appendChild(empty);
				}
			}
			else if (empty.parentNode == div)
			{
				div.removeChild(empty);
			}

			search.style.display = (ui.pages.length > 6 || filter != '') ? '' : 'none';

			if (count.textContent != String(ui.pages.length))
			{
				count.innerText = '';
				mxUtils.write(count, String(ui.pages.length));
			}
		};

		// The search changes only the cards that appear or disappear: the same
		// pages in the same order change nothing (no card is made again, the
		// previews, the scroll position and the focus in the field stay), the
		// others are taken out or put in at their place, with their previews
		// at once where they had one
		var filterCards = function()
		{
			var pages = getPages();
			var same = pages.length == listed.length;

			for (var i = 0; same && i < pages.length; i++)
			{
				same = pages[i] == listed[i];
			}

			var hadFocus = div.contains(document.activeElement) &&
				document.activeElement.classList.contains(p + 'PageCardOpen');
			var changed = !same;

			if (!same)
			{
				var found = new Set(pages);
				var removed = new Set();

				for (var i = 0; i < listed.length; i++)
				{
					var card = cards.get(listed[i]);

					if (!found.has(listed[i]) && card != null)
					{
						if (observer != null)
						{
							observer.unobserve(card);
						}

						grid.removeChild(card);
						cards['delete'](listed[i]);
						spare.set(listed[i], card);
						removed.add(listed[i]);
					}
				}

				if (removed.size > 0)
				{
					queue = queue.filter(function(page)
					{
						return !removed.has(page);
					});
				}

				// The cards left are in the order of the pages, so every new
				// card goes before the next card that stays
				var at = grid.firstChild;

				for (var i = 0; i < pages.length; i++)
				{
					var card = cards.get(pages[i]);

					if (card != null)
					{
						at = card.nextSibling;
					}
					else
					{
						card = spare.get(pages[i]);
						spare['delete'](pages[i]);

						if (card == null)
						{
							card = createCard(pages[i], mxUtils.indexOf(ui.pages, pages[i]));
						}

						cards.set(pages[i], card);
						grid.insertBefore(card, at);
						watch(card, i);
					}
				}

				listed = pages;
			}

			// Insert Page is the last card without a search
			var insert = !lightbox && ui.isPageInsertTabVisible() && filter == '';

			if (insertCard != null && !insert)
			{
				if (insertCard.parentNode == grid)
				{
					grid.removeChild(insertCard);
				}

				insertCard = null;
				changed = true;
			}
			else if (insertCard == null && insert)
			{
				addInsertCard(skin.getDisabledReason(ui));
				changed = true;
			}

			updateHead(pages);

			// The cards or Insert Page changed: one card stays in the order
			// of Tab (Insert Page may have held it, a new one has none yet)
			if (changed)
			{
				var buttons = getButtons();
				var target = (focused != null && cards.get(focused) != null) ?
					cards.get(focused).querySelector('.' + p + 'PageCardOpen') : buttons[0];
				setFocusable(target);

				if (hadFocus && target != null && !div.contains(document.activeElement))
				{
					target.focus();
				}
			}
		};

		// Tiles or the list: the choice is kept in the browser, the focus stays
		// on the switch
		var setView = function(value)
		{
			value = (value == 'tiles') ? 'tiles' : 'list';

			if (value != view)
			{
				view = value;
				ui.setPageOverviewView(view);
				div.classList.toggle(p + 'PageOverviewList', view == 'list');
				refresh(true);

				if (views.setValue != null)
				{
					views.setValue(view);
				}

				place();
			}
		};

		var move = function(btn, evt)
		{
			var buttons = getButtons();
			var index = buttons.indexOf(btn);
			var cols = 1;

			// Cards in the first row of the grid (the offsetTop of the buttons
			// is relative to their cards, so it is the same in every row)
			var top = (buttons.length > 0) ? buttons[0].getBoundingClientRect().top : 0;

			while (cols < buttons.length && Math.abs(buttons[cols].getBoundingClientRect().top - top) < 1)
			{
				cols++;
			}

			var next = index;

			if (evt.key == 'ArrowRight')
			{
				next = index + 1;
			}
			else if (evt.key == 'ArrowLeft')
			{
				next = index - 1;
			}
			else if (evt.key == 'ArrowDown')
			{
				next = index + cols;
			}
			else if (evt.key == 'ArrowUp')
			{
				next = index - cols;
			}
			else if (evt.key == 'Home')
			{
				next = 0;
			}
			else if (evt.key == 'End')
			{
				next = buttons.length - 1;
			}

			next = Math.max(0, Math.min(buttons.length - 1, next));

			if (buttons[next] != null)
			{
				buttons[next].focus();
				buttons[next].scrollIntoView({block: 'nearest'});
			}
		};

		// Keys stay in the overview: the shortcuts of the diagram would change
		// the diagram behind it
		mxEvent.addListener(div, 'keydown', function(evt)
		{
			var source = mxEvent.getSource(evt);
			var btn = (source != null && source.classList != null &&
				source.classList.contains(p + 'PageCardOpen')) ? source : null;
			var card = (btn != null) ? btn.parentNode : null;

			if (evt.key == 'Escape')
			{
				ui.hidePageOverview(true);
				mxEvent.consume(evt);
			}
			else if (btn != null && /^(Arrow(Left|Right|Up|Down)|Home|End)$/.test(evt.key))
			{
				move(btn, evt);
				mxEvent.consume(evt);
			}
			else if (card != null && card.smPage != null && evt.key == 'F2')
			{
				rename(card.smPage);
				mxEvent.consume(evt);
			}
			else if (card != null && card.smPage != null && (evt.key == 'ContextMenu' ||
				(evt.key == 'F10' && evt.shiftKey)))
			{
				showMenu(card.smPage, btn, evt);
				mxEvent.consume(evt);
			}
			else if (btn != null && search.style.display != 'none' && evt.key.length == 1 &&
				!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) && !mxEvent.isAltDown(evt) &&
				evt.key != ' ')
			{
				// Typing on a card filters the pages
				search.input.focus();
			}
			else if (evt.key == 'Tab')
			{
				// Tab stays in the overview
				var stops = Dialog.getTabStops(div);

				if (stops.length > 0)
				{
					var i = stops.indexOf(document.activeElement);
					var target = (evt.shiftKey) ? ((i <= 0) ? stops[stops.length - 1] : null) :
						((i == stops.length - 1) ? stops[0] : null);

					if (target != null)
					{
						target.focus();
						mxEvent.consume(evt);
					}
				}

				evt.stopPropagation();
			}
			else
			{
				evt.stopPropagation();
			}
		});

		// Arrow down in the field goes to the cards
		mxEvent.addListener(search.input, 'keydown', function(evt)
		{
			if (evt.key == 'ArrowDown' || evt.key == 'Enter')
			{
				var buttons = getButtons();

				if (buttons.length > 0)
				{
					buttons[0].focus();
				}

				mxEvent.consume(evt);
			}
		});

		// Clicks inside are not gestures of the diagram, presses outside close it
		mxEvent.addGestureListeners(div, function(evt)
		{
			evt.stopPropagation();
		});

		var outside = function(evt)
		{
			var source = mxEvent.getSource(evt);

			// Presses on the anchor leave it to its click, which toggles
			if (isOpen() && !div.contains(source) && (ui.pageOverview.anchor == null ||
				!ui.pageOverview.anchor.contains(source)) && (ui.currentMenu == null ||
				ui.currentMenu.div == null || !ui.currentMenu.div.contains(source)) &&
				(source == null || source.closest == null || source.closest('.mxPopupMenu') == null))
			{
				ui.hidePageOverview();
			}
		};

		document.addEventListener((mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', outside, true);

		var changed = function()
		{
			if (ui.pages == null)
			{
				ui.hidePageOverview();
			}
			else
			{
				// Pages that changed get a new thumbnail
				var edit = arguments[1] != null && typeof arguments[1].getProperty === 'function' ?
					arguments[1].getProperty('edit') : null;

				if (edit != null && edit.changes != null)
				{
					for (var i = 0; i < edit.changes.length; i++)
					{
						if (!(edit.changes[i] instanceof RenamePage) && !(edit.changes[i] instanceof MovePage))
						{
							thumbs['delete'](ui.currentPage);
							break;
						}
					}
				}

				refresh();

				if (ui.currentPage != null && !thumbs.has(ui.currentPage) && cards.get(ui.currentPage) != null)
				{
					enqueue(ui.currentPage);
				}

				place();
			}
		};

		// Another look closes the overview
		var themeChanged = function()
		{
			ui.hidePageOverview();
		};

		// Dark mode makes the thumbnails that were made again in the new mode
		// (the others are made in it when their card is shown)
		var darkModeChanged = function()
		{
			var pages = [];

			thumbs.forEach(function(data, page)
			{
				pages.push(page);
			});

			thumbs.clear();

			// The cards hidden by the search are made again in the new mode
			spare.clear();

			for (var i = 0; i < pages.length; i++)
			{
				enqueue(pages[i]);
			}
		};

		graph.model.addListener(mxEvent.CHANGE, changed);
		ui.addListener('pageSelected', changed);
		ui.addListener('lockedChanged', changed);
		ui.addListener('currentThemeChanged', themeChanged);
		ui.addListener('darkModeChanged', darkModeChanged);

		var resize = function()
		{
			place();
		};

		mxEvent.addListener(window, 'resize', resize);

		// Over the page bar at its left, in the column of the canvas; over its
		// anchor where the page bar is hidden and the anchor is shown (the page
		// button of the footer of Sketch); a sheet at the bottom where neither
		// is shown (phones)
		var place = function()
		{
			var anchor = (ui.pageOverview != null && ui.pageOverview.div == div) ?
				ui.pageOverview.anchor : null;
			var bar = (ui.tabContainer != null && ui.tabContainer.offsetParent != null) ?
				ui.tabContainer : ((anchor != null && anchor.offsetParent != null) ? anchor : null);
			div.classList.toggle(p + 'PageOverviewSheet', bar == null);

			if (bar != null)
			{
				var c = ui.container.getBoundingClientRect();
				var r = bar.getBoundingClientRect();
				var left = Math.round(r.left - c.left);

				// Inside the window where the page bar starts near its right end,
				// at the right end of an anchor there (the footer of Sketch)
				if (div.parentNode != null && left + div.offsetWidth > c.width - 8)
				{
					left = Math.max(8, Math.round(((bar == anchor) ? Math.min(r.right - c.left,
						c.width - 8) : c.width - 8) - div.offsetWidth));
				}

				div.style.left = left + 'px';
				div.style.bottom = Math.round(c.bottom - r.top + skin.gap) + 'px';
				div.style.maxHeight = Math.min(480, Math.max(160, Math.round(r.top - c.top - 72))) + 'px';
			}
			else
			{
				div.style.left = '';
				div.style.bottom = '';
				div.style.maxHeight = '';
			}
		};

		div.classList.toggle(p + 'PageOverviewList', view == 'list');
		refresh();

		return {div: div, place: place, refresh: refresh, rename: rename,
			inPlace: skin.startRename != null,
			setView: setView,
			getView: function()
			{
				return view;
			},
			getCard: function(page)
			{
				return cards.get(page);
			},
			focusCard: function(page)
			{
				var card = (page != null) ? cards.get(page) : null;
				var btn = (card != null) ? card.querySelector('.' + p + 'PageCardOpen') : getButtons()[0];

				if (btn != null)
				{
					btn.focus();
					btn.scrollIntoView({block: 'nearest'});
				}
			},
			destroy: function()
			{
				if (thread != null)
				{
					window.clearTimeout(thread);
					thread = null;
				}

				if (observer != null)
				{
					observer.disconnect();
				}

				graph.model.removeListener(changed);
				ui.removeListener(changed);
				ui.removeListener(themeChanged);
				ui.removeListener(darkModeChanged);
				mxEvent.removeListener(window, 'resize', resize);
				document.removeEventListener((mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', outside, true);

				if (div.parentNode != null)
				{
					if (skin.fadeOut != null)
					{
						skin.fadeOut(div);
					}

					div.parentNode.removeChild(div);
				}
			}};
	};
})();
