/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchPages = function(pages, diff)
{
	var newPages = [];
	var inserted = {};
	var removed = {};
	var lookup = {};
	var moved = {};
	
	for (var i = 0; i < pages.length; i++)
	{
		lookup[pages[i].getId()] = pages[i];
	}
	
	if (diff.removed != null)
	{
		for (var i = 0; i < diff.removed.length; i++)
		{
			removed[diff.removed[i]] = true;
		}
	}

	var newFirstPage = null;
	
	if (diff.inserted != null)
	{
		for (var i = 0; i < diff.inserted.length; i++)
		{
			inserted[diff.inserted[i].previous] = diff.inserted[i];
		}
	}
	
	if (diff.changed != null)
	{
		for (var id in diff.changed)
		{
			var pageDiff = diff.changed[id];
			
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
				this.patchPage(page, pageDiff.cells);
			}
		}
		
		var mov = moved[id];
		
		if (mov != null)
		{
			addPage(lookup[mov]);
		}
		
		var ins = inserted[id];
		
		if (ins != null)
		{
			var diagram = mxUtils.parseXml(ins.xml).documentElement;
			var doc = mxUtils.parseXml(this.editor.graph.decompress(mxUtils.getTextContent(diagram)));
			var codec = new mxCodec(doc);
			var model = codec.decode(doc.documentElement);

			var newPage = new DiagramPage(diagram);
			newPage.root = model.root;
			
			addPage(newPage);
		}
	});
	
	addPage();
	
	for (var i = 0; i < pages.length; i++)
	{
		if (!removed[pages[i].getId()])
		{
			var pageDiff = (diff.changed != null) ? diff.changed[pages[i].getId()] : null;
			
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
	
	return newPages;
};

/**
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchPage = function(page, diff)
{
	if (diff != null)
	{
		var model = (page == this.currentPage) ? this.editor.graph.model : new mxGraphModel(page.root);
		
		model.beginUpdate();
		try
		{
			if (diff.inserted != null)
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
						var entry = lookup[id];
						
						if (entry != null)
						{
							return entry.cell;
						}
						else
						{
							return model.getCell(id);
						}
					}
				});
				
				var addCell = mxUtils.bind(this, function(cell, json)
				{
					var parent = doLookup(json.parent);
					
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
						else
						{
							console.error('previous cell', json.previous, 'was not found');
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
				
				for (var i = 0; i < diff.inserted.length; i++)
				{
					var cell = this.getCellForJson(diff.inserted[i]);
					lookup[cell.getId()] = {cell: cell, json: diff.inserted[i]};
					previous[diff.inserted[i].previous] = cell.getId();
					cells.push({cell: cell, json: diff.inserted[i]});
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
	
			if (diff.changed != null)
			{
				for (var id in diff.changed)
				{
					this.patchCell(model, diff.changed, id);
				}
			}

			if (diff.removed != null)
			{
				for (var i = 0; i < diff.removed.length; i++)
				{
					var cell = model.getCell(diff.removed[i]);
					
					if (cell != null)
					{
						model.remove(cell);
					}
					else
					{
						console.error('removed cell', diff.removed[i], 'was not found');
					}
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
 * Removes all labels, user objects and styles from the given node in-place.
 */
EditorUi.prototype.patchCell = function(model, diff, id)
{
	var cell = model.getCell(id);
	var json = diff[id];
	
	if (cell != null && json != null)
	{
		var codec = new mxCodec();
		
		if (json.value != null)
		{
			model.setValue(cell, json.value);
		}
		else if (json.xmlValue != null)
		{
			model.setValue(cell, mxUtils.parseXml(json.xmlValue).documentElement);
		}
		
		if (json.style != null)
		{
			model.setStyle(cell, json.style);
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
				
				if (index >= 0)
				{
					model.add(parent, cell, index + 1);
				}
				else
				{
					console.error('previous cell', json.previous, 'was not found');
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
				
				if (index >= 0)
				{
					model.add(parent, cell, index + 1);
				}
				else
				{
					console.error('previous cell', json.previous, 'was not found');
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
	var diagrams = node.getElementsByTagName('diagram');
	var pages = [];
	
	for (var i = 0; i < diagrams.length; i++)
	{
		var doc = mxUtils.parseXml(this.editor.graph.decompress(mxUtils.getTextContent(diagrams[i])));
		var codec = new mxCodec(doc);
		var model = codec.decode(doc.documentElement);

		var page = new DiagramPage(diagrams[i]);
		page.root = model.root;
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
			
			if (((newPage.prev != null) ? prev == null : prev != null) ||
				(prev != null && newPage.prev != null &&
				prev.id != newPage.prev.id))
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
	
	for (var id in lookup)
	{
		var newPage = lookup[id];
		inserted.push({'xml': mxUtils.getXml(newPage.page.node),
			'previous': (newPage.prev != null) ?
			newPage.prev.getId() : ''});
	}
	
	var result = {};
	
	if (removed.length > 0)
	{
		result['removed'] = removed;
	}
	
	if (inserted.length > 0)
	{
		result['inserted'] = inserted;
	}
	
	if (Object.keys(diff).length > 0)
	{
		result['changed'] = diff;
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
			prev.id != newCell.prev.id)))
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
		result['removed'] = removed;
	}
	
	if (inserted.length > 0)
	{
		result['inserted'] = inserted;
	}
	
	if (Object.keys(diff).length > 0)
	{
		result['changed'] = diff;
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
		oldCell.parent.id != newCell.parent.id)
	{
		diff['parent'] = newCell.parent.id;
	}
	
	if (((oldCell.source != null) ? newCell.source == null : newCell.source != null) ||
		(oldCell.source != null && newCell.source != null &&
		oldCell.source.id != newCell.source.id))
	{
		diff['source'] = (newCell.source != null) ? newCell.source.id : '';
	}
	
	if (((oldCell.target != null) ? newCell.target == null : newCell.target != null) ||
		(oldCell.target != null && newCell.target != null &&
		oldCell.target.id != newCell.target.id))
	{
		diff['target'] = (newCell.target != null) ? newCell.target.id : '';
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
		diff['style'] = newCell.style;
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
