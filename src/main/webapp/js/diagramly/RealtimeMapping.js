/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
/**
 * Creates an object that maps all changes from the given diagramMap to the
 * given graph model.
 */
function RealtimeMapping(driveRealtime, diagramMap, page)
{
	this.driveRealtime = driveRealtime;
	this.diagramMap = diagramMap;
	this.page = page;
	
	this.graphModel = new mxGraphModel();
	
	if (page.root != null)
	{
		this.graphModel.setRoot(page.root);
	}
	
	this.ui = this.driveRealtime.ui;
	this.root = this.driveRealtime.root;
	this.graph = this.driveRealtime.graph;
	this.rtModel = this.driveRealtime.rtModel;
};

/**
 * Specifies the key of the root element in the model. Default is root.
 */
RealtimeMapping.prototype.driveRealtime = null;

/**
 * Specifies the key of the root element in the model. Default is root.
 */
RealtimeMapping.prototype.diagramMap = null;

/**
 * Specifies the key of the root element in the model. Default is root.
 */
RealtimeMapping.prototype.page = null;

/**
 * Specifies the key of the root element in the model. Default is root.
 */
RealtimeMapping.prototype.graphModel = null;

/**
 * Specifies the key of the root element in the model. Default is root.
 */
RealtimeMapping.prototype.needsUpdate = true;

/**
 * Specifies the key of the root element in the model. Default is root.
 */
RealtimeMapping.prototype.selectionMap = null;

/**
 * Synchronizes the collaboration model and the graph model and installs
 * the required listeners to keep them in sync.
 */
RealtimeMapping.prototype.init = function()
{
	this.diagramMap.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, mxUtils.bind(this, function(evt)
	{
		if (!this.driveRealtime.isLocalEvent(evt))
		{
			if (evt.property == this.driveRealtime.rootKey && evt.newValue != null)
			{
				this.beginUpdate();
				this.initGraph();
				this.needsUpdate = true;
			}
			else if (evt.property == 'name' && evt.newValue != null)
			{
				this.driveRealtime.ignoreChange = true;
				this.graph.model.execute(new RenamePage(this.ui, this.page, evt.newValue));
				this.driveRealtime.ignoreChange = false;
			}
			else if (evt.newValue != null)
			{
				if (evt.property == 'pageFormat')
				{
					this.realtimePageFormatChanged(evt.newValue);
				}
				else if (evt.property == 'pageScale')
				{
					this.realtimePageScaleChanged(evt.newValue);
				}
				else if (evt.property == 'backgroundColor')
				{
					this.realtimeBackgroundColorChanged(evt.newValue);
				}
				else if (evt.property == 'shadowVisible')
				{
					this.realtimeShadowVisibleChanged(evt.newValue);
				}
				else if (evt.property == 'foldingEnabled')
				{
					this.realtimeFoldingEnabledChanged(evt.newValue);
				}
				else if (evt.property == 'pageVisible')
				{
					this.realtimePageVisibleChanged(evt.newValue);
				}
				else if (evt.property == 'backgroundImage')
				{
					this.realtimeBackgroundImageChanged(evt.newValue);
				}
				else if (evt.property == 'mathEnabled')
				{
					this.realtimeMathEnabledChanged(evt.newValue);
				}
			}
			
			// Marks the mapping dirty regardless of active state
			if (evt.newValue != null && (evt.property == 'pageFormat' ||
				evt.property == 'pageScale' || evt.property == 'shadowVisible' ||
				evt.property == 'backgroundColor' || evt.property == 'foldingEnabled' ||
				evt.property == 'backgroundImage' || evt.property == 'mathEnabled' ||
				evt.property == 'pageVisible'))
			{
				this.needsUpdate = true;
			}
		}
	}));

	if (this.diagramMap.has(this.driveRealtime.rootKey))
	{
		this.initGraph();
	}
	else
	{
		this.initRealtime();
	}
	
	this.page.root = this.graphModel.getRoot();
	this.selectionMap = this.diagramMap.get('select');
	
	if (this.selectionMap == null)
	{
		this.initializeSelection();
	}

	// Resets selection state to ensure change event
	if (this.driveRealtime.file.isEditable())
	{
		this.selectionMap.set(this.driveRealtime.userId, '');
	}
	
	this.installRemoteSelectionListener();
};

/**
 * 
 */
RealtimeMapping.prototype.initializeSelection = function() 
{
	this.selectionMap = this.rtModel.createMap();
	
	if (this.driveRealtime.file.isEditable())
	{
		this.diagramMap.set('select', this.selectionMap);
	}
	//this.log('Selection list created');
};

/**
 * Adds a listener for changes to the RT selection map to highlight
 * remote selection
 */
RealtimeMapping.prototype.installRemoteSelectionListener = function()
{
	this.selectionMap.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, mxUtils.bind(this, function(evt)
	{
		if (!this.driveRealtime.isLocalEvent(evt) && evt.newValue != null && (this.ui.currentPage == null ||
			this.ui.currentPage == this.page))
		{
			var cellIds = evt.newValue.split(',');
			
			for (var i = 0; i < cellIds.length; i++)
			{
				this.driveRealtime.highlight(this.driveRealtime.model.getCell(cellIds[i]), evt.sessionId);
			}
		}
	}));
};

/**
 * Returns true if this diagram is being displayed.
 */
RealtimeMapping.prototype.isActive = function()
{
	return this.ui.currentPage == null || this.ui.currentPage.mapping == this;
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.getGraphModel = function()
{
	return (this.isActive()) ? this.driveRealtime.model : this.graphModel;
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.initGraph = function()
{
	if (this.isActive())
	{
		this.activate(true);
		mxClient.NO_FO = (this.graph.mathEnabled &&
			!this.graph.useCssTransforms) ? true :
			Editor.prototype.originalNoForeignObject;

		// TODO: Fixes math offset - why?
		this.ui.editor.graph.sizeDidChange();
	}
	
	var rtRoot = this.diagramMap.get(this.driveRealtime.rootKey);
	
	if (rtRoot.cell == null)
	{
		this.createCell(rtRoot);
		this.restoreCell(rtRoot);
	}
	else
	{
		this.installAllRealtimeCellListeners(rtRoot);	
	}
	
	// Stores root in current model and local model
	var gm = this.getGraphModel();
	gm.setRoot(rtRoot.cell);
	
	if (gm != this.graphModel)
	{
		this.graphModel.setRoot(gm.getRoot());
	}
};

/**
 * Writes the graph properties from the realtime model to the given mxGraphModel node.
 */
RealtimeMapping.prototype.writeRealtimeToNode = function(node)
{
	node.setAttribute('shadow', this.diagramMap.get('shadowVisible'));
	node.setAttribute('fold', this.diagramMap.get('foldingEnabled'));
	node.setAttribute('math', this.diagramMap.get('mathEnabled'));
	node.setAttribute('pageScale', this.diagramMap.get('pageScale'));
	
	var img = this.diagramMap.get('backgroundImage');
	
	if (img != null && img.length > 0)
	{
		node.setAttribute('backgroundImage', img);
	}
	
	var color = this.diagramMap.get('backgroundColor');
	
	if (color != null)
	{
		node.setAttribute('background', color);
	}
	
	var pf = this.diagramMap.get('pageFormat');
	
	if (pf != null)
	{
		var values = pf.split(',');
		
		if (values.length > 1)
		{
			node.setAttribute('pageWidth', parseInt(values[0]));
			node.setAttribute('pageHeight', parseInt(values[1]));
		}
	}
};

/**
 * Writes the graph properties from the realtime model to the given mxGraphModel node.
 */
RealtimeMapping.prototype.writeNodeToRealtime = function(node)
{
	this.diagramMap.set('shadowVisible', node.getAttribute('shadow'));
	this.diagramMap.set('foldingEnabled', node.getAttribute('fold'));
	this.diagramMap.set('mathEnabled', node.getAttribute('math'));
	this.diagramMap.set('pageScale', node.getAttribute('pageScale'));
	this.diagramMap.set('pageVisible', node.getAttribute('pageVisible'));
	
	var img = node.getAttribute('backgroundImage');
	
	if (img != null && img.length > 0)
	{
		this.diagramMap.set('backgroundImage', img);
	}
	
	var color = node.getAttribute('background');
	
	if (color != null)
	{
		this.diagramMap.set('backgroundColor', color);
	}

	this.diagramMap.set('pageFormat', node.getAttribute('pageWidth') + ',' +
		node.getAttribute('pageHeight'));
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.activate = function(quiet)
{
	this.realtimePageFormatChanged(this.diagramMap.get('pageFormat'), quiet);
	this.realtimePageScaleChanged(this.diagramMap.get('pageScale'), quiet);
	this.realtimeMathEnabledChanged(this.diagramMap.get('mathEnabled'), quiet);
	this.realtimeBackgroundColorChanged(this.diagramMap.get('backgroundColor'), quiet);
	this.realtimeShadowVisibleChanged(this.diagramMap.get('shadowVisible'), quiet);
	this.realtimeFoldingEnabledChanged(this.diagramMap.get('foldingEnabled'), quiet);
	this.realtimePageVisibleChanged(this.diagramMap.get('pageVisible'), quiet);
	this.realtimeBackgroundImageChanged(this.diagramMap.get('backgroundImage'), quiet);
};

/**
 * Syncs initial state from graph model to collab model.
 */
RealtimeMapping.prototype.initRealtime = function()
{
	this.rtModel.beginCompoundOperation();
	
	try
	{
		var rtCell = this.createRealtimeCell(this.getGraphModel().getRoot());
		this.saveRealtimeCell(rtCell.cell);
		this.diagramMap.set(this.driveRealtime.rootKey, rtCell);
		
		if (this.page.graphModelNode != null)
		{
			this.writeNodeToRealtime(this.page.graphModelNode);
		}
		else
		{
			var vs = this.page.viewState;
			var pf = (vs != null) ? vs.pageFormat : mxSettings.getPageFormat();
			
			this.diagramMap.set('shadowVisible', (vs != null && vs.shadowVisible) ? '1' : '0');
			this.diagramMap.set('foldingEnabled', (vs != null && !vs.foldingEnabled) ? '0' : '1');
			this.diagramMap.set('mathEnabled', (vs != null && vs.mathEnabled) ? '1' : '0');
			this.diagramMap.set('pageScale', (vs != null) ? vs.pageScale : mxGraph.prototype.pageScale);
			this.diagramMap.set('pageVisible', (vs != null && !vs.pageVisible) ? '0' : '1');
			this.diagramMap.set('pageFormat', pf.width + ',' + pf.height);
			this.diagramMap.set('backgroundImage', (vs != null &&
				vs.backgroundImage != null) ? JSON.stringify(vs.backgroundImage) : '');
			this.diagramMap.set('backgroundColor', (vs != null &&
				vs.background != null) ? vs.background : '');
		}
		
		this.root.set('modifiedDate', new Date().getTime());
		this.rtModel.endCompoundOperation();
	}
	catch (e)
	{
		this.rtModel.endCompoundOperation();
		this.ui.handleError(e);
	}
};

/**
 * Syncs initial state from graph model to collab model.
 */
RealtimeMapping.prototype.createRealtimeCell = function(cell)
{
	var rtCell = cell.rtCell;
	
	if (rtCell == null)
	{
		rtCell = this.rtModel.create('Cell');
		rtCell.children = this.rtModel.createList();
		rtCell.cell = cell;
		cell.rtCell = rtCell;

		rtCell.cellId = cell.id;
		rtCell.type = (cell.vertex) ? 'vertex' : ((cell.edge) ? 'edge' : '');
		rtCell.connectable = (cell.connectable == null || cell.connectable) ? '1' : '0';
		
		if (mxUtils.isNode(cell.value))
		{
			rtCell.xmlValue = mxUtils.getXml(cell.value);
		}
		else if (cell.value != null)
		{
			rtCell.value = cell.value;
		}
		
		rtCell.style = (cell.style != null) ? cell.style : null;
		rtCell.geometry = (cell.geometry != null) ? mxUtils.getXml(this.driveRealtime.codec.encode(cell.geometry)) : null;
		rtCell.visible = (cell.visible == null || cell.visible) ? '1' : '0';
		rtCell.collapsed = (cell.collapsed != null && cell.collapsed) ? '1' : '0';

		for (var i = 0; i < this.graphModel.getChildCount(cell); i++)
		{
			var child = this.graphModel.getChildAt(cell, i);
			this.createRealtimeCell(child);
			
			if (child.rtCell.parent == null)
			{
				child.rtCell.parent = rtCell;
				rtCell.children.push(child.rtCell);
			}
		}
	
		this.installRealtimeCellListeners(rtCell);
	}

	return rtCell;
};

/**
 * Syncs initial state from graph model to collab model.
 */
RealtimeMapping.prototype.saveRealtimeCell = function(cell)
{
	if (cell.source != null)
	{
		if (cell.source.rtCell == null)
		{
			this.createRealtimeCell(cell.source);
		}
		
		cell.rtCell.source = cell.source.rtCell;
	}
	else
	{
		cell.rtCell.source = null;
	}

	if (cell.target != null)
	{
		if (cell.target.rtCell == null)
		{
			this.createRealtimeCell(cell.target);
		}
		
		cell.rtCell.target = cell.target.rtCell;
	}
	else
	{
		cell.rtCell.target = null;
	}

	for (var i = 0; i < this.graphModel.getChildCount(cell); i++)
	{
		this.saveRealtimeCell(this.graphModel.getChildAt(cell, i));
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.createCell = function(rtCell)
{
	var cell = rtCell.cell;
	
	if (cell == null)
	{
		cell = new mxCell();
		rtCell.cell = cell;
		cell.rtCell = rtCell;

		cell.id = rtCell.cellId;
		cell.vertex = rtCell.type == 'vertex';
		cell.edge = rtCell.type == 'edge';
		cell.connectable = rtCell.connectable != '0';
		cell.value = (rtCell.xmlValue != null) ? mxUtils.parseXml(rtCell.xmlValue).documentElement : rtCell.value;
		cell.style = rtCell.style;
		cell.geometry = (rtCell.geometry != null) ? this.driveRealtime.codec.decode(mxUtils.parseXml(rtCell.geometry).documentElement) : null;
		cell.visible = rtCell.visible != '0';
		cell.collapsed = rtCell.collapsed == '1';

		for (var i = 0; i < rtCell.children.length; i++)
		{
			var rtChild = rtCell.children.get(i);
			this.createCell(rtChild);
			
			if (rtChild.cell.parent == null)
			{
				cell.insert(rtChild.cell);
			}
		}
		
		this.installRealtimeCellListeners(rtCell);
	}
	
	return cell;
};

/**
 * Restores connection between edges and terminals.
 */
RealtimeMapping.prototype.restoreCell = function(rtCell)
{
	var valid = true;

	if (rtCell.cell != null)
	{
		//console.log('restoreCell', rtCell.cellId);
		
		if (rtCell.source != null)
		{
			// Removes edge if source is no longer in the model
			if (rtCell.source.parent == null)
			{
				//console.log('invalid source', valid, rtCell.cellId, rtCell.source.cellId);
				rtCell.source = null;
				valid = false;
			}
			else
			{
				if (rtCell.source.cell == null)
				{
					this.createCell(rtCell.source);
				}
				
				rtCell.source.cell.insertEdge(rtCell.cell, true);
			}
		}
		
		if (valid && rtCell.target != null)
		{
			// Removes edge if source is no longer in the model
			if (rtCell.target.parent == null)
			{
				//console.log('invalid target', valid, rtCell.cellId, rtCell.target.cellId);
				rtCell.target = null;
				valid = false;
			}
			else
			{
				if (rtCell.target.cell == null)
				{
					this.createCell(rtCell.target);
				}
				
				rtCell.target.cell.insertEdge(rtCell.cell, false);
			}
		}

		// Checks if edge contains required terminals or terminal points
		if (valid && this.graphModel.isEdge(rtCell.cell))
		{
			var geo = this.graphModel.getGeometry(rtCell.cell);
			valid = geo != null &&
				(this.graphModel.getTerminal(rtCell.cell, true) != null || geo.getTerminalPoint(true) != null) &&
				(this.graphModel.getTerminal(rtCell.cell, false) != null || geo.getTerminalPoint(false) != null);
			//console.log('geometry check', valid, rtCell.cellId);
		}
	}
	
	// Removes invalid cell
	if (!valid)
	{
		if (rtCell.parent != null)
		{
			rtCell.parent.children.removeValue(rtCell);
			rtCell.parent = null;
		}
		
		if (rtCell.cell != null)
		{
			// TODO: Remove from source and target?
			//console.log('remove invalid cell', rtCell.cellId);
			this.getGraphModel().remove(rtCell.cell);
		}
	}
	else
	{
		for (var i = 0; i < rtCell.children.length; i++)
		{
			this.restoreCell(rtCell.children.get(i));
		}
	}
};

/**
 * Restores connection between edges and terminals.
 */
RealtimeMapping.prototype.containsRealtimeCell = function(rtCell)
{
	var tmp = rtCell;
	
	while (tmp.parent != null)
	{
		tmp = tmp.parent;
	}
	
	return tmp == this.diagramMap.get(this.driveRealtime.rootKey);
};

/**
 * 
 */
RealtimeMapping.prototype.beginUpdate = function()
{
	var graphModel = this.getGraphModel();
	
	if (!this.driveRealtime.ignoreChange)
	{
		this.driveRealtime.ignoreChange = true;
		graphModel.beginUpdate();
		
		window.setTimeout(mxUtils.bind(this, function()
		{
			graphModel.endUpdate();
			this.driveRealtime.ignoreChange = false;
		}), 0);
	}
	
	return graphModel;
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.installAllRealtimeCellListeners = function(rtCell)
{
	if (rtCell != null)
	{
		this.installRealtimeCellListeners(rtCell);
		
		for (var i = 0; i < rtCell.children.length; i++)
		{
			this.installAllRealtimeCellListeners(rtCell.children.get(i));
		}
	}
};

/**
 * Adds the listener for added and removed cells in the collab model and maps
 * them to the graph model.
 */
RealtimeMapping.prototype.installRealtimeCellListeners = function(rtCell)
{
	rtCell.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, mxUtils.bind(this, function(evt)
	{
		this.handleValueChanged(rtCell, evt);
		this.needsUpdate = true;
	}));
	
	rtCell.children.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, mxUtils.bind(this, function(evt)
	{
		this.handleValuesAdded(rtCell, evt);
		this.needsUpdate = true;
	}));
	
	rtCell.children.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, mxUtils.bind(this, function(evt)
	{
		this.handleValuesRemoved(rtCell, evt);
		this.needsUpdate = true;
	}));
};

/**
 * Adds the listener for added and removed cells in the collab model and maps
 * them to the graph model.
 */
RealtimeMapping.prototype.handleValueChanged = function(rtCell, evt)
{
	var cell = rtCell.cell;

	if (!this.driveRealtime.isLocalEvent(evt) && cell != null)
	{
		var value  = evt.newValue;
		var key = evt.property;
		var graphModel = this.beginUpdate();
		//console.log('valueChanged: cell=' + rtCell.cellId + ' key=' + key + ' value=' + ((value != null) ? (value.cellId || value) : '[null]'));
		
		if (key == 'type')
		{
			cell.vertex = value == 'vertex';
			cell.edge = value == 'edge';
		}
		else if (key == 'connectable')
		{
			cell.connectable = (value == '1');
		}
		else if (key == 'source' || key == 'target')
		{
			if (value == null)
			{
				if (evt.oldValue != null)
				{
					graphModel.setTerminal(cell, null, key == 'source');
				}
			}
			else
			{
				// Handles the case where an edge is connected to a vertex which is not in the model
				if (value.cell == null || !this.containsRealtimeCell(value) || graphModel.getCell(value.cellId) == null)
				{
					if (rtCell.parent != null)
					{
						rtCell.parent.children.removeValue(rtCell);
						rtCell.parent = null;
					}
					
					graphModel.setTerminal(cell, null, key == 'source');
					graphModel.remove(rtCell.cell);
					rtCell[key] = null;
				}
				else
				{
					graphModel.setTerminal(cell, value.cell, key == 'source');
				}
			}
		}
		else if (key == 'value')
		{
			graphModel.setValue(cell, value);
		}
		else if (key == 'xmlValue')
		{
			graphModel.setValue(cell, mxUtils.parseXml(value).documentElement);
		}
		else if (key == 'style')
		{
			graphModel.setStyle(cell, value);
		}
		else if (key == 'geometry')
		{
			var geometry = (value != null) ? this.driveRealtime.codec.decode(mxUtils.parseXml(value).documentElement) : null;
			graphModel.setGeometry(cell, geometry);
		}
		else if (key == 'collapsed')
		{
			graphModel.setCollapsed(cell, value == '1');
		}
		else if (key == 'visible')
		{
			graphModel.setVisible(cell, value == '1');
		}
		else if (key == 'parent')
		{
			// Removes the child from its previous parent in the realtime model.
			if (evt.oldValue != null)
			{
				//console.log('remove clone', 'parent', evt.oldValue.cellId, 'child', rtCell.cellId);
				evt.oldValue.children.removeValue(rtCell);
			}
			else
			{
				this.createCell(rtCell);
				this.restoreCell(rtCell);	
			}
			
			if (value == null)
			{
				graphModel.remove(cell);
			}
			else
			{
				var index = value.children.indexOf(rtCell);
				
				if (index >= 0)
				{
					//console.log('move child', 'parent', value.cellId, 'child', rtCell.cellId, index);
					graphModel.add(value.cell, rtCell.cell, index);
				}
			}
		}
	}
};

/**
 * Adds the listener for added and removed cells in the collab model and maps
 * them to the graph model.
 */
RealtimeMapping.prototype.handleValuesAdded = function(rtCell, evt)
{
	if (!this.driveRealtime.isLocalEvent(evt))
	{
		var graphModel = this.beginUpdate();
		
		for (var i = 0; i < evt.values.length; i++)
		{
			var rtChild = evt.values[i];
			//console.log('valueAdded', 'parent', rtCell.cellId, 'child', rtChild.cellId, 'index', evt.index + i, rtChild);
			
			// Removes child if the parent of the child and the parent of the children array are not
			// the same. This happens if clients move a cell into different parents concurrently.
			if (rtChild.parent != null)
			{
				if (rtChild.parent != rtCell)
				{
					//console.log('remove clone', 'parent', rtCell.cellId, 'child', rtChild.cellId);
					rtCell.children.removeValue(rtChild);
				}
				else
				{
					if (rtChild.cell == null || rtChild.cell.parent == null)
					{
						this.createCell(rtChild);
						this.restoreCell(rtChild);
					}
					
					// Resolves conflict when two clients change the order of a child at the same
					// time which results in the same child appearing multiple times in the list.
					// Note that the actual child index may be different from the event information
					// at this point so a generic check for duplicates is performed based on the
					// first appearance of the cell in the list.
					var first = rtCell.children.indexOf(rtChild);
					var last = rtCell.children.lastIndexOf(rtChild);
					
					while (first != last)
					{
						//console.log('remove duplicate', rtChild.cellId, last);
						rtCell.children.remove(last);
						last = rtCell.children.lastIndexOf(rtChild);
					}
	
					// Inserts the child at the smallest index to maintain consistency with RT
					if (rtChild.parent == rtCell)
					{
						//console.log('add', 'parent', rtCell.cellId, 'child', rtChild.cellId, 'index', Math.min(first, evt.index + i));
						graphModel.add(rtCell.cell, rtChild.cell, Math.min(first, evt.index + i));
					}
				}
			}
		}
	}
};

/**
 * Adds the listener for added and removed cells in the collab model and maps
 * them to the graph model.
 */
RealtimeMapping.prototype.handleValuesRemoved = function(rtCell, evt)
{
	if (!this.driveRealtime.isLocalEvent(evt))
	{
		var graphModel = this.beginUpdate();
		
		for (var i = 0; i < evt.values.length; i++)
		{
			var rtChild = evt.values[i];
			
			if (rtChild.cell != null)
			{
				//console.log('valueRemoved', 'parent', rtCell.cellId, 'child', rtChild.cellId,
				//	'index', evt.index + i, rtChild, rtChild.cell);
				
				// Checks if the realtime parent and the graph parent are different and updates the parent
				// in the graph to match the realtime parent. This happens if the child was removed as a
				// clone in another client.
				if (rtChild.parent != null && rtChild.parent != rtCell && rtChild.cell.parent != rtChild.parent.cell)
				{
					//console.log('move clone', rtChild.cellId, evt.index + i, rtChild.parent.cellId);
					var index = rtChild.parent.children.indexOf(rtChild);
					graphModel.add(rtChild.parent.cell, rtChild.cell, index);
				}
				else
				{
					// Checks if the realtime parent contains a duplicate entry of this child
					// and updates the index of the child in the graph. This happens if the
					// child was removed as a duplicate entry in another client.
					var index = rtCell.children.indexOf(rtChild);
					
					if (index >= 0)
					{
						//console.log('adjust duplicate', rtCell.cellId, evt.index + i, rtChild.cellId, 'index', index);
						graphModel.add(rtCell.cell, rtChild.cell, index);
					}
				}
			}
		}
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.realtimePageFormatChanged = function(value, quiet)
{
	if (value != null)
	{
		var values = value.split(',');
		
		if (values.length > 1)
		{
			if (!this.isActive())
			{
				if (this.page.viewState != null)
				{
					this.page.viewState.pageFormat = new mxRectangle(0, 0, parseInt(values[0]), parseInt(values[1]));
				}
			}
			else if (quiet)
			{
				this.graph.pageFormat = new mxRectangle(0, 0, parseInt(values[0]), parseInt(values[1]));
			}
			else
			{
				this.driveRealtime.ignorePageFormatChanged = true;
				this.ui.setPageFormat(new mxRectangle(0, 0, parseInt(values[0]), parseInt(values[1])));
				this.driveRealtime.ignorePageFormatChanged = false;
			}
		}
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.realtimePageScaleChanged = function(value, quiet)
{
	if (value != null)
	{
		if (!this.isActive())
		{
			if (this.page.viewState != null)
			{
				this.page.viewState.pageScale = parseFloat(value);
			}
		}
		else if (quiet)
		{
			this.graph.pageScale = parseFloat(value);
		}
		else
		{
			this.driveRealtime.ignorePageScaleChanged = true;
			this.ui.setPageScale(parseFloat(value));
			this.driveRealtime.ignorePageScaleChanged = false;
		}
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.realtimeBackgroundColorChanged = function(value, quiet)
{
	if (!this.isActive())
	{
		if (this.page.viewState != null)
		{
			this.page.viewState.background = (value == '') ? null : value;
		}
	}
	else if (quiet)
	{
		this.graph.background = (value == '') ? null : value;
	}
	else
	{
		this.driveRealtime.ignoreBackgroundColorChanged = true;
		this.ui.setBackgroundColor((value == '') ? null : value);
		this.driveRealtime.ignoreBackgroundColorChanged = false;
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.realtimeFoldingEnabledChanged = function(value, quiet)
{
	if (!this.isActive())
	{
		if (this.page.viewState != null)
		{
			this.page.viewState.foldingEnabled = value == '1';
		}
	}
	else if (quiet)
	{
		this.graph.foldingEnabled = value == '1';
	}
	else
	{
		this.driveRealtime.ignoreFoldingEnabledChanged = true;
		this.ui.setFoldingEnabled(value == '1');
		this.driveRealtime.ignoreFoldingEnabledChanged = false;
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.realtimePageVisibleChanged = function(value, quiet)
{
	if (!this.isActive())
	{
		if (this.page.viewState != null)
		{
			this.page.viewState.pageVisible = value != '0';
		}
	}
	else if (quiet)
	{
		this.graph.pageVisible = value != '0';
		this.graph.pageBreaksVisible = this.graph.pageVisible; 
		this.graph.preferPageSize = this.graph.pageVisible;
	}
	else
	{
		this.driveRealtime.ignorePageVisibleChanged = true;
		this.ui.setPageVisible(value != '0');
		this.driveRealtime.ignorePageVisibleChanged = false;
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.realtimeShadowVisibleChanged = function(value, quiet)
{
	// Does not need quiet mode as it's handled independently of refresh
	if (!this.isActive())
	{
		if (this.page.viewState != null)
		{
			this.page.viewState.shadowVisible = value == '1';
		}
	}
	else
	{
		this.driveRealtime.ignoreShadowVisibleChanged = true;
		this.ui.editor.graph.setShadowVisible(value == '1');
		this.driveRealtime.ignoreShadowVisibleChanged = false;
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.realtimeBackgroundImageChanged = function(value, quiet)
{
	var data = (value != null && value.length > 0) ? JSON.parse(value) : null;
	
	if (!this.isActive())
	{
		if (this.page.viewState != null)
		{
			this.page.viewState.backgroundImage = (data != null) ? new mxImage(data.src, data.width, data.height) : null;
		}
	}
	else if (quiet)
	{
		this.graph.setBackgroundImage((data != null) ? new mxImage(data.src, data.width, data.height) : null);
	}
	else
	{
		this.driveRealtime.ignoreBackgroundImageChanged = true;
		this.ui.setBackgroundImage((data != null) ? new mxImage(data.src, data.width, data.height) : null);
		this.driveRealtime.ignoreBackgroundImageChanged = false;
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.realtimeMathEnabledChanged = function(value, quiet)
{
	if (!this.isActive())
	{
		if (this.page.viewState != null)
		{
			this.page.viewState.mathEnabled = urlParams['math'] == '1' || value == '1';
		}
	}
	else if (quiet)
	{
		this.graph.mathEnabled = urlParams['math'] == '1' || value == '1';
	}
	else
	{
		this.driveRealtime.ignoreMathEnabledChanged = true;
		this.ui.setMathEnabled(urlParams['math'] == '1' || value == '1');
		this.driveRealtime.ignoreMathEnabledChanged = false;
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.removeAllRealtimeCellListeners = function(rtCell)
{
	if (rtCell != null)
	{
		rtCell.removeAllEventListeners();
		rtCell.children.removeAllEventListeners();
		
		for (var i = 0; i < rtCell.children.length; i++)
		{
			this.removeAllRealtimeCellListeners(rtCell.children.get(i));
		}
	}
};

/**
 * Syncs initial state from collab model to graph model.
 */
RealtimeMapping.prototype.destroy = function()
{
	this.diagramMap.removeAllEventListeners();
	this.selectionMap.removeAllEventListeners();
	this.removeAllRealtimeCellListeners(this.diagramMap.get(this.driveRealtime.rootKey));
};
