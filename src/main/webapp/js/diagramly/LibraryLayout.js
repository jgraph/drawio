/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The library editor of Fusion (LibraryDialog) in every look that has it
 * (concept "Fusion ideas in Simple and Classic", package 4 of the dialogs):
 * the headline and the storage, the name (and Compressed), the hint with
 * Import and Add Images above the shapes as a grid of cards (the picture,
 * the name, which a click or Enter renames in place, and Delete; drag or
 * Alt+arrow keys reorder them), Export and Link on the left of the footer,
 * Cancel and Save on the right. The grid, the entries and the buttons are
 * those of the dialog (LibraryDialog.controls), moved and restyled, so Save
 * and Export get the same library as before.
 *
 * The layout (EditorUi.createLibraryLayout) takes a skin: the Classic skin
 * (LibraryLayout.skins.classic, docs/dialog-style-guide.md, its CSS in
 * grapheditor.css under .geLibEditor, which takes the colors, the font and
 * the corners of the other dialogs of the theme) for Simple, behind the
 * feature libraryDialog of Editor.featureDefaults
 * (Editor.isLibraryDialogEnabled), or the skin of Fusion, which
 * SimpleLibraries.js adds (LibraryLayout.skins.fusion), so the code exists
 * once. The dialog of before is shown where the feature is off.
 */
var LibraryLayout = {};

/**
 * The skins of the layout (the skin of Fusion is added by SimpleLibraries.js).
 */
LibraryLayout.skins = {};

/**
 * Returns the skin of the current look: the skin of Fusion in the theme
 * Fusion, else the Classic skin.
 */
LibraryLayout.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		LibraryLayout.skins.fusion != null) ? LibraryLayout.skins.fusion :
		LibraryLayout.skins.classic;
};

/**
 * Returns true if the dialog shows the layout of Fusion: the feature libraryDialog
 * of Editor.featureDefaults (libraryDialog in the configuration and the URL), on in
 * Simple, off in Classic, Sketch, Minimal and Atlas. The theme Fusion always
 * has it.
 */
Editor.isLibraryDialogEnabled = function()
{
	return Editor.isFeatureEnabled('libraryDialog');
};

/**
 * Size of the content in the Classic skin (the frame adds 48), limited to
 * the window (EditorUi.getLibraryDialogSize).
 */
LibraryLayout.size = {width: 720, height: 540};

/**
 * Space between the frame and the window in the Classic skin.
 */
LibraryLayout.windowMargin = 32;

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the colors of
 * its dialogs light and dark, the headline of the dialogs with the storage
 * in gray, the shapes as cards on the field color, the buttons without
 * glyphs (Delete is a glyph with its name) and the focus rings as outlines
 * inside of the controls. The CSS is in grapheditor.css under .geLibEditor.
 */
LibraryLayout.skins.classic = {
	name: 'classic',
	classes: {root: 'geLibEditor', head: 'geLibEditorHead', name: 'geLibEditorName',
		nameRow: 'geLibEditorNameRow', nameLabel: 'geLibEditorLabel', option: 'geLibEditorOption',
		bar: 'geLibEditorBar', hint: 'geLibEditorHint', area: 'geLibEditorArea', grid: 'geLibEditorGrid',
		empty: 'geLibEditorEmpty', item: 'geLibEditorItem', del: 'geLibEditorDelete',
		replaced: 'geLibEditorReplaced', footer: 'geLibEditorFooter', tools: 'geLibEditorTools'},
	/**
	 * Lays out the given content of the dialog as the library editor.
	 */
	prepare: function(ui, elt)
	{
		// Nothing to do: the size is set where the dialog is shown
		// (EditorUi.getLibraryDialogSize)
	},
	/**
	 * Returns the storage of the library below the headline, or null.
	 */
	createSubtitle: function(text)
	{
		var sub = null;

		if (text != null && text != '')
		{
			sub = document.createElement('div');
			sub.className = 'geLibEditorPlace';
			mxUtils.write(sub, text);
		}

		return sub;
	},
	/**
	 * Prepares the checkbox Compressed (a checkbox, not a switch).
	 */
	prepareOption: function(input)
	{
		// Keeps the checkbox of the dialog
	},
	/**
	 * Adds the glyph of the given name to the given button (the buttons of
	 * the Classic skin have none).
	 */
	addIcon: function(btn, icon)
	{
		return btn;
	},
	/**
	 * Adds the picture of an empty library to the given hint (the text only).
	 */
	prepareEmpty: function(empty)
	{
		// The text only
	},
	/**
	 * Returns the button Delete of an entry with the given name that calls fn.
	 */
	createDeleteButton: function(title, fn, className)
	{
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = className;
		btn.setAttribute('title', title);
		btn.setAttribute('aria-label', title);
		var glyph = document.createElement('span');
		glyph.className = 'geLibEditorGlyph';
		glyph.setAttribute('aria-hidden', 'true');
		glyph.style.setProperty('--ge-lib-glyph', 'url(\'' + Editor.trashImage + '\')');
		btn.appendChild(glyph);

		mxEvent.addListener(btn, 'click', function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});

		return btn;
	},
	/**
	 * A touch that rests on an entry drags it in Fusion (SimpleUi.addCardDrag
	 * of fusion.min.js); the Classic skin keeps the drag and drop of the
	 * dialog of before and Alt+arrow keys.
	 */
	installTouchDrag: null
};

/**
 * Lays out the given library dialog in the Classic skin where the feature is
 * on (Fusion lays it out in SimpleLibraries.js). Called at the end of the
 * constructor of LibraryDialog with its file and storage.
 */
EditorUi.prototype.installLibraryLayout = function(dlg, file, mode)
{
	if (!this.editor.isChromelessView() && Editor.isLibraryDialogEnabled() &&
		LibraryLayout.getSkin() == LibraryLayout.skins.classic)
	{
		try
		{
			this.createLibraryLayout(dlg, file, mode, LibraryLayout.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installLibraryLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Returns the size of the content of the given library dialog: the size of
 * the library editor (LibraryLayout.size) limited to the window if the dialog
 * is laid out in the Classic skin, else the given size. Fusion sizes its
 * frame itself.
 */
EditorUi.prototype.getLibraryDialogSize = function(dlg, width, height)
{
	if (dlg != null && dlg.libraryLayout != null &&
		dlg.libraryLayout.skin == LibraryLayout.skins.classic)
	{
		var ww = window.innerWidth || document.documentElement.clientWidth;
		var wh = window.innerHeight || document.documentElement.clientHeight;
		var margin = 48 + ((ww < 640) ? 16 : LibraryLayout.windowMargin);

		width = Math.max(Math.min(LibraryLayout.size.width, ww - margin), 240);
		height = Math.max(Math.min(LibraryLayout.size.height, wh - margin), 240);
	}

	return {width: width, height: height};
};

/**
 * Replaces the layout of the given library dialog in the given skin (see
 * LibraryLayout.skins.classic): the headline and the storage, the name (and
 * Compressed), Import and Add Images above the grid of the shapes, which are
 * cards with their picture, their name (click or Enter renames in place,
 * Space selects) and Delete; drag (in Fusion a touch rests on the entry
 * first) or Alt+arrow keys reorder them. Export and Link on the left of the
 * footer, Cancel and Save on the right. The grid, the entries and the
 * buttons are those of the dialog, so Save gets the same library as before
 * (see LibraryDialog.controls). Returns true if the dialog was laid out
 * (dlg.libraryLayout is {skin}).
 */
EditorUi.prototype.createLibraryLayout = function(dlg, file, mode, skin)
{
	var c = dlg.controls;
	var elt = dlg.container;
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.nameSection == null || c.nameInput == null || c.grid == null ||
		c.hint == null || c.buttons == null || c.save == null || c.cancel == null ||
		c.buttons.parentNode != elt || c.grid.parentNode != elt)
	{
		return false;
	}

	elt.classList.add(classes.root);
	skin.prepare(this, elt);
	dlg.libraryLayout = {skin: skin};

	// The headline and the storage of the library
	var head = document.createElement('div');
	head.className = classes.head;
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('library'));
	head.appendChild(h3);
	var m = (file != null) ? file.getMode() : mode;
	var storage = (typeof App !== 'undefined' && App.storages != null && m != null) ? App.storages[m] : null;

	var sub = (storage != null) ? skin.createSubtitle(mxResources.get(storage.title)) : null;

	if (sub != null)
	{
		head.appendChild(sub);
	}

	elt.insertBefore(head, elt.firstChild);

	// The name (and Compressed) as form rows
	var section = c.nameSection;
	section.className = classes.name;
	var nameRow = c.nameInput.parentNode;

	if (nameRow != null && nameRow.parentNode == section)
	{
		nameRow.className = classes.nameRow;
		var label = nameRow.firstChild;

		if (label != null && label != c.nameInput)
		{
			label.className = classes.nameLabel;
			label.textContent = '';
			mxUtils.write(label, mxResources.get('filename'));
		}
	}

	if (c.compressed != null && c.compressed.parentNode != null)
	{
		c.compressed.parentNode.className = classes.option;
		skin.prepareOption(c.compressed);
	}

	// Import and Add Images above the grid, with the hint
	var btns = c.buttons;
	var bar = document.createElement('div');
	bar.className = classes.bar;
	var hint = document.createElement('div');
	hint.className = classes.hint;
	mxUtils.write(hint, mxResources.get('libraryHint'));
	bar.appendChild(hint);

	var importBtn = skin.addIcon(btns.querySelector('#btnAddImage'), 'importFile');
	var addBtn = skin.addIcon(btns.querySelector('#btnAddImageUrl'), 'image');

	for (var i = 0; i < 2; i++)
	{
		var b = (i == 0) ? importBtn : addBtn;

		if (b != null)
		{
			bar.appendChild(b);
		}
	}

	elt.insertBefore(bar, c.grid);

	// The grid and the hint of the empty library over it
	var grid = c.grid;
	grid.classList.add(classes.grid);
	grid.setAttribute('role', 'list');
	grid.setAttribute('aria-label', mxResources.get('shapes'));
	var area = document.createElement('div');
	area.className = classes.area;
	elt.insertBefore(area, grid);
	area.appendChild(grid);
	var empty = c.hint;
	var display = empty.style.display;
	empty.style.cssText = '';
	empty.style.display = display;
	empty.className = classes.empty;
	skin.prepareEmpty(empty);
	area.appendChild(empty);

	// Moves the given entry before the entry of the given index (the end
	// for the number of entries) with the drag and drop of the dialog, so
	// the order of the library is the same as after a drag
	var moveTo = function(wrapper, to)
	{
		var items = Array.prototype.slice.call(grid.children);
		var index = mxUtils.indexOf(items, wrapper);

		if (index < 0 || to < 0 || to > items.length || to == index || to == index + 1)
		{
			return;
		}

		var center = function(node)
		{
			node.scrollIntoView({block: 'nearest'});
			var r = node.getBoundingClientRect();

			return {clientX: r.left + r.width / 2, clientY: r.top + r.height / 2};
		};

		var dt = (typeof DataTransfer === 'function') ? new DataTransfer() : null;
		var from = center(wrapper);
		wrapper.dispatchEvent(new DragEvent('dragstart', {bubbles: true, cancelable: true,
			dataTransfer: dt, clientX: from.clientX, clientY: from.clientY}));

		// The entry is inserted before the target, or appended at the end
		var target = items[to];
		var pt = null;

		if (target != null)
		{
			pt = center(target);
		}
		else
		{
			var r = grid.getBoundingClientRect();
			pt = {clientX: r.right - 4, clientY: r.bottom - 4};
		}

		grid.dispatchEvent(new DragEvent('drop', {bubbles: true, cancelable: true,
			dataTransfer: dt, clientX: pt.clientX, clientY: pt.clientY}));

		// After the timeout of dragstart that shrinks the entry
		window.setTimeout(function()
		{
			wrapper.dispatchEvent(new DragEvent('dragend', {bubbles: true, dataTransfer: dt}));
			var label = wrapper.querySelector('.geFocusLabel');

			if (label != null)
			{
				label.focus();
				label.scrollIntoView({block: 'nearest'});
			}
		}, 0);
	};

	// Moves the given entry by delta
	var move = function(wrapper, delta)
	{
		var index = mxUtils.indexOf(grid.children, wrapper);

		if (index >= 0 && index + delta >= 0 && index + delta < grid.children.length)
		{
			moveTo(wrapper, (delta < 0) ? index + delta : index + delta + 1);
		}
	};

	// The entries of the dialog get Delete as a button with its name (the
	// button of the dialog stays, hidden) and Alt+arrow keys
	var decorate = function()
	{
		for (var i = 0; i < grid.children.length; i++)
		{
			(function(wrapper)
			{
				if (!wrapper.libraryLayoutDecorated)
				{
					wrapper.libraryLayoutDecorated = true;
					wrapper.classList.add(classes.item);
					wrapper.setAttribute('role', 'listitem');
					var rem = null;
					var label = wrapper.querySelector('.geFocusLabel');

					for (var j = 0; j < wrapper.children.length; j++)
					{
						if (wrapper.children[j].nodeName == 'IMG' &&
							wrapper.children[j].getAttribute('title') == mxResources.get('delete'))
						{
							rem = wrapper.children[j];
						}
					}

					if (rem != null)
					{
						rem.classList.add(classes.replaced);
						var del = skin.createDeleteButton(mxResources.get('delete') + ((label != null) ?
							': ' + mxUtils.trim(label.textContent) : ''), function(evt)
						{
							rem.click();
							mxEvent.consume(evt);
						}, classes.del);
						del.setAttribute('draggable', 'false');

						mxEvent.addListener(del, 'dragstart', function(evt)
						{
							mxEvent.consume(evt);
						});

						// Delete is at the top of the card: before its name for Tab
						if (label != null && label.parentNode == wrapper)
						{
							wrapper.insertBefore(del, label);
						}
						else
						{
							wrapper.appendChild(del);
						}
					}

					if (label != null)
					{
						mxEvent.addListener(label, 'keydown', function(evt)
						{
							var delta = (evt.keyCode == 37 || evt.keyCode == 38) ? -1 :
								((evt.keyCode == 39 || evt.keyCode == 40) ? 1 : 0);

							if (delta != 0 && mxEvent.isAltDown(evt) && !mxEvent.isControlDown(evt) &&
								!mxEvent.isMetaDown(evt) && label.getAttribute('contentEditable') != 'true')
							{
								move(wrapper, delta);
								mxEvent.consume(evt);
							}
						});
					}
				}
			})(grid.children[i]);
		}
	};

	decorate();

	if (window.MutationObserver != null)
	{
		new MutationObserver(decorate).observe(grid, {childList: true});
	}

	// A touch that rests on an entry drags it in Fusion (the mouse and the
	// pen drag with the drag and drop of the dialog)
	if (skin.installTouchDrag != null)
	{
		skin.installTouchDrag(grid, moveTo, classes);
	}

	// The footer: Export and Link on the left, Cancel and Save on the right
	btns.style.cssText = '';

	if (classes.footer != null)
	{
		btns.className = classes.footer;
	}

	var start = document.createElement('div');
	start.className = classes.tools;
	var exportBtn = skin.addIcon(btns.querySelector('#btnDownload'), 'download');

	if (exportBtn != null)
	{
		start.appendChild(exportBtn);
	}

	for (var i = 0; i < btns.children.length; i++)
	{
		var b = btns.children[i];

		if (b != c.cancel && b != c.save && b != exportBtn && b.nodeName == 'BUTTON')
		{
			start.appendChild(skin.addIcon(b, 'link'));
			break;
		}
	}

	btns.insertBefore(start, btns.firstChild);
	btns.appendChild(c.cancel);
	btns.appendChild(c.save);

	return true;
};
