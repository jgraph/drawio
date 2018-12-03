/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
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
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.viewStateWhitelist = ['background', 'backgroundImage', 'foldingEnabled',
	'pageScale', 'mathEnabled', 'shadowVisible', 'pageFormat'];

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchPages = function(pages, diff, markPages, shadow)
{
	var shadowLookup = {};
	var newPages = [];
	var inserted = {};
	var removed = {};
	var lookup = {};
	var moved = {};
	
  	if (shadow != null)
	{
		for (var i = 0; i < shadow.length; i++)
		{
			shadowLookup[shadow[i].getId()] = shadow[i];
		}
	}
	
	for (var i = 0; i < pages.length; i++)
	{
		lookup[pages[i].getId()] = pages[i];
	}
	
	if (diff[EditorUi.DIFF_REMOVE] != null)
	{
		for (var i = 0; i < diff[EditorUi.DIFF_REMOVE].length; i++)
		{
			removed[diff[EditorUi.DIFF_REMOVE][i]] = true;
		}
	}

	var newFirstPage = null;
	
	if (diff[EditorUi.DIFF_INSERT] != null)
	{
		for (var i = 0; i < diff[EditorUi.DIFF_INSERT].length; i++)
		{
			inserted[diff[EditorUi.DIFF_INSERT][i].previous] = diff[EditorUi.DIFF_INSERT][i];
		}
	}
	
	if (diff[EditorUi.DIFF_UPDATE] != null)
	{
		for (var id in diff[EditorUi.DIFF_UPDATE])
		{
			var pageDiff = diff[EditorUi.DIFF_UPDATE][id];
			
			if (pageDiff.previous != null)
			{
				moved[pageDiff.previous] = id;
			}
		}
	}
	
	var addPage = mxUtils.bind(this, function(page, pageDiff)
	{
		var id = (page != null) ? page.getId() : '';
		
		if (page != null)
		{
			newPages.push(page);
			
			if (pageDiff != null)
			{
				this.patchPage(page, pageDiff.cells, markPages,
					shadowLookup[page.getId()]);
				this.patchViewState(page, pageDiff.view);
			}
		}
		
		var mov = moved[id];
		
		if (mov != null)
		{
			delete moved[id];
			addPage(lookup[mov]);
		}
		
		var ins = inserted[id];
		
		if (ins != null)
		{
			var diagram = mxUtils.parseXml(ins.data).documentElement;
			var newPage = new DiagramPage(diagram);
			this.updatePageRoot(newPage);

			// Ignores insert if page already in UI
			var page = lookup[newPage.getId()]; 
			
			if (page == null)
			{
				addPage(newPage);
			}
			else
			{
				// FIXME: Update index if previous has changed
				page.root = newPage.root;

				if (this.currentPage == page)
				{
					this.editor.graph.model.setRoot(page.root);
				}
				else if (markPages)
				{
					page.needsUpdate = true;
				}
			}
		}
	});
	
	addPage();
	
	// compute correct page order
	var pageOrder = this.getPageOrder(diff[EditorUi.DIFF_UPDATE], diff[EditorUi.DIFF_INSERT], diff[EditorUi.DIFF_REMOVE], pages);

	// Phase 1: run page patches; all pages should be patched/inserted/deleted afterwards; order might be wrong in the end  
	for (var i = 0; i < pages.length; i++)
	{
		if (!removed[pages[i].getId()])
		{
			var pageDiff = (diff[EditorUi.DIFF_UPDATE] != null) ?
				diff[EditorUi.DIFF_UPDATE][pages[i].getId()] : null;
			
			if (pageDiff != null && pageDiff.name != null)
			{
				pages[i].setName(pageDiff.name);
			}
			
			if (pageDiff == null || pageDiff.previous == null)
			{
				addPage(pages[i], pageDiff);
			}
		}
	}

	// Always needs at least one page
	if (newPages.length == 0)
	{
		newPages.push(this.createPage());
	}
	
	// Phase 2: Make sure order of pages is correct
	if (urlParams['reorder-pages'] == '1')
	{
		newPages = this.reorderPages(pageOrder, newPages);
	}
	
	return newPages;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchViewState = function(page, diff)
{
	if (page.viewState != null && diff != null)
	{
		if (page == this.currentPage)
		{
			page.viewState = this.editor.graph.getViewState();
		}
		
		for (var key in diff)
		{
			page.viewState[key] = JSON.parse(diff[key]);
		}
		
		if (page == this.currentPage)
		{
			this.editor.graph.setViewState(page.viewState);
		}
	}
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchPage = function(page, diff, markPage, shadowPage)
{
	this.updatePageRoot(page);

	if (diff != null)
	{
		var model = (page == this.currentPage) ? this.editor.graph.model : new mxGraphModel(page.root);
		var shadowModel = (shadowPage != null) ? new mxGraphModel(shadowPage.root) : null;
		
		model.beginUpdate();
		try
		{
			if (diff[EditorUi.DIFF_INSERT] != null)
			{
				var previous = {};
				var lookup = {};
				var cells = [];
				
				var doLookup = mxUtils.bind(this, function(id)
				{
					if (id == null)
					{
						return null;
					}
					else
					{
						// Ignores insert if cell already in model
						var cell = model.getCell(id);
						
						if (cell != null)
						{
							// FIXME: Update index if previous has changed
							return cell;
						}
						else
						{
							var entry = lookup[id];
							
							if (entry != null)
							{
								return entry.cell;
							}
							
							return null;
						}
					}
				});
				
				var addCell = mxUtils.bind(this, function(cell, json)
				{
					if (json.parent == null)
					{
						model.setRoot(cell);
						page.root = cell;
					}
					else
					{
						var parent = doLookup(json.parent);
						
						if (parent != null)
						{
							if (json.previous == null)
							{
								model.add(parent, cell, 0);
							}
							else
							{
								var prev = doLookup(json.previous);
								var index = parent.getIndex(prev);
								
								if (index >= 0)
								{
									model.add(parent, cell, index + 1);
								}
							}
						}
					}
					
					var next = previous[cell.getId()];
					
					if (next != null)
					{
						var nextCell = lookup[next];
						
						if (nextCell != null)
						{
							addCell(nextCell.cell, nextCell.json);
						}
					}
				});
				
				for (var i = 0; i < diff[EditorUi.DIFF_INSERT].length; i++)
				{
					var cell = this.getCellForJson(diff[EditorUi.DIFF_INSERT][i]);
					lookup[cell.getId()] = {cell: cell, json: diff[EditorUi.DIFF_INSERT][i]};
					previous[diff[EditorUi.DIFF_INSERT][i].previous] = cell.getId();
					cells.push({cell: cell, json: diff[EditorUi.DIFF_INSERT][i]});
				}
				
				for (var i = 0; i < cells.length; i++)
				{
					addCell(cells[i].cell, cells[i].json);
				}
				
				for (var i = 0; i < cells.length; i++)
				{
					model.setTerminal(cells[i].cell, doLookup(cells[i].json.source), true);
					model.setTerminal(cells[i].cell, doLookup(cells[i].json.target), false);
				}
			}
	
			if (diff[EditorUi.DIFF_UPDATE] != null)
			{
				// reorder Ids to guarantee expected order of shapes
				var orderedIds = this.arrangeChanges(diff[EditorUi.DIFF_UPDATE]);
				
				for (var i = 0; i < orderedIds.length; i++)
				{
				  var id = orderedIds[i];
				  this.patchCell(model, diff[EditorUi.DIFF_UPDATE], id, shadowModel);
				}
			}

			if (diff[EditorUi.DIFF_REMOVE] != null)
			{
				for (var i = 0; i < diff[EditorUi.DIFF_REMOVE].length; i++)
				{
					var cell = model.getCell(diff[EditorUi.DIFF_REMOVE][i]);
					
					if (cell != null)
					{
						model.remove(cell);
					}
				}
			}
			
			if (markPage)
			{
				page.needsUpdate = true;
			}
		}
		finally
		{
			model.endUpdate();
		}
	}
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchCell = function(model, diff, id, shadowModel)
{
	var shadowCell = (shadowModel != null) ? shadowModel.getCell(id) : null;
	var cell = model.getCell(id);
	var json = diff[id];

	// TODO: Add helper function or check mxUtils.isNode
	function isNode(value)
	{
		return value != null && typeof value === 'object' && typeof value.nodeType === 'number' &&
			typeof value.nodeName === 'string' && typeof value.getAttribute === 'function';
	};
	
	function isLocalValueChanged()
	{
		if (shadowCell != null && shadowCell.value != null && cell.value != null)
		{
			if (isNode(cell.value) && isNode(shadowCell.value))
			{
				return !cell.value.isEqualNode(shadowCell.value);
			}
			else if (cell.value != shadowCell.value)
			{
				return cell.value != '';
			}
		}
		
		return false;
	};
	
	if (cell != null && json != null)
	{
		var codec = new mxCodec();
		
		// Last write wins for value and style
		if (json.value != null)
		{
			if (!isLocalValueChanged())
			{
				model.setValue(cell, json.value);
			}
		}
		else if (json.xmlValue != null)
		{
			if (!isLocalValueChanged())
			{
				model.setValue(cell, mxUtils.parseXml(json.xmlValue).documentElement);
			}
		}
		
		if (json.style != null && !(shadowCell != null && shadowCell.style != null &&
			cell.style != null && cell.style != shadowCell.style))
		{
			model.setStyle(cell, json.style);
		}

		if (json.visible != null)
		{
			model.setVisible(cell, json.visible == 1);
		}

		if (json.collapsed != null)
		{
			model.setCollapsed(cell, json.collapsed == 1);
		}

		if (json.connectable != null)
		{
			// Changes connectable state in-place
			cell.connectable = json.connectable == 1;
		}
		
		if (json.geometry != null)
		{
			model.setGeometry(cell, codec.decode(mxUtils.parseXml(json.geometry).documentElement));
		}
		
		if (json.source != null)
		{
			model.setTerminal(cell, model.getCell(json.source), true);
		}
		
		if (json.target != null)
		{
			model.setTerminal(cell, model.getCell(json.target), false);
		}
		
		if (json.parent != null)
		{
			var parent = model.getCell(json.parent);

			if (json.previous == '')
			{
				model.add(parent, cell, 0);
			}
			else
			{
				var prev = model.getCell(json.previous);
				var index = parent.getIndex(prev);
				
				if (index >= 0 || parent != cell.parent)
				{
					model.add(parent, cell, index + 1);
				}
			}
		}
		else if (json.previous != null)
		{
			var parent = cell.parent;

			if (json.previous == '')
			{
				model.add(parent, cell, 0);
			}
			else
			{
				var prev = model.getCell(json.previous);
				var index = parent.getIndex(prev);
				
				if (index >= 0 || parent != cell.parent)
				{
					model.add(parent, cell, index + 1);
				}
			}
		}
	}
};

/**
 * Gets a file node that is comparable with a remote file node
 * so that using isEqualNode returns true if the files can be
 * considered equal.
 */
EditorUi.prototype.getPagesForNode = function(node)
{
	var tmp = this.editor.extractGraphModel(node, true);
	
	if (tmp != null)
	{
		node = tmp;
	}

	var diagrams = node.getElementsByTagName('diagram');
	var pages = [];
	
	for (var i = 0; i < diagrams.length; i++)
	{
		var page = new DiagramPage(diagrams[i]);
		this.updatePageRoot(page);
		pages.push(page);
	}
	
	return pages;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.diffPages = function(oldPages, newPages)
{
	var lookup = {};
	var diff = {};
	var prev = null;
	
	for (var i = 0; i < newPages.length; i++)
	{
		lookup[newPages[i].getId()] = {'page': newPages[i], 'prev': prev};
		prev = newPages[i];
	}

	var removed = [];
	var inserted = [];
	var diff = {};
	prev = null;
	
	for (var i = 0; i < oldPages.length; i++)
	{
		var id = oldPages[i].getId();
		var newPage = lookup[id];
		
		if (newPage == null)
		{
			removed.push(id);
		}
		else
		{
			var pageDiff = {};
			var temp = this.diffPage(oldPages[i], newPage.page);
			
			if (Object.keys(temp).length > 0)
			{
				pageDiff['cells'] = temp;
			}
			
			var view = this.diffViewState(oldPages[i], newPage.page);
			
			if (Object.keys(view).length > 0)
			{
				pageDiff['view'] = view;
			}
			
			if (((newPage.prev != null) ? prev == null : prev != null) ||
				(prev != null && newPage.prev != null &&
				prev.getId() != newPage.prev.getId()))
			{
				pageDiff['previous'] = (newPage.prev != null) ? newPage.prev.getId() : '';
			}
			
			if (oldPages[i].getName() != newPage.page.getName())
			{
				pageDiff['name'] = newPage.page.getName();
			}
			
			if (Object.keys(pageDiff).length > 0)
			{
				diff[id] = pageDiff;
			}
		}

		delete lookup[oldPages[i].getId()];
		prev = oldPages[i];
	}
	
	var graph = this.editor.graph;
	
	for (var id in lookup)
	{
		var newPage = lookup[id];
		inserted.push({data: mxUtils.getXml(newPage.page.node),
			previous: (newPage.prev != null) ?
			newPage.prev.getId() : ''});
	}
	
	var result = {};
	
	if (removed.length > 0)
	{
		result[EditorUi.DIFF_REMOVE] = removed;
	}
	
	if (inserted.length > 0)
	{
		result[EditorUi.DIFF_INSERT] = inserted;
	}
	
	if (Object.keys(diff).length > 0)
	{
		result[EditorUi.DIFF_UPDATE] = diff;
	}
	
	return result;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.createCellLookup = function(cell, prev, lookup)
{
	lookup = (lookup != null) ? lookup : {};
	lookup[cell.getId()] = {'cell': cell, 'prev': prev};
	
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
		removed.push(cell.getId());
	}
	else
	{
		var temp = this.diffCell(cell, newCell.cell);
		
		if (temp.parent != null ||
			(((newCell.prev != null) ? prev == null : prev != null) ||
			(prev != null && newCell.prev != null &&
			prev.getId() != newCell.prev.getId())))
		{
			temp['previous'] = (newCell.prev != null) ? newCell.prev.getId() : '';
		}
		
		if (Object.keys(temp).length > 0)
		{
			diff[cell.getId()] = temp;
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
EditorUi.prototype.diffPage = function(oldPage, newPage)
{
	this.updatePageRoot(oldPage);
	this.updatePageRoot(newPage);

	var removed = [];
	var inserted = [];
	var lookup = this.createCellLookup(newPage.root);

	var diff = this.diffCellRecursive(oldPage.root, null, lookup, diff, removed);
	var codec = new mxCodec();

	for (var id in lookup)
	{
		var newCell = lookup[id];
		inserted.push(this.getJsonForCell(newCell.cell, newCell.prev));
	}
	
	var result = {};
	
	if (removed.length > 0)
	{
		result[EditorUi.DIFF_REMOVE] = removed;
	}
	
	if (inserted.length > 0)
	{
		result[EditorUi.DIFF_INSERT] = inserted;
	}
	
	if (Object.keys(diff).length > 0)
	{
		result[EditorUi.DIFF_UPDATE] = diff;
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
	
	if (newPage == this.currentPage)
	{
		target = this.editor.graph.getViewState();
	}
	
	var result = {};
	
	if (source != null && target != null)
	{
		for (var i = 0; i < this.viewStateWhitelist.length; i++)
		{
			var key = this.viewStateWhitelist[i];
			
			// TODO: Check if normalization is needed for
			// attribute order to compare JSON output
			var old = JSON.stringify(source[key]);
			var now = JSON.stringify(target[key]);
			
			if (now != old)
			{
				result[key] = now;
			}
		}
	}
	
	return result;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.getCellForJson = function(json)
{
	var codec = new mxCodec();
	var geometry = (json.geometry != null) ? codec.decode(mxUtils.parseXml(json.geometry).documentElement) : null;
	var value = json.value;
	
	if (json.xmlValue != null)
	{
		value = mxUtils.parseXml(json.xmlValue).documentElement;
	}
	
	var cell = new mxCell(value, geometry, json.style);
	cell.connectable = json.connectable != 0;
	cell.collapsed = json.collapsed == 1;
	cell.visible = json.visible != 0;
	cell.vertex = json.vertex;
	cell.edge = json.edge;
	cell.id = json.id;
	
	return cell;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.getJsonForCell = function(cell, previous)
{
	var result = {id: cell.getId(), vertex: (cell.vertex) ? 1 : 0,
		edge: (cell.edge) ? 1 : 0};
	var codec = new mxCodec();

	if (previous != null)
	{
		result['previous'] = previous.getId();
	}

	if (cell.parent != null)
	{
		result['parent'] = cell.parent.getId();
	}

	if (cell.source != null)
	{
		result['source'] = cell.source.getId();
	}

	if (cell.target != null)
	{
		result['target'] = cell.target.getId();
	}

	if (cell.style != null)
	{
		result['style'] = cell.style;
	}

	if (cell.geometry != null)
	{
		result['geometry'] = mxUtils.getXml(codec.encode(cell.geometry));
	}

	if (!cell.connectable)
	{
		result['connectable'] = 0;
	}

	if (cell.collapsed)
	{
		result['collapsed'] = 1;
	}

	if (!cell.visible)
	{
		result['visible'] = 0;
	}

	if (cell.value != null)
	{
		if (typeof cell.value === 'object' && typeof cell.value.nodeType === 'number' &&
			typeof cell.value.nodeName === 'string' && typeof cell.value.getAttribute === 'function')
		{
			result['xmlValue'] = mxUtils.getXml(cell.value);
		}
		else
		{
			result['value'] = cell.value;
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

	if (oldCell.parent != null && newCell.parent != null &&
		oldCell.parent.getId() != newCell.parent.getId())
	{
		diff['parent'] = newCell.parent.getId();
	}
	
	if (((oldCell.source != null) ? newCell.source == null : newCell.source != null) ||
		(oldCell.source != null && newCell.source != null &&
		oldCell.source.getId() != newCell.source.getId()))
	{
		diff['source'] = (newCell.source != null) ? newCell.source.getId() : '';
	}
	
	if (((oldCell.target != null) ? newCell.target == null : newCell.target != null) ||
		(oldCell.target != null && newCell.target != null &&
		oldCell.target.getId() != newCell.target.getId()))
	{
		diff['target'] = (newCell.target != null) ? newCell.target.getId() : '';
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
			diff['xmlValue'] = mxUtils.getXml(newCell.value);
		}
	}
	else if (oldCell.value != newCell.value)
	{
		if (isNode(newCell.value))
		{
			diff['xmlValue'] = mxUtils.getXml(newCell.value);
		}
		else
		{
			diff['value'] = (newCell.value != null) ? newCell.value : '';
		}
	}
	
	if (oldCell.style != newCell.style)
	{
		// TODO: Split into keys and do fine-grained diff
		diff['style'] = newCell.style;
	}
	
	if (oldCell.visible != newCell.visible)
	{
		diff['visible'] = (newCell.visible) ? 1 : 0;
	}
	
	if (oldCell.collapsed != newCell.collapsed)
	{
		diff['collapsed'] = (newCell.collapsed) ? 1 : 0;
	}

	if (oldCell.connectable != newCell.connectable)
	{
		diff['connectable'] = (newCell.connectable) ? 1 : 0;
	}
	
	var codec = new mxCodec();
	
	// FIXME: Proto only needed because source.geometry has no constructor (wrong type?)
	if (!this.isObjectEqual(oldCell.geometry, newCell.geometry, new mxGeometry()))
	{
		diff['geometry'] = mxUtils.getXml(codec.encode(newCell.geometry));
	}
	
	return diff;
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

/**
 * Arranges diff changes so that they are executed preserving correct order of nodes
 */
EditorUi.prototype.arrangeChanges = function(changes)
{
	var chains = {};
	var nodes = {};
	var processedNodes = {};
	var toExplore = [];
	
	// first, put all changed nodes as heads of their own chains
	for (var id in changes)
	{
		var chainNode = {id: id, item: changes[id], previous: null, next: null};
		chains[id] = chainNode;
		nodes[id] = chainNode;
		toExplore.push(id);
	}
	
	// now go through all chain heads and link them to their previous nodes
	for (var i = 0; i < toExplore.length; i++)
	{
		var id = toExplore[i];
		var node = chains[id];
		var item = node.item;
		
		// does the node have a previous item its position depends on?
		if (item.previous != '')
		{
			// link node and its previous together in a single chain
			var previousNode = nodes[item.previous];
			if (previousNode != null)
			{
			    previousNode.next = node;
				node.previous = previousNode;
				// delete node as a chain head
                delete chains[id];
			}
		}
	}
	
	// now all nodes should be in their own chains with correct precedence; get order
	result = [];
	
	// scan all chains starting from head
	for (var headId in chains)
	{
		result.push(headId);
		var node = chains[headId];
		while (node.next != null)
		{
			node = node.next;
			result.push(node.id);
		}
	}
	
	return result;
};

/**
 * Returns a correct page order after applying diffs
 */
EditorUi.prototype.getPageOrder = function(changes, inserts, removes, pages)
{
	var previousNodes = {};
	var nextNodes = {};
	var initialPositions = {};
	var firstNode = pages[0].getId();
	var lastNode = pages[pages.length - 1].getId();
	// setup previous/next relationship from initial pages
	var numberOfPages = pages.length;
	for (var i = 0; i < numberOfPages; i++)
	{
		var page = pages[i];
		if (i > 0)
		{
		    previousNodes[page.getId()] = pages[i - 1].getId();
		}
		else
		{
			previousNodes[page.getId()] = null;
		}
		if (i < numberOfPages - 1)
		{
			nextNodes[page.getId()] = pages[i + 1].getId();
		}
		else
		{
			nextNodes[page.getId()] = null;
		}
		initialPositions[i] = page.getId();
	}
	
	// process diff
	
	// first, apply removals
	if (removes != null)
	{
		for (var id in removes)
		{
			var previousId = previousNodes[id];
			var nextId = nextNodes[id];
			if (previousId != null && previousId != '')
			{
				nextNodes[nextId] = previousId;
			}
			if (nextId != null)
			{
				previousNodes[nextId] = previousId;
			}
			if (previous == '')
			{
				firstNode = id;
			}
			if (id == lastNode)
			{
				lastNode = previousNodes[id];
			}
			delete previousNodes[id];
			delete nextNodes[id];
			numberOfPages--;
		}
	}
	
	// second, apply inserts
	if (inserts != null)
	{
		for (var k in inserts)
		{
			var node = inserts[k]; // please consider adding ID to insert, otherwise the whole diagram XML has to be parsed
			var diagram = mxUtils.parseXml(node.data).documentElement;
			var id = diagram.attributes.id.nodeValue;
			var previous = node.previous;
			previousNodes[id] = previous;
			if (previous != '')
			{
				// set next node of previous node to new node
				nextNodes[previous] = id;
			}
			else
			{
				firstNode = id;
			}
			if (lastNode == previous)
			{
				lastNode = id;
			}
			numberOfPages++;
		}
	}
	
	// at last, apply diff changes
	if (changes != null)
	{
		for (var id in changes)
		{
			var node = changes[id];
			var previous = node.previous;
			previousNodes[id] = previous;
			if (previous != '')
			{
				nextNodes[previous] = id;
			}
			else
			{
				firstNode = id;
			}
		}
	}
	// get new positions
	var finalPositions = {};
	var id = firstNode;
	var k = 0;
	while (k < numberOfPages)
	{
		finalPositions[k] = id;
		id = nextNodes[id];
		k++;
	}
	// find position differences
	var order = [];
	var differences = [];
	for (var i = 0; i < numberOfPages; i++)
	{
		if (finalPositions[i] != initialPositions[i])
		{
			differences.push(finalPositions[i]);
		}
		order.push(finalPositions[i]);
	}
	return order;
};

/**
 * Reorders pages to a given order (which is just a list of IDs in correct order sequence)
 */
EditorUi.prototype.reorderPages = function(order, pages)
{
	var getPageById = function(id, pages)
	{
		for (var i = 0; i < pages.length; i++)
		{
			if (pages[i].getId() == id)
			{
				return pages[i];
			}
		}
		return null;
	}

	result = [];
	for (var i = 0; i < order.length; i++)
	{
		var page = getPageById(order[i], pages);
		if (page.getId() != pages[i].getId())
		{
			console.log("page " + i + " changed to " + page.getId() + " from " + pages[i].getId());
		}
		result.push(page);
	}
	return result;
};

