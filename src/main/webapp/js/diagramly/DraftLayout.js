/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * Drafts and Recovery on the layout of Fusion's Preview template (package 5
 * of the dialogs of Fusion in Simple, the driver, 18 November 2026): the
 * draft dialog (DraftDialog: one draft of the embed mode with Edit, Discard
 * and Ignore, or several drafts of App.js, whose list of before has Delete
 * All) and the recovery dialog (RecoveryDialog of
 * EditorUi.showRecoveryDialog: the candidates of a file that could not be
 * opened) show the message, the drafts or the candidates as a listbox next to
 * a preview and the buttons of the dialog in the footer. The controls of the
 * dialogs (DraftDialog.controls, RecoveryDialog.controls) move into the new
 * layout with their listeners or stay hidden and are driven, so Edit, Open,
 * Discard, Ignore, Delete All and Cancel call what they called before.
 *
 * The layout (EditorUi.createDraftLayout and createRecoveryLayout) takes a
 * skin: the Classic skin (DraftLayout.skins.classic, docs/dialog-style-guide.md,
 * its CSS in grapheditor.css under .geDraftLayout with the colors of the
 * other dialogs of the theme) for Simple behind the feature draftDialog of
 * Editor.featureDefaults (Editor.isDraftDialogEnabled), or the skin of
 * Fusion, which SimpleFiles.js adds (DraftLayout.skins.fusion; Revision
 * history of Fusion uses its preview pane and tools), so the code exists
 * once. Where the feature is off the dialogs of before are shown.
 */
var DraftLayout = {};

/**
 * Size of the content of the dialogs in the Classic skin (the frame adds 48),
 * the size of the draft dialog of before, limited to the window
 * (EditorUi.getDraftLayoutSize).
 */
DraftLayout.size = {width: 640, height: 480};

/**
 * Space between the frame of the dialog and the window in the Classic skin.
 */
DraftLayout.windowMargin = 32;

/**
 * The skins of the layout. A skin has the classes of the parts and the
 * builders of the parts that differ (see DraftLayout.skins.classic). The skin
 * of Fusion is added by SimpleFiles.js.
 */
DraftLayout.skins = {};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the headline of
 * the dialogs, the colors of the dialogs of the theme light and dark, the
 * rows of the listbox with the accent border and a tint when chosen, the
 * preview as a card with its name, focus rings as outlines inside of the
 * controls. The CSS is in grapheditor.css under .geDraftLayout.
 */
DraftLayout.skins.classic = {
	name: 'classic',
	classes: {template: 'geDraftLayout', draft: 'geDraftLayoutDraft', drafts: 'geDraftLayoutDrafts',
		recovery: 'geDraftLayoutRecovery', head: 'geDraftLayoutHead', body: 'geDraftLayoutBody',
		message: 'geDraftLayoutMessage', pane: 'geDraftLayoutPane', graph: 'geDraftLayoutGraph',
		tools: 'geDraftLayoutTools', split: 'geDraftLayoutSplit', main: 'geDraftLayoutMain',
		list: 'geDraftLayoutList', row: 'geDraftLayoutRow', on: 'geDraftLayoutOn', dot: null,
		text: 'geDraftLayoutText', name: 'geDraftLayoutName', hint: 'geDraftLayoutHint',
		image: 'geDraftLayoutImage', replaced: 'geDraftLayoutReplaced',
		footerGroup: 'geDraftLayoutStart', link: 'geBtn geDraftLayoutLink',
		panePaused: 'geDraftLayoutPanePaused', paused: 'geDraftLayoutPaused'},
	/**
	 * The pictures of the candidates of Recovery keep to the budget of the
	 * live previews (EditorUi.simplePreviewBudget, see createRecoveryLayout).
	 */
	pausePreviews: true,
	/**
	 * Lays out the given content of the dialog (kind is draft or recovery).
	 */
	prepare: function(div, kind)
	{
		div.classList.add(this.classes.template, this.classes[kind]);
	},
	/**
	 * Returns the head with the given headline (a string or the h3 of the
	 * dialog).
	 */
	createHead: function(title)
	{
		var head = document.createElement('div');
		head.className = this.classes.head;

		if (typeof title === 'string')
		{
			var h3 = document.createElement('h3');
			mxUtils.write(h3, title);
			head.appendChild(h3);
		}
		else
		{
			head.appendChild(title);
		}

		return head;
	},
	/**
	 * Returns the name of the preview in its pane.
	 */
	createBadge: function()
	{
		var badge = document.createElement('div');
		badge.className = 'geDraftLayoutBadge';
		mxUtils.write(badge, mxResources.get('preview'));

		return badge;
	},
	/**
	 * Returns the badge of a row of the listbox with the given text.
	 */
	createRowBadge: function(text)
	{
		var badge = document.createElement('span');
		badge.className = 'geDraftLayoutRowBadge';
		mxUtils.write(badge, text);

		return badge;
	},
	/**
	 * Returns the primary button of the given content of a dialog.
	 */
	getPrimary: function(elt)
	{
		return elt.querySelector('.gePrimaryBtn');
	},
	/**
	 * Returns true if the focus is not moved into the dialog (touch screens,
	 * which have no Enter and would show a ring like a choice).
	 */
	isTouch: function()
	{
		return typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
	}
};

/**
 * Returns the skin of the layout for the current theme: the skin of Fusion in
 * Fusion (if its scripts are loaded), else the Classic skin.
 */
DraftLayout.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		DraftLayout.skins.fusion != null) ? DraftLayout.skins.fusion :
		DraftLayout.skins.classic;
};

/**
 * Adds the classes of the given string (separated by spaces) to the given
 * element.
 */
DraftLayout.addClasses = function(elt, classes)
{
	if (classes != null)
	{
		var names = classes.split(' ');

		for (var i = 0; i < names.length; i++)
		{
			if (names[i].length > 0)
			{
				elt.classList.add(names[i]);
			}
		}
	}
};

/**
 * Moves the given graph container of a dialog into the given preview pane
 * of the given skin: it fills the pane below its name.
 */
DraftLayout.setPreviewGraph = function(container, pane, skin)
{
	container.style.position = 'absolute';
	container.style.left = '';
	container.style.right = '';
	container.style.top = '';
	container.style.bottom = '';
	container.style.width = '';
	container.style.height = '';
	container.style.marginTop = '';
	container.style.borderStyle = 'none';
	container.style.borderWidth = '';
	container.classList.add(skin.classes.graph);
	pane.appendChild(container);
};

/**
 * Returns the given toolbar of a dialog (zoom buttons and selects) as the row
 * of tools of the given skin.
 */
DraftLayout.setPreviewTools = function(tb, skin)
{
	tb.style.cssText = '';
	tb.className = skin.classes.tools;
	var selects = tb.querySelectorAll('select');

	for (var i = 0; i < selects.length; i++)
	{
		selects[i].style.position = '';
		selects[i].style.top = '';
		selects[i].style.verticalAlign = '';
		selects[i].style.marginLeft = '';
		selects[i].style.marginRight = '';
		selects[i].style.maxWidth = '';
	}

	return tb;
};

/**
 * Gives the focus to the primary action of the dialog with the given content
 * after it is shown, if the focus is not in the dialog (Enter runs it), not
 * on touch screens.
 */
DraftLayout.focusPrimary = function(elt, skin)
{
	window.setTimeout(function()
	{
		var div = elt.parentNode;

		if (div != null && !div.contains(document.activeElement) && !skin.isTouch())
		{
			var btn = skin.getPrimary(elt);

			if (btn != null && !btn.disabled && btn.offsetParent != null)
			{
				btn.focus();
			}
		}
	}, 0);
};

/**
 * Returns an SVG data URI of the first page of the given file data (an image,
 * so nothing in it runs or loads), or null if it cannot be read. If the first
 * page has more than the given optional most cells (counted in the XML before
 * the page is decoded) false is returned and no picture is made.
 */
DraftLayout.createFilePreview = function(ui, data, maxCells)
{
	var g = null;

	try
	{
		data = ui.validateFileData(data);
		var doc = (data != null && data.length > 0) ? mxUtils.parseXml(data) : null;
		var node = (doc != null) ? ui.editor.extractGraphModel(doc.documentElement, true) : null;

		// The root and the default layer are not counted
		if (node != null && maxCells != null && node.getElementsByTagName('mxCell').length > maxCells + 2)
		{
			return false;
		}
		else if (node != null)
		{
			g = ui.createTemporaryGraph(ui.editor.graph.getStylesheet());
			document.body.appendChild(g.container);
			ui.decodeNodeIntoGraph(node, g);
			var svg = g.getSvg(null, 1, 8, false, null, true, null, null, null, false, null,
				(Editor.isDarkMode()) ? 'dark' : 'light');

			return Editor.createSvgDataUri(mxUtils.getXml(svg));
		}
	}
	catch (e)
	{
		// No preview
	}
	finally
	{
		if (g != null)
		{
			var container = g.container;
			g.destroy();

			if (container != null && container.parentNode != null)
			{
				container.parentNode.removeChild(container);
			}
		}
	}

	return null;
};

/**
 * Returns a listbox of rows (title, hint, an optional badge) of the given
 * skin for choosing one item: the arrow keys, Home and End choose, Enter runs
 * enter, a double click too. choose is called with the index of the chosen
 * row. The texts are written as text.
 */
DraftLayout.createChoiceList = function(label, choose, enter, skin)
{
	var cls = skin.classes;
	var list = document.createElement('div');
	list.className = cls.list;
	list.setAttribute('role', 'listbox');
	list.setAttribute('aria-label', label);
	list.rows = [];

	list.select = function(index, focus)
	{
		for (var i = 0; i < list.rows.length; i++)
		{
			var on = i == index;
			list.rows[i].classList.toggle(cls.on, on);
			list.rows[i].setAttribute('aria-selected', (on) ? 'true' : 'false');
			list.rows[i].setAttribute('tabindex', (on) ? '0' : '-1');
		}

		list.selectedIndex = index;

		if (list.rows[index] != null)
		{
			if (focus)
			{
				list.rows[index].focus();
			}

			choose(index);
		}
	};

	list.addRow = function(title, hint, badge)
	{
		var index = list.rows.length;
		var row = document.createElement('div');
		row.className = cls.row;
		row.setAttribute('role', 'option');
		row.setAttribute('tabindex', '-1');

		if (cls.dot != null)
		{
			var dot = document.createElement('span');
			dot.className = cls.dot;
			row.appendChild(dot);
		}

		var text = document.createElement('span');
		text.className = cls.text;
		var name = document.createElement('span');
		name.className = cls.name;
		mxUtils.write(name, title);
		text.appendChild(name);

		if (hint != null && hint != '')
		{
			var hintNode = document.createElement('span');
			hintNode.className = cls.hint;
			mxUtils.write(hintNode, hint);
			text.appendChild(hintNode);
		}

		row.appendChild(text);

		if (badge != null)
		{
			row.appendChild(skin.createRowBadge(badge));
		}

		mxEvent.addListener(row, 'click', function()
		{
			list.select(index);
		});

		mxEvent.addListener(row, 'dblclick', function(evt)
		{
			list.select(index);
			enter();
			mxEvent.consume(evt);
		});

		mxEvent.addListener(row, 'keydown', function(evt)
		{
			var next = (evt.keyCode == 38) ? index - 1 : ((evt.keyCode == 40) ? index + 1 :
				((evt.keyCode == 36) ? 0 : ((evt.keyCode == 35) ? list.rows.length - 1 : null)));

			if (next != null)
			{
				if (list.rows[next] != null)
				{
					list.select(next, true);
				}

				mxEvent.consume(evt);
			}
			else if (evt.keyCode == 13)
			{
				enter();
				mxEvent.consume(evt);
			}
			else if (evt.keyCode == 32)
			{
				list.select(index);
				mxEvent.consume(evt);
			}
		});

		list.rows.push(row);
		list.appendChild(row);

		return row;
	};

	return list;
};

/**
 * Returns true if the draft dialog and the recovery dialog show the layout of
 * Fusion: the feature draftDialog of Editor.featureDefaults (draftDialog in
 * the configuration and the URL), on in Simple (the driver, 18 November
 * 2026: the dialogs of Fusion for Simple), off in Classic, Sketch, Minimal
 * and Atlas. The theme Fusion always has it.
 */
Editor.isDraftDialogEnabled = function()
{
	return Editor.isFeatureEnabled('draftDialog');
};

/**
 * Lays out the given draft dialog in the Classic skin where the feature is
 * on (Fusion lays it out in SimpleFiles.js). Called at the end of the
 * constructor of DraftDialog with its drafts.
 */
EditorUi.prototype.installDraftLayout = function(dlg, drafts)
{
	if (!this.editor.isChromelessView() && Editor.isDraftDialogEnabled() &&
		DraftLayout.getSkin() == DraftLayout.skins.classic)
	{
		try
		{
			this.createDraftLayout(dlg, drafts, DraftLayout.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installDraftLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Lays out the given recovery dialog in the Classic skin where the feature is
 * on (Fusion lays it out in SimpleFiles.js). Called at the end of the
 * constructor of RecoveryDialog.
 */
EditorUi.prototype.installRecoveryLayout = function(dlg)
{
	if (!this.editor.isChromelessView() && Editor.isDraftDialogEnabled() &&
		DraftLayout.getSkin() == DraftLayout.skins.classic)
	{
		try
		{
			this.createRecoveryLayout(dlg, DraftLayout.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installRecoveryLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Returns the size of the content of the given draft or recovery dialog: the
 * size of the layout (DraftLayout.size) limited to the window if the dialog
 * is laid out in the Classic skin, else the given size. Fusion sizes its
 * frame itself.
 */
EditorUi.prototype.getDraftLayoutSize = function(dlg, width, height)
{
	if (dlg != null && dlg.draftLayout != null && dlg.draftLayout.skin == DraftLayout.skins.classic)
	{
		var ww = window.innerWidth || document.documentElement.clientWidth;
		var wh = window.innerHeight || document.documentElement.clientHeight;
		var margin = 48 + ((ww < 640) ? 16 : DraftLayout.windowMargin);

		width = Math.max(Math.min(DraftLayout.size.width, ww - margin), 240);
		height = Math.max(Math.min(DraftLayout.size.height, wh - margin), 240);
	}

	return {width: width, height: height};
};

/**
 * Replaces the layout of the given draft dialog with the layout of the
 * Preview template in the given skin (see DraftDialog.controls): the message,
 * the drafts as a listbox (several drafts) next to the preview with its
 * tools, Discard, Ignore and Delete All on the left of the footer, Cancel and
 * the primary action on the right.
 */
EditorUi.prototype.createDraftLayout = function(dlg, drafts, skin)
{
	var c = dlg.controls;
	var div = dlg.container;
	var cls = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.message == null || c.container == null || c.toolbar == null ||
		c.buttons == null || c.edit == null || c.cancel == null || c.message.parentNode != div ||
		c.buttons.parentNode != div || c.toolbar.parentNode != div)
	{
		return;
	}

	skin.prepare(div, 'draft');
	div.insertBefore(skin.createHead(mxResources.get((drafts != null &&
		drafts.length > 1) ? 'drafts' : 'draft')), div.firstChild);

	var body = document.createElement('div');
	body.className = cls.body;
	div.insertBefore(body, c.buttons);

	// The message, then the drafts on their own row
	c.message.style.cssText = '';
	c.message.className = cls.message;
	body.appendChild(c.message);

	var pane = document.createElement('div');
	pane.className = cls.pane;
	DraftLayout.setPreviewGraph(c.container, pane, skin);
	pane.appendChild(skin.createBadge());
	var deleteAll = null;
	var list = null;

	// Several drafts: rows next to the preview that choose in the select of
	// the dialog (which loads the draft); Delete All in the footer
	if (c.select != null && c.select.parentNode == c.message)
	{
		var select = c.select;
		select.classList.add(cls.replaced);
		select.setAttribute('aria-hidden', 'true');
		select.setAttribute('tabindex', '-1');
		body.appendChild(select);

		var split = document.createElement('div');
		split.className = cls.split;
		list = DraftLayout.createChoiceList(mxResources.get('drafts'), function(index)
		{
			var value = list.rows[index].smValue;

			if (select.value != value)
			{
				select.value = value;
				select.dispatchEvent(new Event('change'));
			}
		}, function()
		{
			c.edit.click();
		}, skin);

		// The rows follow the options (Discard removes one)
		var updateRows = function()
		{
			var focused = list.contains(document.activeElement);
			list.textContent = '';
			list.rows = [];

			for (var i = 0; i < select.options.length; i++)
			{
				var opt = select.options[i];

				if (opt.value != '-1')
				{
					list.addRow(mxResources.get('draft') + ' ' + (list.rows.length + 1),
						mxUtils.trim(opt.textContent)).smValue = opt.value;
				}
				else if (deleteAll == null)
				{
					deleteAll = mxUtils.button(mxUtils.trim(opt.textContent), function()
					{
						select.value = '-1';
						select.dispatchEvent(new Event('change'));
					});
					deleteAll.className = cls.link;
				}
			}

			for (var i = 0; i < list.rows.length; i++)
			{
				if (list.rows[i].smValue == select.value)
				{
					list.select(i, focused);
				}
			}
		};

		updateRows();

		if (window.MutationObserver != null)
		{
			new MutationObserver(updateRows).observe(select, {childList: true});
		}

		mxEvent.addListener(select, 'change', function()
		{
			for (var i = 0; i < list.rows.length; i++)
			{
				if (list.rows[i].smValue == select.value)
				{
					list.select(i, false);
				}
			}
		});

		var main = document.createElement('div');
		main.className = cls.main;
		main.appendChild(pane);
		main.appendChild(DraftLayout.setPreviewTools(c.toolbar, skin));
		split.appendChild(list);
		split.appendChild(main);
		body.appendChild(split);
		div.classList.add(cls.drafts);
	}
	else
	{
		body.appendChild(pane);
		body.appendChild(DraftLayout.setPreviewTools(c.toolbar, skin));
	}

	// The footer: Discard and Ignore on the left, Cancel and the primary
	// action on the right
	var btns = c.buttons;
	btns.style.cssText = '';
	var start = document.createElement('div');
	start.className = cls.footerGroup;

	if (c.discard != null && c.discard.parentNode == btns)
	{
		start.appendChild(c.discard);
	}

	if (c.ignore != null && c.ignore.parentNode == btns)
	{
		start.appendChild(c.ignore);
	}

	if (deleteAll != null)
	{
		start.appendChild(deleteAll);
	}

	btns.insertBefore(start, btns.firstChild);
	btns.appendChild(c.cancel);
	btns.appendChild(c.edit);
	dlg.draftLayout = {skin: skin, list: list};
	DraftLayout.focusPrimary(div, skin);
};

/**
 * Replaces the layout of the given recovery dialog with the layout of the
 * Preview template in the given skin: the candidates as a listbox (the label
 * and the description of each), the first page of the chosen one as an
 * image, Cancel and Open (which clicks the row of the dialog, so the
 * candidate opens as before, see RecoveryDialog.controls). Where the skin
 * pauses previews (pausePreviews) a first page with more cells than the
 * budget of the live previews (EditorUi.simplePreviewBudget) is not drawn
 * when it is chosen: the pane says Preview paused, click to refresh and is a
 * button that draws it.
 */
EditorUi.prototype.createRecoveryLayout = function(dlg, skin)
{
	var ui = this;
	var c = dlg.controls;
	var div = dlg.container;
	var cls = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.title == null || c.rows == null || c.rows.length == 0 || c.buttons == null ||
		c.cancel == null || c.title.parentNode != div || c.buttons.parentNode != div)
	{
		return;
	}

	skin.prepare(div, 'recovery');
	div.style.paddingBottom = '';
	div.insertBefore(skin.createHead(c.title), div.firstChild);

	var body = document.createElement('div');
	body.className = cls.body;
	div.insertBefore(body, c.buttons);

	var pane = document.createElement('div');
	pane.className = cls.pane;
	pane.setAttribute('aria-hidden', 'true');
	pane.appendChild(skin.createBadge());
	var img = document.createElement('img');
	img.className = cls.image;
	img.setAttribute('alt', '');
	pane.appendChild(img);
	var maxCells = (skin.pausePreviews && EditorUi.simplePreviewBudget != null) ?
		EditorUi.simplePreviewBudget.cells : null;
	var paused = null;

	if (maxCells != null)
	{
		paused = document.createElement('div');
		paused.className = cls.paused;
		paused.style.display = 'none';
		mxUtils.write(paused, mxResources.get('previewPaused'));
		pane.appendChild(paused);
	}

	// The picture of each candidate: a data URI, null (none) or false (paused)
	var previews = [];

	// The pane is a button while the picture is paused
	var setPaused = function(on)
	{
		if (paused != null)
		{
			paused.style.display = (on) ? '' : 'none';
			pane.classList.toggle(cls.panePaused, on);

			if (on)
			{
				pane.removeAttribute('aria-hidden');
				pane.setAttribute('role', 'button');
				pane.setAttribute('tabindex', '0');
				pane.setAttribute('aria-label', mxResources.get('previewPaused'));
			}
			else
			{
				// Keeps the focus in the dialog on the chosen candidate
				if (document.activeElement == pane)
				{
					var row = list.rows[list.selectedIndex];

					if (row != null)
					{
						row.focus();
					}
					else
					{
						pane.blur();
					}
				}

				pane.setAttribute('aria-hidden', 'true');
				pane.removeAttribute('role');
				pane.removeAttribute('tabindex');
				pane.removeAttribute('aria-label');
			}
		}
	};

	// Shows the picture of the given candidate, made once (force draws a
	// paused one)
	var showPreview = function(index, force)
	{
		if (previews[index] === undefined || (force && previews[index] === false))
		{
			previews[index] = DraftLayout.createFilePreview(ui, c.rows[index].candidate.data,
				(force) ? null : maxCells);
		}

		if (typeof previews[index] === 'string')
		{
			img.setAttribute('src', previews[index]);
			img.style.display = '';
		}
		else
		{
			img.removeAttribute('src');
			img.style.display = 'none';
		}

		setPaused(previews[index] === false);
	};

	if (paused != null)
	{
		var refresh = function(evt)
		{
			if (previews[list.selectedIndex] === false)
			{
				showPreview(list.selectedIndex, true);
				mxEvent.consume(evt);
			}
		};

		mxEvent.addListener(pane, 'click', refresh);
		mxEvent.addListener(pane, 'keydown', function(evt)
		{
			if (evt.key == 'Enter' || evt.key == ' ')
			{
				refresh(evt);
			}
		});
	}

	// The primary action opens the chosen candidate
	var open = mxUtils.button(mxResources.get('open'), function()
	{
		var r = c.rows[list.selectedIndex];

		if (r != null)
		{
			r.row.click();
		}
	});
	open.className = 'geBtn gePrimaryBtn';

	var list = DraftLayout.createChoiceList(mxResources.get('recoverTitle'), function(index)
	{
		showPreview(index);
	}, function()
	{
		open.click();
	}, skin);

	for (var i = 0; i < c.rows.length; i++)
	{
		var candidate = c.rows[i].candidate;
		c.rows[i].row.classList.add(cls.replaced);
		list.addRow(String(candidate.label), (candidate.description != null) ?
			String(candidate.description) : null);
	}

	var split = document.createElement('div');
	split.className = cls.split;
	split.appendChild(list);
	split.appendChild(pane);
	body.appendChild(split);

	// The footer: Cancel and Open
	var btns = c.buttons;
	btns.style.cssText = '';
	btns.appendChild(open);
	list.select(0);
	dlg.draftLayout = {skin: skin, list: list};

	window.setTimeout(function()
	{
		if (div.parentNode != null && !skin.isTouch())
		{
			list.rows[0].focus();
		}
	}, 0);
};
