/**
 * Copyright (c) 2006-2016, JGraph Holdings Ltd
 * Copyright (c) 2006-2016, draw.io AG
 */
/**
 * Global types
 */
/**
 * Constructs a new page for the given diagram node. The node gets the given
 * ID, or a new ID if it has none.
 */
function DiagramPage(node, id)
{
	this.node = node;

	if (id != null)
	{
		this.node.setAttribute('id', id);
	}
	else if (this.getId() == null)
	{
		this.node.setAttribute('id', Editor.guid());
	}
};

/**
 * Holds the diagram node for the page.
 */
DiagramPage.prototype.node = null;

/**
 * Holds the root cell for the page.
 */
DiagramPage.prototype.root = null;

/**
 * Holds the view state for the page.
 */
DiagramPage.prototype.viewState = null;

/**
 * Specifies if the diagram in the page was been modified
 * and the cached XML data needs to be updated.
 */
DiagramPage.prototype.diagramModified = false;

/**
 * Specifies if the root of the page was changed without updating the cached
 * XML data, eg. by a patch while the page is not the current page. See
 * <invalidateNode>.
 */
DiagramPage.prototype.needsUpdate = false;

/**
 * 
 */
DiagramPage.prototype.getId = function()
{
	return this.node.getAttribute('id');
};

/**
 * 
 */
DiagramPage.prototype.getName = function()
{
	return this.node.getAttribute('name');
};

/**
 * 
 */
DiagramPage.prototype.setName = function(value)
{
	if (value == null)
	{
		this.node.removeAttribute('name');
	}
	else
	{
		this.node.setAttribute('name', value);
	}
};

/**
 * Returns the name of the group of the page or null if the page is in no
 * group. Groups are consecutive pages with the same group, which the tabs
 * show if the file has page groups (see EditorUi.isPageGroupsEnabled). The
 * pages stay a flat list, so readers without groups show all pages.
 */
DiagramPage.prototype.getGroup = function()
{
	var value = this.node.getAttribute('group');

	return (value != null && value.length > 0) ? value : null;
};

/**
 * Sets the name of the group of the page or removes it if value is null.
 */
DiagramPage.prototype.setGroup = function(value)
{
	if (value == null)
	{
		this.node.removeAttribute('group');
	}
	else
	{
		this.node.setAttribute('group', value);
	}
};

/**
 * Returns the stored initial view as {x, y, width, height, scale} or null.
 * The view is persisted as a space-separated "x y width height [scale]"
 * attribute on the diagram node (see Graph.getCurrentViewBox /
 * EditorUi.fitInitialView). The scale is optional so externally authored or
 * legacy four-value strings still resolve (the restore then falls back to a
 * fit). Returns null unless at least the four geometry values are finite and
 * width/height are positive.
 */
DiagramPage.prototype.getViewBox = function()
{
	var value = this.node.getAttribute('viewBox');

	if (value != null)
	{
		var t = value.split(' ');
		var x = parseFloat(t[0]);
		var y = parseFloat(t[1]);
		var w = parseFloat(t[2]);
		var h = parseFloat(t[3]);
		var s = (t.length > 4) ? parseFloat(t[4]) : null;

		if (isFinite(x) && isFinite(y) && isFinite(w) && isFinite(h) && w > 0 && h > 0)
		{
			return {x: x, y: y, width: w, height: h,
				scale: (s != null && isFinite(s) && s > 0) ? s : null};
		}
	}

	return null;
};

/**
 * Stores the given {x, y, width, height, scale} as the initial view, or
 * removes the attribute when vb is null. The scale token is omitted when null.
 */
DiagramPage.prototype.setViewBox = function(vb)
{
	if (vb == null)
	{
		this.node.removeAttribute('viewBox');
	}
	else
	{
		var value = vb.x + ' ' + vb.y + ' ' + vb.width + ' ' + vb.height;

		if (vb.scale != null)
		{
			value += ' ' + vb.scale;
		}

		this.node.setAttribute('viewBox', value);
	}
};

/**
 * Returns the text alternative of the page or null. Exports write it as the
 * accessible name of the SVG of the page (see Graph.addSvgTitle).
 */
DiagramPage.prototype.getAlt = function()
{
	return this.node.getAttribute('alt');
};

/**
 * Sets the given text alternative without the characters that are invalid
 * in XML, or removes it if the given value is null or empty.
 */
DiagramPage.prototype.setAlt = function(value)
{
	value = (value != null) ? Graph.zapGremlins(value) : '';

	if (value == '')
	{
		this.node.removeAttribute('alt');
	}
	else
	{
		this.node.setAttribute('alt', value);
	}
};

/**
 * Sets the diagram modified flag.
 */
DiagramPage.prototype.setDiagramModified = function(value)
{
	this.diagramModified = value;
};

/**
 * Returns the diagram modified flag.
 */
DiagramPage.prototype.isDiagramModified = function()
{
	return this.diagramModified;
};

/**
 * Marks the cached XML data of the page as older than its root, eg. after
 * the root was changed while the page is not the current page.
 */
DiagramPage.prototype.invalidateNode = function()
{
	this.needsUpdate = true;
};

/**
 * Returns true if the cached XML data of the page is older than its root:
 * the root was changed (see <invalidateNode>) or the diagram was edited while
 * the page was the current page. Copies of pages keep both flags (see
 * EditorUi.clonePage), so the XML data of a copy is encoded from its root.
 */
DiagramPage.prototype.isNodeStale = function()
{
	return this.needsUpdate || this.diagramModified;
};

/**
 * Change types
 */
function RenamePage(ui, page, name)
{
	this.ui = ui;
	this.page = page;
	this.name = name;
	this.previous = name;
}

/**
 * Implementation of the undoable page rename.
 */
RenamePage.prototype.execute = function()
{
	var tmp = this.page.getName();
	this.page.setName(this.previous);
	this.name = this.previous;
	this.previous = tmp;
	
	// Required to update page name in placeholders
	this.ui.editor.graph.updatePlaceholders();
	this.ui.editor.fireEvent(new mxEventObject('pageRenamed'));
};

/**
 * Undoable change of the ID of a page. The caller checks that the ID is not
 * used by another page.
 */
function ChangePageId(ui, page, id)
{
	this.ui = ui;
	this.page = page;
	this.previous = id;
}

/**
 * Implementation of the undoable page ID change. Keeps the ID if another page
 * has taken the new ID in the meantime, eg. in a remote change.
 */
ChangePageId.prototype.execute = function()
{
	var tmp = this.page.getId();
	var page = this.ui.getPageById(this.previous);

	if (page == null || page == this.page)
	{
		this.page.node.setAttribute('id', this.previous);
	}

	this.previous = tmp;

	// Updates the ID in the tooltip of the tab and in the URL
	this.ui.updateTabContainer();

	if (this.page == this.ui.currentPage)
	{
		this.ui.updateHashObject();
	}
};

/**
 * Undoable change of a page's stored initial view (see DiagramPage.getViewBox).
 */
function ChangePageView(ui, page, viewBox)
{
	this.ui = ui;
	this.page = page;
	this.viewBox = viewBox;
	this.previous = viewBox;
}

/**
 * Implementation of the undoable initial-view change.
 */
ChangePageView.prototype.execute = function()
{
	var tmp = this.page.getViewBox();
	this.page.setViewBox(this.previous);
	this.viewBox = this.previous;
	this.previous = tmp;

	this.ui.editor.fireEvent(new mxEventObject('pageViewChanged'));
};

/**
 * Adds the text alternative of the current page, which exports write as the
 * accessible name of the SVG of the page (see DiagramPage.getAlt).
 */
EditorUi.prototype.addPageSetupOptions = function(parent, styleLabel, styleContent)
{
	var page = this.currentPage;
	var result = null;

	if (page != null)
	{
		var row = document.createElement('div');
		row.className = 'geDialogFormRow geDialogFormRowTop';

		var label = document.createElement('span');
		label.className = 'geDialogFormLabel';
		mxUtils.write(label, mxResources.get('altText', null, 'Alt Text') + ':');
		row.appendChild(styleLabel(label));

		var initialAlt = page.getAlt() || '';
		var input = document.createElement('textarea');
		input.setAttribute('rows', '2');
		input.setAttribute('aria-label', mxResources.get('altText', null, 'Alt Text'));
		input.style.fontFamily = 'inherit';
		input.style.resize = 'vertical';
		input.value = initialAlt;
		row.appendChild(styleContent(input));
		parent.appendChild(row);

		// Applies the text alternative if it was changed in the dialog, so that
		// a change of a collaborator is kept (whitespace only removes it)
		result = mxUtils.bind(this, function()
		{
			if (input.value != initialAlt)
			{
				var alt = Graph.zapGremlins(input.value);
				alt = (mxUtils.trim(alt) != '') ? alt : '';

				if (alt != (page.getAlt() || ''))
				{
					this.editor.graph.model.execute(new ChangePageAlt(this, page, alt));
				}
			}
		});
	}

	return result;
};

/**
 * Undoable change of the text alternative of a page (see DiagramPage.getAlt).
 */
function ChangePageAlt(ui, page, alt)
{
	this.ui = ui;
	this.page = page;
	this.alt = alt;
	this.previous = alt;
}

/**
 * Implementation of the undoable text alternative change.
 */
ChangePageAlt.prototype.execute = function()
{
	var tmp = this.page.getAlt();
	this.page.setAlt(this.previous);
	this.alt = this.previous;
	this.previous = tmp;
};

/**
 * Undoable change of the group of a page (see DiagramPage.getGroup). The
 * tabs are updated once per edit (see EditorUi.initPages), so changes of
 * many pages, eg. if a group is renamed, update them once.
 */
function ChangePageGroup(ui, page, group)
{
	this.ui = ui;
	this.page = page;
	this.group = group;
	this.previous = group;
}

/**
 * Implementation of the undoable page group change.
 */
ChangePageGroup.prototype.execute = function()
{
	var tmp = this.page.getGroup();
	this.page.setGroup(this.previous);
	this.group = this.previous;
	this.previous = tmp;
};

/**
 * Undoable change of the root of a page. An edit that replaces the root of
 * the model (mxGraphModel.setRoot, Editor.setGraphXml) must replace the
 * root of the current page with this change in the same edit: the flush
 * and the save diff the pages, so an undo that restored only the root of
 * the model left the page with the replaced root, and every later edit on
 * that page was lost (jgraph/drawio#5795).
 */
function ChangePageRoot(ui, page, root)
{
	this.ui = ui;
	this.page = page;
	this.root = root;
	this.previous = root;
}

/**
 * Implementation of the undoable page root change.
 */
ChangePageRoot.prototype.execute = function()
{
	var tmp = this.page.root;
	this.page.root = this.previous;
	this.root = this.previous;
	this.previous = tmp;

	// The cached XML of a page that is not viewed is encoded from the
	// root (see getXmlFileData)
	this.page.invalidateNode();
};

/**
 * Undoable change of page title.
 */
function MovePage(ui, oldIndex, newIndex)
{
	this.ui = ui;
	this.oldIndex = oldIndex;
	this.newIndex = newIndex;
}

/**
 * Implementation of the undoable page rename.
 */
MovePage.prototype.execute = function()
{
	var pages = this.ui.pages;

	// Moving a page that does not exist would insert an undefined page
	if (pages != null && this.oldIndex >= 0 && this.oldIndex < pages.length)
	{
		pages.splice(this.newIndex, 0, pages.splice(this.oldIndex, 1)[0]);
	}

	var tmp = this.oldIndex;
	this.oldIndex = this.newIndex;
	this.newIndex = tmp;

	// The page numbers in placeholders and the tabs are updated once per
	// edit (see initPages), as groups of pages move page by page
};

/**
 * Class: mxCurrentRootChange
 *
 * Action to change the current root in a view.
 *
 * Constructor: mxCurrentRootChange
 *
 * Constructs a change of the current root in the given view.
 */
function SelectPage(ui, page, viewState)
{
	this.ui = ui;
	this.page = page;
	this.previousPage = page;
	
	if (page != null)
	{
		this.ui.updatePageRoot(page);
		
		if (viewState != null)
		{
			page.viewState = viewState;
		}
	}
};

/**
 * Executes selection of a new page.
 */
SelectPage.prototype.execute = function()
{
	var prevIndex = mxUtils.indexOf(this.ui.pages, this.previousPage);
	
	if (this.page != null && prevIndex >= 0)
	{
		var page = this.ui.currentPage;
		var editor = this.ui.editor;
		var graph = editor.graph;
		
		if (page.isDiagramModified())
		{
			page.setDiagramModified(false);

			// Updates cached diagram data
			EditorUi.removeChildNodes(page.node);
			page.node.appendChild(editor.getGraphXml(true));
		}

		page.viewState = graph.getViewState();
		page.root = graph.model.root;
		
		if (page.model != null)
		{
			// Updates internal structures of offpage model
			page.model.rootChanged(page.root);
		}
		
		// Removes the previous cells and clears selection
		graph.view.clear(page.root, true);
		graph.clearSelection();
			
		// Switches the current page
		this.ui.currentPage = this.previousPage;
		this.previousPage = page;
		page = this.ui.currentPage;
	
		// Switches the root cell and sets the view state
		this.ui.applyHiddenTagsForPage(page);
		graph.model.prefix = Editor.guid() + '-';
		graph.model.rootChanged(page.root);
		graph.setViewState(page.viewState);

		// Handles grid state in chromeless mode which is stored in Editor instance
		graph.gridEnabled = graph.gridEnabled && (!this.ui.editor.isChromelessView() ||
			urlParams['grid'] == '1');
		
		// Fires events
		editor.graph.fireEvent(new mxEventObject(mxEvent.ROOT));
		editor.fireEvent(new mxEventObject('pageSelected', 'change', this));
	}
};

/**
 * 
 */
function ChangePage(ui, page, select, index, noSelect)
{
	SelectPage.call(this, ui, select);
	this.relatedPage = page;
	this.index = index;
	this.previousIndex = null;
	this.noSelect = noSelect;
};

mxUtils.extend(ChangePage, SelectPage);

/**
 * Function: execute
 *
 * Changes the current root of the view.
 */
ChangePage.prototype.execute = function()
{
	// Fires event to setting view state from realtime
	this.ui.editor.fireEvent(new mxEventObject('beforePageChange', 'change', this));
	this.previousIndex = this.index;
	
	if (this.index == null)
	{
		var tmp = mxUtils.indexOf(this.ui.pages, this.relatedPage);
		this.ui.pages.splice(tmp, 1);
		this.index = tmp;
	}
	else
	{
		this.ui.pages.splice(this.index, 0, this.relatedPage);
		this.index = null;
	}
	
	if (!this.noSelect)
	{
		SelectPage.prototype.execute.apply(this, arguments);
	}
};

/**
 * Execute-time repair for replayed page changes, the page-level twin
 * of the cell change repair in EditorUi.js: the undo history holds
 * DiagramPage OBJECT references, but patches may have removed the
 * page or replaced it with a new object of the same id. Every replay
 * resolves the reference fresh against ui.pages:
 * - the id is taken by a new object: redirected to the canonical page
 *   (an insert replay of an already present page becomes a no-op
 *   instead of a duplicate array entry; a remove replay removes the
 *   canonical instance instead of hitting indexOf -1, whose
 *   splice(-1, 1) silently removed the LAST page)
 * - the id is gone on a remove replay: no-op with the field cycle of
 *   a real remove, so a later insert replay revives the page
 * The first execution is transparent (fresh references by
 * construction).
 */
(function()
{
	var canonicalPage = function(ui, page)
	{
		if (page != null && ui != null && ui.pages != null)
		{
			for (var i = 0; i < ui.pages.length; i++)
			{
				if (ui.pages[i].getId() == page.getId())
				{
					return ui.pages[i];
				}
			}
		}

		return null;
	};

	// The viewed page must stay part of the document. A remove replay
	// can take it out while the page-switch that follows stays inert
	// (its own target was deleted by a peer), leaving ui.currentPage
	// outside ui.pages: it still renders and accepts edits, but those
	// belong to no page in any diff, so they reach neither a flush nor
	// a save and vanish when the next patch heals the reference.
	// Selected quietly, so the repair stays out of the undo history.
	// Drained ONCE after the undo or redo (EditorUi.undo/redo), not
	// per replayed change: the undo of a wholesale replacement passes
	// through one such state per page, and a select per state was a
	// full page render each (the undo of a restore took seconds).
	EditorUi.prototype.healCurrentPage = function()
	{
		if (this.pages != null && this.pages.length > 0 &&
			mxUtils.indexOf(this.pages, this.currentPage) < 0)
		{
			this.selectPage(this.pages[0], true);
		}
	};

	var changePageExecute = ChangePage.prototype.execute;

	ChangePage.prototype.execute = function()
	{
		if (this.repairExecuted && this.relatedPage != null)
		{
			var canonical = canonicalPage(this.ui, this.relatedPage);

			if (this.index == null)
			{
				// Remove replay
				if (canonical != null)
				{
					this.relatedPage = canonical;
				}
				else
				{
					// The page is already gone: no-op with the field
					// cycle of a real remove (a later insert replay
					// revives the recorded page object)
					this.ui.editor.fireEvent(new mxEventObject(
						'beforePageChange', 'change', this));
					this.previousIndex = null;
					this.index = this.ui.pages.length;

					if (!this.noSelect && this.page != null)
					{
						SelectPage.prototype.execute.apply(this, arguments);
					}

					this.repairExecuted = true;

					return;
				}
			}
			else if (canonical != null)
			{
				// Insert replay of a page that is already present (a
				// remote patch re-added it): no-op with the field
				// cycle of a real insert
				this.relatedPage = canonical;
				this.ui.editor.fireEvent(new mxEventObject(
					'beforePageChange', 'change', this));
				this.previousIndex = this.index;
				this.index = null;

				// The select replay walks by direction and skips a
				// self-select itself (see SelectPage.execute below)
				if (!this.noSelect && this.page != null)
				{
					SelectPage.prototype.execute.apply(this, arguments);
				}

				this.repairExecuted = true;

				return;
			}
		}

		changePageExecute.apply(this, arguments);
		this.repairExecuted = true;
	};

	var selectPageExecute = SelectPage.prototype.execute;

	// A replay has a direction: the undo returns to the page viewed
	// before the first execution, the redo to the target, each
	// resolved by id, and a destination that is not in the document
	// (deleted by a peer, or not yet back in a composite undo) keeps
	// the current page. The base toggle - previousPage is the next
	// destination and is swapped on every executed switch - breaks as
	// soon as one replay is inert: its destination stays put and the
	// next replay walks the wrong way. In the undo of a wholesale
	// replacement the inert step is the rule (the origin returns only
	// with the last change), so the redo left the target unselected
	// and the client ended on the last page.
	SelectPage.prototype.execute = function()
	{
		if (this.repairExecuted)
		{
			var dest = (this.page != null) ? canonicalPage(this.ui,
				(this.applied) ? this.origin : this.page) : null;
			this.applied = !this.applied;

			// A self-select would overwrite the current page's view
			// state (scroll/zoom) with a stale one
			if (dest != null && dest != this.ui.currentPage)
			{
				this.previousPage = dest;
				selectPageExecute.apply(this, arguments);
			}
		}
		else
		{
			this.origin = this.ui.currentPage;
			this.applied = true;
			selectPageExecute.apply(this, arguments);
			this.repairExecuted = true;
		}
	};

	var renamePageExecute = RenamePage.prototype.execute;

	RenamePage.prototype.execute = function()
	{
		if (this.repairExecuted)
		{
			var canonical = canonicalPage(this.ui, this.page);

			if (canonical != null)
			{
				this.page = canonical;
			}
		}

		renamePageExecute.apply(this, arguments);
		this.repairExecuted = true;
	};

	var changePageIdExecute = ChangePageId.prototype.execute;

	ChangePageId.prototype.execute = function()
	{
		if (this.repairExecuted)
		{
			var canonical = canonicalPage(this.ui, this.page);

			if (canonical != null)
			{
				this.page = canonical;
			}
		}

		changePageIdExecute.apply(this, arguments);
		this.repairExecuted = true;
	};

	var changePageRootExecute = ChangePageRoot.prototype.execute;

	ChangePageRoot.prototype.execute = function()
	{
		if (this.repairExecuted)
		{
			var canonical = canonicalPage(this.ui, this.page);

			if (canonical != null)
			{
				this.page = canonical;
			}
		}

		changePageRootExecute.apply(this, arguments);
		this.repairExecuted = true;
	};

	// A root change of the main model belongs to the page that was viewed
	// when it was first executed. The history holds no page switch that
	// is not the user's (following a collaborator, the select after a
	// peer removed the viewed page), so a replay on another page put the
	// old root of the first page behind the viewed page, which the next
	// page switch then copied into the viewed page. Such a replay leaves
	// the model as it is; the page of the change gets its root from the
	// ChangePageRoot in the same edit (jgraph/drawio#5795).
	var rootChangeExecute = mxRootChange.prototype.execute;

	mxRootChange.prototype.execute = function()
	{
		var ui = (this.model != null) ? this.model.repairUi : null;

		if (ui != null)
		{
			var pageId = (ui.currentPage != null) ?
				ui.currentPage.getId() : null;

			if (!this.repairExecuted)
			{
				this.repairPageId = pageId;
				this.repairExecuted = true;
			}
			else if (pageId != this.repairPageId)
			{
				// Field cycle of an executed change
				var tmp = this.root;
				this.root = this.previous;
				this.previous = tmp;

				return;
			}
		}

		rootChangeExecute.apply(this, arguments);
	};

	var changePageViewExecute = ChangePageView.prototype.execute;

	ChangePageView.prototype.execute = function()
	{
		if (this.repairExecuted)
		{
			var canonical = canonicalPage(this.ui, this.page);

			if (canonical != null)
			{
				this.page = canonical;
			}
		}

		changePageViewExecute.apply(this, arguments);
		this.repairExecuted = true;
	};

	var changePageAltExecute = ChangePageAlt.prototype.execute;

	ChangePageAlt.prototype.execute = function()
	{
		if (this.repairExecuted)
		{
			var canonical = canonicalPage(this.ui, this.page);

			if (canonical != null)
			{
				this.page = canonical;
			}
		}

		changePageAltExecute.apply(this, arguments);
		this.repairExecuted = true;
	};

	var changePageGroupExecute = ChangePageGroup.prototype.execute;

	ChangePageGroup.prototype.execute = function()
	{
		if (this.repairExecuted)
		{
			var canonical = canonicalPage(this.ui, this.page);

			if (canonical != null)
			{
				this.page = canonical;
			}
		}

		changePageGroupExecute.apply(this, arguments);
		this.repairExecuted = true;
	};

	var movePageExecute = MovePage.prototype.execute;

	MovePage.prototype.execute = function()
	{
		// Index-based: clamp against the current page count so a
		// replay after remote inserts/removes stays in bounds
		if (this.repairExecuted && this.ui != null && this.ui.pages != null)
		{
			var max = Math.max(0, this.ui.pages.length - 1);
			this.oldIndex = Math.min(this.oldIndex, max);
			this.newIndex = Math.min(this.newIndex, max);
		}

		movePageExecute.apply(this, arguments);
		this.repairExecuted = true;
	};
})();

/**
 *
 */
function ReplaceDiagram(ui, data)
{
	this.ui = ui;
	this.data = data;
};

/**
 * Function: execute
 *
 * Changes the current root of the view.
 */
ReplaceDiagram.prototype.execute = function()
{
	var graph = this.ui.editor.graph;
	var data = this.ui.editor.getGraphXml();

	this.ui.editor.readGraphState(this.data);
	this.ui.editor.updateGraphComponents();
	
	var dec = new mxCodec(this.data.ownerDocument);
	var model = new mxGraphModel();
	dec.decode(this.data, model);
	
	this.data = data;

	if (this.ui.currentPage)
	{
		this.ui.currentPage.viewState = graph.getViewState();
		this.ui.currentPage.root = model.root;

		if (this.ui.currentPage.model != null)
		{
			// Updates internal structures of offpage model
			this.ui.currentPage.model.rootChanged(this.ui.currentPage.model.root);
		}
	}

	graph.view.clear(graph.model.root, true);
	graph.model.rootChanged(model.root);
	graph.fireEvent(new mxEventObject(mxEvent.ROOT));
};

/**
 * Specifies if the tab container is visible. Default is true.
 */
EditorUi.prototype.tabContainerVisible = true;

/**
 * Returns the index of the selected page.
 */
EditorUi.prototype.setTabContainerVisible = function(visible, remember)
{
	if (Editor.isSettingsEnabled() && remember)
	{
		mxSettings.settings.pages = visible;
		mxSettings.save();
	}
	
	this.tabContainerVisible = visible;
	this.updateTabContainer();
};

/**
 * Returns the index of the selected page.
 */
EditorUi.prototype.isTabContainerVisible = function()
{
	return this.tabContainerVisible;
};

/**
 * Returns the index of the selected page.
 */
EditorUi.prototype.getSelectedPageIndex = function()
{
	return this.getPageIndex(this.currentPage);
};

/**
 * Returns the index of the given page.
 */
 EditorUi.prototype.getPageIndex = function(page)
 {
	 var result = null;
	 
	 if (this.pages != null && page != null)
	 {
		 for (var i = 0; i < this.pages.length; i++)
		 {
			 if (this.pages[i] == page)
			 {
				 result = i;
				 
				 break;
			 }
		 }
	 }
	 
	 return result;
 };
 
/**
 * Changes the ID of the given page with an undoable change.
 */
EditorUi.prototype.setPageId = function(page, id)
{
	this.editor.graph.model.execute(new ChangePageId(this, page, id));
};

/**
 * Returns the page with the given ID from the optional array of pages.
 */
EditorUi.prototype.getPageById = function(id, pages)
{
	pages = (pages != null) ? pages : this.pages;

	if (pages != null)
	{
		for (var i = 0; i < pages.length; i++)
		{
			if (pages[i].getId() == id)
			{
				return pages[i];
			}
		}
	}

	return null;
};

/**
 * Returns the page for the given data:page/id, link or null. Whitespace
 * around the ID of a hand-typed link is ignored: "data:page/id, abc" gave
 * "Page not found" (Kym, 2026-09-25). Page IDs from Editor.guid never
 * contain whitespace, and an exact match still wins.
 */
EditorUi.prototype.getPageByLink = function(href, pages)
{
	var id = href.substring(href.indexOf(',') + 1);

	return this.getPageById(id, pages) ||
		this.getPageById(mxUtils.trim(id), pages);
};

/**
 * Returns the background image for the given page link.
 */
EditorUi.prototype.createImageForPageLink = function(src, sourcePage, sourceGraph, addFonts)
{
	var comma = src.indexOf(',');
	var result = null;
		
	if (comma > 0)
	{
		var page = this.getPageById(src.substring(comma + 1));

		if (page != null && page != sourcePage)
		{
			result = this.getImageForPage(page, sourcePage, sourceGraph, addFonts);
			result.originalSrc = src;
		}
	}

	if (result == null)
	{
		result = {originalSrc: src};
	}

	return result;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.pageSelected = function()
{
	var graph = this.editor.graph;
	var page = this.currentPage;

	if (page != null)
	{
		// Keeps the fit window mode and fits the new page below
		var fitWindow = this.fitWindowEnabled;

		graph.tooltipHandler.hide();

		if (page.viewState == null ||
			page.viewState.scrollTop == null ||
			page.viewState.scrollLeft == null)
		{
			// Selects unlocked layer if page was never shown
			graph.selectUnlockedLayer();
			this.resetScrollbars();

			if (graph.isLightboxView())
			{
				this.lightboxFit();
			}
			// Skips the fit while a file is opening since resetGraphView
			// resets the scroll position and fileLoaded fits the diagram
			else if (Editor.fitDiagramOnPage && !this.openingFile)
			{
				this.fitInitialView();
			}

			if (this.chromelessResize != null)
			{
				graph.container.scrollLeft = 0;
				graph.container.scrollTop = 0;
				this.chromelessResize();

				// Views with scrollbars pad the diagram, so the scroll
				// position of the origin does not show it
				this.centerChromelessDiagram();
			}
		}
		else
		{
			// Restores scrollbar positions
			graph.setScrollbarPositions(page.viewState,
				graph.view.translate.x, graph.view.translate.y);
		}

		if (fitWindow)
		{
			this.setFitWindowEnabled(true);
		}

		this.updateTabContainer();
	}
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.getImageForPage = function(page, sourcePage, sourceGraph, addFonts)
{
	sourceGraph = (sourceGraph != null) ? sourceGraph : this.editor.graph;
	var graphGetGlobalVariable = sourceGraph.getGlobalVariable;
	var graph = this.createTemporaryGraph(sourceGraph.getStylesheet());
	var index = this.getPageIndex((sourcePage != null) ?
		sourcePage : this.currentPage);

	graph.getGlobalVariable = function(name)
	{
		if (name == 'pagenumber')
		{
			return index + 1;
		}
		else if (name == 'page' && sourcePage != null)
		{
			return sourcePage.getName();
		}
		else
		{
			return graphGetGlobalVariable.apply(this, arguments);
		}
	};

	document.body.appendChild(graph.container);
	
	this.updatePageRoot(page);
	graph.setAdaptiveColors(page.viewState.adaptiveColors);
	graph.setMeasureScale(page.viewState.measureScale);

	// Uses the root in the source graph for the current page since the
	// root of the page is updated after the background image is set
	graph.addPlaceholderRoot((sourcePage != null && sourcePage != this.currentPage) ?
		sourcePage.root : sourceGraph.model.getRoot());
	graph.model.setRoot(page.root);

	var temp = Graph.foreignObjectWarningText;
	Graph.foreignObjectWarningText = '';
	var svgRoot = graph.getSvg(null, null, null, null, null, null, null,
		null, null, null, addFonts, null, null, null, true, true);
	
	var bounds = graph.getGraphBounds();
	document.body.removeChild(graph.container);
	Graph.foreignObjectWarningText = temp;

	return new mxImage(Editor.createSvgDataUri(mxUtils.getXml(svgRoot)),
		bounds.width, bounds.height, bounds.x, bounds.y);
};

/**
 * Returns a temporary graph with the given page, which is not the current
 * page, and the settings of the page for exports. The given index is the
 * number of the page minus one. The container of the graph is added to the
 * document and must be removed by the caller.
 */
EditorUi.prototype.createPageGraph = function(page, index)
{
	var graph = this.editor.graph;
	var temp = this.createTemporaryGraph(graph.getStylesheet());
	temp.shapeForegroundColor = graph.shapeForegroundColor;
	temp.shapeBackgroundColor = graph.shapeBackgroundColor;
	temp.enableFlowAnimation = graph.enableFlowAnimation;
	this.updatePageRoot(page);
	var state = page.viewState;

	if (state != null)
	{
		var img = state.backgroundImage;

		// Updates the image of background pages
		if (img != null && img.originalSrc != null)
		{
			img = this.createImageForPageLink(img.originalSrc, page);
		}

		temp.pageVisible = state.pageVisible;
		temp.pageFormat = state.pageFormat;
		temp.pageScale = state.pageScale;
		temp.mathEnabled = state.mathEnabled;
		temp.shadowVisible = state.shadowVisible;
		temp.background = state.background;
		temp.backgroundImage = img;
		temp.gridSize = Graph.parseGridSize(state.gridSize);
		temp.hiddenTags = state.hiddenTags || [];
		temp.setBackgroundGradient(state.backgroundGradient,
			state.backgroundGradientDirection);
		temp.setMeasureScale(state.measureScale);
		temp.setAdaptiveColors(state.adaptiveColors);
	}

	// Resolves the other placeholders like in the current page
	temp.getGlobalVariable = function(name)
	{
		if (name == 'page')
		{
			return page.getName();
		}
		else if (name == 'pagenumber')
		{
			return index + 1;
		}

		return graph.getGlobalVariable.apply(graph, arguments);
	};

	document.body.appendChild(temp.container);
	temp.model.setRoot(page.root);

	return temp;
};

/**
 * Returns an SVG with all pages and a view for each page that shows the
 * current page (see Graph.createSvgWithViews). The given function returns
 * the SVG root for the graph and the page. Math and the outlines of images
 * in other pages are only in the SVG if MathJax is loaded and the outlines
 * are traced (see prepareOtherPages).
 */
EditorUi.prototype.getSvgWithViews = function(fn)
{
	var pages = [];

	for (var i = 0; i < this.pages.length; i++)
	{
		var page = this.pages[i];
		var graph = (page == this.currentPage) ? this.editor.graph :
			this.createPageGraph(page, i);

		try
		{
			pages.push({svg: fn(graph, page), id: page.getId(), name: page.getName()});
		}
		finally
		{
			if (graph != this.editor.graph)
			{
				graph.container.parentNode.removeChild(graph.container);
			}
		}
	}

	return Graph.createSvgWithViews(pages, mxUtils.indexOf(
		this.pages, this.currentPage));
};

/**
 * Invokes the given function once the pages other than the current page can
 * be exported (see getSvgWithViews): MathJax is loaded if they use math, and
 * the images of their shapes with an outline perimeter are traced, whose
 * outlines are then cached (see Graph.waitForOutlines).
 */
EditorUi.prototype.prepareOtherPages = function(fn)
{
	var math = false;
	var graphs = [];

	for (var i = 0; this.pages != null && i < this.pages.length; i++)
	{
		var page = this.pages[i];

		if (page != this.currentPage)
		{
			try
			{
				this.updatePageRoot(page);
				math = math || (page.viewState != null && page.viewState.mathEnabled == true);

				// Starts the traces in a graph of the page
				if (EditorUi.hasOutlinePerimeter(page.root))
				{
					graphs.push(this.createPageGraph(page, i));
				}
			}
			catch (e)
			{
				// The export reports the error
			}
		}
	}

	var pending = graphs.length + 1;

	var done = function()
	{
		if (--pending == 0)
		{
			if (math && typeof Editor.loadMath === 'function')
			{
				Editor.loadMath(fn);
			}
			else
			{
				fn();
			}
		}
	};

	for (var i = 0; i < graphs.length; i++)
	{
		(function(graph)
		{
			graph.waitForOutlines(function()
			{
				graph.container.parentNode.removeChild(graph.container);
				done();
			}, 10000);
		})(graphs[i]);
	}

	done();
};

/**
 * Returns true if a cell under the given root has perimeter=outlinePerimeter
 * in its style (see Graph.isOutlinePerimeter and getOutlinePages in export.js).
 */
EditorUi.hasOutlinePerimeter = function(root)
{
	var cells = [root];

	while (cells.length > 0)
	{
		var cell = cells.pop();

		if (cell.style != null && /(^|;)\s*perimeter=outlinePerimeter\s*(;|$)/.test(cell.style))
		{
			return true;
		}

		for (var i = 0; cell.children != null && i < cell.children.length; i++)
		{
			cells.push(cell.children[i]);
		}
	}

	return false;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.initPages = function()
{
	if (!this.editor.graph.standalone)
	{
		this.actions.addAction('previousPage', mxUtils.bind(this, function()
		{
			this.selectNextPage(false);
		}));
		
		this.actions.addAction('nextPage', mxUtils.bind(this, function()
		{
			this.selectNextPage(true);
		}));

		if (this.isPagesEnabled())
		{
			this.keyHandler.bindAction(33, true, 'previousPage', true); // Ctrl+Shift+PageUp
			this.keyHandler.bindAction(34, true, 'nextPage', true); // Ctrl+Shift+PageDown
		}
			
		// Updates the tabs after loading the diagram
		var graph = this.editor.graph;
		var graphViewValidateBackground = graph.view.validateBackground; 
		
		graph.view.validateBackground = mxUtils.bind(this, function()
		{
			graphViewValidateBackground.apply(graph.view, arguments);
			
			// Uses SVG subtree to support custom fonts and images
			if (graph.view.backgroundImage != null)
			{
				EditorUi.embedSvgImages(graph.view.backgroundImage.node);
			}
		});

		// Adds a graph model listener to update the view and diagram modified flag
		this.editor.graph.model.addListener(mxEvent.CHANGE, mxUtils.bind(this, function(sender, evt)
		{
			var edit = evt.getProperty('edit');
			var changes = edit.changes;
			var tabs = false;
			var moved = false;
			
			for (var i = 0; i < changes.length; i++)
			{
				if (changes[i] instanceof MovePage)
				{
					moved = true;
				}
				else if (changes[i] instanceof RenamePage ||
					changes[i] instanceof ChangePage ||
					changes[i] instanceof ChangePageGroup ||
					changes[i] instanceof mxRootChange)
				{
					tabs = true;
				}
			}

			// Updates the page numbers in placeholders and the tabs once for all
			// moved pages: moving a group of G pages updated them G times (a
			// group of 500 pages: 9.4 s)
			if (moved)
			{
				graph.updatePlaceholders();
				this.editor.fireEvent(new mxEventObject('pageMoved'));
			}
			else if (tabs)
			{
				this.updateTabContainer();
			}

			if (this.currentPage != null && !(changes.length == 1 &&
				changes[0] instanceof SelectPage))
			{
				this.currentPage.setDiagramModified(true);
			}
		}));
		
		// Invokes pageSelected to reset/restore view state
		var graphSizeDidChange = graph.sizeDidChange;
		var lastPage = null;
		var ui = this;

		graph.sizeDidChange = function()
		{
			var result = graphSizeDidChange.apply(this, arguments);

			if (ui.currentPage != null &&
				lastPage != ui.currentPage)
			{
					lastPage = ui.currentPage;
				ui.pageSelected();
			}

			return result;
		};

		// Selects new default parent if root changes
		graph.addListener(mxEvent.ROOT, mxUtils.bind(this, function()
		{
			graph.checkDefaultParent();
		}));
		
		var pagesChanged = mxUtils.bind(this, function()
		{
			this.updateDocumentTitle();
			this.updateTabContainer();
		});

		this.addListener('currentThemeChanged', pagesChanged);
		this.editor.addListener('pagesPatched', pagesChanged);
		this.editor.addListener('pageRenamed', pagesChanged);
		this.editor.addListener('pageMoved', pagesChanged);
		this.editor.addListener('fileLoaded', pagesChanged);

		this.editor.addListener('pageSelected', mxUtils.bind(this, function(sender, evt)
		{
			this.updateTabContainer();
			this.updateHashObject();
			this.updateDocumentTitle();
		}));

		this.editor.addListener('pageMoved', mxUtils.bind(this, function(sender, evt)
		{
			this.updateHashObject();
		}));

		var resizeHandler = mxUtils.bind(this, function()
		{
			this.checkTabScrollerOverflow();
		});

		mxEvent.addListener(window, 'resize', resizeHandler);

		this.destroyFunctions.push(function()
		{
			mxEvent.removeListener(window, 'resize', resizeHandler);
		});

		this.addListener('languageChanged', mxUtils.bind(this, function()
		{
			this.updateTabContainer();
		}));
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
EditorUi.prototype.scrollToPage = function(page, force)
{
	var index = (page != null) ? this.getPageIndex(page) :
		this.getSelectedPageIndex();
	var scrollPage = (page != null) ?
		page : this.currentPage;

	// The tabs of the pages are not the only children of the tab scroller
	// if the tabs show page groups
	var tab = (index != null && this.pageTabs != null) ?
		this.pageTabs[index] : null;

	if (tab != null && this.tabScroller != null &&
		(scrollPage != this.lastScrollPage || force))
	{
		tab.scrollIntoView({block: 'nearest', inline: (page != null) ?
			'nearest' : 'center'});
		tab.classList.add('geActivePage');
		this.lastScrollPage = scrollPage;
		this.btKnownTabScroll = this.tabScroller.scrollLeft;
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
EditorUi.prototype.restoreViewState = function(page, viewState, selection)
{
	var newPage = (page != null) ? this.getPageById(page.getId()) : null;
	var graph = this.editor.graph;

	if (newPage != null && this.currentPage != null && this.pages != null)
	{
		if (newPage != this.currentPage)
		{
			this.selectPage(newPage, true, viewState);
		}
		else
		{
			// TODO: Pass viewState to setGraphXml
			graph.setViewState(viewState);
			this.editor.updateGraphComponents();
			graph.view.revalidate();
			graph.sizeDidChange();
		}

		graph.container.scrollLeft = graph.view.translate.x * graph.view.scale + viewState.scrollLeft;
		graph.container.scrollTop = graph.view.translate.y * graph.view.scale + viewState.scrollTop;
		graph.restoreSelection(selection);
	}
};

/**
 * Overrides setDefaultParent
 */
Graph.prototype.createViewState = function(node)
{
	var pv = node.getAttribute('page');
	var ps = parseFloat(node.getAttribute('pageScale'));
	var pw = parseFloat(node.getAttribute('pageWidth'));
	var ph = parseFloat(node.getAttribute('pageHeight'));
	var bg = node.getAttribute('background');
	var bgImg = this.parseBackgroundImage(node.getAttribute('backgroundImage'));
	var extFonts = node.getAttribute('extFonts');
	
	if (extFonts)
	{
		try
		{
			extFonts = extFonts.split('|').map(function(ef)
			{
				var parts = ef.split('^');
				return {name: parts[0], url: parts[1]};
			});
		}
		catch(e)
		{
			console.log('ExtFonts format error: ' + e.message);
		}
	}

	// Validated gradient of the page background
	var gradient = Graph.parseBackgroundGradient(
		node.getAttribute('backgroundGradient'),
		node.getAttribute('backgroundGradientDirection'));

	return {
		gridEnabled: node.getAttribute('grid') != '0',
		//gridColor: node.getAttribute('gridColor') || mxSettings.getGridColor(Editor.isDarkMode()),
		gridSize: Graph.parseGridSize(node.getAttribute('gridSize')),
		guidesEnabled: node.getAttribute('guides') != '0',
		foldingEnabled: (function() { var fold = node.getAttribute('fold');
			return fold != null && (Editor.config == null || Editor.config.defaultFoldingEnabled == null) ?
			fold != '0' : Graph.prototype.defaultFoldingEnabled; })(),
		shadowVisible: node.getAttribute('shadow') == '1',
		pageVisible: (this.isLightboxView()) ? false : ((pv != null) ? (pv != '0') : this.defaultPageVisible),
		background: (bg != null && bg.length > 0) ? bg : null,
		backgroundGradient: gradient.color,
		backgroundGradientDirection: gradient.direction,
		backgroundImage: bgImg,
		pageScale: (!isNaN(ps)) ? ps : mxGraph.prototype.pageScale,
		pageFormat: (!isNaN(pw) && !isNaN(ph)) ? new mxRectangle(0, 0, pw, ph) :
			((typeof mxSettings === 'undefined' || this.defaultPageFormat != null) ?
				mxGraph.prototype.pageFormat : mxSettings.getPageFormat()),
		tooltips: node.getAttribute('tooltips') != '0',
		connect: (function() { var connect = node.getAttribute('connect');
			return connect != null && (Editor.config == null || Editor.config.defaultConnectable == null) ?
			connect != '0' : Graph.prototype.defaultConnectable; })(),
		arrows: (function() { var arrows = node.getAttribute('arrows');
			return arrows != null && (Editor.config == null || Editor.config.defaultConnectionArrowsEnabled == null) ?
			arrows != '0' : Graph.prototype.defaultConnectionArrowsEnabled; })(),
		mathEnabled: node.getAttribute('math') == '1',
		adaptiveColors: node.getAttribute('adaptiveColors'),
		measureScale: Graph.parseMeasureScale(node.getAttribute('measureScale')),
		selectionCells: null,
		defaultParent: null,
		scrollbars: this.defaultScrollbars,
		scale: 1,
		hiddenTags: [],
		extFonts: extFonts || []
	};
};

/**
 * Writes the graph properties from the realtime model to the given mxGraphModel node.
 */
Graph.prototype.saveViewState = function(vs, node, ignoreTransient, resolveReferences, sourcePage)
{
	if (!ignoreTransient)
	{
		node.setAttribute('grid', ((vs == null) ? this.defaultGridEnabled : vs.gridEnabled) ? '1' : '0');
		node.setAttribute('page', ((vs == null) ? this.defaultPageVisible : vs.pageVisible) ? '1' : '0');
		node.setAttribute('gridSize', (vs != null) ? vs.gridSize : mxGraph.prototype.gridSize);
		node.setAttribute('guides', (vs == null || vs.guidesEnabled) ? '1' : '0');
		node.setAttribute('tooltips', (vs == null || vs.tooltips) ? '1' : '0');
		node.setAttribute('connect', (vs == null || vs.connect) ? '1' : '0');
		node.setAttribute('arrows', (vs == null || vs.arrows) ? '1' : '0');
		
		// Ignores fold to avoid checksum errors for lightbox mode
		node.setAttribute('fold', (vs == null || vs.foldingEnabled) ? '1' : '0');
	}

	node.setAttribute('pageScale', (vs != null && vs.pageScale != null) ?
		vs.pageScale : mxGraph.prototype.pageScale);
	
	var pf = (vs != null) ? vs.pageFormat : (typeof mxSettings === 'undefined' ||
		this.defaultPageFormat != null) ? mxGraph.prototype.pageFormat :
			mxSettings.getPageFormat();
	
	if (pf != null)
	{
		node.setAttribute('pageWidth', pf.width);
		node.setAttribute('pageHeight', pf.height);
	}

	if (vs != null)
	{
		if (vs.background != null)
		{
			node.setAttribute('background', vs.background);
		}

		// Validated gradient of the page background
		var gradient = Graph.parseBackgroundGradient(
			vs.backgroundGradient, vs.backgroundGradientDirection);

		if (gradient.color != null)
		{
			node.setAttribute('backgroundGradient', gradient.color);

			if (gradient.direction != null)
			{
				node.setAttribute('backgroundGradientDirection', gradient.direction);
			}
		}

		var bgImg = this.getBackgroundImageObject(vs.backgroundImage,
			resolveReferences, sourcePage);

		if (bgImg != null)
		{
			node.setAttribute('backgroundImage', JSON.stringify(bgImg));
		}
	}

	node.setAttribute('math', ((vs == null) ? this.defaultMathEnabled : vs.mathEnabled) ? '1' : '0');
	node.setAttribute('shadow', (vs != null && vs.shadowVisible) ? '1' : '0');

	if (vs == null || vs.adaptiveColors == null)
	{
		node.removeAttribute('adaptiveColors');
	}
	else
	{
		node.setAttribute('adaptiveColors', vs.adaptiveColors);
	}

	// Only written if it is not the default so that other files are unchanged
	var measureScale = (vs != null) ? Graph.parseMeasureScale(vs.measureScale) : 1;

	if (measureScale != 1)
	{
		node.setAttribute('measureScale', measureScale);
	}
	else
	{
		node.removeAttribute('measureScale');
	}
	
	if (vs != null && vs.extFonts != null && vs.extFonts.length > 0)
	{
		node.setAttribute('extFonts', vs.extFonts.map(function(ef)
		{
			return ef.name + '^' + ef.url;
		}).join('|'));
	}
};

/**
 * Overrides setDefaultParent
 */
Graph.prototype.getViewState = function()
{
	return {
		defaultParent: this.defaultParent,
		currentRoot: this.view.currentRoot,
		gridEnabled: this.gridEnabled,
		gridSize: this.gridSize,
		guidesEnabled: this.graphHandler.guidesEnabled,
		foldingEnabled: this.foldingEnabled,
		shadowVisible: this.shadowVisible,
		scrollbars: this.scrollbars,
		pageVisible: this.pageVisible,
		background: this.background,
		backgroundGradient: this.backgroundGradient,
		backgroundGradientDirection: this.backgroundGradientDirection,
		backgroundImage: this.backgroundImage,
		pageScale: this.pageScale,
		pageFormat: this.pageFormat,
		tooltips: this.tooltipHandler.isEnabled(),
		connect: this.connectionHandler.isEnabled(),
		arrows: this.connectionArrowsEnabled,
		scale: this.view.scale,
		scrollLeft: this.container.scrollLeft - this.view.translate.x * this.view.scale,
		scrollTop: this.container.scrollTop - this.view.translate.y * this.view.scale,
		translate: this.view.translate.clone(),
		lastPasteXml: this.lastPasteXml,
		pasteCounter: this.pasteCounter,
		mathEnabled: this.mathEnabled,
		adaptiveColors: this.adaptiveColors,
		measureScale: this.measureScale,
		hiddenTags: this.hiddenTags,
		extFonts: this.extFonts
	};
};

/**
 * Overrides setDefaultParent
 */
Graph.prototype.setViewState = function(state, removeOldExtFonts)
{
	if (state != null)
	{
		this.lastPasteXml = state.lastPasteXml;
		this.pasteCounter = state.pasteCounter || 0;
		this.mathEnabled = state.mathEnabled;
		this.adaptiveColors = state.adaptiveColors;
		this.setMeasureScale(state.measureScale);
		this.gridEnabled = urlParams['grid'] != null ? urlParams['grid'] != '0' : state.gridEnabled;
		this.gridSize = Graph.parseGridSize(state.gridSize);
		this.graphHandler.guidesEnabled = state.guidesEnabled;
		this.foldingEnabled = state.foldingEnabled;
		this.setShadowVisible(state.shadowVisible, false);
		this.scrollbars = state.scrollbars;
		this.pageVisible = !this.isViewer() && (urlParams['pv'] != null ? urlParams['pv'] != '0' : state.pageVisible);
		this.background = state.background;
		this.setBackgroundGradient(state.backgroundGradient,
			state.backgroundGradientDirection);
		this.pageScale = state.pageScale;
		this.pageFormat = state.pageFormat;
		this.view.currentRoot = state.currentRoot;
		this.defaultParent = state.defaultParent;
		this.connectionArrowsEnabled = state.arrows;
		this.setTooltips(state.tooltips);
		this.setConnectable(state.connect);
		this.setBackgroundImage(state.backgroundImage);
		this.hiddenTags = state.hiddenTags;

		var oldExtFonts = this.extFonts;
		this.extFonts = state.extFonts || [];

		// Removing old fonts is important for real-time synchronization
		// But, for page change, it results in undesirable font flicker
		if (removeOldExtFonts && oldExtFonts != null)
		{
			for (var i = 0; i < oldExtFonts.length; i++)
			{
				var fontElem = document.getElementById('extFont_' + oldExtFonts[i].name);
				
				if (fontElem != null)
				{
					fontElem.parentNode.removeChild(fontElem);
				}
			}
		}
		
		for (var i = 0; i < this.extFonts.length; i++)
		{
			this.addExtFont(this.extFonts[i].name, this.extFonts[i].url, true);
		}
		
		if (state.scale != null)
		{
			this.view.scale = state.scale;
		}
		else
		{
			this.view.scale = 1;
		}
		
		// Checks if current root or default parent have been removed
		if (this.view.currentRoot != null &&
			!this.model.contains(this.view.currentRoot))
		{
			this.view.currentRoot = null;
		}
		
		if (this.defaultParent != null &&
			!this.model.contains(this.defaultParent))
		{
			this.setDefaultParent(null);
			this.selectUnlockedLayer();
		}
		
		if (state.translate != null)
		{
			this.view.translate = state.translate;
		}
	}
	else
	{
		this.view.currentRoot = null;
		this.view.scale = 1;
		this.gridEnabled = this.defaultGridEnabled;
		this.gridSize = mxGraph.prototype.gridSize;
		this.pageScale = mxGraph.prototype.pageScale;
		this.pageFormat = (typeof mxSettings === 'undefined' || this.defaultPageFormat != null) ?
			mxGraph.prototype.pageFormat : mxSettings.getPageFormat();
		this.pageVisible = this.defaultPageVisible;
		this.background = null;
		this.setBackgroundGradient(null);
		this.backgroundImage = null;
		this.scrollbars = this.defaultScrollbars;
		this.graphHandler.guidesEnabled = true;
		this.foldingEnabled = this.defaultFoldingEnabled;
		this.setShadowVisible(false, false);
		this.defaultParent = null;
		this.setTooltips(true);
		this.setConnectable(this.defaultConnectable);
		this.lastPasteXml = null;
		this.pasteCounter = 0;
		this.mathEnabled = this.defaultMathEnabled;
		this.adaptiveColors = null;
		this.setMeasureScale(null);
		this.connectionArrowsEnabled = this.defaultConnectionArrowsEnabled;
		this.hiddenTags = [];
		this.extFonts = [];
	}

	// Handles adaptive colors
	this.setAdaptiveColors(this.adaptiveColors);
	
	// Implicit settings
	this.pageBreaksVisible = this.pageVisible; 
	this.preferPageSize = this.pageVisible;
	this.fireEvent(new mxEventObject('viewStateChanged', 'state', state));
};

/**
 * Sets the scrollbar positions from the given view state.
 */
Graph.prototype.setScrollbarPositions = function(state, dx, dy)
{
	if (state != null &&
		state.scrollLeft != null &&
		state.scrollTop != null)
	{
		this.container.scrollLeft = dx *
			this.view.scale + state.scrollLeft;
		this.container.scrollTop = dy *
			this.view.scale + state.scrollTop;
	}
};

/**
 * Executes selection of a new page.
 */
Graph.prototype.addExtFont = function(fontName, fontUrl, dontRemember)
{
	// KNOWN: Font not added when pasting cells with custom fonts
	if (fontName && fontUrl)
	{
		var fontId = 'extFont_' + fontName;

		// Font URLs come from the file and are untrusted. Invalid URLs are
		// not loaded but still remembered so that saving keeps the file as
		// it is, same as in getCustomFonts which filters them for exports.
		if (document.getElementById(fontId) == null && Graph.isValidFontUrl(fontUrl))
		{
			// KNOWN: Should load fonts synchronously
			var elt = Graph.createFontElement(fontName, fontUrl);
			elt.setAttribute('id', fontId);
			document.getElementsByTagName('head')[0].appendChild(elt);
		}
		
		if (!dontRemember)
		{
			if (this.extFonts == null) 
			{
				this.extFonts = [];
			}
			
			var extFonts = this.extFonts, notFound = true;
			
			for (var i = 0; i < extFonts.length; i++)
			{
				if (extFonts[i].name == fontName)
				{
					notFound = false;
					break;
				}
			}
			
			if (notFound)
			{
				this.extFonts.push({name: fontName, url: fontUrl});
			}
		}
	}
};

/**
 * Executes selection of a new page.
 */
EditorUi.prototype.updatePageRoot = function(page, checked)
{
	if (page.root == null)
	{
		var node = this.editor.extractGraphModel(page.node, null, checked);
		var cause = Editor.extractParserError(node);
		
		if (cause)
		{
			throw new Error(cause);
		}
		else if (node != null)
		{
			page.graphModelNode = node;
			
			// Converts model XML into page object with root cell
			page.viewState = this.editor.graph.createViewState(node);
			var codec = new mxCodec(node.ownerDocument);
			page.root = codec.decode(node).root;
		}
		else
		{
			// Initializes page object with new empty root
			page.root = this.editor.graph.model.createRoot();

			// Sets default cell IDs
			page.root.setId('0');
			page.root.children[0].setId('1');

			// Marks the page as needing an update
			page.invalidateNode();
		}
	}
	else if (page.viewState == null)
	{
		if (page.graphModelNode == null)
		{
			var node = this.editor.extractGraphModel(page.node);
			var cause = Editor.extractParserError(node);
			
			if (cause)
			{
				throw new Error(cause);
			}
			else if (node != null)
			{
				page.graphModelNode = node;
			}
		}
		
		if (page.graphModelNode != null)
		{
			page.viewState = this.editor.graph.createViewState(page.graphModelNode);	
		}
	}

	// Ensures the root has a default layer
	if (page.root.children == null || page.root.children.length == 0)
	{
		var layer = new mxCell();
		layer.setId('1');
		page.root.insert(layer);

		// Marks the page as needing an update
		page.invalidateNode();
	}
	
	return page;
};

/**
 * Returns the current page and XML for the given page.
 */
EditorUi.prototype.getDiagramSnapshot = function()
{
	return {node: this.editor.getGraphXml(), page: this.currentPage};
};

/**
 * Applies the given XML node to the page of the given snapshot as a diff,
 * so that the page and the model keep the same root. Whole files (eg. from
 * generators or a file dropped on the Edit Diagram dialog), single pages
 * and compressed, SVG or HTML data are unwrapped: the first page replaces
 * the page of the snapshot and further pages are added after it. Throws
 * for anything else, which would otherwise decode as an empty page.
 */
EditorUi.prototype.updateDiagramData = function(snapshot, node)
{
	var diagrams = null;

	if (node != null && node.nodeName == 'diagram')
	{
		diagrams = [node];
	}
	else if (node != null && node.nodeName != 'mxGraphModel' &&
		node.nodeName != 'root')
	{
		node = this.editor.extractGraphModel(node, true, true);

		if (node != null && node.nodeName == 'mxfile')
		{
			var children = mxUtils.getChildNodes(node);
			diagrams = [];

			for (var i = 0; i < children.length; i++)
			{
				if (children[i].nodeName == 'diagram')
				{
					diagrams.push(children[i]);
				}
			}
		}
	}

	if (diagrams != null)
	{
		node = (diagrams.length > 0) ? Editor.parseDiagramNode(diagrams[0], true) : null;
	}

	if (node != null && node.nodeName == 'root')
	{
		var wrapper = node.ownerDocument.createElement('mxGraphModel');
		wrapper.appendChild(node);
		node = wrapper;
	}

	// Cells outside of a root element are ignored by the codec
	var hasRoot = false;

	if (node != null && node.nodeName == 'mxGraphModel')
	{
		var children = mxUtils.getChildNodes(node);

		for (var i = 0; i < children.length && !hasRoot; i++)
		{
			hasRoot = children[i].nodeName == 'root';
		}
	}

	if (!hasRoot)
	{
		throw new Error(mxResources.get('notADiagramFile'));
	}

	// Parses further pages before anything is changed
	var newPages = [];
	var oldIds = [];

	for (var i = 1; diagrams != null && i < diagrams.length; i++)
	{
		oldIds.push(diagrams[i].getAttribute('id'));
		diagrams[i].removeAttribute('id');
		newPages.push(this.updatePageRoot(new DiagramPage(diagrams[i])));
	}

	var graph = this.editor.graph;
	var page = snapshot.page;

	if (this.getPageIndex(page) != null)
	{
		this.selectPage(page);
	}

	graph.model.beginUpdate();
	try
	{
		if (this.getPageIndex(page) == null)
		{
			page = this.insertPage(null, null, node);
		}
		else
		{
			var dec = new mxCodec(snapshot.node.ownerDocument);
			var oldModel = new mxGraphModel();
			dec.decode(snapshot.node, oldModel);

			dec = new mxCodec(node.ownerDocument);
			var newModel = new mxGraphModel();
			dec.decode(node, newModel);

			var patch = this.diffCells(oldModel.root, newModel.root);
			this.patchPage(page, patch, null, true);
		}

		if (page != null && newPages.length > 0)
		{
			this.insertDiagramPages(page, diagrams[0].getAttribute('id'),
				newPages, oldIds);
		}
	}
	finally
	{
		graph.model.endUpdate();
	}
};

/**
 * Inserts the given new pages after the given page, which holds the first
 * page of a file, and updates the links to the pages of the file from
 * their IDs in the file (oldId, oldIds) to the IDs of the pages. Links to
 * existing pages are kept.
 */
EditorUi.prototype.insertDiagramPages = function(page, oldId, newPages, oldIds)
{
	var graph = this.editor.graph;
	var index = this.getPageIndex(page);

	// Null prototype as the IDs are user data
	var mapping = this.addLocalPagesToMapping(Object.create(null));

	if (oldId != null)
	{
		mapping[oldId] = page.getId();
	}

	for (var i = 0; i < newPages.length; i++)
	{
		if (oldIds[i] != null)
		{
			mapping[oldIds[i]] = newPages[i].getId();
		}

		if (newPages[i].getName() == null)
		{
			newPages[i].setName(this.createPageName());
		}

		graph.model.execute(new ChangePage(this,
			newPages[i], newPages[i], ++index, true));
	}

	this.updatePageLinks(mapping, [page].concat(newPages));
};

/**
 * Adds keyboard shortcuts for page handling.
 */
EditorUi.prototype.replaceDiagramData = function(data)
{
	this.editor.graph.model.execute(new ReplaceDiagram(
		this, mxUtils.parseXml(data).documentElement));
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.selectPage = function(page, quiet, viewState)
{
	try
	{
		if (page != this.currentPage)
		{
			var graph = this.editor.graph;

			if (graph.isEditing())
			{
				graph.stopEditing(false);
			}
			
			quiet = (quiet != null) ? quiet : false;
			graph.isMouseDown = false;
			graph.reset();
			
			var edit = graph.model.createUndoableEdit();
			
			// Special flag to bypass autosave for this edit
			edit.ignoreEdit = true;

			var change = new SelectPage(this, page, viewState);
			change.execute();
			edit.add(change);
			edit.notify();
			
			if (!quiet)
			{
				graph.model.fireEvent(new mxEventObject(
					mxEvent.UNDO, 'edit', edit));
			}
		}
	}
	catch (e)
	{
		this.handleError(e);
	}
};

/**
 * 
 */
EditorUi.prototype.selectNextPage = function(forward)
{
	var next = this.currentPage;
	
	if (next != null && this.pages != null)
	{
		var tmp = mxUtils.indexOf(this.pages, next);
		
		if (forward)
		{
			this.selectPage(this.pages[mxUtils.mod(tmp + 1, this.pages.length)]);
		}
		else if (!forward)
		{
			this.selectPage(this.pages[mxUtils.mod(tmp - 1, this.pages.length)]);
		}
	}
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.insertPage = function(page, index, node)
{
	if (this.editor.graph.isEnabled())
	{
		if (this.editor.graph.isEditing())
		{
			this.editor.graph.stopEditing(false);
		}
		
		page = (page != null) ? page : this.createPage(
			null, this.createPageId(), node);
		index = (index != null) ? index : this.pages.length;
		
		// Uses model to fire event and trigger autosave
		var change = new ChangePage(this, page, page, index);
		this.editor.graph.model.execute(change);
	}
	
	return page;
};

/**
 * Returns a unique page ID.
 */
EditorUi.prototype.createPageId = function()
{
	var id = null;
	
	do
	{
		id = Editor.guid();
	} while (this.getPageById(id) != null)
	
	return id;
};

/**
 * Returns a new DiagramPage instance. A new empty page takes the grid size
 * of the current page, as the default grid size is not stored in the file.
 */
EditorUi.prototype.createPage = function(name, id, node)
{
	var doc = (this.fileNode != null) ? this.fileNode.ownerDocument : document;
	var page = new DiagramPage(doc.createElement('diagram'), id);
	page.setName((name != null) ? name : this.createPageName());
	this.initDiagramNode(page, node);

	if (node == null && page.node.firstChild != null)
	{
		page.node.firstChild.setAttribute('gridSize', this.editor.graph.gridSize);
	}
	
	return page;
};

/**
 * Returns a page name.
 */
EditorUi.prototype.createPageName = function()
{
	// Creates a lookup with names
	var existing = {};
	
	for (var i = 0; i < this.pages.length; i++)
	{
		var tmp = this.pages[i].getName();
		
		if (tmp != null && tmp.length > 0)
		{
			existing[tmp] = tmp;
		}
	}

	// Avoids existing names
	var nr = this.pages.length;
	var name = null;
	
	do
	{
		name = mxResources.get('pageWithNumber', [++nr]);
	}
	while (existing[name] != null);
	
	return name;
};

/**
 * Removes the given page.
 */
EditorUi.prototype.removePage = function(page)
{
	try
	{
		var graph = this.editor.graph;
		var tmp = mxUtils.indexOf(this.pages, page);
		
		if (graph.isEnabled() && tmp >= 0)
		{
			if (this.editor.graph.isEditing())
			{
				this.editor.graph.stopEditing(false);
			}
			
			graph.model.beginUpdate();
			try
			{
				var next = this.currentPage;
				
				if (next == page && this.pages.length > 1)
				{
					if (tmp == this.pages.length - 1)
					{
						tmp--;
					}
					else
					{
						tmp++;
					}
					
					next = this.pages[tmp];
				}
				else if (this.pages.length <= 1)
				{
					// Removes label with incorrect page number to force
					// default page name which is OK for a single page
					next = this.insertPage();
					graph.model.execute(new RenamePage(this, next,
						mxResources.get('pageWithNumber', [1])));
				}
				
				// Uses model to fire event to trigger autosave
				graph.model.execute(new ChangePage(this, page, next));
			}
			finally
			{
				graph.model.endUpdate();
			}
		}
	}
	catch (e)
	{
		this.handleError(e);
	}
	
	return page;
};

/**
 * Duplicates the given page.
 */
EditorUi.prototype.duplicatePage = function(page, name)
{
	var newPage = null;
	
	try
	{
		var graph = this.editor.graph;
		
		if (graph.isEnabled())
		{
			if (graph.isEditing())
			{
				graph.stopEditing();
			}
			
			// Clones the current page and takes a snapshot of the graph model and view state
			var node = page.node.cloneNode(false);
			node.removeAttribute('id');

			var cloneMap = new Object();
			var lookup = graph.createCellLookup([graph.model.root]);

			var newPage = new DiagramPage(node);
			newPage.root = graph.cloneCell(graph.model.root,
				null, cloneMap);
			
			// Updates cell IDs
			var model = new mxGraphModel();
			model.prefix = Editor.guid() + '-';
			model.setRoot(newPage.root);

			// Updates custom links
			graph.updateCustomLinks(graph.createCellMapping(
				cloneMap, lookup), [newPage.root]);
			
			// Initializes diagram node
			newPage.viewState = (page == this.currentPage) ?
				graph.getViewState() : page.viewState;
			this.initDiagramNode(newPage);
			
			// Resets zoom and scrollbar positions
			newPage.viewState.scale = 1;
			delete newPage.viewState.scrollLeft;
			delete newPage.viewState.scrollTop;
			delete newPage.viewState.currentRoot
			delete newPage.viewState.defaultParent;
			newPage.setName(name);
			
			// Inserts new page after duplicated page
			newPage = this.insertPage(newPage,
				mxUtils.indexOf(this.pages,
					page) + 1);
		}
	}
	catch (e)
	{
		this.handleError(e);
	}
	
	return newPage;
};

/**
 * Returns the XML of the given page for serialization into a diff,
 * encoding the live root when the cached node is stale. The cached node
 * is only rewritten when a page is switched away from, so a page that
 * was inserted and drawn on without ever leaving it would ship an EMPTY
 * insert - and once that insert is out, later diffs compare roots, find
 * them equal and never resend the cells. The same holds for a page whose
 * root was patched (needsUpdate, eg. an own page that a save merge
 * brought cells into): its node is only re-encoded when the file is
 * saved, so the cleanup's insert of such a page carried the pre-patch
 * cells and the screen copy was stale until the next full diff. Does
 * not mutate the page: the caller may be diffing a snapshot clone.
 */
EditorUi.prototype.getPageXmlForDiff = function(page)
{
	if (page.isNodeStale() && page.root != null)
	{
		var enc = new mxCodec(mxUtils.createXmlDocument());
		var node = enc.encode(new mxGraphModel(page.root));
		this.editor.graph.saveViewState(page.viewState, node);

		var result = page.node.cloneNode(false);
		result.appendChild(node);

		return mxUtils.getXml(result);
	}

	return mxUtils.getXml(page.node);
};

/**
 * Duplicates the given page.
 */
EditorUi.prototype.initDiagramNode = function(page, node)
{
	if (node == null)
	{
		var enc = new mxCodec(mxUtils.createXmlDocument());
		node = enc.encode(new mxGraphModel(page.root));
	}

	this.editor.graph.saveViewState(page.viewState, node);
	EditorUi.removeChildNodes(page.node);
	page.node.appendChild(node);
};

/**
 * Duplicates the given page.
 */
EditorUi.prototype.clonePages = function(pages, lazy)
{
	var errors = [];
	var result = [];
	
	for (var i = 0; i < pages.length; i++)
	{
		try
		{
			result.push(this.clonePage(pages[i], lazy));
		}
		catch (e)
		{
			errors.push(mxResources.get('pageWithNumber',
				[i + 1]) + ': ' + e.toString());
		}
	}

	if (errors.length > 0)
	{
		var error = new Error(errors.join('\n'));

		// Provides error handling with XML of valid pages for fallback
		try
		{
			if (result.length > 0)
			{
				error.fallbackFileData = this.getXmlForPages(result);
			}
		}
		catch (e)
		{
			// ignore
		}

		throw error;
	}
	
	return result;
};

/**
 * Duplicates the given page. If lazy is true then a page that was not
 * decoded yet is copied without decoding it, so its copy is decoded when
 * its root is needed (see <updatePageRoot>).
 */
EditorUi.prototype.clonePage = function(page, lazy)
{
	if (lazy && page.root == null)
	{
		return new DiagramPage(page.node.cloneNode(true));
	}

	this.updatePageRoot(page);

	var result = new DiagramPage(page.node.cloneNode(true));
	var viewState = (page == this.currentPage) ?
		this.editor.graph.getViewState() :
		page.viewState;
	result.viewState = mxUtils.clone(viewState,
		EditorUi.transientViewStateProperties)
	result.root = this.editor.graph.model.cloneCell(
		page.root, null, true);

	// The cloned node is as stale as the node of the page, so it must be
	// encoded from the cloned root when the clone is saved
	result.diagramModified = page.diagramModified;
	result.needsUpdate = page.needsUpdate;
	
	return result;
};

/**
 * Renames the given page using a dialog.
 */
EditorUi.prototype.renamePage = function(page)
{
	var graph = this.editor.graph;

	if (graph.isEnabled())
	{
		var dlg = new FilenameDialog(this, page.getName(), mxResources.get('rename'),
			mxUtils.bind(this, function(name)
		{
			if (name != null && name.length > 0)
			{
				this.editor.graph.model.execute(new RenamePage(this, page, name));
			}
		}), mxResources.get('rename'));
		this.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}
	
	return page;
}

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.movePage = function(oldIndex, newIndex)
{
	// Ignores stale indices, eg. from a menu that was opened before a
	// merge removed pages, so that no change is added to the history
	if (this.pages != null && oldIndex >= 0 && oldIndex < this.pages.length)
	{
		this.editor.graph.model.execute(new MovePage(this, oldIndex, newIndex));
	}
}

/**
 * Sorts pages by name in natural ascending order as one undoable edit. If the
 * tabs show page groups, the pages are sorted within their groups and the
 * groups keep their order.
 */
EditorUi.prototype.sortPages = function()
{
	var groups = this.isPageGroupsEnabled();
	var run = 0;

	var entries = this.pages.map(function(page, index, pages)
	{
		if (groups && index > 0 && page.getGroup() != pages[index - 1].getGroup())
		{
			run++;
		}

		return {page: page, run: run};
	});

	var sorted = entries.sort(function(a, b)
	{
		return (a.run != b.run) ? a.run - b.run :
			(a.page.getName() || '').localeCompare(b.page.getName() || '',
				undefined, {numeric: true, sensitivity: 'base'});
	}).map(function(entry)
	{
		return entry.page;
	});

	var model = this.editor.graph.model;
	model.beginUpdate();
	try
	{
		for (var i = 0; i < sorted.length; i++)
		{
			var index = mxUtils.indexOf(this.pages, sorted[i]);

			if (index != i)
			{
				this.movePage(index, i);
			}
		}
	}
	finally
	{
		model.endUpdate();
	}

	this.scrollToPage(this.currentPage, true);
};

/**
 * Returns true if the tabs show the groups of the pages (see
 * DiagramPage.getGroup). The setting is stored in the file.
 */
EditorUi.prototype.isPageGroupsEnabled = function()
{
	return this.fileNode != null && this.fileNode.getAttribute('pageGroups') == '1';
};

/**
 * Shows the pages in their groups or as a flat list in the tabs. The setting
 * is stored in the file and the groups of the pages are kept if the tabs do
 * not show them.
 */
EditorUi.prototype.setPageGroupsEnabled = function(enabled)
{
	if (this.fileNode != null && enabled != this.isPageGroupsEnabled())
	{
		if (enabled)
		{
			this.fileNode.setAttribute('pageGroups', '1');
		}
		else
		{
			this.fileNode.removeAttribute('pageGroups');
		}

		var file = this.getCurrentFile();

		if (file != null)
		{
			file.fileChanged();
		}

		this.updateTabContainer();
	}
};

/**
 * Returns the names of the groups of the pages in the order of the pages.
 */
EditorUi.prototype.getPageGroups = function()
{
	// Null prototype as the names are user data
	var lookup = Object.create(null);
	var result = [];

	for (var i = 0; this.pages != null && i < this.pages.length; i++)
	{
		var group = (this.pages[i] != null) ? this.pages[i].getGroup() : null;

		if (group != null && !lookup[group])
		{
			lookup[group] = true;
			result.push(group);
		}
	}

	return result;
};

/**
 * Returns the indices of the first and last page of the consecutive pages in
 * the given group around the page at the given index as {start, end}. Uses
 * the first pages of the group if the page at the index is not in the group,
 * eg. if the pages were changed after a menu was opened, and returns null if
 * no page is in the group.
 */
EditorUi.prototype.getPageGroupRun = function(group, index)
{
	var pages = this.pages;
	var result = null;

	if (pages != null && group != null)
	{
		var inGroup = function(i)
		{
			return i >= 0 && i < pages.length && pages[i] != null &&
				pages[i].getGroup() == group;
		};

		if (!inGroup(index))
		{
			index = 0;

			while (index < pages.length && !inGroup(index))
			{
				index++;
			}
		}

		if (inGroup(index))
		{
			result = {start: index, end: index};

			while (inGroup(result.start - 1))
			{
				result.start--;
			}

			while (inGroup(result.end + 1))
			{
				result.end++;
			}
		}
	}

	return result;
};

/**
 * Returns a lookup for the names of the collapsed page groups, which are
 * stored as a JSON array in the file (see setPageGroupCollapsed).
 */
EditorUi.prototype.getCollapsedPageGroups = function()
{
	var value = (this.fileNode != null) ?
		this.fileNode.getAttribute('collapsedPageGroups') : null;

	if (this.collapsedPageGroups == null || value !== this.collapsedPageGroupsValue)
	{
		// Null prototype as the names are user data
		this.collapsedPageGroups = Object.create(null);
		this.collapsedPageGroupsValue = value;

		if (value != null)
		{
			try
			{
				var names = JSON.parse(value);

				for (var i = 0; Array.isArray(names) && i < names.length; i++)
				{
					if (typeof names[i] === 'string')
					{
						this.collapsedPageGroups[names[i]] = true;
					}
				}
			}
			catch (e)
			{
				// Ignores invalid values
			}
		}
	}

	return this.collapsedPageGroups;
};

/**
 * Returns true if the given page group is collapsed in the tabs.
 */
EditorUi.prototype.isPageGroupCollapsed = function(group)
{
	return this.getCollapsedPageGroups()[group] === true;
};

/**
 * Collapses or expands the given page group in the tabs. The collapsed
 * groups are view state like the scroll position of a page: they are saved
 * with the file, but collapsing a group does not modify the file.
 */
EditorUi.prototype.setPageGroupCollapsed = function(group, collapsed)
{
	if (this.fileNode != null && collapsed != this.isPageGroupCollapsed(group))
	{
		var lookup = this.getCollapsedPageGroups();
		var groups = this.getPageGroups();
		var names = [];

		// Drops the names of groups that no longer exist
		for (var i = 0; i < groups.length; i++)
		{
			if ((groups[i] == group) ? collapsed : lookup[groups[i]])
			{
				names.push(groups[i]);
			}
		}

		if (names.length > 0)
		{
			this.fileNode.setAttribute('collapsedPageGroups', JSON.stringify(names));
		}
		else
		{
			this.fileNode.removeAttribute('collapsedPageGroups');
		}

		this.updateTabContainer();
	}
};

/**
 * Moves the page at the given index to the new index and into the given
 * group (null for no group) as one undoable edit.
 */
EditorUi.prototype.movePageToGroup = function(oldIndex, newIndex, group)
{
	var page = (this.pages != null) ? this.pages[oldIndex] : null;

	if (page != null)
	{
		var model = this.editor.graph.model;

		model.beginUpdate();
		try
		{
			if (newIndex != oldIndex)
			{
				this.movePage(oldIndex, newIndex);
			}

			if (group != page.getGroup())
			{
				model.execute(new ChangePageGroup(this, page, group));
			}
		}
		finally
		{
			model.endUpdate();
		}
	}
};

/**
 * Moves the given page into the given group (null for no group) as one
 * undoable edit. The pages of a group stay together: the page is moved after
 * the last page of an existing group, or after the pages of its own group if
 * it is between two of them.
 */
EditorUi.prototype.setPageGroup = function(page, group)
{
	var index = this.getPageIndex(page);

	if (index != null && group != page.getGroup())
	{
		var target = index;
		var last = -1;

		for (var i = 0; group != null && i < this.pages.length; i++)
		{
			if (i != index && this.pages[i] != null &&
				this.pages[i].getGroup() == group)
			{
				last = i;
			}
		}

		if (last >= 0)
		{
			target = (last > index) ? last : last + 1;
		}
		else
		{
			var run = this.getPageGroupRun(page.getGroup(), index);

			if (run != null && run.start < index && index < run.end)
			{
				target = run.end;
			}
		}

		this.movePageToGroup(index, target, group);
	}
};

/**
 * Moves the pages of the given group into the group with the given name, or
 * into no group if name is null, as one undoable edit. A renamed group stays
 * collapsed.
 */
EditorUi.prototype.changePageGroup = function(group, name)
{
	var collapsed = this.isPageGroupCollapsed(group);
	var model = this.editor.graph.model;

	model.beginUpdate();
	try
	{
		for (var i = 0; i < this.pages.length; i++)
		{
			if (this.pages[i] != null && this.pages[i].getGroup() == group)
			{
				model.execute(new ChangePageGroup(this, this.pages[i], name));
			}
		}
	}
	finally
	{
		model.endUpdate();
	}

	if (collapsed && name != null)
	{
		this.setPageGroupCollapsed(name, true);
	}
};

/**
 * Renames the given page group using a dialog.
 */
EditorUi.prototype.renamePageGroup = function(group)
{
	if (this.editor.graph.isEnabled())
	{
		var dlg = new FilenameDialog(this, group, mxResources.get('rename'),
			mxUtils.bind(this, function(name)
		{
			if (name != null && name.length > 0 && name != group)
			{
				this.changePageGroup(group, name);
			}
		}), mxResources.get('rename'));
		this.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}
};

/**
 * Moves the given page into a new group whose name is entered in a dialog.
 */
EditorUi.prototype.addPageGroup = function(page)
{
	if (this.editor.graph.isEnabled())
	{
		var dlg = new FilenameDialog(this, '', mxResources.get('create'),
			mxUtils.bind(this, function(name)
		{
			if (name != null && name.length > 0)
			{
				this.setPageGroup(page, name);
			}
		}), mxResources.get('name'));
		this.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}
};

/**
 * Inserts a new page after the last page of the given group (see
 * getPageGroupRun) and returns the new page.
 */
EditorUi.prototype.insertPageInGroup = function(group, index)
{
	var run = this.getPageGroupRun(group, index);
	var page = null;

	if (run != null)
	{
		page = this.createPage(null, this.createPageId());
		page.setGroup(group);
		page = this.insertPage(page, run.end + 1);
	}

	return page;
};

/**
 * Inserts a new page into a new group whose name is entered in a dialog after
 * the last page, or into the group with that name if there is one (see
 * insertPageInGroup), as groups have at least one page.
 */
EditorUi.prototype.insertPageGroup = function()
{
	if (this.editor.graph.isEnabled())
	{
		var dlg = new FilenameDialog(this, '', mxResources.get('create'),
			mxUtils.bind(this, function(name)
		{
			if (name != null && name.length > 0 &&
				this.insertPageInGroup(name, 0) == null)
			{
				var page = this.createPage(null, this.createPageId());
				page.setGroup(name);
				this.insertPage(page, this.pages.length);
			}
		}), mxResources.get('name'));
		this.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}
};

/**
 * Moves the consecutive pages from start to end so that the first of them
 * is at the given index after the move, as one undoable edit.
 */
EditorUi.prototype.movePages = function(start, end, index)
{
	var model = this.editor.graph.model;
	var count = end - start + 1;

	if (index != start && count > 0)
	{
		model.beginUpdate();
		try
		{
			for (var i = 0; i < count; i++)
			{
				if (index < start)
				{
					this.movePage(start + i, index + i);
				}
				else
				{
					this.movePage(start, index + count - 1);
				}
			}
		}
		finally
		{
			model.endUpdate();
		}
	}
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createTabContainer = function()
{
	var div = document.createElement('div');
	div.className = 'geTabContainer geTabItem';

	return div;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.updateTabContainer = function()
{
	if (this.tabContainer != null && !this.isTabContainerVisible())
	{
		this.tabContainer.style.display = 'none';
	}
	else if (this.tabContainer != null && this.pages != null)
	{
		this.tabContainer.style.display = '';
		var wrapper = document.createElement('div');
		wrapper.className = 'geTabScroller';
		var activeTab = null;
		var sl =(this.tabScroller != null) ? this.tabScroller.scrollLeft : 0;
		var btCacheMiss = false;
		var groups = this.isPageGroupsEnabled();
		var lastGroup = null;
		var pageTabs = [];

		// Keeps the focus on the same control, eg. on the tab of a page that
		// was selected with the keyboard (see focusTabContainerControl)
		var focusKey = (mxUtils.isAncestorNode(this.tabContainer,
			document.activeElement)) ? document.activeElement.tabKey : null;

		for (var i = 0; i < this.pages.length; i++)
		{
			var page = this.pages[i];

			if (page == null)
			{
				lastGroup = null;
				continue;
			}

			var group = (groups) ? page.getGroup() : null;

			if (group != null && group != lastGroup)
			{
				var groupTab = this.createTabForPageGroup(group, i);
				groupTab.pageGroup = group;
				groupTab.setAttribute('draggable', 'true');
				groupTab.setAttribute('data-index', i);
				this.addTabDragListeners(groupTab);
				wrapper.appendChild(groupTab);
			}

			lastGroup = group;

			var pageId = page.getId();
			var pageName = page.getName() || mxResources.get('untitled');
			var cacheKey = pageId + ':' + pageName;
			var tab = (this.btPageTabCache != null) ?
				this.btPageTabCache[cacheKey] : null;

			if (tab != null)
			{
				// Reuse cached tab (preserves browser translation)
				tab.setAttribute('title', pageName + ((pageId != null) ?
					' (' + pageId + ')' : '') + ' [' + (i + 1) + ']');
			}
			else
			{
				tab = this.createTabForPage(page, i + 1);
				btCacheMiss = true;
			}

			// Update data-index for DnD (read at event time)
			tab.setAttribute('draggable', 'true');
			tab.setAttribute('data-index', i);
			tab.className = 'geTab gePageTab';
			tab.pageGroup = group;

			if (group != null)
			{
				tab.classList.add('gePageTabGrouped');

				if (groupTab.pageGroupCollapsed)
				{
					tab.classList.add('gePageTabCollapsed');
				}

				if (!groupTab.pageGroupCurrent)
				{
					tab.classList.add('gePageGroupInactive');
				}

				// The last visible tab of a group before a page without a
				// group or at the end has a line (see gePageGroupTab)
				var next = this.pages[i + 1];

				if (next == null || next.getGroup() == null)
				{
					((groupTab.pageGroupCollapsed) ? groupTab : tab).classList.add('gePageGroupEnd');
				}
			}

			// The name of the tab is the control for the keyboard (see addTabListeners)
			if (page == this.currentPage)
			{
				tab.firstChild.setAttribute('aria-current', 'page');
			}
			else
			{
				tab.firstChild.removeAttribute('aria-current');
			}

			// Install DnD listeners once per tab element
			if (tab.btDndInstalled == null)
			{
				tab.btDndInstalled = true;
				this.addTabDragListeners(tab);
			}

			if (page == this.currentPage)
			{
				activeTab = tab;
			}

			pageTabs[i] = tab;
			wrapper.appendChild(tab);
		}

		this.tabContainer.innerText = '';

		// Not chromeless and not read-only file
		if (this.isPageInsertTabVisible())
		{
			var insertTab = this.createPageInsertTab();
			insertTab.tabKey = 'insertPage';
			this.tabContainer.appendChild(insertTab);
		}
	
		if (Editor.currentTheme != 'simple')
		{
			this.pageMenuTab = this.createPageMenuTab();
			this.pageMenuTab.tabKey = 'pages';
			this.tabContainer.appendChild(this.pageMenuTab);
		}
		
		this.tabContainer.appendChild(wrapper);
		
		this.leftScrollTab = this.createLeftScrollTab();
		this.leftScrollTab.tabKey = 'scrollLeft';
		this.tabContainer.appendChild(this.leftScrollTab);

		this.rightScrollTab = this.createRightScrollTab();
		this.rightScrollTab.tabKey = 'scrollRight';
		this.tabContainer.appendChild(this.rightScrollTab);

		// Cache tabs by page ID + name for reuse across rebuilds.
		// This preserves browser translation <font> wrappers.
		if (Graph.browserTranslate && Graph.isBrowserTranslated())
		{
			this.btPageTabCache = {};

			for (var i = 0; i < pageTabs.length; i++)
			{
				var p = this.pages[i];

				if (p != null && pageTabs[i] != null)
				{
					var key = p.getId() + ':' +
						(p.getName() || mxResources.get('untitled'));
					this.btPageTabCache[key] = pageTabs[i];
				}
			}
		}

		this.tabScroller = wrapper;
		this.pageTabs = pageTabs;

		mxEvent.addListener(this.tabScroller, 'scroll', mxUtils.bind(this, function(evt)
		{
			this.checkTabScrollerOverflow();
		}));

		// Preserve tab scroll position across browser translation.
		// A hidden "canary" paragraph in document.body contains text
		// in the original language. After tab rebuild we reset the
		// canary and save scroll position. When Chrome re-translates
		// the canary we know translation is done and restore scroll.
		if (Graph.browserTranslate && Graph.isBrowserTranslated())
		{
			if (this.btCanary == null)
			{
				var ui = this;

				// Canary: a paragraph with enough content for Chrome
				// to reliably translate. Positioned offscreen but not
				// display:none. Placed at the end of document.body so
				// Chrome translates it after the tab labels.
				this.btCanary = document.createElement('p');
				this.btCanary.setAttribute('aria-hidden', 'true');
				this.btCanary.style.cssText = 'position:absolute;left:-10000px;' +
					'top:0;width:1px;height:1px;overflow:hidden;pointer-events:none;';
				this.btCanaryOriginal = 'Click here to insert a new page into the document';
				this.btCanary.textContent = this.btCanaryOriginal;
				document.body.appendChild(this.btCanary);
				this.btCanarySavedScroll = null;

				var btRestoreScroll = function()
				{
					if (ui.btCanarySavedScroll != null &&
						ui.tabScroller != null)
					{
						ui.btCanarySavedScroll = null;
						ui.scrollToPage(null, true);
					}
				};

				this.btCanaryObserver = new MutationObserver(function()
				{
					if (ui.btCanarySavedScroll == null)
					{
						return;
					}

					var canaryText = ui.btCanary.textContent;

					if (canaryText != ui.btCanaryOriginal)
					{
						setTimeout(btRestoreScroll, 100);
					}
				});

				this.btCanaryObserver.observe(this.btCanary,
				{
					characterData: true,
					childList: true,
					subtree: true
				});

				// Initial translation is handled by tab caching —
				// no canary restore needed for the first load.
			}

			// Reset canary to original text and save scroll position.
			// Only save on the first rebuild in a translation cycle —
			// subsequent rebuilds may already have a shifted scroll.
			// Skip when there is no cached tab content yet (first load)
			// or no meaningful scroll position to preserve.
			// Only arm canary when new tabs were created (cache miss)
			// that Chrome will need to translate.
			if (this.btCanarySavedScroll == null && btCacheMiss &&
				this.btKnownTabScroll > 0)
			{
				this.btCanarySavedScroll = this.btKnownTabScroll;

				// Move canary to end of body so Chrome translates it
				// after all other elements including the tab labels
				this.btCanary.textContent = this.btCanaryOriginal;
				document.body.appendChild(this.btCanary);
			}
		}

		var ghLink = document.createElement('a');
		ghLink.href = 'https://github.com/jgraph/drawio';
		ghLink.target = '_blank';
		ghLink.style.cssText = 'margin-left:auto;display:flex;align-items:center;' +
			'padding:0 8px;opacity:0.5;flex-shrink:0';
		var ghImg = document.createElement('img');
		ghImg.src = IMAGE_PATH + (Editor.isDarkMode() ?
			'/github-logo-white.svg' : '/github-logo.svg');
		ghImg.style.cssText = 'width:18px;height:18px';
		ghImg.setAttribute('title', 'jgraph/drawio');
		ghLink.appendChild(ghImg);

		mxEvent.addListener(ghLink, 'mouseenter', function()
		{
			ghLink.style.opacity = '1';
		});

		mxEvent.addListener(ghLink, 'mouseleave', function()
		{
			ghLink.style.opacity = '0.5';
		});

		this.tabContainer.appendChild(ghLink);

		if (activeTab != null)
		{
			activeTab.classList.add('geActivePage');
		}

		// Restore scroll position after all DOM mutations (ghLink append,
		// active class) so the wrapper has its final clientWidth/scrollWidth.
		// Otherwise sl gets clamped to a temporarily smaller maxScrollLeft
		// when the previous active page was at the right end.
		this.tabScroller.scrollLeft = sl;
		this.scrollToPage();
		this.btKnownTabScroll = this.tabScroller.scrollLeft;
		this.checkTabScrollerOverflow();

		if (activeTab != null)
		{
			activeTab.scrollIntoView({behavior: 'smooth',
				block: 'nearest', inline: 'nearest'});
		}

		this.focusTabContainerControl(focusKey);
	}
};

/**
 * Adds the listeners for dragging the given tab of a page, or of a page group
 * with the tabs of the pages in the group, and for dropping other tabs on it.
 * The state of a drag is stored in tabDrag, so that tabs which are reused
 * (see btPageTabCache) and new tabs share it.
 */
EditorUi.prototype.addTabDragListeners = function(tab)
{
	var graph = this.editor.graph;
	var ui = this;

	mxEvent.addListener(tab, 'dragstart', mxUtils.bind(this, function(evt)
	{
		if (graph.isEnabled())
		{
			// Drag events created by scripts may have no dataTransfer
			if (mxClient.IS_FF && evt.dataTransfer != null)
			{
				evt.dataTransfer.setData('Text', '<diagram/>');
			}

			var tabs = [tab];

			// The tab of a group is dragged with the tabs of its pages
			while (tab.classList.contains('gePageGroupTab') &&
				tabs[tabs.length - 1].nextSibling != null &&
				tabs[tabs.length - 1].nextSibling.classList.contains('gePageTab') &&
				tabs[tabs.length - 1].nextSibling.pageGroup == tab.pageGroup)
			{
				tabs.push(tabs[tabs.length - 1].nextSibling);
			}

			var drag = {index: parseInt(tab.getAttribute('data-index'), 10),
				tabs: tabs, className: tab.className};
			this.tabDrag = drag;

			// Defer hiding so browser captures the drag image first
			window.requestAnimationFrame(function()
			{
				for (var i = 0; ui.tabDrag == drag && i < tabs.length; i++)
				{
					tabs[i].classList.add('gePageTabDragPlaceholder');
				}
			});

			// Suppress default drop highlight on other elements
			ui._pageTabDragOverHandler = function(e)
			{
				if (e.dataTransfer != null)
				{
					e.dataTransfer.dropEffect = 'move';
				}

				e.preventDefault();

				// Stop propagation for non-tab targets to suppress
				// browser highlight on other elements. The name and
				// the buttons of a tab are part of the tab.
				if (e.target.closest == null ||
					e.target.closest('.gePageTab, .gePageGroupTab') == null)
				{
					// Tabs dragged between other tabs or to the end of the
					// tabs, eg. between two groups, are in no group. The
					// buttons and links next to the tabs and the space
					// around them are no gaps, only the space after the
					// tabs if the last tab is shown.
					var scroller = ui.tabScroller;

					if (e.target == scroller || (e.target == ui.tabContainer &&
						e.clientX >= scroller.getBoundingClientRect().right &&
						Math.ceil(scroller.scrollLeft) + scroller.offsetWidth >=
						scroller.scrollWidth))
					{
						ui.moveDraggedTabsOutsideGroups(e.clientX);
					}

					e.stopPropagation();
				}
			};

			ui._pageTabDropHandler = function(e)
			{
				e.preventDefault();
				e.stopPropagation();
			};

			document.addEventListener('dragover',
				ui._pageTabDragOverHandler, true);
			document.addEventListener('drop',
				ui._pageTabDropHandler, true);
		}
		else
		{
			mxEvent.consume(evt);
		}
	}));

	mxEvent.addListener(tab, 'dragend', mxUtils.bind(this, function(evt)
	{
		var drag = this.tabDrag;

		if (drag != null)
		{
			for (var i = 0; i < drag.tabs.length; i++)
			{
				drag.tabs[i].classList.remove('gePageTabDragPlaceholder');
			}

			// Determine final position from DOM order
			var tabs = tab.parentNode.querySelectorAll('.gePageTab');

			if (tab.classList.contains('gePageGroupTab'))
			{
				this.movePages(drag.index, drag.index + drag.tabs.length - 2,
					mxUtils.indexOf(tabs, drag.tabs[1]));
			}
			else
			{
				var page = this.pages[drag.index];
				var group = (page != null) ? page.getGroup() : null;

				// A page joins the group of the tab that it was dropped on
				// (see setTabDragGroup)
				if (drag.group !== undefined && this.isPageGroupsEnabled())
				{
					group = drag.group;
				}

				var index = mxUtils.indexOf(tabs, tab);

				// The tabs are created again after a move, but the tab of a
				// page dropped in place gets back the classes that it had
				// before the drag (see setTabDragGroup)
				if (page != null && index == drag.index && group == page.getGroup())
				{
					tab.className = drag.className;
				}

				this.movePageToGroup(drag.index, index, group);

				// A page that joins a collapsed group expands it. The group of
				// the current page is shown expanded and keeps its state.
				if (group != null && this.isPageGroupCollapsed(group) &&
					!this.isCurrentPageGroup(group, index))
				{
					this.setPageGroupCollapsed(group, false);
				}
			}
		}

		if (ui._pageTabDragOverHandler != null)
		{
			document.removeEventListener('dragover',
				ui._pageTabDragOverHandler, true);
			document.removeEventListener('drop',
				ui._pageTabDropHandler, true);
			ui._pageTabDragOverHandler = null;
			ui._pageTabDropHandler = null;
		}

		this.tabDrag = null;
		evt.stopPropagation();
		evt.preventDefault();
	}));

	mxEvent.addListener(tab, 'dragover', mxUtils.bind(this, function(evt)
	{
		var drag = this.tabDrag;

		// The tabs are created again in a new scroller if the tab bar is
		// updated during the drag, eg. after a change of the file. The
		// dragged tabs then stay in the old scroller and are not moved.
		if (drag != null && mxUtils.indexOf(drag.tabs, tab) < 0 &&
			drag.tabs[0].parentNode == tab.parentNode)
		{
			if (evt.dataTransfer != null)
			{
				evt.dataTransfer.dropEffect = 'move';
			}

			var rect = tab.getBoundingClientRect();
			var before = evt.clientX < rect.left + rect.width / 2;
			var dragTab = drag.tabs[0];
			var parent = dragTab.parentNode;

			if (dragTab.classList.contains('gePageGroupTab'))
			{
				// Groups are dropped before or after other groups
				var first = tab;
				var last = tab;

				if (tab.pageGroup != null)
				{
					while (!first.classList.contains('gePageGroupTab') &&
						first.previousSibling != null)
					{
						first = first.previousSibling;
					}

					while (last.nextSibling != null &&
						last.nextSibling.classList.contains('gePageTab') &&
						last.nextSibling.pageGroup == tab.pageGroup)
					{
						last = last.nextSibling;
					}
				}

				var ref = (before) ? first : last.nextSibling;

				if (mxUtils.indexOf(drag.tabs, ref) < 0 &&
					drag.tabs[drag.tabs.length - 1].nextSibling != ref)
				{
					for (var i = 0; i < drag.tabs.length; i++)
					{
						parent.insertBefore(drag.tabs[i], ref);
					}
				}
			}
			else
			{
				// A page dropped onto the tab of a group is the first page of
				// the group, a page dropped onto the tab of a page is before
				// or after it in the group of that page
				var ref = (before && !tab.classList.contains('gePageGroupTab')) ?
					tab : tab.nextSibling;

				if (ref != dragTab && dragTab.nextSibling != ref)
				{
					parent.insertBefore(dragTab, ref);
				}

				this.setTabDragGroup(tab.pageGroup, tab.classList.contains('gePageGroupInactive'));
			}
		}

		evt.stopPropagation();
		evt.preventDefault();
	}));

	mxEvent.addListener(tab, 'drop', function(evt)
	{
		evt.stopPropagation();
		evt.preventDefault();
	});
};

/**
 * Sets the group (null for no group) that the dragged tab of a page joins
 * when it is dropped, and shows it on the tab like on the tabs of the group:
 * underlined and inactive if the group is not the group of the current page.
 * A gap in the group that it joins would be a drop in no group (see
 * moveDraggedTabsOutsideGroups), so the tab has no line and gap at the end of
 * a group, and after the tab with the line at the end of the group it takes
 * the line.
 */
EditorUi.prototype.setTabDragGroup = function(group, inactive)
{
	var drag = this.tabDrag;

	if (drag != null && !drag.tabs[0].classList.contains('gePageGroupTab'))
	{
		var tab = drag.tabs[0];
		var prev = tab.previousSibling;

		if (drag.groupEnd != null)
		{
			drag.groupEnd.classList.add('gePageGroupEnd');
			drag.groupEnd = null;
		}

		drag.group = group;
		tab.classList.toggle('gePageTabGrouped', group != null);
		tab.classList.toggle('gePageGroupInactive', group != null && inactive);
		tab.classList.remove('gePageGroupEnd');

		// The tab before the dragged tab in a group is in that group
		// (see the dragover listener in addTabDragListeners)
		if (group != null && prev != null && prev.classList.contains('gePageGroupEnd'))
		{
			prev.classList.remove('gePageGroupEnd');
			tab.classList.add('gePageGroupEnd');
			drag.groupEnd = prev;
		}
	}
};

/**
 * Moves the dragged tabs to the given position in the tab bar outside of the
 * tabs, eg. between two groups or after the last tab, where they are in no
 * group: before the first shown tab whose center is right of x but not
 * between the tabs of a group, or after the last tab.
 */
EditorUi.prototype.moveDraggedTabsOutsideGroups = function(x)
{
	var drag = this.tabDrag;
	var scroller = this.tabScroller;

	if (drag != null && scroller != null && drag.tabs[0].parentNode == scroller)
	{
		var first = drag.tabs[0];
		var last = drag.tabs[drag.tabs.length - 1];

		// Returns the next or previous tab that is not dragged. The dragged
		// tabs are always next to each other, so they are skipped at once.
		var sibling = function(elt, next)
		{
			elt = (next) ? elt.nextSibling : elt.previousSibling;

			if (elt == first || elt == last)
			{
				elt = (next) ? last.nextSibling : first.previousSibling;
			}

			return elt;
		};

		var ref = null;

		// Shown tabs have a size, the tabs in collapsed groups are hidden
		for (var tab = (scroller.firstChild == first) ? last.nextSibling : scroller.firstChild;
			tab != null && ref == null; tab = sibling(tab, true))
		{
			if (tab.offsetWidth > 0)
			{
				var rect = tab.getBoundingClientRect();

				if (x < rect.left + rect.width / 2)
				{
					ref = tab;
				}
			}
		}

		// Skips the remaining tabs of a group
		while (ref != null && ref.classList.contains('gePageTab') && ref.pageGroup != null &&
			sibling(ref, false) != null && sibling(ref, false).pageGroup == ref.pageGroup)
		{
			ref = sibling(ref, true);
		}

		if (last.nextSibling != ref)
		{
			for (var i = 0; i < drag.tabs.length; i++)
			{
				scroller.insertBefore(drag.tabs[i], ref);
			}
		}

		this.setTabDragGroup(null, false);
	}
};

/**
 * Moves the focus to the control of the page tabs with the given key (see
 * updateTabContainer), eg. after the tabs were created again: the tab of the
 * same page, the tab of the page whose menu button is hidden or the tab of
 * the current page if the page was removed.
 */
EditorUi.prototype.focusTabContainerControl = function(key)
{
	if (key != null && this.tabContainer != null)
	{
		var stops = Dialog.getTabStops(this.tabContainer);
		var keys = [key, key.replace(/^menu:/, 'page:').replace(/^groupMenu:/, 'group:')];
		var elt = null;

		for (var i = 0; i < keys.length && elt == null; i++)
		{
			for (var j = 0; j < stops.length && elt == null; j++)
			{
				if (stops[j].tabKey == keys[i])
				{
					elt = stops[j];
				}
			}
		}

		elt = (elt != null) ? elt : this.tabContainer.querySelector('.geActivePage > .geFocusLabel');

		if (elt != null)
		{
			elt.focus();
		}
	}
};

/**
 * Shows the given menu for the given event at the mouse or, for a keystroke
 * or a click with the keyboard (see Editor.clickWithKeyboard), at the given
 * control with the focus on its first item. The focus returns to the same
 * control of the page tabs if they were created again, eg. after a page was
 * duplicated (see focusTabContainerControl).
 */
EditorUi.prototype.popupTabMenu = function(menu, elt, evt)
{
	var keyboard = evt.type == 'keydown' || (evt.type == 'click' && evt.detail == 0);
	var x = mxEvent.getClientX(evt);
	var y = mxEvent.getClientY(evt);

	if (keyboard)
	{
		var bounds = elt.getBoundingClientRect();
		x = bounds.left;
		y = bounds.top;
	}

	var menuRestoreFocus = menu.restoreFocus;

	menu.restoreFocus = mxUtils.bind(this, function(target)
	{
		if (target != null && target.tabKey != null &&
			!mxUtils.isAncestorNode(document.body, target))
		{
			this.focusTabContainerControl(target.tabKey);
		}
		else
		{
			menuRestoreFocus.apply(menu, arguments);
		}
	});

	menu.popup(x, y, null, evt);

	if (keyboard)
	{
		menu.returnFocus = elt;
		menu.focusFirstItem();
	}
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.checkTabScrollerOverflow = function()
{
	if (this.tabScroller != null && this.tabContainer != null &&
		this.tabContainer.children.length > 2)
	{
		var overflow = this.tabScroller.scrollWidth > this.tabScroller.offsetWidth;

		if (!overflow)
		{
			this.leftScrollTab.style.display = 'none';
			this.rightScrollTab.style.display = 'none';
		}
		else
		{
			this.leftScrollTab.style.display = '';
			this.rightScrollTab.style.display = '';

			if (this.tabScroller.scrollLeft == 0)
			{
				this.leftScrollTab.classList.add('mxDisabled');
			}
			else
			{
				this.leftScrollTab.classList.remove('mxDisabled');
			}

			if (Math.ceil(this.tabScroller.scrollLeft) + this.tabScroller.offsetWidth >=
				this.tabScroller.scrollWidth)
			{
				this.rightScrollTab.classList.add('mxDisabled');
			}
			else
			{
				this.rightScrollTab.classList.remove('mxDisabled');
			}
		}
	}
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.isPageInsertTabVisible = function()
{
	return urlParams['embed'] == 1 || (this.getCurrentFile() != null &&
		this.getCurrentFile().isEditable());
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createTab = function()
{
	var tab = document.createElement('div');
	tab.className = 'geTab';

	mxEvent.addListener(tab, 'click', mxUtils.bind(this, function(evt)
	{
		tab.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
	}));

	return tab;
};

/**
 * Returns a shortened page name.
 */
EditorUi.prototype.getShortPageName = function(page)
{
	var short = null;
	
	if (page != null)
	{
		short = page.getName();

		if (short != null && short.length > 36)
		{
			short = short.substring(0, 34) + '...';
		}
	}

	return short;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createControlTab = function(title, image, fn)
{
	var tab = this.createTab();
	tab.className = 'geTab geControlTab';
	
	if (title != null)
	{
		tab.setAttribute('title', title);
	}

	var inner = document.createElement('div');
	inner.className = 'geButton';
	inner.style.backgroundImage = 'url(' + image + ')';

	tab.appendChild(inner);
	mxEvent.addListener(tab, 'click', fn);
	this.initKeyboardButton(tab);

	return tab;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createPageInsertTab = function()
{
	return this.createControlTab(mxResources.get('insertPage'),
		Editor.plusImage, mxUtils.bind(this, function(evt)
		{
			this.actions.get('insertPage').funct();
			mxEvent.consume(evt);
		}));
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createLeftScrollTab = function()
{
	var tab = this.createControlTab(null, Editor.chevronLeftImage, mxUtils.bind(this, function(evt)
		{
			var dx = Math.max(60, this.tabScroller.clientWidth / 2);

			if (this.tabScroller.scrollBy != null)
			{
				this.tabScroller.scrollBy({left: -dx, top: 0, behavior: 'smooth'});
			}
			else
			{
				this.tabScroller.scrollLeft -= dx;
			}

			mxEvent.consume(evt);
		}));
	tab.setAttribute('aria-label', mxResources.get('left'));

	return tab;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createRightScrollTab = function()
{
	var tab = this.createControlTab(null, Editor.chevronRightImage, mxUtils.bind(this, function(evt)
		{
			var dx = Math.max(60, this.tabScroller.clientWidth / 2);

			if (this.tabScroller.scrollBy != null)
			{
				this.tabScroller.scrollBy({left: dx, top: 0, behavior: 'smooth'});
			}
			else
			{
				this.tabScroller.scrollLeft += dx;
			}

			mxEvent.consume(evt);
		}));
	tab.setAttribute('aria-label', mxResources.get('right'));

	return tab;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createPageMenuTab = function()
{
	return this.createControlTab(mxResources.get('pages'),
		Editor.menuImage, mxUtils.bind(this, function(evt)
	{
		this.editor.graph.popupMenuHandler.hideMenu();

		var menu = new mxPopupMenu(mxUtils.bind(this, function(menu, parent)
		{
			this.menus.get('pages').funct(menu, parent);
		}));
		
		menu.smartSeparators = true;
		menu.showDisabled = true;
		menu.autoExpand = true;
		
		// Disables autoexpand and destroys menu when hidden
		menu.hideMenu = mxUtils.bind(this, function()
		{
			mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
			menu.destroy();
		});
	
		this.popupTabMenu(menu, evt.currentTarget, evt);
		
		// Allows hiding by clicking on document
		this.setCurrentMenu(menu);

		mxEvent.consume(evt);
	}));
};

/**
 * Returns a new tab for the given page with its name, ID and the given page
 * number in the tooltip.
 */
EditorUi.prototype.createTabForPage = function(page, pageNumber)
{
	var tab = this.createTab();
	var name = page.getName() || mxResources.get('untitled');
	var id = page.getId();
	tab.setAttribute('title', name + ((id != null) ?
		' (' + id + ')' : '') + ' [' + pageNumber + ']');
	
	var label = document.createElement('span');
	label.style.maxWidth = '160px';
	label.style.textOverflow = 'ellipsis';
	label.style.overflow = 'hidden';
	mxUtils.write(label, name);
	tab.appendChild(label);
	this.addTabListeners(page, tab);

	return tab;
};

/**
 * Adds the rule for the menu buttons of the tabs of page groups to the
 * document once. Chrome restyles inline background images with data URIs in
 * quadratic time, so a background image on each tab made opening a file
 * with 16,000 page groups take 9 s and each page switch 12 s. The disclosure
 * triangles are in grapheditor.css.
 */
EditorUi.addPageGroupTabStyles = function()
{
	if (EditorUi.pageGroupTabStyles == null)
	{
		var style = document.createElement('style');
		style.setAttribute('data-source', 'pageGroupTabs');
		style.textContent = '.gePageGroupMenuIcon{background-image:url(' + Editor.thinExpandImage + ');}';
		document.head.appendChild(style);
		EditorUi.pageGroupTabStyles = style;
	}
};

/**
 * Returns true if the current page is in the consecutive pages of the given
 * page group around the page at the given index (see getPageGroupRun).
 */
EditorUi.prototype.isCurrentPageGroup = function(group, index)
{
	var run = this.getPageGroupRun(group, index);

	for (var i = (run != null) ? run.start : 0; run != null && i <= run.end; i++)
	{
		if (this.pages[i] == this.currentPage)
		{
			return true;
		}
	}

	return false;
};

/**
 * Returns a new tab for the given page group, which starts with the page at
 * the given index. A click on the tab collapses or expands the group and its
 * button or a right click shows the menu of the group (see
 * createPageGroupMenu). The group of the current page is always expanded, so
 * that the tab of the current page is with the other pages of the group, and
 * the tabs of the other groups are inactive (see updateTabContainer).
 */
EditorUi.prototype.createTabForPageGroup = function(group, index)
{
	var run = this.getPageGroupRun(group, index);
	var current = this.isCurrentPageGroup(group, index);
	var collapsed = !current && this.isPageGroupCollapsed(group);
	var tab = this.createTab();
	tab.className = 'geTab gePageGroupTab' + ((current) ?
		' gePageGroupCurrent' : ' gePageGroupInactive');
	tab.setAttribute('title', group + ' (' + (run.end - run.start + 1) + ')');
	tab.pageGroupCurrent = current;
	tab.pageGroupCollapsed = collapsed;
	mxEvent.disableContextMenu(tab);
	EditorUi.addPageGroupTabStyles();

	var icon = document.createElement('div');
	icon.className = 'geButton ' + ((collapsed) ?
		'gePageGroupCollapsedIcon' : 'gePageGroupExpandedIcon');
	tab.appendChild(icon);

	var label = document.createElement('span');
	label.style.maxWidth = '160px';
	label.style.textOverflow = 'ellipsis';
	label.style.overflow = 'hidden';
	label.setAttribute('role', 'button');
	label.setAttribute('tabindex', '0');
	label.setAttribute('aria-expanded', (collapsed) ? 'false' : 'true');

	if (current)
	{
		label.setAttribute('aria-disabled', 'true');
	}

	label.tabKey = 'group:' + group;
	mxUtils.write(label, group);
	Editor.addFocusRing(label, tab);
	tab.appendChild(label);

	var elt = document.createElement('div');
	elt.className = 'geButton gePageGroupMenuIcon';
	elt.setAttribute('role', 'button');
	elt.setAttribute('tabindex', '0');
	elt.setAttribute('aria-haspopup', 'menu');
	elt.setAttribute('aria-label', mxResources.get('options'));
	elt.tabKey = 'groupMenu:' + group;
	tab.appendChild(elt);

	this.addTabMouseFocusListeners(tab);

	var showMenu = mxUtils.bind(this, function(evt)
	{
		this.editor.graph.popupMenuHandler.hideMenu();
		this.hideCurrentMenu();

		var menu = new mxPopupMenu(this.createPageGroupMenu(group, index));
		menu.smartSeparators = true;
		menu.showDisabled = true;
		menu.autoExpand = true;

		// Disables autoexpand and destroys menu when hidden
		menu.hideMenu = mxUtils.bind(this, function()
		{
			mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
			this.resetCurrentMenu();
			menu.destroy();
		});

		this.popupTabMenu(menu, elt, evt);
		this.setCurrentMenu(menu, tab);
	});

	mxEvent.addListener(tab, 'click', mxUtils.bind(this, function(evt)
	{
		if (mxEvent.getSource(evt) == elt)
		{
			showMenu(evt);
		}
		else if (!current)
		{
			this.setPageGroupCollapsed(group, !collapsed);
		}

		mxEvent.consume(evt);
	}));

	mxEvent.addListener(tab, 'contextmenu', function(evt)
	{
		showMenu(evt);
		mxEvent.consume(evt);
	});

	// Enter and Space click the name or the button. Editor.initKeyboardButton
	// would prevent the mousedown and thereby the drag of the tab.
	mxEvent.addListener(tab, 'keydown', function(evt)
	{
		if ((evt.keyCode == 13 /* Enter */ || evt.keyCode == 32 /* Space */) &&
			!mxEvent.isAltDown(evt) && !mxEvent.isControlDown(evt) &&
			!mxEvent.isMetaDown(evt))
		{
			Editor.clickWithKeyboard(mxEvent.getSource(evt), evt);
			mxEvent.consume(evt);
		}
	});

	return tab;
};

/**
 * Returns a function that adds the menu items for the given page group,
 * which starts with the page at the given index, to a menu.
 */
EditorUi.prototype.createPageGroupMenu = function(group, index)
{
	return mxUtils.bind(this, function(menu, parent)
	{
		// The group of the current page cannot be collapsed
		var current = this.isCurrentPageGroup(group, index);
		var collapsed = !current && this.isPageGroupCollapsed(group);

		menu.addItem(mxResources.get((collapsed) ? 'expand' : 'collapse'), null,
			mxUtils.bind(this, function()
		{
			this.setPageGroupCollapsed(group, !collapsed);
		}), parent, null, !current);

		if (this.editor.graph.isEnabled())
		{
			menu.addSeparator(parent);

			menu.addItem(mxResources.get('insertPage'), null, mxUtils.bind(this, function()
			{
				this.insertPageInGroup(group, index);
			}), parent);

			menu.addItem(mxResources.get('rename') + '...', null, mxUtils.bind(this, function()
			{
				this.renamePageGroup(group);
			}), parent);

			menu.addItem(mxResources.get('ungroup'), null, mxUtils.bind(this, function()
			{
				this.changePageGroup(group, null);
			}), parent);
		}
	});
};

/**
 * Leaves the focus where it was after a click or a drag with the mouse on
 * the given tab, which focuses the tab or one of its buttons as the
 * mousedown cannot prevent it without preventing the drag (see
 * Editor.initKeyboardButton).
 */
EditorUi.prototype.addTabMouseFocusListeners = function(tab)
{
	var mouseFocus = false;

	tab.addEventListener((mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', function()
	{
		mouseFocus = !mxUtils.isAncestorNode(tab, document.activeElement);
	}, true);

	var restoreFocus = function()
	{
		if (mouseFocus && mxUtils.isAncestorNode(tab, document.activeElement))
		{
			document.activeElement.blur();
		}

		mouseFocus = false;
	};

	tab.addEventListener((mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', restoreFocus, true);
	tab.addEventListener('dragend', restoreFocus, true);
};

/**
 * Adds the listeners to the given tab for selecting the given page, renaming
 * it on double click and showing its menu. Enter and Space select the page
 * on its name, which is the first child of the tab, or show the menu from
 * its button. The tab contains both, so it is no control itself as screen
 * readers do not announce controls inside of controls.
 */
EditorUi.prototype.addTabListeners = function(page, tab)
{
	mxEvent.disableContextMenu(tab);
	var graph = this.editor.graph;

	mxEvent.addListener(tab, 'dblclick', mxUtils.bind(this, function(evt)
	{
		this.renamePage(page)
		mxEvent.consume(evt);
	}));
	
	var elt = document.createElement('div');
	elt.style.backgroundImage = 'url(' + Editor.thinExpandImage + ')';
	elt.className = 'geButton';
	tab.appendChild(elt);

	var label = tab.firstChild;
	label.setAttribute('role', 'button');
	label.setAttribute('tabindex', '0');
	label.tabKey = 'page:' + page.getId();
	Editor.addFocusRing(label, tab);
	elt.setAttribute('role', 'button');
	elt.setAttribute('tabindex', '0');
	elt.setAttribute('aria-haspopup', 'menu');
	elt.setAttribute('aria-label', mxResources.get('options'));
	elt.tabKey = 'menu:' + page.getId();
	this.addTabMouseFocusListeners(tab);

	var menuWasVisible = false;
	var pageWasActive = false;

	var showMenu = mxUtils.bind(this, function(evt)
	{
		var menu = new mxPopupMenu(this.createPageMenu(page));
		menu.smartSeparators = true;
		menu.showDisabled = true;
		menu.autoExpand = true;

		// Disables autoexpand and destroys menu when hidden
		menu.hideMenu = mxUtils.bind(this, function()
		{
			mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
			this.resetCurrentMenu();
			menu.destroy();
		});

		this.popupTabMenu(menu, elt, evt);
		this.setCurrentMenu(menu, tab);
	});

	mxEvent.addListener(tab, 'keydown', mxUtils.bind(this, function(evt)
	{
		if ((evt.keyCode == 13 /* Enter */ || evt.keyCode == 32 /* Space */) &&
			!mxEvent.isAltDown(evt) && !mxEvent.isControlDown(evt) &&
			!mxEvent.isMetaDown(evt))
		{
			if (mxEvent.getSource(evt) == elt)
			{
				graph.popupMenuHandler.hideMenu();
				this.hideCurrentMenu();
				showMenu(evt);
			}
			else if (page != this.currentPage)
			{
				this.selectPage(page);
			}

			mxEvent.consume(evt);
		}
	}));

	var onMouseDown = mxUtils.bind(this, function(evt)
	{
		// Do not consume event here to allow for drag and drop of tabs
		menuWasVisible = this.currentMenu != null;
		pageWasActive = page == this.currentPage;
		this.scrollToPage(page);
		
		if (!graph.isMouseDown && !pageWasActive)
		{
			this.selectPage(page);
		}
	});

	var onMouseUp = mxUtils.bind(this, function(evt)
	{
		if (!graph.isMouseDown && ((pageWasActive &&
			(mxEvent.isTouchEvent(evt) ||
				mxEvent.getSource(evt) == elt)) ||
			mxEvent.isPopupTrigger(evt)))
		{
			graph.popupMenuHandler.hideMenu();
			this.hideCurrentMenu();

			if (!mxEvent.isTouchEvent(evt) || !menuWasVisible)
			{
				showMenu(evt);
			}
		}

		mxEvent.consume(evt);
	});

	mxEvent.addGestureListeners(elt, onMouseDown, null, onMouseUp);
	mxEvent.addGestureListeners(tab, onMouseDown, null, onMouseUp);
};

/**
 * Returns a function that adds the menu items for the given page to a menu.
 */
EditorUi.prototype.createPageMenu = function(page, label)
{
	return mxUtils.bind(this, function(menu, parent)
	{
		if (urlParams['embed'] != 1)
		{
			if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp &&
				this.getServiceName() == 'draw.io' && !navigator.standalone)
			{
				menu.addItem(mxResources.get('openInNewWindow'), null, mxUtils.bind(this, function()
				{
					this.editor.editAsNew(this.getFileData(true, null, null, null, true, true));
				}), parent);
			}
		}

		if (this.editor.graph.isEnabled())
		{
			this.menus.addMenuItems(menu, ['duplicatePage', '-'], parent);

			if (this.currentPage == page && this.pages.length > 1)
			{
				this.menus.addSubmenu('movePage', menu, parent, mxResources.get('move'));
			}

			if (this.currentPage == page && this.isPageGroupsEnabled())
			{
				this.menus.addSubmenu('pageGroup', menu, parent, mxResources.get('group'));
			}

			this.menus.addMenuItems(menu, ['removePage', 'renamePage'], parent);
		}
	});
};
