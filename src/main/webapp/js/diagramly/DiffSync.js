/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.DIFF_INSERT = 'i';

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.DIFF_REMOVE = 'r';

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.DIFF_UPDATE = 'u';

/**
 * Constant for file-level attribute changes in patches.
 */
EditorUi.DIFF_FILE = 'f';

/**
 * Shared codec.
 */
EditorUi.transientViewStateProperties = ['defaultParent', 'currentRoot', 'scrollLeft',
	'scrollTop', 'scale', 'translate', 'lastPasteXml', 'pasteCounter'];

/**
 * Contains all view state properties that should not be ignored in diff sync.
 */
EditorUi.prototype.viewStateProperties = {background: true, backgroundImage: true, shadowVisible: true,
	foldingEnabled: true, pageScale: true, mathEnabled: true, pageFormat: true, extFonts: true,
	adaptiveColors: true};

/**
 * Contains all known cell properties that should be ignored for a generic cell diff.
 */
EditorUi.prototype.cellProperties = {id: true, value: true, xmlValue: true, vertex: true, edge: true,
	visible: true, collapsed: true, connectable: true, parent: true, children: true, previous: true,
	source: true, target: true, edges: true, geometry: true, style: true, overlays: true,
	mxObjectId: true, mxTransient: true};

/**
 * Returns true if the given key must never be copied from an untrusted patch
 * onto an object as it would allow prototype pollution (eg. a diff key or a
 * cell/view-state property called __proto__, constructor or prototype). Patches
 * are attacker-controlled JSON (collab and embed protocol) so keys are guarded
 * at every point where they are written to an object.
 */
EditorUi.isPrototypePollutionKey = function(key)
{
	return key == '__proto__' || key == 'constructor' || key == 'prototype';
};

/**
 * Returns true if the given key of a patch entry may be copied onto a
 * cell as a custom property: not one of the known cell fields, not a
 * prototype-pollution key and not a member of mxCell's prototype. A
 * remote entry {"getId": 1} would otherwise shadow the method on the
 * live cell and break every later encode, diff and flush of the session.
 */
EditorUi.prototype.isCustomCellProperty = function(key)
{
	return !this.cellProperties[key] && !EditorUi.isPrototypePollutionKey(key) &&
		!(key in mxCell.prototype);
};

/**
 * Normalizes a patch list (inserts, removes) to a real array. Patches
 * are attacker-controlled JSON, and a string passed where an array is
 * expected is iterated CHARACTER by character: every character becomes
 * an entry with undefined id and parent, which scrambled the order
 * rebuild and dropped legitimate saved cells from the document
 * (adversarial-patch). Anything that is not an array is treated as
 * absent - a malformed list carries no intent that could be honored.
 */
EditorUi.patchList = function(value)
{
	return (Object.prototype.toString.call(value) ==
		'[object Array]') ? value : null;
};

/**
 * Normalizes a patch update map to a real object. The list normalization
 * above covers inserts and removes, but the update maps are the same
 * attacker-controlled JSON and their VALUES were dereferenced blind: a
 * null or primitive entry threw a TypeError out of the patch, and on the
 * live path nothing catches it - the receiver was left half patched and
 * its receive latch never reset, so it silently stopped applying every
 * later message while still broadcasting its own. Entries that are not
 * objects carry no intent that could be honored and are dropped.
 */
EditorUi.patchMap = function(value)
{
	if (value == null || typeof value != 'object' ||
		Object.prototype.toString.call(value) == '[object Array]')
	{
		return null;
	}

	var result = null;

	for (var id in value)
	{
		var entry = value[id];

		if (entry != null && typeof entry == 'object' &&
			Object.prototype.toString.call(entry) != '[object Array]')
		{
			if (result == null)
			{
				// Null prototype: keyed by ids taken verbatim from the patch
				result = Object.create(null);
			}

			result[id] = entry;
		}
	}

	return result;
};

/**
 * Shared codec.
 */
EditorUi.prototype.codec = new mxCodec();

/**
 * Applies the given patches to the given pages. If mergeInserts is true,
 * cell inserts that collide with an existing cell are merged into that
 * cell instead of being ignored (see patchCellRecursive). An array of
 * booleans selects this separately for each patch; omitted entries are false.
 * The page-level equivalent is mergePageInserts and is deliberately
 * separate: live resends need the cell merge but must NOT merge colliding
 * PAGE inserts, which re-assert an adopted page and would revert fresh cells.
 */
EditorUi.prototype.applyPatches = function(pages, patches, markPages, resolver, updateEdgeParents, mergeInserts, mergePageInserts)
{
	if (patches != null)
	{
		for (var i = 0; i < patches.length; i++)
		{
			if (patches[i] != null)
			{
				pages = this.patchPages(pages, patches[i],
					markPages, resolver, updateEdgeParents,
					(Array.isArray(mergeInserts)) ? mergeInserts[i] === true :
						mergeInserts, mergePageInserts);
			}
		}
	}

	return pages;
};

/**
 * Applies file-level attribute changes from the given patches to the fileNode.
 * Returns true if any file-level attributes were changed.
 */
EditorUi.prototype.patchFileNode = function(patches)
{
	var changed = false;

	if (this.fileNode != null && patches != null)
	{
		for (var i = 0; i < patches.length; i++)
		{
			if (patches[i] != null && patches[i][EditorUi.DIFF_FILE] != null)
			{
				for (var key in patches[i][EditorUi.DIFF_FILE])
				{
					var val = patches[i][EditorUi.DIFF_FILE][key];

					if (val != null)
					{
						this.fileNode.setAttribute(key, val);
					}
					else
					{
						this.fileNode.removeAttribute(key);
					}

					changed = true;
				}
			}
		}
	}

	return changed;
};

/**
 * Absolute origin of the given cell's coordinate space: the summed
 * offsets of its non-relative ancestors, the layers and the root
 * excluded (they carry no offset).
 */
EditorUi.prototype.getAbsoluteOrigin = function(cell)
{
	var x = 0;
	var y = 0;

	while (cell != null && cell.getParent() != null)
	{
		var geo = cell.getGeometry();

		if (geo != null && !geo.relative && !cell.isEdge())
		{
			x += geo.x;
			y += geo.y;
		}

		cell = cell.getParent();
	}

	return new mxPoint(x, y);
};

/**
 * Disconnects the given end of the edge and keeps the edge RENDERABLE:
 * an end that is neither a terminal nor a terminal point cannot be
 * drawn, so the edge silently disappears from the screen while the
 * model stays perfectly consistent - which is why convergence
 * verdicts never saw it. mxGraph.cellsRemoved does the same for user
 * deletes; the sync paths must not be weaker.
 *
 * The point is the disconnected terminal's center, computed from the
 * geometry alone: several clients sanitize the same window
 * independently, so a view-dependent attachment point (as in the undo
 * replay, where a single client computes it and the diff distributes
 * the result) would diverge between them.
 */
EditorUi.prototype.disconnectTerminal = function(edge, source, model)
{
	try
	{
		var terminal = edge.getTerminal(source);
		var geo = edge.getGeometry();

		if (terminal != null && geo != null &&
			geo.getTerminalPoint(source) == null)
		{
			var tgeo = terminal.getGeometry();

			if (tgeo != null && !tgeo.relative)
			{
				var to = this.getAbsoluteOrigin(terminal);
				var eo = this.getAbsoluteOrigin(edge);
				geo = geo.clone();
				geo.setTerminalPoint(new mxPoint(
					to.x + tgeo.width / 2 - eo.x,
					to.y + tgeo.height / 2 - eo.y), source);

				if (model != null)
				{
					model.setGeometry(edge, geo);
				}
				else
				{
					edge.setGeometry(geo);
				}
			}
		}
	}
	catch (e)
	{
		// Keeping the edge visible must never break the disconnect
	}

	if (model != null)
	{
		model.setTerminal(edge, null, source);
	}
	else
	{
		edge.setTerminal(null, source);
	}
};

/**
 * Point for an edge end that lost its terminal without leaving a point
 * behind (an exact patch path cannot invent one, see patchPage). The
 * position is derived from the geometry alone so every client computes
 * the same value: next to the surviving end if there is one, else next
 * to the edge's own position.
 */
EditorUi.prototype.getEdgeEndFallback = function(edge, source, other)
{
	var origin = this.getAbsoluteOrigin(edge);

	if (other != null)
	{
		var geo = other.getGeometry();

		if (geo != null && !geo.relative)
		{
			var oo = this.getAbsoluteOrigin(other);

			return new mxPoint(oo.x + geo.width / 2 - origin.x +
				((source) ? -120 : 120), oo.y + geo.height / 2 - origin.y);
		}
	}

	var egeo = edge.getGeometry();

	return (egeo != null) ? new mxPoint(egeo.x + ((source) ? -60 : 60),
		egeo.y) : null;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchPages = function(pages, diff, markPages, resolver, updateEdgeParents, mergeInserts, mergePageInserts)
{
	// Null prototypes: all of these are keyed by page ids and cell ids taken
	// verbatim from the patch or the document, so a plain {} would resolve
	// __proto__/constructor to an inherited value and treat it as a real entry
	var resolverLookup = Object.create(null);
	var newPages = [];
	var removed = Object.create(null);
	var lookup = Object.create(null);

  	if (resolver != null && resolver[EditorUi.DIFF_UPDATE] != null)
	{
  		for (var id in resolver[EditorUi.DIFF_UPDATE])
  		{
  			resolverLookup[id] = resolver[EditorUi.DIFF_UPDATE][id];
		}
	}

	var pageRemoves = EditorUi.patchList(diff[EditorUi.DIFF_REMOVE]);

	if (pageRemoves != null)
	{
		for (var i = 0; i < pageRemoves.length; i++)
		{
			removed[pageRemoves[i]] = true;
		}
	}

	if (pages != null)
	{
		for (var i = 0; i < pages.length; i++)
		{
			lookup[pages[i].getId()] = pages[i];
		}
	}

	// Null prototypes as the lookups are keyed by remote page IDs
	var reinserted = Object.create(null);
	var inserted = Object.create(null);
	var moved = Object.create(null);
	var update = EditorUi.patchMap(diff[EditorUi.DIFF_UPDATE]);
	var mergedEntries = [];

	var pageInserts = EditorUi.patchList(diff[EditorUi.DIFF_INSERT]);

	if (pageInserts != null)
	{
		for (var i = 0; i < pageInserts.length; i++)
		{
			var entry = pageInserts[i];

			// Same rule as for cells: an insert states an identity, it
			// does not create one
			if (entry == null || typeof entry != 'object' || entry.id == null)
			{
				continue;
			}

			var anchor = (entry.previous != null) ? entry.previous : '';

			if (entry.id != null && lookup[entry.id] != null && !mergePageInserts)
			{
				// Colliding page inserts are merged into the existing
				// page in place (see insertPage) and keep their local
				// position; only with mergePageInserts does the explicit
				// previous reference reposition the page
				mergedEntries.push(entry);
			}
			else
			{
				if (entry.id != null && lookup[entry.id] != null)
				{
					reinserted[entry.id] = true;
				}

				if (inserted[anchor] == null)
				{
					inserted[anchor] = [];
				}

				inserted[anchor].push(entry);
			}
		}
	}

	if (update != null)
	{
		for (var id in update)
		{
			if (update[id].previous != null)
			{
				if (moved[update[id].previous] == null)
				{
					moved[update[id].previous] = [];
				}

				moved[update[id].previous].push(id);
			}
		}
	}

	// Canonical order rebuild from the previous chains, the page-level
	// equivalent of patchCellRecursive: every page has exactly one
	// anchor - the explicit previous reference from the patch, or
	// implicitly its current local predecessor - and the final order
	// is the deterministic walk of this anchor graph with a fixed
	// claimant order (inserts in patch order, moved pages sorted by
	// ID, then the implicit follower), so clients applying crossing
	// patches on different bases converge to the same order
	var claimants = Object.create(null);
	var id = null;

	for (id in inserted)
	{
		claimants[id] = [];

		for (var i = 0; i < inserted[id].length; i++)
		{
			claimants[id].push({id: inserted[id][i].id,
				entry: inserted[id][i]});
		}
	}

	for (id in moved)
	{
		var ids = moved[id].slice();
		ids.sort();

		if (claimants[id] == null)
		{
			claimants[id] = [];
		}

		for (var i = 0; i < ids.length; i++)
		{
			claimants[id].push({id: ids[i]});
		}
	}

	// Implicit anchors: existing pages without an explicit previous
	// in the patch follow their current local predecessor, exactly
	// like patchCellRecursive. A page whose whole block moved with
	// its anchor carries no own previous update in a minimal diff
	// (its predecessor is unchanged) and must follow the anchor -
	// keeping such pages at their old relative position broke the
	// checksum on net block moves between two saves. Removed pages
	// do not advance the anchor so their followers reanchor on the
	// preceding survivor, matching the cell level after its remove
	// pass.
	if (pages != null)
	{
		var prev = '';

		for (var i = 0; i < pages.length; i++)
		{
			var pageId = pages[i].getId();

			if (!removed[pageId])
			{
				if (!reinserted[pageId] &&
					(update == null || update[pageId] == null ||
					update[pageId].previous == null))
				{
					if (claimants[prev] == null)
					{
						claimants[prev] = [];
					}

					claimants[prev].push({id: pageId});
				}

				prev = pageId;
			}
		}
	}

	// Emits the claimant chains anchored at the given ID in
	// depth-first order (a claimant is followed by its own chain
	// before the next claimant of the same anchor)
	var emittedIds = Object.create(null);
	var order = [];

	var emitRun = function(anchor)
	{
		var stack = [];
		var list = claimants[anchor];

		if (list != null)
		{
			delete claimants[anchor];

			for (var i = list.length - 1; i >= 0; i--)
			{
				stack.push(list[i]);
			}
		}

		while (stack.length > 0)
		{
			var current = stack.pop();

			if (current.id == null || !emittedIds[current.id])
			{
				if (current.id != null)
				{
					emittedIds[current.id] = true;
				}

				order.push(current);
				var next = (current.id != null) ?
					claimants[current.id] : null;

				if (next != null)
				{
					delete claimants[current.id];

					for (var i = next.length - 1; i >= 0; i--)
					{
						stack.push(next[i]);
					}
				}
			}
		}
	};

	// The whole order is one anchor graph rooted at the start
	emitRun('');

	// Orphaned chains (the anchor vanished in the local pages) are
	// appended in anchor ID order. Collected and sorted ONCE:
	// emitRun only ever removes anchors, never adds any, so an
	// anchor a previous run consumed leaves an empty stack and its
	// call is a no-op. Termination no longer rests on every pass
	// consuming an anchor, and the drain is linear instead of
	// rescanning the whole claimant map once per orphan.
	var orphans = [];

	for (id in claimants)
	{
		orphans.push(id);
	}

	orphans.sort();

	for (var oi = 0; oi < orphans.length; oi++)
	{
		emitRun(orphans[oi]);
	}

  	// FIXME: Workaround for possible duplicate pages
  	var added = Object.create(null);

	var addPage = mxUtils.bind(this, function(page)
	{
		var id = (page != null) ? page.getId() : '';

		if (page != null && !added[id])
		{
			added[id] = true;
			newPages.push(page);
			var pageDiff = (update != null) ? update[id] : null;

			if (pageDiff != null)
			{
				this.updatePageRoot(page);

				if (pageDiff.name != null)
				{
					page.setName(pageDiff.name);
				}

				// View box (initial view) — empty string removes it.
				if (pageDiff.viewBox != null)
				{
					if (pageDiff.viewBox == '')
					{
						page.node.removeAttribute('viewBox');
					}
					else
					{
						page.node.setAttribute('viewBox', pageDiff.viewBox);
					}
				}

				if (pageDiff.view != null)
				{
					this.patchViewState(page, pageDiff.view);
				}

				if (pageDiff.cells != null)
				{
					this.patchPage(page, pageDiff.cells,
						resolverLookup[page.getId()],
						updateEdgeParents, mergeInserts);
				}

				if (markPages && (pageDiff.cells != null ||
					pageDiff.view != null))
				{
					page.needsUpdate = true;
				}
			}
		}
	});

	var insertPage = mxUtils.bind(this, function(ins)
	{
		var newPage = null;

		// The payload is remote JSON and is PARSED here: a parser error,
		// a diagram body that is not valid base64 (Graph.decompress ->
		// atob) or any other malformed shape throws out of the middle of
		// the patch, which leaves the pages half applied and, on the
		// live path, wedges the receive channel. A page that cannot be
		// read carries no intent that could be honored - it is treated
		// as absent, like every other malformed list entry.
		try
		{
			newPage = new DiagramPage(
				mxUtils.parseXml(ins.data).documentElement);
			this.updatePageRoot(newPage);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.patchPages: unreadable page insert',
				ins.id, e.message);

			return;
		}

		// The entry announces an id and the payload carries one. When
		// they disagree the entry is malformed: the announced id was
		// already excluded from the implicit page order as a collision,
		// so honoring the payload would silently drop THAT page while
		// adding a different one.
		if (ins.id != null && newPage.getId() != ins.id)
		{
			EditorUi.debug('EditorUi.patchPages: page insert id mismatch',
				ins.id, newPage.getId());

			return;
		}

		var page = lookup[newPage.getId()];

		if (page == null)
		{
			addPage(newPage);
		}
		else
		{
			// Colliding page inserts merge their content ONLY in
			// mergePageInserts mode (save merge), where the entry is
			// the authoritative saved state. On the live path a
			// colliding insert is a trailing re-assertion of an adopted
			// page (eg. the resolve patch of a flush) whose data is
			// STALE against newer live traffic, so merging it would
			// revert fresh cells - content and position stay local
			// there. This is deliberately NOT the cell-level
			// mergeInserts flag, which the live path DOES set: the
			// two levels answer different questions and sharing one
			// flag silently reverted freshly flushed cells.
			// diffPages returns a pages-level diff: the page's own
			// update entry carries the diff that patchPage and the
			// name handling consume (passing the pages-level object
			// to patchPage was a silent no-op)
			if (mergePageInserts)
			{
				var pagesDiff = this.diffPages([page], [newPage]);
				var pageDiff = (pagesDiff[EditorUi.DIFF_UPDATE] != null) ?
					pagesDiff[EditorUi.DIFF_UPDATE][newPage.getId()] : null;

				if (pageDiff != null)
				{
					// The merge is ADDITIVE, like the colliding cell insert
					// it mirrors: an insert states the page as its sender
					// knew it, and a cell the sender never saw is not a
					// deletion. Applying the full diff deleted the local
					// copy's own unconfirmed cells, and since that removal
					// never appears in the patch, the pending re-assertion
					// could not know to restore them - the adopter silently
					// lost its flushed work when the page creator saved
					// first. Real deletions travel as removes in the page's
					// update entry, which is applied unchanged
					if (pageDiff.cells != null)
					{
						delete pageDiff.cells[EditorUi.DIFF_REMOVE];
					}

					this.updatePageRoot(page);

					if (pageDiff.name != null)
					{
						page.setName(pageDiff.name);
					}

					if (pageDiff.viewBox != null)
					{
						if (pageDiff.viewBox == '')
						{
							page.node.removeAttribute('viewBox');
						}
						else
						{
							page.node.setAttribute('viewBox', pageDiff.viewBox);
						}
					}

					if (pageDiff.view != null)
					{
						this.patchViewState(page, pageDiff.view);
					}

					if (pageDiff.cells != null)
					{
						this.patchPage(page, pageDiff.cells,
							resolverLookup[page.getId()],
							updateEdgeParents);
					}
				}
			}

			if (markPages)
			{
				page.needsUpdate = true;
			}

			// Repositions the merged page at the insert position
			// (reinserted mode); without mergePageInserts the page
			// keeps its position via the backbone
			if (mergePageInserts)
			{
				addPage(page);
			}
		}
	});

	// Applies the canonical order: existing pages are added at their
	// target position, inserted pages are created from their entries
	for (var i = 0; i < order.length; i++)
	{
		if (order[i].entry != null)
		{
			insertPage(order[i].entry);
		}
		else
		{
			var page = lookup[order[i].id];

			if (page != null)
			{
				addPage(page);
			}
		}
	}

	// Colliding page inserts outside mergePageInserts mode: the page
	// keeps its local content and position, insertPage only marks it
	// for update (the skip that keeps a stale re-assertion from
	// reverting newer live state)
	for (var i = 0; i < mergedEntries.length; i++)
	{
		insertPage(mergedEntries[i]);
	}

	return newPages;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchViewState = function(page, diff)
{
	if (diff != null)
	{
		if (page.viewState == null)
		{
			var doc = mxUtils.createXmlDocument();
			page.viewState = this.editor.graph.createViewState(
				doc.createElement('mxGraphModel'));
		}

		if (page == this.currentPage)
		{
			page.viewState = this.editor.graph.getViewState();
		}

		for (var key in diff)
		{
			if (EditorUi.isPrototypePollutionKey(key))
			{
				continue;
			}

			try
			{
				this.patchViewStateProperty(page, diff, key);
			}
			catch(e) {} //Ignore TODO Is this correct, we encountered an undefined value for a key (extFonts)
		}

		if (page == this.currentPage)
		{
			this.editor.graph.setViewState(page.viewState, true);
		}
	}
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchViewStateProperty = function(page, diff, key)
{
	page.viewState[key] = JSON.parse(diff[key]);
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.createParentLookup = function(model, diff)
{
	// Null prototypes and multi-claimant lists: keys are remote
	// controlled patch data, and several cells can claim the same
	// previous anchor when concurrent patches cross (the canonical
	// order rebuild in patchCellRecursive resolves the competition
	// deterministically instead of dropping all but the last claim).
	// Note inserted is enumerated and deleted from, so an inherited
	// hit would loop forever (delete cannot remove an inherited key).
	var parentLookup = Object.create(null);

	function getLookup(id)
	{
		var result = parentLookup[id];

		if (result == null)
		{
			result = {inserted: Object.create(null),
				moved: Object.create(null)};
			parentLookup[id] = result;
		}
		
		return result;
	};
	
	var cellInserts = EditorUi.patchList(diff[EditorUi.DIFF_INSERT]);

	if (cellInserts != null)
	{
		for (var i = 0; i < cellInserts.length; i++)
		{
			var temp = cellInserts[i];

			// An insert without an id would reach mxGraphModel.cellAdded
			// with an undefined id, which MINTS one - and each model copy
			// mints a different one, so the clients diverge on a cell
			// nobody can address. A patch never creates identity.
			if (temp == null || typeof temp != 'object' || temp.id == null)
			{
				continue;
			}

			var par = (temp.parent != null) ? temp.parent : '';
			var prev = (temp.previous != null) ? temp.previous : '';
			var lookup = getLookup(par);

			if (lookup.inserted[prev] == null)
			{
				lookup.inserted[prev] = [];
			}

			lookup.inserted[prev].push(temp);
		}
	}
	
	var lookupUpdate = EditorUi.patchMap(diff[EditorUi.DIFF_UPDATE]);

	if (lookupUpdate != null)
	{
		for (var id in lookupUpdate)
		{
			var temp = lookupUpdate[id];
			
			if (temp.previous != null)
			{
				var par = temp.parent;
				
				if (par == null)
				{
					var cell = model.getCell(id);
					
					if (cell != null)
					{
						var parent = model.getParent(cell);
						
						if (parent != null)
						{
							par = parent.getId();
						}
					} 
				}
				
				if (par != null)
				{
					var lookup = getLookup(par);

					if (lookup.moved[temp.previous] == null)
					{
						lookup.moved[temp.previous] = [];
					}

					lookup.moved[temp.previous].push(id);
				}
			}
		}
	}
	
	return parentLookup;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchPage = function(page, diff, resolver, updateEdgeParents, mergeInserts)
{
	var model = (page == this.currentPage) ? this.editor.graph.model : new mxGraphModel(page.root);
	var parentLookup = this.createParentLookup(model, diff);
	var reinserted = null;
	var ignoredInserts = Object.create(null);

	// Lookup of all inserted cell IDs for merging inserts that collide
	// with existing cells in patchCellRecursive: cells with an insert
	// entry are placed explicitly and must not take part in the implicit
	// order chain of existing children. Null prototype as the IDs are
	// remote-controlled patch data.
	var pageCellInserts = EditorUi.patchList(diff[EditorUi.DIFF_INSERT]);

	// Normalized ONCE per page: patchCellRecursive reads the update map
	// for every child it visits, and rebuilding the normalized copy there
	// made a patch cost cells x updates (10k cells with 1k updates spent
	// ~0.6s in the copies alone)
	var cellUpdate = EditorUi.patchMap(diff[EditorUi.DIFF_UPDATE]);

	model.beginUpdate();
	try
	{
		// Disables or delays update of edge parents to after patch
		var prev = model.updateEdgeParent;
		var dict = new mxDictionary();
		var pendingUpdates = [];
		
		model.updateEdgeParent = function(edge, root)
		{
			if (!dict.get(edge) && updateEdgeParents)
			{
				dict.put(edge, true);
				pendingUpdates.push(edge);
			}
		};

		// Handles new root cells (first claimant of the empty anchor)
		var temp = parentLookup[''];
		var cellDiff = (temp != null && temp.inserted != null &&
			temp.inserted[''] != null) ? temp.inserted[''][0] : null;
		var root = null;
		
		if (cellDiff != null)
		{
			root = this.getCellForJson(cellDiff);
		}
		
		// Handles cells becoming root
		if (root == null)
		{
			var id = (temp != null && temp.moved != null &&
				temp.moved[''] != null) ? temp.moved[''][0] : null;
			
			if (id != null)
			{
				root = model.getCell(id);
			}
		}
		
		var previousRoot = model.getRoot();

		if (root != null && root != previousRoot)
		{
			// An inserted root is created from its entry WITHOUT
			// children: its layers are separate insert entries that
			// the walk below adds under the new root, so the swap
			// must happen first. A fresh parse selects the last
			// parentless cell of a page as its root, so a file whose
			// page root id changed between two saves (external tools,
			// a stray cell with no parent) diffs as a full re-insert
			// rooted at the new id - refusing an empty root here
			// rejected every such patch and failed the mergeFile
			// checksum for the whole page (31.5.0, jgraph/drawio-dev#677).
			// The layer invariant the remove pass enforces is checked
			// after the walk instead, see below.
			model.setRoot(root);
			page.root = root;

			EditorUi.debug('EditorUi.patchPage: Root changed', root.id);
		}

		// Lookup of all inserted cell IDs for merging inserts that
		// collide with existing cells in patchCellRecursive: cells with
		// an insert entry are placed explicitly and must not take part
		// in the implicit order chain of existing children. Computed
		// after the root swap, which unregisters the previous tree:
		// a re-insert under a new root collides with nothing, and a
		// collision recorded against the old tree would keep the
		// terminals of the re-inserted edges from being set below.
		// Null prototype as the IDs are remote-controlled patch data.
		if (pageCellInserts != null)
		{
			reinserted = (mergeInserts) ? Object.create(null) : null;

			for (var i = 0; i < pageCellInserts.length; i++)
			{
				if (pageCellInserts[i] != null &&
					pageCellInserts[i].id != null)
				{
					var id = pageCellInserts[i].id;

					if (reinserted != null)
					{
						reinserted[id] = true;
					}
					else if (model.getCell(id) != null)
					{
						// An ignored collision must not apply the old
						// insert's terminals after explicit updates below.
						ignoredInserts[id] = true;
					}
				}
			}
		}

		// Inserts and updates previous and parent (hierarchy update)
		this.patchCellRecursive(page, model, model.root,
			parentLookup, diff, reinserted, cellUpdate);

		// Mirrors the invariant the remove pass enforces: a page must
		// never be left without a layer, or the model is unrenderable
		// and every later walk dereferences null. A legitimate root
		// change always brings at least one layer (updatePageRoot
		// guarantees one on the sender), so only a crafted root insert
		// with no children arrives here, and the previous root with
		// its intact subtree is restored for it.
		if (root != null && root != previousRoot &&
			model.getChildCount(model.getRoot()) == 0)
		{
			model.setRoot(previousRoot);
			page.root = previousRoot;

			EditorUi.debug('EditorUi.patchPage: refused root without ' +
				'a layer', root.id);
		}

		// Removes cells after parents have been updated above
		var pageCellRemoves = EditorUi.patchList(
			diff[EditorUi.DIFF_REMOVE]);

		if (pageCellRemoves != null)
		{
			// Disconnects surviving edges as removeCells does for
			// interactive removes: a dangling terminal reference
			// cannot be reproduced via diff and patch or cloning
			// (the cell is missing), so it diverges all copies of
			// the model (eg. the sync snapshot and own pages)
			var disconnect = mxUtils.bind(this, function(cell)
			{
				var edges = (cell.edges != null) ?
					cell.edges.slice() : [];

				for (var j = 0; j < edges.length; j++)
				{
					// No terminal point is invented here: patching is an
					// EXACT path (the shadow is patched and checksummed
					// against the sender), so anything the sender does
					// not have breaks the checksum. Keeping the edge
					// renderable is the job of the LOCAL disconnects
					// (mxGraph.cellsRemoved, sanitizePageTerminals,
					// sanitizeRealtimeTerminals), whose points ride
					// along in the diff like any other local change.
					if (model.getTerminal(edges[j], true) == cell)
					{
						model.setTerminal(edges[j], null, true);
					}

					if (model.getTerminal(edges[j], false) == cell)
					{
						model.setTerminal(edges[j], null, false);
					}
				}

				var childCount = model.getChildCount(cell);

				for (var j = 0; j < childCount; j++)
				{
					disconnect(model.getChildAt(cell, j));
				}
			});

			for (var i = 0; i < pageCellRemoves.length; i++)
			{
				var id = pageCellRemoves[i];
				var cell = model.getCell(id);
				var root = model.getRoot();

				// A patch must never leave a page without its root or
				// without a layer: the model becomes unrenderable and
				// every later walk dereferences null, which takes the
				// whole editor with it. Patches are attacker
				// controlled (any collaborator can send them), so a
				// remove of '0'/'1' is refused rather than trusted -
				// legitimate layer removals are unaffected, as the
				// insert pass above has already added the replacement
				// when a diff swaps layers.
				if (cell != null && cell != root &&
					(model.getParent(cell) != root ||
					model.getChildCount(root) > 1))
				{
					disconnect(cell);
					model.remove(cell);
				}
			}

			// Safety net behind the edge-list based disconnect above: a
			// terminal object that detached without its edge list being
			// consulted (crossing patches under loss and reorder can
			// re-materialize an edge while its terminal still lives and
			// remove the terminal through another window) leaves a
			// dangling object reference that diffs and clones cannot
			// represent, permanently diverging the model copies. After
			// the removes, any edge whose terminal is no longer the
			// model's object for that id is disconnected.
			var sanitizeTerminals = mxUtils.bind(this, function(cell)
			{
				if (cell.isEdge())
				{
					var src = cell.getTerminal(true);
					var trg = cell.getTerminal(false);

					// Exact path, see the remove pass above
					if (src != null && model.getCell(src.getId()) != src)
					{
						model.setTerminal(cell, null, true);
					}

					if (trg != null && model.getCell(trg.getId()) != trg)
					{
						model.setTerminal(cell, null, false);
					}
				}

				var childCount = model.getChildCount(cell);

				for (var j = 0; j < childCount; j++)
				{
					sanitizeTerminals(model.getChildAt(cell, j));
				}
			});

			sanitizeTerminals(model.root);
		}
		
		// Updates cell states and terminals
		if (cellUpdate != null)
		{
			var res = (resolver != null && resolver.cells != null) ? 
				resolver.cells[EditorUi.DIFF_UPDATE] : null;
			
			for (var id in cellUpdate)
			{
				var cell = model.getCell(id);

				if (cell != null)
				{
					this.patchCell(model, cell,
						cellUpdate[id],
						(res != null) ? res[id] : null);
				}
				else
				{
					EditorUi.debug('EditorUi.patchPage: Updated cell not found',
						id, 'diff', [cellUpdate[id]]);
				}
			}
		}

		// Updates terminals for inserted cells
		if (pageCellInserts != null)
		{
			for (var i = 0; i < pageCellInserts.length; i++)
			{
				var cellDiff = pageCellInserts[i];

				if (cellDiff == null || typeof cellDiff != 'object')
				{
					continue;
				}

				var cell = model.getCell(cellDiff.id);

				// A vetoed cell keeps its LOCAL content: its own copy is
				// fresher than this entry (edits flushed after the
				// incoming save was computed). The content merge honors
				// that in patchCellRecursive, so re-applying the entry's
				// terminals here would reinstate exactly the stale
				// connection the veto exists to keep out.
				if (cell != null && !ignoredInserts[cellDiff.id] &&
					(this.realtimeMergeVeto == null ||
					this.realtimeMergeVeto[cellDiff.id] == null))
				{
					model.setTerminal(cell, model.getCell(cellDiff.source), true);
					model.setTerminal(cell, model.getCell(cellDiff.target), false);
				}
			}
		}

		// Delayed update of edge parents
		model.updateEdgeParent = prev;
		
		if (updateEdgeParents && pendingUpdates.length > 0)
		{
			for (var i = 0; i < pendingUpdates.length; i++)
			{
				if (model.contains(pendingUpdates[i]))
				{
					model.updateEdgeParent(pendingUpdates[i]);
				}
			}
		}
	}
	finally
	{
		model.endUpdate();
	}
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchCellRecursive = function(page, model, cell, parentLookup, diff, reinserted, update)
{
	if (cell != null)
	{
		var temp = parentLookup[cell.getId()];
		var inserted = (temp != null && temp.inserted != null) ?
			temp.inserted : Object.create(null);
		var moved = (temp != null && temp.moved != null) ?
			temp.moved : Object.create(null);
		var index = 0;

		// The normalized update map comes from patchPage (see there);
		// computed here only for callers that do not pass it
		if (update === undefined)
		{
			update = EditorUi.patchMap(diff[EditorUi.DIFF_UPDATE]);
		}

		// Canonical order rebuild from the previous chains: every child
		// has exactly one anchor - the explicit previous reference from
		// the patch, or implicitly its current local predecessor (whose
		// adjacency an exact diff guarantees to be unchanged). The final
		// order is the deterministic walk of this anchor graph with a
		// fixed claimant order per anchor: insert entries in patch order,
		// then explicitly moved cells sorted by ID, then the implicit
		// follower. For an exact diff every anchor has one claimant and
		// the walk reproduces the diffed order; for patches applied to a
		// diverged base, competing claims are resolved deterministically
		// so all clients converge to the same order (the previous chain
		// walk was arrival-order-dependent and dropped competing claims
		// into map-order appends, diverging crossing reorders forever).
		var claimants = Object.create(null);
		var id = null;

		var addClaim = function(anchor, claim)
		{
			if (claimants[anchor] == null)
			{
				claimants[anchor] = [];
			}

			claimants[anchor].push(claim);
		};

		for (id in inserted)
		{
			for (var i = 0; i < inserted[id].length; i++)
			{
				addClaim(id, {id: inserted[id][i].id,
					entry: inserted[id][i]});
			}
		}

		for (id in moved)
		{
			var ids = moved[id].slice();
			ids.sort();

			for (var i = 0; i < ids.length; i++)
			{
				addClaim(id, {id: ids[i]});
			}
		}

		// Implicit anchors: existing children without an explicit
		// previous or parent in the patch follow their current local
		// predecessor. Cells with an insert entry (reinserted, see
		// patchPage) are placed via that entry instead
		var childCount = model.getChildCount(cell);
		var prev = '';

		for (var i = 0; i < childCount; i++)
		{
			var cellId = model.getChildAt(cell, i).getId();

			if ((reinserted == null || !reinserted[cellId]) &&
				(update == null || update[cellId] == null ||
				(update[cellId].previous == null &&
				update[cellId].parent == null)))
			{
				addClaim(prev, {id: cellId});
			}

			prev = cellId;
		}

		// Emits the claimant chains anchored at the given ID in
		// depth-first order (a claimant is followed by its own chain
		// before the next claimant of the same anchor)
		var emittedIds = Object.create(null);
		var order = [];

		var emitRun = function(anchor)
		{
			var stack = [];
			var list = claimants[anchor];

			if (list != null)
			{
				delete claimants[anchor];

				for (var i = list.length - 1; i >= 0; i--)
				{
					stack.push(list[i]);
				}
			}

			while (stack.length > 0)
			{
				var current = stack.pop();

				if (current.id == null || !emittedIds[current.id])
				{
					if (current.id != null)
					{
						emittedIds[current.id] = true;
					}

					order.push(current);
					var next = (current.id != null) ?
						claimants[current.id] : null;

					if (next != null)
					{
						delete claimants[current.id];

						for (var i = next.length - 1; i >= 0; i--)
						{
							stack.push(next[i]);
						}
					}
				}
			}
		};

		emitRun('');

		// Orphaned chains (the anchor vanished in the local model) are
		// appended in anchor ID order. Collected and sorted ONCE:
		// emitRun only ever removes anchors, never adds any, so an
		// anchor a previous run consumed leaves an empty stack and its
		// call is a no-op. Termination no longer rests on every pass
		// consuming an anchor, and the drain is linear instead of
		// rescanning the whole claimant map once per orphan.
		var orphans = [];

		for (id in claimants)
		{
			orphans.push(id);
		}

		orphans.sort();

		for (var oi = 0; oi < orphans.length; oi++)
		{
			emitRun(orphans[oi]);
		}

		var addCell = mxUtils.bind(this, function(child, insert)
		{
			var id = (child != null) ? child.getId() : '';

			if (id == null)
			{
				EditorUi.debug('EditorUi.patchCellRecursive: Inserting cell with null id',
					'cell', child);
			}

			// Ignores the insert if the cell is already in the model, or
			// merges it into the existing cell if reinserted is set: in
			// an exact diff an insert cannot collide, but a patch applied
			// to a diverged model can insert cells that exist as pending
			// local copies of the same cells, eg. a remote save of cells
			// that were adopted from this client (resolveCrossReferences),
			// and ignoring the insert would keep the stale local state
			if (child != null && insert)
			{
				var ex = model.getCell(id);

					if (ex != null && ex != child)
				{
					if (reinserted != null && ex != cell &&
						!model.isAncestor(ex, cell))
					{
						// realtimeMergeVeto lists cells whose local copy
						// is fresher than the insert entry (edits flushed
						// after the incoming save was computed): the cell
						// keeps its local content but still takes the
						// insert position below - the pre-scan already
						// removed it from the backbone, so skipping it
						// entirely would orphan it and its chains
						if (this.realtimeMergeVeto == null ||
							this.realtimeMergeVeto[id] == null)
						{
							// Patches the existing cell with the diff to the
							// insert entry state, like insertPage does for
							// colliding pages, and moves it to the position
							// of the insert below. The cell built from the
							// entry has no parent or terminal references so
							// those keys are not meaningful in the diff
							// (terminals are set from the entry in patchPage)
							var cellDiff = this.diffCell(ex, child);
							delete cellDiff.parent;
							delete cellDiff.source;
							delete cellDiff.target;
							this.patchCell(model, ex, cellDiff);
						}

						child = ex;
					}
					else
					{
						child = null;
					}
				}
			}

			if (child != null)
			{
				// Guards against ancestor-under-descendant moves from
				// crafted parent or previous references (includes the
				// self-reference as isAncestor(x, x) is true): the
				// model has no cycle check in add, so such a move
				// would corrupt it. The cell keeps its current parent
				// and only the crafted order entry is ignored.
				if (!model.isAncestor(child, cell))
				{
					if (model.getChildAt(cell, index) != child)
					{
						model.add(cell, child, index);
					}

					index++;
				}
				else
				{
					EditorUi.debug('EditorUi.patchCellRecursive: ' +
						'Ignoring cyclic move', 'cell', child);
				}

				this.patchCellRecursive(page, model,
					child, parentLookup, diff, reinserted, update);
			}
		});

		// Applies the canonical order: existing cells are moved to
		// their target index, inserted cells are created from their
		// entries (lazily, as before)
		for (var i = 0; i < order.length; i++)
		{
			if (order[i].entry != null)
			{
				addCell(this.getCellForJson(order[i].entry), true);
			}
			else
			{
				var child = model.getCell(order[i].id);

				if (child != null)
				{
					addCell(child, false);
				}
			}
		}
	}
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchCell = function(model, cell, diff, resolve)
{
	// Requires an object: `in` throws a TypeError on a primitive by
	// spec, and the entry comes from attacker-controlled patch JSON
	if (cell != null && diff != null && typeof diff == 'object')
	{
		// Last write wins for value except if label is empty
		if (resolve == null || (resolve.xmlValue == null &&
			(resolve.value == null || resolve.value == '')))
		{
			if ('value' in diff)
			{
				// A label is a primitive: user objects travel as
				// xmlValue and are parsed below. A plain object here
				// is malformed input, and everything downstream that
				// treats a non-string value as an XML node then calls
				// getAttribute on it and throws (adversarial-patch)
				if (diff.value == null || typeof diff.value != 'object')
				{
					model.setValue(cell, diff.value);
				}
			}
			else if (diff.xmlValue != null)
			{
				model.setValue(cell, mxUtils.parseXml(diff.xmlValue).documentElement);
			}
		}
		
		// Last write wins for style; a null entry removes the style
		// (diffCell emits style: null when the new cell has none -
		// ignoring it made style removals unpatchable and left a
		// rollback to a style-less state silently incomplete)
		// A style is a string, null removes it - anything else is
		// malformed input and throws out of the middle of the patch in
		// the first reader that splits it (mxStylesheet.getCellStyle)
		if ((resolve == null || resolve.style == null) && 'style' in diff &&
			(diff.style == null || typeof diff.style == 'string'))
		{
			model.setStyle(cell, diff.style);
		}

		if (diff.visible != null)
		{
			model.setVisible(cell, diff.visible == 1);
		}

		if (diff.collapsed != null)
		{
			model.setCollapsed(cell, diff.collapsed == 1);
		}

		if (diff.vertex != null)
		{
			// Changes vertex state in-place
			cell.vertex = diff.vertex == 1;
		}

		if (diff.edge != null)
		{
			// Changes edge state in-place
			cell.edge = diff.edge == 1;
		}
		
		if (diff.connectable != null)
		{
			// Changes connectable state in-place
			cell.connectable = diff.connectable == 1;
		}
		
		// A geometry travels as an XML string; anything else is
		// malformed input and the parser dereferences it as one
		if (typeof diff.geometry == 'string')
		{
			model.setGeometry(cell, this.codec.decode(mxUtils.parseXml(
				diff.geometry).documentElement));
		}
		
		// diffCell encodes a disconnect as an empty id; the point that
		// keeps the edge renderable rides along in the sender's
		// geometry (exact path, see patchPage)
		if (diff.source != null)
		{
			model.setTerminal(cell, model.getCell(diff.source), true);
		}

		if (diff.target != null)
		{
			model.setTerminal(cell, model.getCell(diff.target), false);
		}
		
		for (var key in diff)
		{
			if (this.isCustomCellProperty(key))
			{
				cell[key] = diff[key];
			}
		}
	}
};

/**
 * Returns the pages for the given XML string.
 */
EditorUi.prototype.getXmlForPages = function(pages)
{
	var node = this.getNodeForPages(pages);
	var result = null;

	if (node != null)
	{
		result = mxUtils.getXml(node);
	}

	return result;
};

/**
 * Returns the pages for the given XML string.
 */
EditorUi.prototype.getNodeForPages = function(pages)
{
	var result = null;

	if (this.fileNode != null && pages != null)
	{
		result = this.fileNode.cloneNode(false);

		for (var i = 0; i < pages.length; i++)
		{
			var enc = new mxCodec(mxUtils.createXmlDocument());
			var temp = enc.encode(new mxGraphModel(pages[i].root));
			this.editor.graph.saveViewState(pages[i].viewState, temp);
			var node = pages[i].node.cloneNode(false);
			node.appendChild(temp);
			result.appendChild(node);
		}
	}

	return result;
};

/**
 * Returns the pages for the given XML string.
 */
EditorUi.prototype.getPagesForXml = function(data, allowPartial)
{
	var doc = mxUtils.parseXml(data);

	return this.getPagesForNode(doc.documentElement, null, allowPartial);
};

/**
 * Returns the pages for the given node. If allowPartial is true,
 * pages that fail to decode (eg. corrupt base64 data) are included
 * as null entries so that the remaining pages are still available.
 */
EditorUi.prototype.getPagesForNode = function(node, nodeName, allowPartial)
{
	var tmp = this.editor.extractGraphModel(node, true, true);

	if (tmp != null)
	{
		node = tmp;
	}

	var diagrams = node.getElementsByTagName(nodeName || 'diagram');
	var pages = [];

	if (diagrams.length > 0)
	{
		for (var i = 0; i < diagrams.length; i++)
		{
			var page = new DiagramPage(diagrams[i]);

			try
			{
				this.updatePageRoot(page, true);
			}
			catch (e)
			{
				if (!allowPartial)
				{
					throw e;
				}

				page = null;
			}

			pages.push(page);
		}
	}
	else if (node.nodeName == 'mxGraphModel')
	{
		var page = new DiagramPage(node.ownerDocument.createElement('diagram'));
		page.setName(mxResources.get('pageWithNumber', [1]));
		page.node.appendChild(node.cloneNode(true));
		pages.push(page);
	}

	return pages;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.diffPages = function(oldPages, newPages, skipCells)
{
	var inserted = [];
	var removed = [];
	// Null prototypes: keyed by page ids from the document
	var result = Object.create(null);
	var lookup = Object.create(null);
	var diff = Object.create(null);
	var prev = null;

	if (oldPages != null && newPages != null)
	{
		for (var i = 0; i < newPages.length; i++)
		{
			if (newPages[i] != null)
			{
				lookup[newPages[i].getId()] = {page: newPages[i], prev: prev};
				prev = newPages[i];
			}
		}

		prev = null;

		for (var i = 0; i < oldPages.length; i++)
		{
			if (oldPages[i] == null)
			{
				continue;
			}

			var id = oldPages[i].getId();
			var newPage = lookup[id];
			
			if (newPage == null)
			{
				removed.push(id);
			}
			else
			{
				this.updatePageRoot(oldPages[i]);
				this.updatePageRoot(newPage.page);

				// Skips cell diffing for pages the caller guarantees to
				// be unchanged (dirty page tracking in the sync); page
				// order, name, view state and view box are still diffed
				var temp = (skipCells != null && skipCells[id]) ? null :
					this.diffCells(oldPages[i].root, newPage.page.root);
				var pageDiff = {};

				if (temp != null && !mxUtils.isEmptyObject(temp))
				{
					pageDiff.cells = temp;
				}
				
				var view = this.diffViewState(oldPages[i], newPage.page);
				
				if (!mxUtils.isEmptyObject(view))
				{
					pageDiff.view = view;
				}
				
				if (((newPage.prev != null) ? prev == null : prev != null) ||
					(prev != null && newPage.prev != null &&
					prev.getId() != newPage.prev.getId()))
				{
					pageDiff.previous = (newPage.prev != null) ? newPage.prev.getId() : '';
				}
				
				// FIXME: Check why names can be null in newer files
				// ignore in hash and do not diff null names for now
				if (newPage.page.getName() != null &&
					oldPages[i].getName() != newPage.page.getName())
				{
					pageDiff.name = newPage.page.getName();
				}

				// View box (initial view) is diffed like name: synced to
				// collaborators but kept out of the page hash (getHashValueForPages
				// never copies it onto the hashed diagram node). Empty string
				// signals removal on patch.
				var oldViewBox = oldPages[i].node.getAttribute('viewBox');
				var newViewBox = newPage.page.node.getAttribute('viewBox');

				if (newViewBox != oldViewBox)
				{
					pageDiff.viewBox = (newViewBox != null) ? newViewBox : '';
				}

				if (!mxUtils.isEmptyObject(pageDiff))
				{
					diff[id] = pageDiff;
				}
			}

			delete lookup[oldPages[i].getId()];
			prev = oldPages[i];
		}
		
		for (var id in lookup)
		{
			var newPage = lookup[id];
			inserted.push({id: newPage.page.getId(),
				data: this.getPageXmlForDiff(newPage.page),
				previous: (newPage.prev != null) ?
				newPage.prev.getId() : ''});
		}
		
		if (!mxUtils.isEmptyObject(diff))
		{
			result[EditorUi.DIFF_UPDATE] = diff;
		}
		
		if (removed.length > 0)
		{
			result[EditorUi.DIFF_REMOVE] = removed;
		}
		
		if (inserted.length > 0)
		{
			result[EditorUi.DIFF_INSERT] = inserted;
		}
	}

	return result;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.createCellLookup = function(cell, prev, lookup)
{
	// Null prototype: keyed by cell ids from the document
	lookup = (lookup != null) ? lookup : Object.create(null);

	if (cell.getId() == null)
	{
		EditorUi.debug('EditorUi.createCellLookup: Ignored inserted cell with no id', cell);
	}
	else
	{
		lookup[cell.getId()] = {cell: cell, prev: prev};
	}
	
	var childCount = cell.getChildCount();
	prev = null;
	
	for (var i = 0; i < childCount; i++)
	{
		var child = cell.getChildAt(i);
		this.createCellLookup(child, prev, lookup);
		prev = child;
	}
	
	return lookup;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.diffCellRecursive = function(cell, prev, lookup, diff, removed)
{
	diff = (diff != null) ? diff : {};
	var newCell = lookup[cell.getId()];
	delete lookup[cell.getId()];
	
	if (newCell == null)
	{
		if (cell.getId() == null)
		{
			EditorUi.debug('EditorUi.diffCellRecursive: Ignored removed cell with no id', cell);
		}
		else
		{
			removed.push(cell.getId());
		}
	}
	else
	{
		var temp = this.diffCell(cell, newCell.cell);
		
		if (temp.parent != null ||
			(((newCell.prev != null) ? prev == null : prev != null) ||
			(prev != null && newCell.prev != null &&
			prev.getId() != newCell.prev.getId())))
		{
			temp.previous = (newCell.prev != null) ? newCell.prev.getId() : '';
		}
		
		if (!mxUtils.isEmptyObject(temp))
		{
			if (cell.getId() == null)
			{
				EditorUi.debug('EditorUi.diffCellRecursive: Ignored changed cell with no id', cell, 'diff', temp);
			}
			else
			{
				diff[cell.getId()] = temp;
			}
		}
	}

	var childCount = cell.getChildCount();
	prev = null;
	
	for (var i = 0; i < childCount; i++)
	{
		var child = cell.getChildAt(i);
		this.diffCellRecursive(child, prev, lookup, diff, removed);
		prev = child;
	}
	
	return diff;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.diffCells = function(oldRoot, newRoot)
{
	var result = {};
	var inserted = [];
	var lookup = this.createCellLookup(newRoot);

	// Marks all cells as inserted if root is different
	if (newRoot.id == oldRoot.id)
	{
		var removed = [];
		var diff = this.diffCellRecursive(oldRoot, null, lookup, null, removed);

		if (!mxUtils.isEmptyObject(diff))
		{
			result[EditorUi.DIFF_UPDATE] = diff;
		}	

		if (removed.length > 0)
		{
			result[EditorUi.DIFF_REMOVE] = removed;
		}
	}
	else
	{
		EditorUi.debug('EditorUi.diffCells: Root changed', newRoot.id);
	}

	for (var id in lookup)
	{
		var newCell = lookup[id];
		inserted.push(this.getJsonForCell(newCell.cell, newCell.prev));
	}
	
	if (inserted.length > 0)
	{
		result[EditorUi.DIFF_INSERT] = inserted;
	}

	return result;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.diffViewState = function(oldPage, newPage)
{
	var source = oldPage.viewState;
	var target = newPage.viewState;
	var result = {};

	if (oldPage == this.currentPage)
	{
		source = this.editor.graph.getViewState();
	}
	
	if (newPage == this.currentPage)
	{
		target = this.editor.graph.getViewState();
	}

	// Creates default view state for null sides to ensure
	// diff/patch round-trip consistency with hash computation
	if (source == null)
	{
		source = this.editor.graph.createViewState(
			mxUtils.createXmlDocument().createElement('mxGraphModel'));
	}

	if (target == null)
	{
		target = this.editor.graph.createViewState(
			mxUtils.createXmlDocument().createElement('mxGraphModel'));
	}

	for (var key in this.viewStateProperties)
	{
		this.diffViewStateProperty(source, target, key, result);
	}

	return result;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.diffViewStateProperty = function(source, target, key, result)
{
	// LATER: Check if normalization is needed for
	// object attribute order to compare JSON
	var old = JSON.stringify(this.getViewStateProperty(source, key));
	var now = JSON.stringify(this.getViewStateProperty(target, key));
	
	if (old != now)
	{
		result[key] = now;
	}
};

/**
 * Ignores image data for background pages and normalizes extFonts.
 */
EditorUi.prototype.getViewStateProperty = function(viewState, key)
{
	var result = viewState[key];

	if (key == 'backgroundImage' && result != null &&
		result.originalSrc != null)
	{
		result = {originalSrc: result.originalSrc};
	}
	else if (key == 'extFonts' && result == null)
	{
		result = [];
	}

	return result;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.getCellForJson = function(json)
{
	// Typed exactly as on the update path (see patchCell): geometry and
	// xmlValue travel as XML STRINGS and a label is a primitive.
	// Anything else is malformed input, and parseXml dereferences it as
	// a string, which throws from the middle of the patch
	var geometry = (typeof json.geometry == 'string') ? this.codec.decode(
		mxUtils.parseXml(json.geometry).documentElement) : null;
	var value = (json.value == null || typeof json.value != 'object') ?
		json.value : null;

	if (typeof json.xmlValue == 'string')
	{
		value = mxUtils.parseXml(json.xmlValue).documentElement;
	}
	
	var cell = new mxCell(value, geometry,
		(typeof json.style == 'string') ? json.style : null);
	cell.connectable = json.connectable != 0;
	cell.collapsed = json.collapsed == 1;
	cell.visible = json.visible != 0;
	cell.vertex = json.vertex == 1;
	cell.edge = json.edge == 1;
	cell.id = json.id;
	
	for (var key in json)
	{
		if (this.isCustomCellProperty(key))
		{
			cell[key] = json[key];
		}
	}

	return cell;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.getJsonForCell = function(cell, previous)
{
	var result = {id: cell.getId()};
	
	if (cell.vertex)
	{
		result.vertex = 1;
	}

	if (cell.edge)
	{
		result.edge = 1;
	}

	if (!cell.connectable)
	{
		result.connectable = 0;
	}

	if (cell.parent != null)
	{
		result.parent = cell.parent.getId();
	}

	if (previous != null)
	{
		result.previous = previous.getId();
	}

	if (cell.source != null)
	{
		result.source = cell.source.getId();
	}

	if (cell.target != null)
	{
		result.target = cell.target.getId();
	}

	if (cell.style != null)
	{
		result.style = cell.style;
	}

	if (cell.geometry != null)
	{
		result.geometry = mxUtils.getXml(this.codec.encode(cell.geometry));
	}

	if (cell.collapsed)
	{
		result.collapsed = 1;
	}

	if (!cell.visible)
	{
		result.visible = 0;
	}

	if (cell.value != null)
	{
		if (typeof cell.value === 'object' && typeof cell.value.nodeType === 'number' &&
			typeof cell.value.nodeName === 'string' && typeof cell.value.getAttribute === 'function')
		{
			result.xmlValue = mxUtils.getXml(cell.value);
		}
		else
		{
			result.value = cell.value;
		}
	}
	
	for (var key in cell)
	{
		if (!this.cellProperties[key] &&
			typeof cell[key] !== 'function')
		{
			result[key] = cell[key];
		}
	}

	return result;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.diffCell = function(oldCell, newCell)
{
	var diff = {};

	if (oldCell.vertex != newCell.vertex)
	{
		diff.vertex = (newCell.vertex) ? 1 : 0;
	}
	
	if (oldCell.edge != newCell.edge)
	{
		diff.edge = (newCell.edge) ? 1 : 0;
	}

	if (oldCell.connectable != newCell.connectable)
	{
		diff.connectable = (newCell.connectable) ? 1 : 0;
	}
	
	if (((oldCell.parent != null) ? newCell.parent == null : newCell.parent != null) ||
		(oldCell.parent != null && newCell.parent != null &&
		oldCell.parent.getId() != newCell.parent.getId()))
	{
		diff.parent = (newCell.parent != null) ? newCell.parent.getId() : '';
	}
	
	if (((oldCell.source != null) ? newCell.source == null : newCell.source != null) ||
		(oldCell.source != null && newCell.source != null &&
		oldCell.source.getId() != newCell.source.getId()))
	{
		diff.source = (newCell.source != null) ? newCell.source.getId() : '';
	}
	
	if (((oldCell.target != null) ? newCell.target == null : newCell.target != null) ||
		(oldCell.target != null && newCell.target != null &&
		oldCell.target.getId() != newCell.target.getId()))
	{
		diff.target = (newCell.target != null) ? newCell.target.getId() : '';
	}
	
	function isNode(value)
	{
		return value != null && typeof value === 'object' && typeof value.nodeType === 'number' &&
			typeof value.nodeName === 'string' && typeof value.getAttribute === 'function';
	};
	
	if (isNode(oldCell.value) && isNode(newCell.value))
	{
		if (!oldCell.value.isEqualNode(newCell.value))
		{
			diff.xmlValue = mxUtils.getXml(newCell.value);
		}
	}
	else if (oldCell.value != newCell.value)
	{
		if (isNode(newCell.value))
		{
			diff.xmlValue = mxUtils.getXml(newCell.value);
		}
		else
		{
			diff.value = (newCell.value != null) ? newCell.value : null;
		}
	}
	
	if (oldCell.style != newCell.style)
	{
		// LATER: Split into keys and do fine-grained diff
		// Undefined is normalized to null as for value above, as cells decoded
		// from XML with no style attribute have an undefined style and
		// JSON.stringify drops undefined values, which would remove the entry
		// from the patch on the wire and leave the style removal unapplied in
		// the receiving client
		diff.style = (newCell.style != null) ? newCell.style : null;
	}
	
	if (oldCell.visible != newCell.visible)
	{
		diff.visible = (newCell.visible) ? 1 : 0;
	}
	
	if (oldCell.collapsed != newCell.collapsed)
	{
		diff.collapsed = (newCell.collapsed) ? 1 : 0;
	}

	// FIXME: Proto only needed because source.geometry has no constructor (wrong type?)
	if (!this.isObjectEqual(oldCell.geometry, newCell.geometry, new mxGeometry()))
	{
		var node = this.codec.encode(newCell.geometry);
		
		if (node != null)
		{
			diff.geometry = mxUtils.getXml(node);
		}
	}
	
	// Compares all keys from oldCell to newCell and uses null in the diff
	// to force the attribute to be removed in the receiving client
	for (var key in oldCell)
	{
		if (!this.cellProperties[key] && typeof oldCell[key] !== 'function' &&
			typeof newCell[key] !== 'function' && oldCell[key] != newCell[key])
		{
			diff[key] = (newCell[key] === undefined) ? null : newCell[key];
		}
	}
	
	// Compares the remaining keys in newCell with oldCell
	for (var key in newCell)
	{
		if (!(key in oldCell) &&
			!this.cellProperties[key] && typeof oldCell[key] !== 'function' &&
			typeof newCell[key] !== 'function' && oldCell[key] != newCell[key])
		{
			diff[key] = (newCell[key] === undefined) ? null : newCell[key];
		}
	}
	
	return diff;
};

/**
 * Creates a patch that inserts pages and cells that are modified or referenced
 * as parents or terminals in the given diff but have not been saved yet by the
 * remote collaborator. These pages and cells are "adopted" by the local user.
 */
EditorUi.prototype.resolveCrossReferences = function(ownDiff, theirDiff)
{
	var resolve = {};

	if (!mxUtils.isEmptyObject(theirDiff))
	{
		this.adoptTheirPages(ownDiff, theirDiff, resolve);
		this.adoptTheirCells(ownDiff, theirDiff, resolve);
	}

	EditorUi.debug('EditorUi.resolveCrossReferences', [this],
		'ownDiff', ownDiff, 'theirDiff', theirDiff,
		'resolve', resolve);

	return resolve;
};

/**
 * Computes and sends the local changes if the file was changed.
 */
EditorUi.prototype.adoptTheirPages = function(ownDiff, theirDiff, resolve)
{
	// Null prototype as the map is keyed by remote page IDs
	var theirInsertedPages = Object.create(null);

	var theirInserts = EditorUi.patchList(
		theirDiff[EditorUi.DIFF_INSERT]);

	if (theirInserts != null)
	{
		for (var i = 0; i < theirInserts.length; i++)
		{
			if (theirInserts[i] != null &&
				typeof theirInserts[i] == 'object')
			{
				theirInsertedPages[theirInserts[i].id] = theirInserts[i];
			}
		}
	}

	for (var id in ownDiff[EditorUi.DIFF_UPDATE])
	{
		if (theirInsertedPages[id] != null)
		{
			if (resolve[EditorUi.DIFF_INSERT] == null)
			{
				resolve[EditorUi.DIFF_INSERT] = [];
			}

			if (resolve[EditorUi.DIFF_UPDATE] == null)
			{
				resolve[EditorUi.DIFF_UPDATE] = Object.create(null);
			}

			// Adds changed page to own pages
			resolve[EditorUi.DIFF_INSERT].push(
				theirInsertedPages[id]);
			resolve[EditorUi.DIFF_UPDATE][id] =
				ownDiff[EditorUi.DIFF_UPDATE][id];
			delete ownDiff[EditorUi.DIFF_UPDATE][id];
		}
	}
};

/**
 * Computes and sends the local changes if the file was changed.
 */
EditorUi.prototype.adoptTheirCells = function(ownDiff, theirDiff, resolve)
{
	for (var id in ownDiff[EditorUi.DIFF_UPDATE])
	{
		var ownPageUpdate = ownDiff[EditorUi.DIFF_UPDATE][id];

		if (ownPageUpdate.cells != null)
		{
			this.adoptTheirCellsFromPage(ownPageUpdate, theirDiff, id, resolve);
		}
	}
};

/**
 * Computes and sends the local changes if the file was changed.
 */
EditorUi.prototype.adoptTheirCellsFromPage = function(ownPageUpdate, theirDiff, pageId, resolve)
{
	var theirPageUpdate = theirDiff[EditorUi.DIFF_UPDATE] != null ?
		theirDiff[EditorUi.DIFF_UPDATE][pageId] : null;

	if (theirPageUpdate != null && theirPageUpdate.cells != null &&
		theirPageUpdate.cells[EditorUi.DIFF_INSERT] != null)
	{
		var theirUpdatedCells = theirPageUpdate.cells[EditorUi.DIFF_UPDATE];

		// Null prototypes as the lookups are keyed by remote cell IDs
		var theirInsertedCells = Object.create(null);

		for (var i = 0; i < theirPageUpdate.cells[EditorUi.DIFF_INSERT].length; i++)
		{
			var entry = theirPageUpdate.cells[EditorUi.DIFF_INSERT][i];
			theirInsertedCells[entry.id] = entry;
		}

		var pageDiff = {};
		pageDiff.cells = {};
		pageDiff.cells[EditorUi.DIFF_INSERT] = [];
		pageDiff.cells[EditorUi.DIFF_UPDATE] = Object.create(null);

		// Blocks duplicate inserts, deleted below for result
		// Null prototype: keyed by cell ids from the document
		pageDiff.inserted = Object.create(null);

		this.resolveOwnInsertedCells(
			ownPageUpdate.cells[EditorUi.DIFF_INSERT],
			theirInsertedCells, pageDiff);
		this.resolveOwnUpdatedCells(
			ownPageUpdate.cells[EditorUi.DIFF_UPDATE],
			theirInsertedCells, theirUpdatedCells,
			pageDiff);
		
		if (resolve[EditorUi.DIFF_UPDATE] == null)
		{
			resolve[EditorUi.DIFF_UPDATE] = Object.create(null);
		}
		
		delete pageDiff.inserted;
		resolve[EditorUi.DIFF_UPDATE][pageId] = pageDiff;
	}
};

/**
 * Computes and sends the local changes if the file was changed.
 */
EditorUi.prototype.resolveOwnInsertedCells = function(ownInsertedCells, theirInsertedCells, pageDiff)
{
	if (ownInsertedCells != null)
	{
		for (var i = 0; i < ownInsertedCells.length; i++)
		{
			var cell = ownInsertedCells[i];

			if (cell != null)
			{
				// An insert below a missing parent was skipped when the
				// local patch first reached ownPages. It is still in the
				// residual insert diff, so resolve that cell WITH
				// its ancestors: adding only the parent leaves the local
				// child out of ownPages and therefore out of the next save.
				this.adoptParentCell((theirInsertedCells[cell.id] != null) ?
					cell.id : cell.parent, null, theirInsertedCells, pageDiff);
				this.adoptTerminalCell(cell.id, cell,
					theirInsertedCells, true, pageDiff);
				this.adoptTerminalCell(cell.id, cell,
					theirInsertedCells, false, pageDiff);
			}
		}
	}
};

/**
 * Computes and sends the local changes if the file was changed.
 */
EditorUi.prototype.resolveOwnUpdatedCells = function(ownUpdatedCells, theirInsertedCells, theirUpdatedCells, pageDiff)
{
	if (ownUpdatedCells != null)
	{
		for (var id in ownUpdatedCells)
		{
			// Adds changed cell to own cells
			var cell = theirInsertedCells[id];

			if (cell != null)
			{
				// Adds the cell with its unsaved ancestors and terminals
				// as inserts below a missing parent and terminals of
				// dangling references are dropped when the patch is
				// applied, ie. changing a child of an unsaved container
				// must adopt the container chain as well
				this.adoptParentCell(id, null,
					theirInsertedCells, pageDiff);
				this.adoptTerminalCell(id, cell,
					theirInsertedCells, true, pageDiff);
				this.adoptTerminalCell(id, cell,
					theirInsertedCells, false, pageDiff);

				// Own update wins over terminal references added above
				pageDiff.cells[EditorUi.DIFF_UPDATE][id] =
					ownUpdatedCells[id];
			}
			else if (theirUpdatedCells != null)
			{
				// Adds their referenced terminals
				// and parents to own cells
				var theirCell = theirUpdatedCells[id];
				
				if (theirCell != null)
				{
					this.adoptParentCell(id, theirCell,
						theirInsertedCells, pageDiff);
					this.adoptTerminalCell(id, theirCell,
						theirInsertedCells, true, pageDiff, id);
					this.adoptTerminalCell(id, theirCell,
						theirInsertedCells, false, pageDiff, id);
				}
			}
		}
	}
};

/**
 * Adds unsaved remote parents to the patch.
 */
EditorUi.prototype.adoptParentCell = function(cellId, cellDiff, theirInsertedCells, pageDiff)
{
	var cell = (cellId != null) ? theirInsertedCells[cellId] : null;

	if (cell != null)
	{
		if (pageDiff.inserted[cellId])
		{
			// Already adopted including its ancestors
			return;
		}

		// Marked before the recursion so that a malformed
		// parent cycle terminates
		pageDiff.inserted[cellId] = true;
	}

	var parentId = (cellDiff != null) ? cellDiff.parent :
		((cell != null) ? cell.parent : null);

	if (parentId != null)
	{
		this.adoptParentCell(parentId, null, theirInsertedCells, pageDiff);
	}

	if (cell != null)
	{
		// After the recursion so that ancestors precede the cell
		pageDiff.cells[EditorUi.DIFF_INSERT].push(cell);
	}
	else if (cellDiff != null)
	{
		if (pageDiff.cells[EditorUi.DIFF_UPDATE][cellId] == null)
		{
			pageDiff.cells[EditorUi.DIFF_UPDATE][cellId] = {};
		}

		pageDiff.cells[EditorUi.DIFF_UPDATE][cellId] = cellDiff;
	}
};

/**
 * Computes and sends the local changes if the file was changed.
 */
EditorUi.prototype.adoptTerminalCell = function(cellId, cell, theirInsertedCells, source, pageDiff)
{
	var terminalId = (source) ? cell.source : cell.target;
	var terminal = (terminalId != null) ?
		theirInsertedCells[terminalId] : null;

	if (terminal != null)
	{
		// Inserts the terminal and its unsaved ancestors
		this.adoptParentCell(terminalId, null,
			theirInsertedCells, pageDiff);

		if (pageDiff.cells[EditorUi.DIFF_UPDATE][cellId] == null)
		{
			pageDiff.cells[EditorUi.DIFF_UPDATE][cellId] = {};
		}

		pageDiff.cells[EditorUi.DIFF_UPDATE][cellId]
			[(source) ? 'source' : 'target'] = terminalId;
	}
};

/**
 *
 */
EditorUi.prototype.isObjectEqual = function(source, target, proto)
{
	if (source == null && target == null)
	{
		return true;
	}
	else if ((source != null) ? target == null : target != null)
	{
		return false;
	}
	else
	{
		var replacer = function(key, value)
		{
			return (proto == null || proto[key] != value) ? ((value === true) ? 1 : value) : undefined;
		};

		//console.log('eq', JSON.stringify(source, replacer), JSON.stringify(target, replacer));
		
		return JSON.stringify(source, replacer) == JSON.stringify(target, replacer);

	}
};
