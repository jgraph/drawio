/**
 * Copyright (c) 2006-2012, JGraph Holdings Ltd
 */
Format = function(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
	this.collapsedSections = editorUi.getCollapsedSections();
};

/**
 * Icons for markers (24x16).
 */
Format.noMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 24 8" stroke="black" fill="black"/>', 32, 20);
Format.classicFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 10 2 L 5 8 L 10 14 Z M 0 8 L 24 8" stroke="black" fill="black"/>', 32, 20);
Format.classicThinFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 8 4 L 3 8 L 8 12 Z M 0 8 L 24 8" stroke="black" fill="black"/>', 32, 20);
Format.openFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 8 0 L 0 8 L 8 16 M 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.openThinFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 8 4 L 0 8 L 8 12 M 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.openAsyncFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 8 4 L 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.blockFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 8 2 L 8 14 Z M 0 8 L 24 8" stroke="black" fill="black"/>', 32, 20);
Format.blockThinFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 8 4 L 8 12 Z M 0 8 L 24 8" stroke="black" fill="black"/>', 32, 20);
Format.asyncFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 6 8 L 6 4 L 0 8 L 24 8" stroke="black" fill="black"/>', 32, 20);
Format.ovalFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 A 5 5 0 0 1 5 3 A 5 5 0 0 1 11 8 A 5 5 0 0 1 5 13 A 5 5 0 0 1 0 8 Z M 10 8 L 24 8" stroke="black" fill="black"/>', 32, 20);
Format.diamondFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 6 2 L 12 8 L 6 14 Z M 0 8 L 24 8" stroke="black" fill="black"/>', 32, 20);
Format.diamondThinFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 8 3 L 16 8 L 8 13 Z M 0 8 L 24 8" stroke="black" fill="black"/>', 32, 20);
Format.classicMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 10 2 L 5 8 L 10 14 Z M 5 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.classicThinMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 8 4 L 5 8 L 8 12 Z M 5 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.blockMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 8 2 L 8 14 Z M 8 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.blockThinMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 8 4 L 8 12 Z M 8 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.asyncMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 6 8 L 6 4 L 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.ovalMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 A 5 5 0 0 1 5 3 A 5 5 0 0 1 11 8 A 5 5 0 0 1 5 13 A 5 5 0 0 1 0 8 Z M 10 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.diamondMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 6 2 L 12 8 L 6 14 Z M 12 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.diamondThinMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 8 3 L 16 8 L 8 13 Z M 16 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.boxMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 3 L 10 3 L 10 13 L 0 13 Z M 10 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.halfCircleMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 3 A 5 5 0 0 1 5 8 A 5 5 0 0 1 0 13 M 5 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.dashMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 2 L 12 14 M 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.crossMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 2 L 12 14 M 12 2 L 0 14 M 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.circlePlusMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 A 6 6 0 0 1 6 2 A 6 6 0 0 1 12 8 A 6 6 0 0 1 6 14 A 6 6 0 0 1 0 8 Z M 6 2 L 6 14 M 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.circleMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 A 6 6 0 0 1 6 2 A 6 6 0 0 1 12 8 A 6 6 0 0 1 6 14 A 6 6 0 0 1 0 8 Z M 12 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.ERmandOneMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 6 2 L 6 14 M 9 2 L 9 14 M 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.ERmanyMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 2 L 12 8 L 0 14 M 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.ERoneToManyMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 2 L 12 8 L 0 14 M 15 2 L 15 14 M 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.ERzeroToOneMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 8 8 A 5 5 0 0 1 13 3 A 5 5 0 0 1 18 8 A 5 5 0 0 1 13 13 A 5 5 0 0 1 8 8 Z M 0 8 L 8 8 M 18 8 L 24 8 M 4 3 L 4 13" stroke="black" fill="transparent"/>', 32, 20);
Format.ERzeroToManyMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 8 8 A 5 5 0 0 1 13 3 A 5 5 0 0 1 18 8 A 5 5 0 0 1 13 13 A 5 5 0 0 1 8 8 Z M 0 8 L 8 8 M 18 8 L 24 8 M 0 3 L 8 8 L 0 13" stroke="black" fill="transparent"/>', 32, 20);
Format.EROneMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 5 2 L 5 14 M 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.baseDashMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 2 L 0 14 M 0 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.doubleBlockMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 8 2 L 8 14 Z M 8 8 L 16 2 L 16 14 Z M 16 8 L 24 8" stroke="black" fill="transparent"/>', 32, 20);
Format.doubleBlockFilledMarkerImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,2)" stroke-width="2.5" d="M 0 8 L 8 2 L 8 14 Z M 8 8 L 16 2 L 16 14 Z M 16 8 L 24 8" stroke="black" fill="black"/>', 32, 20);
Format.connectionImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,3)" stroke-width="2.5" d="M 0 8 L 26 8 L 26 4 L 32 8 L 26 12 L 26 8 Z" stroke="black" fill="black"/>', 42, 20);
Format.linkEdgeImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,3)" stroke-width="2.5" d="M 0 6 L 32 6 M 0 10 L 32 10" stroke="black" fill="black"/>', 42, 20);
Format.pipeEdgeImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,0)" stroke-width="10.5" d="M 0 10 L 34 10" stroke="black" fill="black"/>' +
	'<path transform="translate(4,0)" stroke-width="4.5" d="M 0 10 L 34 10" stroke="lightblue" fill="black"/>', 42, 20);
Format.filledEdgeImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,0)" stroke-width="8.5" d="M 0 10 L 34 10" stroke="black" fill="black"/>' +
	'<path transform="translate(4,0)" stroke-width="4.5" d="M 0 10 L 34 10" stroke="white" fill="black"/>', 42, 20);
Format.wireEdgeImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,0)" stroke-dasharray="8 8" stroke-width="3.5" d="M 0 10 L 34 10" stroke="red" fill="black"/>' +
	'<path transform="translate(4,0)" stroke-dashoffset="8" stroke-dasharray="8 8" stroke-width="3.5" d="M 0 10 L 34 10" stroke="green" fill="black"/>', 42, 20);
Format.arrowImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,3)" stroke-width="2.5" d="M 0 6 L 24 6 L 24 2 L 32 8 L 24 14 L 24 10 L 0 10 Z" stroke="black" fill="none"/>', 42, 20);
Format.simpleArrowImage = Graph.createSvgImage(20, 22, '<path transform="translate(4,3)" stroke-width="2.5" d="M 0 6 L 4 6 L 4 10 L 0 10 Z M 7 6 L 18 6 L 18 2 L 25 8 L 18 14 L 18 10 L 7 10 Z M 28 6 L 28 6 L 32 6 L 32 10 L 28 10 Z" stroke="black" fill="none"/>', 42, 20);
Format.straightImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 0 26 L 4 26 L 4 30 L 0 30 Z M 4 26 L 26 4 M 26 0 L 30 0 L 30 4 L 26 4 Z" stroke="black" fill="none"/>', 36, 36);
Format.orthogonalImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 0 26 L 4 26 L 4 30 L 0 30 Z M 2 26 L 2 14 L 28 14 L 28 4 M 26 0 L 30 0 L 30 4 L 26 4 Z" stroke="black" fill="none"/>', 36, 36);
Format.horizontalElbowImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 13 0 L 17 0 L 17 4 L 13 4 Z M 15 4 L 15 26 M 13 26 L 17 26 L 17 30 L 13 30 Z M 12 15 L 6 15 M 4 15 L 6 13 L 6 17 Z M 18 15 L 24 15 M 26 15 L 24 13 L 24 17 Z" stroke="black" fill="none"/>', 36, 36);
Format.verticalElbowImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 0 13 L 4 13 L 4 17 L 0 17 Z M 4 15 L 26 15 M 26 13 L 30 13 L 30 17 L 26 17 Z M 15 12 L 15 6 M 15 4 L 17 6 L 13 6 Z M 15 18 L 15 24 M 15 26 L 17 24 L 13 24 Z" stroke="black" fill="none"/>', 36, 36);
Format.horizontalIsometricImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 0 26 L 4 26 L 4 30 L 0 30 Z M 4 26 L 19 17 L 10 12 L 26 4 M 26 0 L 30 0 L 30 4 L 26 4 Z" stroke="black" fill="none"/>', 36, 36);
Format.verticalIsometricImage = Graph.createSvgImage(16, 18, '<path transform="translate(32,4)scale(-1,1)" stroke-width="2.5" d="M 0 26 L 4 26 L 4 30 L 0 30 Z M 4 26 L 19 17 L 10 12 L 26 4 M 26 0 L 30 0 L 30 4 L 26 4 Z" stroke="black" fill="none"/>', 36, 36);
Format.curvedImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 0 26 L 4 26 L 4 30 L 0 30 Z M 2 26 Q 2 14 14 14 Q 28 14 28 4 M 26 0 L 30 0 L 30 4 L 26 4 Z" stroke="black" fill="none"/>', 36, 36);
Format.entityImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 0 26 L 4 26 L 4 30 L 0 30 Z M 4 28 L 10 28 L 20 2 L 26 2 M 26 0 L 30 0 L 30 4 L 26 4 Z" stroke="black" fill="none"/>', 36, 36);
// libavoid obstacle-avoiding routing: an orthogonal connector that detours
// around an outlined obstacle box (source bottom-left, target top-right).
Format.libavoidImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 0 26 L 4 26 L 4 30 L 0 30 Z M 2 26 L 8 26 L 8 7 L 28 7 L 28 4 M 26 0 L 30 0 L 30 4 L 26 4 Z M 12 11 L 20 11 L 20 19 L 12 19 Z" stroke="black" fill="none"/>', 36, 36);
Format.sharpBendImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 6 2 L 6 22 L 26 22" stroke="black" fill="none"/>', 36, 36);
Format.roundedBendImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 6 2 L 6 12 Q 6 22 16 22 L 26 22" stroke="black" fill="none"/>', 36, 36);
Format.curvedBendImage = Graph.createSvgImage(16, 18, '<path transform="translate(3,4)" stroke-width="2.5" d="M 6 2 Q 6 22 26 22" stroke="black" fill="none"/>', 36, 36);

/**
 * Adds a style change item to the given menu.
 */
Format.processMenuIcon = function(elt, transform)
{
	var imgs = elt.getElementsByTagName('img');

	if (imgs.length > 0)
	{
		imgs[0].className = 'geAdaptiveAsset geStyleMenuItem';

		if (transform != null)
		{
			mxUtils.setPrefixedStyle(imgs[0].style, 'transform', transform);
		}
	}

	return elt;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.labelIndex = 0;

/**
 * Returns information about the current selection.
 */
Format.prototype.diagramIndex = 0;

/**
 * Returns information about the current selection.
 */
Format.prototype.currentIndex = 0;

/**
 * Returns information about the current selection.
 */
Format.prototype.rounded = false;

/**
 * Returns information about the current selection.
 */
Format.prototype.curved = false;

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.init = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	this.update = mxUtils.bind(this, function(sender, evt)
	{
		this.refresh();
	});
	
	graph.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
	graph.getModel().addListener(mxEvent.CHANGE, this.update);
	graph.addListener(mxEvent.EDITING_STARTED, this.update);
	graph.addListener(mxEvent.EDITING_STOPPED, this.update);
	graph.getView().addListener('unitChanged', this.update);
	editor.addListener('autosaveChanged', this.update);
	graph.addListener(mxEvent.ROOT, this.update);
	ui.addListener('styleChanged', this.update);
	ui.addListener('lockedChanged', this.update);
	ui.addListener('languageChanged', this.update);
	ui.addListener('formatWidthChanged', this.update);
	
	this.refresh();
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.clear = function()
{
	this.container.innerText = '';
	
	// Destroy existing panels
	if (this.panels != null)
	{
		for (var i = 0; i < this.panels.length; i++)
		{
			this.panels[i].destroy();
		}
	}
	
	this.panels = [];
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.refresh = function()
{
	if (this.pendingRefresh != null)
	{
		window.clearTimeout(this.pendingRefresh);
		this.pendingRefresh = null;
	}

	this.pendingRefresh = window.setTimeout(mxUtils.bind(this, function()
	{
		this.immediateRefresh();
	}));
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.immediateRefresh = function()
{
	// Skips refresh if not visible
	if (this.container.offsetWidth == 0)
	{
		return;
	}

	// Snapshots the focused input so it can be restored after the
	// rebuild (eg. while tabbing through inputs, see issue #5368)
	var focusState = this.captureFocus();
	this.clear();
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	var div = document.createElement('div');
	div.className = 'geFormatContent';
	var label = document.createElement('div');
	label.className = 'geFormatTitle';
	this.container.appendChild(div);
	
	var ss = ui.getSelectionState();
	// transparentBounds cells store 0x0 geometry (their bounds are derived from
	// the children), which flags the selection as a label. For tab selection
	// they behave like regular cells, so they keep the current tab (e.g. Arrange)
	// instead of switching to the separate label tab memory (defaults to Style).
	var containsLabel = ss.containsLabel && !ss.transparentBounds;
	var currentLabel = null;
	var currentPanel = null;
	
	var addClickHandler = mxUtils.bind(this, function(elt, panel, index, lastEntry)
	{
		var clickHandler = mxUtils.bind(this, function(evt, skipIndex)
		{
			if (currentLabel != elt)
			{
				if (!skipIndex)
				{
					if (containsLabel)
					{
						this.labelIndex = index;
					}
					else if (graph.isSelectionEmpty())
					{
						this.diagramIndex = index;
					}
					else
					{
						this.currentIndex = index;
					}
				}
				
				if (currentLabel != null)
				{
					currentLabel.classList.remove('geActiveFormatTitle');
				}

				currentLabel = elt;
				currentLabel.classList.add('geActiveFormatTitle');

				if (currentPanel != panel)
				{
					if (currentPanel != null)
					{
						currentPanel.style.display = 'none';
					}
					
					currentPanel = panel;
					currentPanel.style.display = '';
				}
			}
		});
		
		mxEvent.addListener(elt, 'click', clickHandler);

		var currentIndex = (containsLabel) ? this.labelIndex :
			((graph.isSelectionEmpty()) ? this.diagramIndex :
				this.currentIndex);
		
		if ((lastEntry && currentLabel == null) ||
			index == currentIndex)
		{
			clickHandler(null, lastEntry && currentLabel == null);
		}
	});
	
	var idx = 0;

	if (graph.isSelectionEmpty())
	{
		var title = document.createElement('div');
		mxUtils.write(title, mxResources.get('diagram'));
		label.appendChild(title);
		label.setAttribute('title', mxResources.get('diagram'));
		div.appendChild(label);
		var diagramPanel = div.cloneNode(false);
		this.panels.push(new DiagramFormatPanel(this, ui, diagramPanel));
		this.container.appendChild(diagramPanel);
		diagramPanel.style.display = 'none';
		
		var label2 = label.cloneNode(false);
		addClickHandler(label, diagramPanel, idx++);
		
		var stylePanel = div.cloneNode(false);
		stylePanel.style.display = 'none';
		var title = document.createElement('div');
		mxUtils.write(title, mxResources.get('style'));
		label2.appendChild(title);
		label2.setAttribute('title', mxResources.get('style'));
		div.appendChild(label2);
		this.panels.push(new DiagramStylePanel(this, ui, stylePanel));
		this.container.appendChild(stylePanel);
		
		addClickHandler(label2, stylePanel, idx++, true);
	}
	else if (graph.isEditing())
	{
		// Text Editing
		var title = document.createElement('div');
		mxUtils.write(title, mxResources.get('text'));
		label.appendChild(title);
		label.setAttribute('title', mxResources.get('text'));
		div.appendChild(label);

		var textPanel = div.cloneNode(false);
		textPanel.style.display = 'none';
		this.panels.push(new TextFormatPanel(this, ui, textPanel));
		this.container.appendChild(textPanel);

		addClickHandler(label, textPanel, idx++, true);
	}
	else
	{
		var label2 = label.cloneNode(false);
		var label3 = label2.cloneNode(false);
		
		// Style
		if (ss.cells.length > 0)
		{
			var title = document.createElement('div');
			mxUtils.write(title, mxResources.get('style'));
			label.appendChild(title);
			label.setAttribute('title', mxResources.get('style'));
			div.appendChild(label);
			
			var stylePanel = div.cloneNode(false);
			stylePanel.style.display = 'none';
			this.panels.push(new StyleFormatPanel(this, ui, stylePanel));
			this.container.appendChild(stylePanel);

			addClickHandler(label, stylePanel, idx++);
		}
		
		// Text
		var title = document.createElement('div');
		mxUtils.write(title, mxResources.get('text'));
		label2.appendChild(title);
		label2.setAttribute('title', mxResources.get('text'));
		div.appendChild(label2);

		var textPanel = div.cloneNode(false);
		textPanel.style.display = 'none';
		this.panels.push(new TextFormatPanel(this, ui, textPanel));
		this.container.appendChild(textPanel);
		
		// Arrange
		var title = document.createElement('div');
		mxUtils.write(title, mxResources.get('arrange'));
		label3.appendChild(title);
		label3.setAttribute('title', mxResources.get('arrange'));
		div.appendChild(label3);

		var arrangePanel = div.cloneNode(false);
		arrangePanel.style.display = 'none';
		this.panels.push(new ArrangePanel(this, ui, arrangePanel));
		this.container.appendChild(arrangePanel);

		if (ss.cells.length > 0)
		{
			addClickHandler(label2, textPanel, idx++);
		}
		else
		{
			label2.style.display = 'none';
		}
		
		addClickHandler(label3, arrangePanel, idx++, true);
	}
	
	div.className = 'geFormatTitleContainer';

	// Restores focus and selection on the rebuilt input
	this.restoreFocus(focusState);
};

/**
 * Records the currently focused format input so it can be restored
 * after the panel DOM is rebuilt in immediateRefresh. The input is
 * identified by its index among the focusable controls in the panel
 * (the rebuild is deterministic for a given selection, so the order
 * is stable). Returns null if focus is not on a panel input, in which
 * case restoreFocus is a no-op (eg. focus is in the canvas).
 */
Format.prototype.captureFocus = function()
{
	var active = document.activeElement;

	if (active == null || !this.container.contains(active) ||
		(active.nodeName != 'INPUT' && active.nodeName != 'SELECT' &&
		active.nodeName != 'TEXTAREA'))
	{
		return null;
	}

	var focusables = this.container.querySelectorAll('input, select, textarea');
	var index = Array.prototype.indexOf.call(focusables, active);

	if (index < 0)
	{
		return null;
	}

	var state = {index: index, nodeName: active.nodeName, type: active.type};

	// Caret/selection is only available on text inputs (number, select,
	// color throw on access, so this is guarded)
	try
	{
		state.selectionStart = active.selectionStart;
		state.selectionEnd = active.selectionEnd;
		state.selectionDirection = active.selectionDirection;
	}
	catch (e)
	{
		// ignore
	}

	return state;
};

/**
 * Restores focus and selection captured by captureFocus on the rebuilt
 * panel. Skips if the control at the recorded index no longer matches
 * (eg. a conditional field changed the layout) or is not visible.
 */
Format.prototype.restoreFocus = function(state)
{
	if (state == null)
	{
		return;
	}

	var focusables = this.container.querySelectorAll('input, select, textarea');
	var el = focusables[state.index];

	if (el == null || el.nodeName != state.nodeName || el.type != state.type ||
		el.offsetParent == null)
	{
		return;
	}

	el.focus({preventScroll: true});

	if (state.selectionStart != null)
	{
		try
		{
			el.setSelectionRange(
				Math.min(state.selectionStart, el.value.length),
				Math.min(state.selectionEnd, el.value.length),
				state.selectionDirection);
		}
		catch (e)
		{
			// ignore
		}
	}
};

/**
 * Base class for format panels.
 */
BaseFormatPanel = function(format, editorUi, container)
{
	this.format = format;
	this.editorUi = editorUi;
	this.container = container;
	this.listeners = [];
};

/**
 * 
 */
BaseFormatPanel.prototype.buttonBackgroundColor = 'transparent';

/**
 * Install input handler.
 */
BaseFormatPanel.prototype.installInputHandler = function(input, key, defaultValue, min, max, unit, textEditFallback, isFloat, useUnits)
{
	unit = (unit != null) ? unit : '';
	isFloat = (isFloat != null) ? isFloat : false;
	
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	min = (min != null) ? min : 1;
	max = (max != null) ? max : 999;
	
	var selState = null;
	var updating = false;
	var lastValue = null;
	
	var update = mxUtils.bind(this, function(evt)
	{
		var value = (isFloat) ? parseFloat(input.value) : parseInt(input.value);

		if (useUnits)
		{
			value = this.fromUnit(value);
		}

		if (value != lastValue)
		{
			lastValue = value;

			// Special case: angle mod 360
			if (!isNaN(value) && key == mxConstants.STYLE_ROTATION)
			{
				// Workaround for decimal rounding errors in floats is to
				// use integer and round all numbers to two decimal point
				value = mxUtils.mod(Math.round(value * 100), 36000) / 100;
			}
			
			value = Math.min(max, Math.max(min, (isNaN(value)) ? defaultValue : value));
			
			if (graph.cellEditor.isContentEditing() && textEditFallback)
			{
				if (!updating)
				{
					updating = true;
					
					if (selState != null)
					{
						graph.cellEditor.restoreSelection(selState);
						selState = null;
					}
					
					textEditFallback(value);
					input.value = (useUnits? this.inUnit(value) : value) + unit;
		
					// Restore focus and selection in input
					updating = false;
				}
			}
			else if (value != mxUtils.getValue(ui.getSelectionState().style, key, defaultValue))
			{
				if (graph.isEditing())
				{
					graph.stopEditing(true);
				}
				
				graph.getModel().beginUpdate();
				try
				{
					var cells = ui.getSelectionState().cells;

					// Rotating a group must rotate its children as a rigid body (like the
					// rotation handle) instead of only spinning the group's own shape
					if (key == mxConstants.STYLE_ROTATION)
					{
						for (var i = 0; i < cells.length; i++)
						{
							graph.setCellRotation(cells[i], value);
						}
					}
					else
					{
						graph.setCellStyles(key, value, cells);
					}

					// Handles special case for fontSize where HTML labels are parsed and updated
					if (key == mxConstants.STYLE_FONTSIZE)
					{
						graph.updateLabelElements(cells, function(elt)
						{
							elt.removeAttribute('size');
							elt.style.fontSize = '';
							
							if (elt.getAttribute('style') == '')
							{
								elt.removeAttribute('style');
							}
						});
					}
					
					for (var i = 0; i < cells.length; i++)
					{
						if (graph.model.getChildCount(cells[i]) == 0)
						{
							graph.autoSizeCell(cells[i], false);
						}

						if (key != mxConstants.STYLE_FONTSIZE &&
							graph.isAutosizeTextCell(cells[i]) &&
							graph.model.isVertex(cells[i]))
						{
							graph.updateAutosizeTextFontSize(cells[i],
								graph.getCurrentCellStyle(cells[i], true));
						}
					}
					
					ui.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
							'values', [value], 'cells', cells));
				}
				finally
				{
					graph.getModel().endUpdate();
				}
			}
			
			input.value = (useUnits? this.inUnit(value) : value) + unit;
		}

		mxEvent.consume(evt);
	});

	if (textEditFallback && graph.cellEditor.isContentEditing())
	{
		mxEvent.addGestureListeners(input, mxUtils.bind(this, function(evt)
		{
			if (document.activeElement == graph.cellEditor.textarea)
			{
				selState = graph.cellEditor.saveSelection();
			}
		}));
	}
	
	mxEvent.addListener(input, 'change', update);
	mxEvent.addListener(input, 'blur', update);

	return update;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createPanel = function()
{
	var div = document.createElement('div');
	div.className = 'geFormatSection';
	
	return div;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createTitle = function(title)
{
	var div = document.createElement('div');
	div.className = 'geFormatSectionTitle';
	div.setAttribute('title', title);
	mxUtils.write(div, title);

	return div;
};

/**
 * Creates a collapsible section with a toggle chevron.
 * Returns {wrapper, contentDiv} where contentDiv is the
 * container for section content.
 */
BaseFormatPanel.prototype.createCollapsibleSection = function(title, defaultCollapsed)
{
	var state = this.format.collapsedSections;

	// Use stored state if available, otherwise use default
	var collapsed = (state[title] != null) ? state[title] : defaultCollapsed;

	var wrapper = document.createElement('div');
	wrapper.className = 'geFormatSection';

	var titleDiv = document.createElement('div');
	titleDiv.className = 'geCollapsibleTitle' + (collapsed ? '' : ' geExpanded');
	titleDiv.setAttribute('title', title);
	mxUtils.write(titleDiv, title);
	wrapper.appendChild(titleDiv);

	var contentDiv = document.createElement('div');
	contentDiv.className = 'geCollapsibleContent' + (collapsed ? ' geCollapsed' : '');
	wrapper.appendChild(contentDiv);

	var ui = this.format.editorUi;

	mxEvent.addListener(titleDiv, 'click', function()
	{
		titleDiv.classList.toggle('geExpanded');
		contentDiv.classList.toggle('geCollapsed');
		state[title] = !titleDiv.classList.contains('geExpanded');
		ui.fireEvent(new mxEventObject('collapsedSectionsChanged'));
	});

	return {wrapper: wrapper, contentDiv: contentDiv};
};

/**
 * Hides the collapsible wrapper if inner panel is hidden (display none)
 * or has no visible children. Also observes style changes to keep in sync.
 */
BaseFormatPanel.prototype.syncCollapsibleVisibility = function(wrapper, innerPanel)
{
	var update = function()
	{
		wrapper.style.display = (innerPanel.style.display == 'none') ? 'none' : '';
	};

	// Initial check
	update();

	// Observe attribute changes on inner panel for dynamic display toggling
	if (typeof MutationObserver !== 'undefined')
	{
		var observer = new MutationObserver(update);
		observer.observe(innerPanel, {attributes: true, attributeFilter: ['style']});
		this.listeners.push({destroy: function() { observer.disconnect(); }});
	}
};

/**
 *
 */
BaseFormatPanel.prototype.addAction = function(div, name)
{
	var action = this.editorUi.actions.get(name);
	var btn = null;

	if (action != null && action.isEnabled())
	{
		btn = mxUtils.button(action.getTitle(), mxUtils.bind(this, function(evt)
		{
			try
			{
				action.funct(evt, evt);
			}
			catch (e)
			{
				this.editorUi.handleError(e);
			}
		}));
		
		var short = (action.shortcut != null) ? ' (' + action.shortcut + ')' : '';
		btn.setAttribute('title', action.getTitle() + short);
		btn.style.marginBottom = '2px';
		btn.className = 'geFullWidthElement';
		div.appendChild(btn);
	}

	return btn;
};

/**
 * 
 */
BaseFormatPanel.prototype.addActions = function(div, names)
{
	var lastBr = null;
	var last = null;
	var count = 0;

	for (var i = 0; i < names.length; i++)
	{
		var btn = this.addAction(div, names[i]);

		if (btn != null)
		{
			count++;

			if (mxUtils.mod(count, 2) == 0)
			{
				last.style.marginRight = '4px';
				last.style.width = '104px';
				btn.style.width = '104px';
				lastBr.parentNode.removeChild(lastBr);
			}

			lastBr = mxUtils.br(div);
			last = btn;
		}
	}

	return count;
};

/**
 * 
 */
BaseFormatPanel.prototype.createStepper = function(input, update, step, disableFocus, defaultValue, isFloat)
{
	step = (step != null) ? step : 1;
	var bigStep = 10 * step;
	
	var stepper = document.createElement('div');
	stepper.className = 'geBtnStepper';
	stepper.style.position = 'absolute';
	stepper.style.left = '200px';
	
	var up = document.createElement('div');
	up.style.height = '9px';
	up.style.backgroundImage = 'url(' + Editor.arrowUpImage + ')';
	up.style.width = '10px';
	stepper.appendChild(up);
	
	var down = up.cloneNode(false);
	down.style.backgroundImage = 'url(' + Editor.arrowDownImage + ')';
	stepper.appendChild(down);

	function changeValue(increment, localDefaultValue, evt)
	{
		if (input.value == '')
		{
			input.value = (defaultValue != null) ? defaultValue : localDefaultValue;
		}
		
		var val = isFloat? parseFloat(input.value) : parseInt(input.value);

		if (!isNaN(val))
		{
			// Rounds to avoid IEEE754 artifacts (eg. 0.2 + 0.1) in the input
			input.value = Math.round((val + increment) * 1000000) / 1000000;
			
			if (update != null)
			{
				update(evt);
			}
		}
	};
	
	mxEvent.addGestureListeners(up, function(evt)
	{
		// Stops text selection on shift+click
		mxEvent.consume(evt);
	}, null, function(evt)
	{
		changeValue(mxEvent.isShiftDown(evt) ? bigStep : step, '0', evt);
		mxEvent.consume(evt);
	});
	
	mxEvent.addGestureListeners(down, function(evt)
	{
		// Stops text selection on shift+click
		mxEvent.consume(evt);
	}, null, function(evt)
	{
		changeValue(-(mxEvent.isShiftDown(evt) ? bigStep : step), '2', evt);
		mxEvent.consume(evt);
	});
	
	// Disables transfer of focus to DIV but also :active CSS
	// so it's only used for fontSize where the focus should
	// stay on the selected text, but not for any other input.
	if (disableFocus)
	{
		var currentSelection = null;
		
		mxEvent.addGestureListeners(stepper,
			function(evt)
			{
				mxEvent.consume(evt);
			},
			null,
			function(evt)
			{
				// Workaround for lost current selection in page because of focus in IE
				if (currentSelection != null)
				{
					try
					{
						currentSelection.select();
					}
					catch (e)
					{
						// ignore
					}
					
					currentSelection = null;
					mxEvent.consume(evt);
				}
			}
		);
	}
	else
	{
		// Stops propagation on checkbox labels
		mxEvent.addListener(stepper, 'click', function(evt)
		{
			mxEvent.consume(evt);
		});
	}
	
	return stepper;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createOption = function(label, isCheckedFn, setCheckedFn, listener, fn)
{
	var div = document.createElement('div');
	div.className = 'geFormatEntry';
	
	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.setAttribute('title', label);
	div.appendChild(cb);

	var elt = document.createElement('span');
	elt.className = 'geStyleLabel';
	elt.setAttribute('title', label);
	mxUtils.write(elt, label);
	div.appendChild(elt);

	var applying = false;
	var value = isCheckedFn();
	
	var apply = function(newValue, evt)
	{
		if (!applying)
		{
			applying = true;
			
			if (newValue)
			{
				cb.setAttribute('checked', 'checked');
				cb.defaultChecked = true;
				cb.checked = true;
			}
			else
			{
				cb.removeAttribute('checked');
				cb.defaultChecked = false;
				cb.checked = false;
			}
			
			if (value != newValue)
			{
				value = newValue;
				
				// Checks if the color value needs to be updated in the model
				if (isCheckedFn() != value)
				{
					setCheckedFn(value, evt);
				}
			}
			
			applying = false;
		}
	};

	mxEvent.addListener(div, 'click', function(evt)
	{
		if (cb.getAttribute('disabled') != 'disabled')
		{
			// Toggles checkbox state for click on label
			var source = mxEvent.getSource(evt);
			
			if (source == div || source == elt)
			{
				cb.checked = !cb.checked;
			}
			
			apply(cb.checked, evt);
		}
	});
	
	apply(value);
	
	if (listener != null)
	{
		listener.install(apply);
		this.listeners.push(listener);
	}
	
	if (fn != null)
	{
		fn(div);
	}

	return div;
};

/**
 * The string 'null' means use null in values.
 */
BaseFormatPanel.prototype.createCellOption = function(label, key, defaultValue, enabledValue, disabledValue, fn, action, stopEditing, cells)
{	
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	enabledValue = (enabledValue != null) ? ((enabledValue == 'null') ? null : enabledValue) : 1;
	disabledValue = (disabledValue != null) ? ((disabledValue == 'null') ? null : disabledValue) : 0;

	var style = (cells != null) ? graph.getCommonStyle(cells) : ui.getSelectionState().style;

	return this.createOption(label, function()
	{
		return mxUtils.getValue(style, key, defaultValue) != disabledValue;
	}, function(checked)
	{
		if (stopEditing)
		{
			graph.stopEditing();
		}
		
		if (action != null)
		{
			action.funct();
		}
		else
		{
			graph.getModel().beginUpdate();
			try
			{
				var temp = (cells != null) ? cells : ui.getSelectionState().cells;
				var value = (checked) ? enabledValue : disabledValue;
				graph.setCellStyles(key, value, temp);

				if (fn != null)
				{
					fn(temp, value);
				}
				
				ui.fireEvent(new mxEventObject('styleChanged', 'keys',
					[key], 'values', [value], 'cells', temp));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	},
	{
		install: function(apply)
		{
			this.listener = function()
			{
				apply(mxUtils.getValue(style, key, defaultValue) != disabledValue);
			};
			
			graph.getModel().addListener(mxEvent.CHANGE, this.listener);
		},
		destroy: function()
		{
			graph.getModel().removeListener(this.listener);
		}
	});
};

/**
 * Adds the given color option.
 */
BaseFormatPanel.prototype.createColorOption = function(label, getColorFn, setColorFn, defaultColor,
	listener, callbackFn, hideCheckbox, defaultColorValue, singleColorMode, isDarkModeFn, title, inheritInfo)
{
	// Resolves the color an 'inherit' value currently renders as, for previewing
	// in the swatch and seeding the picker. Falls back to the default color.
	function getInheritedColorValue()
	{
		var col = (inheritInfo != null && inheritInfo.getColor != null) ?
			inheritInfo.getColor() : null;

		return (col != null && col != 'inherit') ? col : defaultColorValue;
	};
	var darkModeOverridden = isDarkModeFn != null;
	isDarkModeFn = (isDarkModeFn != null) ? isDarkModeFn : Editor.isDarkMode;

	var graph = this.editorUi.editor.graph;
	var div = document.createElement('div');
	div.className = 'geFormatEntry';
	
	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.setAttribute('title', label);

	if (!hideCheckbox)
	{
		div.appendChild(cb);
	}

	var span = document.createElement('span');
	mxUtils.write(span, label);
	span.setAttribute('title', label);
	div.appendChild(span);

	var value = getColorFn();
	var applying = false;
	var dropper = null;
	var btn = null;

	var clrInput = document.createElement('input');
	clrInput.setAttribute('type', 'color');
	clrInput.style.position = 'relative';
	clrInput.style.visibility = 'hidden';
	clrInput.style.top = '10px';
	clrInput.style.width = '0px';
	clrInput.style.height = '0px';
	clrInput.style.border = 'none';

	// Extracts single color value from light-dark color
	function getActualColorValue(color, allowDefault)
	{
		if (color == 'default' && !allowDefault)
		{
			color = defaultColorValue;
		}

		if (color != 'default' && singleColorMode)
		{
			var temp = mxUtils.getLightDarkColor(color);
			color = (isDarkModeFn()) ? temp.dark : temp.light;
		}

		return color;
	};

	// Adds native color dialog
	if (!mxClient.IS_TOUCH)
	{
		dropper = document.createElement('img');
		dropper.src = Editor.colorDropperImage;
		dropper.className = 'geColorDropper geAdaptiveAsset';

		mxEvent.addListener(dropper, 'click', function(evt)
		{
			clrInput.value = getActualColorValue(value);
			clrInput.click();
			mxEvent.consume(evt);
		});
	}
	
	var selState = null;
	
	var apply = function(color, disableUpdate)
	{
		if (!applying)
		{
			applying = true;

			if (callbackFn != null)
			{
				callbackFn(color);
			}
			
			if (!disableUpdate)
			{
				if (selState != null)
				{
					graph.cellEditor.restoreSelection(selState);
					selState = null;
				}

				setColorFn(color);
			}

			value = getColorFn();
			// Previews the resolved color for an inherited value in the swatch
			var swatchValue = (value == 'inherit' && inheritInfo != null) ?
				getInheritedColorValue() : value;
			var cssColor = mxUtils.getLightDarkColor(
				(swatchValue != 'default') ? swatchValue :
					defaultColorValue);

			var div = document.createElement('div');
			div.style.width = '21px';
			div.style.height = '12px';
			div.style.margin = '2px 18px 2px 3px';
			div.style.borderWidth = '1px';
			div.style.borderStyle = 'solid';
			div.style.backgroundColor = cssColor.cssText;
			btn.innerText = '';
			btn.appendChild(div);
			
			if (!singleColorMode && mxUtils.isLightDarkColor(swatchValue) &&
				cssColor.light != cssColor.dark)
			{
				div.style.background = 'linear-gradient(to right bottom, ' +
					cssColor.cssText + ' 50%, ' + mxUtils.invertLightDarkColor(cssColor).
					cssText + ' 50.3%)';
			}
			else if (singleColorMode && darkModeOverridden)
			{
				// Handles special case of fixed color
				div.style.backgroundColor = (isDarkModeFn()) ?
					cssColor.dark : cssColor.light;
			}

			if (dropper != null)
			{
				div.style.width = '21px';
				div.style.margin = '2px 18px 2px 3px';
				div.appendChild(dropper);
			}
			else
			{
				div.style.width = '36px';
				div.style.margin = '3px';
			}

			// Adds tooltip to color button
			if (value != null && value != mxConstants.NONE &&
				value.length > 1 && typeof value === 'string')
			{
				var clr = (value.charAt(0) == '#') ?
				value.substring(1).toUpperCase() : value;
				var name = ColorDialog.prototype.colorNames[clr];

				if (name != null)
				{
					btn.setAttribute('title', name);
				}
				else if (value == 'default')
				{
					btn.setAttribute('title', mxResources.get('useBlackAndWhite'));
				}
				else
				{
					btn.setAttribute('title', value);
				}
			}

			// 'inherit' is the no-own-color state (eg. a table cell using its
			// table's line/fill color), not a contextual reference like the
			// other special colors. Keep the checkbox visible but unchecked so
			// the color can be re-enabled, instead of hiding it.
			if (graph.isSpecialColor(value) && value != 'inherit')
			{
				cb.style.display = 'none';
			}
			else
			{
				cb.style.display = '';

				if (value != null && value != mxConstants.NONE && value != 'inherit')
				{
					cb.setAttribute('checked', 'checked');
					cb.defaultChecked = true;
					cb.checked = true;
				}
				else
				{
					cb.removeAttribute('checked');
					cb.defaultChecked = false;
					cb.checked = false;
				}
			}
	
			btn.style.display = (cb.checked || hideCheckbox ||
				(value == 'inherit' && inheritInfo != null)) ? '' : 'none';
			applying = false;
		}
	};
	
	div.appendChild(clrInput);

	mxEvent.addListener(clrInput, 'change', function()
	{
		var color = clrInput.value;

		// Adds selected color to light-dark color
		if (!singleColorMode)
		{
			var cssColor = mxUtils.getLightDarkColor(value);

			if (isDarkModeFn())
			{
				cssColor.dark = color;
			}
			else
			{
				cssColor.light = color;
			}

			color = 'light-dark(' + cssColor.light +
				', ' + cssColor.dark + ')';
		}

		apply(color);
	});

	btn = mxUtils.button('', mxUtils.bind(this, function(evt)
	{
		var actualDefaultValue = defaultColorValue;

		if (singleColorMode && isDarkModeFn() &&
			mxUtils.isLightDarkColor(actualDefaultValue))
		{
			actualDefaultValue = mxUtils.getLightDarkColor(defaultColorValue).dark;
		}

		// Seeds the picker with the resolved color for an inherited value so it
		// shows the inherited color rather than the literal 'inherit' token.
		var pickerColor = (value == 'inherit' && inheritInfo != null) ?
			getInheritedColorValue() : getActualColorValue(value, true);

		this.editorUi.pickColor(pickerColor, function(newColor)
		{
			apply(newColor);
		}, (defaultColor == 'default') ? 'default' : null,
			actualDefaultValue, singleColorMode, title || label, function()
		{
			// Returns NONE rather than null when the new selection has no value
			// for this key, so the open (non-modal) color window updates to
			// "none" instead of keeping the previous selection's color, e.g.
			// switching to a shape with no gradient or one that has no fill.
			// ColorWindow.refreshColor ignores null, so null would be stale.
			var current = getColorFn();
			var refreshValue = (current == 'inherit' && inheritInfo != null) ?
				getInheritedColorValue() : getActualColorValue(current, true);

			return (refreshValue != null) ? refreshValue : mxConstants.NONE;
		}, (inheritInfo != null) ? inheritInfo.allow : null);

		mxEvent.consume(evt);
	}));
	
	btn.className = 'geColorBtn';
	btn.style.display = (cb.checked || hideCheckbox ||
		(value == 'inherit' && inheritInfo != null)) ? '' : 'none';
	div.appendChild(btn);

	var clr = (value != null && typeof value === 'string' &&value.charAt(0) == '#') ?
		value.substring(1).toUpperCase() : value;
	var name = ColorDialog.prototype.colorNames[clr];

	if (name != null)
	{
		btn.setAttribute('title', name);
	}

	if (!hideCheckbox)
	{
		mxEvent.addListener(div, 'click', function(evt)
		{
			var source = mxEvent.getSource(evt);
			
			if (source == cb || source.nodeName != 'INPUT')
			{		
				// Toggles checkbox state for click on label
				if (source != cb)
				{
					cb.checked = !cb.checked;
				}
		
				// Overrides default value with current value to make it easier
				// to restore previous value if the checkbox is clicked twice
				if (!cb.checked && value != null && value != mxConstants.NONE &&
					defaultColor != mxConstants.NONE)
				{
					defaultColor = getActualColorValue(value);
				}
				
				apply((cb.checked) ? defaultColor : mxConstants.NONE);
			}
		});

		mxEvent.addGestureListeners(cb, mxUtils.bind(this, function(evt)
		{
			if (document.activeElement == graph.cellEditor.textarea)
			{
				selState = graph.cellEditor.saveSelection();
			}
		}));
	
		mxEvent.addGestureListeners(div, mxUtils.bind(this, function(evt)
		{
			if (document.activeElement == graph.cellEditor.textarea)
			{
				selState = graph.cellEditor.saveSelection();
			}
		}));
	}
	
	apply(value, true);
	
	if (listener != null)
	{
		listener.install(function()
		{
			apply(value, true);
		}, this.listeners.push(listener));
	}

	return div;
};

/**
 * 
 */
BaseFormatPanel.prototype.createArrayCellColorOption = function(label, colorKey, defaultColor,
	callbackFn, setStyleFn, defaultColorValue, undefinedValue)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var style = graph.getCellStyle(graph.getSelectionCell(), false);
	var value = (style != null) ? ((style[colorKey] != null) ?
		style[colorKey] : undefinedValue) : null;
	var values = (value != null) ? mxUtils.parseColorList(value) : [];
	var div = document.createElement('div');

	for (var i = 0; i < values.length; i++)
	{
		(mxUtils.bind(this, function(index)
		{
			div.appendChild(this.createColorOption(label + ' (' + (index + 1) + ')', function()
			{
				return values[i];
			}, function(color)
			{
				graph.getModel().beginUpdate();
				try
				{
					var cells = ui.getSelectionState().cells;
					values[index] = color;
					var temp = values.join(',');
					graph.setCellStyles(colorKey, temp, cells);

					if (setStyleFn != null)
					{
						setStyleFn(color);
					}
					
					ui.fireEvent(new mxEventObject('styleChanged', 'keys', [colorKey],
						'values', [temp], 'cells', cells));
				}
				finally
				{
					graph.getModel().endUpdate();
				}
			}, defaultColor || mxConstants.NONE,
			{
				install: function(apply)
				{
					this.listener = function()
					{
						var style = graph.getCellStyle(graph.getSelectionCell(), false);

						if (style != null)
						{
							var value = (style != null) ? ((style[colorKey] != null) ?
								style[colorKey] : undefinedValue) : null;
							values = (value != null) ?
								mxUtils.parseColorList(value) : [];
							apply(values[i], true);
						}
					};
					
					graph.getModel().addListener(mxEvent.CHANGE, this.listener);
				},
				destroy: function()
				{
					graph.getModel().removeListener(this.listener);
				}
			}, callbackFn, null, defaultColorValue));
		}))(i);
	}

	return div;
};

/**
 * 
 */
BaseFormatPanel.prototype.createCellColorOption = function(label, colorKey, defaultColor,
	callbackFn, setStyleFn, defaultColorValue, undefinedValue, allowArrays, title)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;

	function getValue()
	{
		var style = graph.getCellStyle(graph.getSelectionCell(), false);
		var returnValue = (style != null) ? style[colorKey] : null;

		// Handles special case for inherited colors
		if (returnValue == 'inherit')
		{
			var parent = graph.getModel().getParent(graph.getSelectionCell());
			var pstyle = graph.getCellStyle(parent, false);

			if (pstyle != null && pstyle[colorKey] != null)
			{
				returnValue = pstyle[colorKey];
			}
		}

		return (style != null) ? ((returnValue != null) ?
			returnValue : undefinedValue) : null;
	};

	var value = getValue();

	// Drives the "Inherit" affordance for colorKey. allow() reports whether the
	// current selection can inherit (it lives inside another shape such as a
	// table, swimlane or container); getColor() resolves the color it currently
	// inherits, for the swatch preview. Both read the live selection so the
	// reused (non-modal) color window tracks selection changes while open.
	var inheritInfo = {
		allow: function()
		{
			var cell = graph.getSelectionCell();
			var parent = (cell != null) ? graph.getModel().getParent(cell) : null;

			return parent != null && graph.getModel().isVertex(parent);
		},
		getColor: function()
		{
			var curr = graph.getModel().getParent(graph.getSelectionCell());

			while (curr != null && graph.getModel().isVertex(curr))
			{
				var style = graph.getCellStyle(curr, false);
				var col = (style != null) ? style[colorKey] : null;

				if (col != null && col != 'inherit')
				{
					return col;
				}

				curr = graph.getModel().getParent(curr);
			}

			return null;
		}
	};

	if (value != null && allowArrays && mxUtils.parseColorList(value).length > 1)
	{
		return this.createArrayCellColorOption(label, colorKey, defaultColor,
			callbackFn, setStyleFn, defaultColorValue, undefinedValue);
	}
	else
	{
		return this.createColorOption(label, getValue, function(color)
		{
			graph.getModel().beginUpdate();
			try
			{
				var cells = ui.getSelectionState().cells;
				graph.setCellStyles(colorKey, color, cells);

				if (setStyleFn != null)
				{
					setStyleFn(color);
				}
				
				ui.fireEvent(new mxEventObject('styleChanged', 'keys', [colorKey],
					'values', [color], 'cells', cells));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}, defaultColor || mxConstants.NONE,
		{
			install: function(apply)
			{
				this.listener = function()
				{
					var style = graph.getCellStyle(graph.getSelectionCell(), false);

					if (style != null)
					{
						apply((style[colorKey] != null) ? style[colorKey] :
							undefinedValue, true);
					}
				};
				
				graph.getModel().addListener(mxEvent.CHANGE, this.listener);
			},
			destroy: function()
			{
				graph.getModel().removeListener(this.listener);
			}
		}, callbackFn, null, defaultColorValue, null, null, title, inheritInfo);
	}
};

/**
 * 
 */
BaseFormatPanel.prototype.addArrow = function(elt)
{
	var arrow = document.createElement('div');
	arrow.className = 'geAdaptiveAsset geArrow';
	arrow.style.backgroundImage = 'url(' + Editor.thinExpandImage + ')';
	elt.className = 'geStyleBtn';
	elt.appendChild(arrow);

	return arrow;
};

/**
 * 
 */
BaseFormatPanel.prototype.addUnitInput = function(container, unit, right, width, update, step, marginTop, disableFocus, isFloat)
{
	marginTop = (marginTop != null) ? marginTop : 0;
	
	var input = document.createElement('input');
	input.style.position = 'absolute';
	input.style.left = (216 - right - width) + 'px';

	input.style.width = width + 'px';
	container.appendChild(input);
	
	var stepper = this.createStepper(input, update, step, disableFocus, null, isFloat);
	stepper.style.left = (216 - right) + 'px';
	container.appendChild(stepper);

	return input;
};

/**
 * 
 */
BaseFormatPanel.prototype.addGenericInput = function(container, unit, left, width, readFn, writeFn)
{
	var graph = this.editorUi.editor.graph;

	var update = function()
	{
		writeFn(input.value);
	};

	var input = this.addUnitInput(container, unit, left, width, update);

	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		if (force || input != document.activeElement)
		{
			input.value = readFn() + unit;
		}
	});
	
	mxEvent.addListener(input, 'keydown', function(e)
	{
		if (e.keyCode == 13)
		{
			graph.container.focus();
			mxEvent.consume(e);
		}
		else if (e.keyCode == 27)
		{
			listener(null, null, true);
			graph.container.focus();
			mxEvent.consume(e);
		}
	});
	
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();

	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);

	return input;
};

/**
 * 
 */
BaseFormatPanel.prototype.createRelativeOption = function(label, key, width, handler, init)
{
	width = (width != null) ? width : 52;
	
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var div = this.createPanel();
	div.className = 'geFormatEntry';
	mxUtils.write(div, label);
	div.setAttribute('title', label);
	div.style.fontWeight = 'bold';

	var update = mxUtils.bind(this, function(evt)
	{
		if (handler != null)
		{
			handler(input);
		}
		else
		{
			var value = parseInt(input.value);
			value = Math.min(100, Math.max(0, (isNaN(value)) ? 100 : value));
			var state = graph.view.getState(ui.getSelectionState().cells[0]);
			
			if (state != null && value != mxUtils.getValue(state.style, key, 100))
			{
				// Removes entry in style (assumes 100 is default for relative values)
				if (value == 100)
				{
					value = null;
				}
				
				var cells = ui.getSelectionState().cells;
				graph.setCellStyles(key, value, cells);
				this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
					'values', [value], 'cells', cells));
			}
	
			input.value = ((value != null) ? value : '100') + ' %';
		}
		
		mxEvent.consume(evt);
	});

	var input = this.addUnitInput(div, '%', 16,
		width, update, 10, 0, handler != null);
	input.setAttribute('title', label);

	if (key != null)
	{
		var listener = mxUtils.bind(this, function(sender, evt, force)
		{
			if (force || input != document.activeElement)
			{
				var ss = ui.getSelectionState();
				var tmp = parseInt(mxUtils.getValue(ss.style, key, 100));
				input.value = (isNaN(tmp)) ? '' : tmp + ' %';
			}
		});
		
		mxEvent.addListener(input, 'keydown', function(e)
		{
			if (e.keyCode == 13)
			{
				graph.container.focus();
				mxEvent.consume(e);
			}
			else if (e.keyCode == 27)
			{
				listener(null, null, true);
				graph.container.focus();
				mxEvent.consume(e);
			}
		});
		
		graph.getModel().addListener(mxEvent.CHANGE, listener);
		this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
		listener();
	}

	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);
	
	if (init != null)
	{
		init(input);
	}

	return div;
};

/**
 * 
 */
BaseFormatPanel.prototype.addLabel = function(div, title, right, width)
{
	width = (width != null) ? width : 61;

	var label = document.createElement('div');
	mxUtils.write(label, title);
	label.setAttribute('title', title);
	label.style.position = 'absolute';
	label.style.left = (226 - right - width) + 'px';
	label.style.width = width + 'px';
	label.style.marginTop = '10px';
	label.style.display = 'flex';
	label.style.justifyContent = 'center';
	div.appendChild(label);

	return label;
};

/**
 * 
 */
BaseFormatPanel.prototype.addKeyHandler = function(input, listener)
{
	mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function(e)
	{
		if (e.keyCode == 13)
		{
			this.editorUi.editor.graph.container.focus();
			mxEvent.consume(e);
		}
		else if (e.keyCode == 27)
		{
			if (listener != null)
			{
				listener(null, null, true);				
			}

			this.editorUi.editor.graph.container.focus();
			mxEvent.consume(e);
		}
	}));
};

/**
 * Adds the label menu items to the given menu and parent.
 */
BaseFormatPanel.prototype.destroy = function()
{
	if (this.listeners != null)
	{
		for (var i = 0; i < this.listeners.length; i++)
		{
			this.listeners[i].destroy();
		}
		
		this.listeners = null;
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(ArrangePanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.init = function()
{
	var ss = this.editorUi.getSelectionState();

	if (ss.cells.length > 0)
	{
		this.container.appendChild(this.addLayerOps(this.createPanel()));

		// Special case that adds two panels
		var geoSec = this.createCollapsibleSection(mxResources.get('size') +
			' / ' + mxResources.get('position'), false);
		this.addGeometry(geoSec.contentDiv);

		if (geoSec.contentDiv.childNodes.length > 0)
		{
			this.container.appendChild(geoSec.wrapper);
		}

		if (ss.edges.length > 0 && (ss.style.shape == 'link' || ss.style.shape == 'flexArrow'))
		{
			var arrowSec = this.createCollapsibleSection(mxResources.get('arrow'), false);
			this.addArrowGeometry(arrowSec.contentDiv);
			this.container.appendChild(arrowSec.wrapper);
		}

		if (ss.edges.length == 1)
		{
			var edge = ss.edges[0];
			var graph = this.editorUi.editor.graph;
			var title = '';

			if (graph.model.getTerminal(edge, true) == null)
			{
				title = mxResources.get('linestart');
			}

			if (graph.model.getTerminal(edge, false) == null)
			{
				title += ((title.length > 0) ? ' / ' : '') +
					mxResources.get('lineend');
			}

			// Only when the edge is selected on its own: with a shape also
			// selected the line start/end inputs are blanked (see addEdgeGeometry),
			// which would leave just an empty section title
			if (title.length > 0 && ss.cells.length == 1)
			{
				var edgeGeoSec = this.createCollapsibleSection(title, false);
				edgeGeoSec.contentDiv.style.paddingBottom = '10px';
				this.addEdgeGeometry(edgeGeoSec.contentDiv);
				this.container.appendChild(edgeGeoSec.wrapper);
			}
		}

		// Direction of an edge: which side a self-loop sits on (dropdown) plus the
		// reverse/turn button that inverts the edge direction
		if (ss.vertices.length == 0 && ss.edges.length > 0 && !ss.containsLabel)
		{
			var dirSec = this.createCollapsibleSection(mxResources.get('direction'), false);
			var dirPanel = this.createPanel();

			// Reverse/turn button on top, then the loop direction dropdown
			this.addEdgeTurn(dirPanel);

			if (ss.edges.length == 1)
			{
				var loopEdge = ss.edges[0];
				var loopModel = this.editorUi.editor.graph.model;

				if (loopModel.getTerminal(loopEdge, true) != null &&
					loopModel.getTerminal(loopEdge, true) == loopModel.getTerminal(loopEdge, false))
				{
					this.addLoopDirection(dirPanel);
				}
			}

			dirSec.contentDiv.appendChild(dirPanel);
			this.container.appendChild(dirSec.wrapper);
		}

		// Rotation (vertices); the edge reverse/turn lives in the direction section
		// above, so this is hidden when addAngle would leave it empty
		if (!ss.containsLabel || ss.edges.length == 0)
		{
			var angleSec = this.createCollapsibleSection(mxResources.get('rotation'), true);
			var anglePanel = this.addAngle(this.createPanel());
			angleSec.contentDiv.appendChild(anglePanel);

			if (anglePanel.childNodes.length > 0)
			{
				this.container.appendChild(angleSec.wrapper);
			}
		}

		if (!ss.containsLabel)
		{
			var flipSec = this.createCollapsibleSection(mxResources.get('flip'), true);
			flipSec.contentDiv.appendChild(this.addFlip(this.createPanel()));
			this.container.appendChild(flipSec.wrapper);
		}

		this.container.appendChild(this.addAlign(this.createPanel()));

		if (ss.vertices.length > 1 && !ss.cell && !ss.row)
		{
			this.container.appendChild(this.addDistribute(this.createPanel()));
		}

		var tablePanel = this.addTable(this.createPanel());
		var tableSec = this.createCollapsibleSection(mxResources.get('table'), true);
		tableSec.contentDiv.appendChild(tablePanel);
		this.container.appendChild(tableSec.wrapper);
		this.syncCollapsibleVisibility(tableSec.wrapper, tablePanel);
	}

	// Allows to lock/unload button to be added
	this.container.appendChild(this.addGroupOps(this.createPanel()));
};

/**
 * 
 */
ArrangePanel.prototype.addTable = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = ui.getSelectionState();
	var panel = document.createElement('div');
	panel.style.position = 'relative';
	panel.style.paddingLeft = '0px';
	panel.style.borderWidth = '0px';
	panel.style.width = '220px';
	panel.className = 'geToolbarContainer';

	var cell = ss.vertices[0];

	if (graph.getSelectionCount() > 1)
	{
		if (graph.isTableCell(cell))
		{
			cell = graph.model.getParent(cell);
		}

		if (graph.isTableRow(cell))
		{
			cell = graph.model.getParent(cell);
		}
	}

	var isTable = ss.table || ss.row || ss.cell;
	var isStack = graph.isStack(cell) ||
		graph.isStackChild(cell);

	var tableForCheck = cell;

	if (tableForCheck != null && graph.isTableCell(tableForCheck))
	{
		tableForCheck = graph.model.getParent(tableForCheck);
	}

	if (tableForCheck != null && graph.isTableRow(tableForCheck))
	{
		tableForCheck = graph.model.getParent(tableForCheck);
	}

	var emptyTable = !isStack && tableForCheck != null &&
		graph.model.getChildCount(tableForCheck) === 0;

	var showCols = isTable;
	var showRows = isTable;

	if (isStack)
	{
		var style = (graph.isStack(cell)) ? ss.style :
			graph.getCellStyle(graph.model.getParent(cell));

		showRows = style['horizontalStack'] == '0';
		showCols = !showRows;
	}

	var btns = [];

	if (showCols)
	{
		btns = btns.concat([
			ui.addButton(Editor.addColumnLeftImage, mxResources.get('insertColumnBefore'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (isStack)
					{
						graph.insertLane(cell, true);
					}
					else
					{
						graph.insertTableColumn(cell, true);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), panel),
			ui.addButton(Editor.addColumnRightImage, mxResources.get('insertColumnAfter'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (isStack)
					{
						graph.insertLane(cell, false);
					}
					else
					{
						graph.insertTableColumn(cell, false);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), panel),
			ui.addButton(Editor.removeColumnImage, mxResources.get('deleteColumn'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (isStack)
					{
						graph.deleteLane(cell);
					}
					else
					{
						graph.deleteTableColumn(cell);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), panel)]);

		if (emptyTable)
		{
			btns[btns.length - 3].setAttribute('disabled', 'disabled');
			btns[btns.length - 2].setAttribute('disabled', 'disabled');
		}
	}

	if (showRows)
	{
		btns = btns.concat([ui.addButton(Editor.addRowAboveImage, mxResources.get('insertRowBefore'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (isStack)
					{
						graph.insertLane(cell, true);
					}
					else
					{
						graph.insertTableRow(cell, true);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), panel),
			ui.addButton(Editor.addRowBelowImage, mxResources.get('insertRowAfter'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (isStack)
					{
						graph.insertLane(cell, false);
					}
					else
					{
						graph.insertTableRow(cell, false);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), panel),
			ui.addButton(Editor.removeRowImage, mxResources.get('deleteRow'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (isStack)
					{
						graph.deleteLane(cell);
					}
					else
					{
						graph.deleteTableRow(cell);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), panel)]);
	}

	if (btns.length > 0)
	{
		div.appendChild(panel);

		if (btns.length > 3)
		{
			btns[2].style.marginRight = '10px';
		}

		var count = 0;

		if (ss.mergeCell != null)
		{
			count += this.addActions(div, ['mergeCells']);
		}
		else if (ss.style['colspan'] > 1 || ss.style['rowspan'] > 1)
		{
			count += this.addActions(div, ['unmergeCells']);
		}

		if (count > 0)
		{
			panel.style.paddingBottom = '2px';
		}
	}
	else
	{
		div.style.display = 'none';
	}
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addLayerOps = function(div)
{
	this.addActions(div, ['toFront', 'toBack']);
	this.addActions(div, ['bringForward', 'sendBackward']);
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addGroupOps = function(div)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = ui.getSelectionState();

	var count = this.addActions(div, ['group', 'ungroup']) +
		this.addActions(div, ['removeFromGroup']);

	if (!ss.cell && !ss.row)
	{
		count += this.addActions(div, ['copySize', 'pasteSize', 'swap']);
	}

	var resetSelect = document.createElement('select');
	resetSelect.style.position = 'relative';
	resetSelect.className = 'geFullWidthElement';
	resetSelect.style.marginBottom = '2px';

	var ops = [{label: mxResources.get('reset') + '...', action: 'reset'},
		{label: mxResources.get('waypoints'), action: 'clearWaypoints'},
		{label: mxResources.get('connectionPoints'), action: 'clearAnchors'}];

	for (var i = 0; i < ops.length; i++)
	{
		var action = this.editorUi.actions.get(ops[i].action);

		if (action == null || action.enabled)
		{
			var option = document.createElement('option');
			option.setAttribute('value', ops[i].action);
			option.setAttribute('title', ops[i].label +
				((action != null && action.shortcut != null) ?
					' (' + action.shortcut + ')' : ''));
			mxUtils.write(option, ops[i].label);
			resetSelect.appendChild(option);
		}
	}

	if (resetSelect.children.length > 1)
	{
		resetSelect.value = 'reset';
		div.appendChild(resetSelect);
		mxUtils.br(div);
		count++;

		mxEvent.addListener(resetSelect, 'change', mxUtils.bind(this, function(evt)
		{
			var action = this.editorUi.actions.get(resetSelect.value);
			resetSelect.value = 'reset';

			if (action != null)
			{
				action.funct();
			}
		}));
	}

	count += this.addActions(div, ['lockUnlock']);

	if (ss.vertices.length == 1 && ss.edges.length == 0)
	{
		if (graph.getOpposites(graph.getEdges(ss.vertices[0]),
			ss.vertices[0]).length > 0)
		{
			count += this.addActions(div, ['explore']);
		}
	}

	if (count == 0)
	{
		div.style.display = 'none';
	}
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addAlign = function(div)
{
	var ui = this.editorUi;
	var ss = ui.getSelectionState();
	var graph = ui.editor.graph;
	div.appendChild(this.createTitle(mxResources.get('align')));
	
	if (ss.vertices.length > 1)
	{
		var stylePanel = document.createElement('div');
		stylePanel.className = 'geToolbarContainer';
		ui.addButton(Editor.alignHorizontalLeftImage, mxResources.get('left'),
			function() { graph.alignCells(mxConstants.ALIGN_LEFT); }, stylePanel).
			style.marginLeft = '6px';
		ui.addButton(Editor.alignHorizontalCenterImage, mxResources.get('center'),
			function() { graph.alignCells(mxConstants.ALIGN_CENTER); }, stylePanel);
		ui.addButton(Editor.alignHorizontalRightImage, mxResources.get('right'),
			function() { graph.alignCells(mxConstants.ALIGN_RIGHT); }, stylePanel);
		
		ui.addButton(Editor.alignVerticalTopImage, mxResources.get('top'),
			function() { graph.alignCells(mxConstants.ALIGN_TOP); }, stylePanel).
			style.marginLeft = '12px';
		ui.addButton(Editor.alignVerticalMiddleImage, mxResources.get('middle'),
			function() { graph.alignCells(mxConstants.ALIGN_MIDDLE); }, stylePanel);
		ui.addButton(Editor.alignVerticalBottomImage, mxResources.get('bottom'),
			function() { graph.alignCells(mxConstants.ALIGN_BOTTOM); }, stylePanel);
		div.appendChild(stylePanel);
	}

	this.addActions(div, ['snapToGrid']);
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addFlip = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = this.editorUi.getSelectionState();

	var btn = mxUtils.button(mxResources.get('horizontal'), function(evt)
	{
		graph.flipCells(ss.cells, true);
	})
	
	btn.setAttribute('title', mxResources.get('horizontal'));
	btn.style.width = '104px';
	btn.style.marginRight = '2px';
	div.appendChild(btn);
	
	var btn = mxUtils.button(mxResources.get('vertical'), function(evt)
	{
		graph.flipCells(ss.cells, false);
	})

	btn.setAttribute('title', mxResources.get('vertical'));
	btn.style.width = '104px';
	div.appendChild(btn);

	return div;
};

/**
 * Adds a direction selector for self-loops, choosing which side of the vertex
 * the loop sits on. It drives the loop geometry directly - re-routing the loop
 * to the chosen side via getLoopAroundPoints - rather than STYLE_DIRECTION,
 * which is ignored once a loop carries inner waypoints; the displayed value is
 * read back from the loop's actual position. For fixed-anchor shapes (lifeline
 * spine / horizontal backbone) only the two sides perpendicular to the line are
 * offered, since the others are not meaningful there.
 */
ArrangePanel.prototype.addLoopDirection = function(div)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = ui.getSelectionState();
	var edge = ss.edges[0];
	var state = graph.view.getState(edge);

	if (state == null)
	{
		return div;
	}

	var select = document.createElement('select');
	select.className = 'geFullWidthElement';
	select.style.boxSizing = 'border-box';
	// Overrides the absolute positioning of .geFormatSection select so the
	// dropdown keeps flow height and the next section divider is pushed down
	select.style.position = 'relative';
	select.setAttribute('title', mxResources.get('direction'));

	// A fixed-anchor perimeter only supports the two sides perpendicular to its
	// line (vertical spine -> east/west, horizontal backbone -> north/south)
	var axis = graph.getLoopFixedAxis(state);
	var dirs = (axis == 'x') ? [mxConstants.DIRECTION_EAST, mxConstants.DIRECTION_WEST] :
		(axis == 'y') ? [mxConstants.DIRECTION_NORTH, mxConstants.DIRECTION_SOUTH] :
		[mxConstants.DIRECTION_NORTH, mxConstants.DIRECTION_EAST,
			mxConstants.DIRECTION_SOUTH, mxConstants.DIRECTION_WEST];

	for (var i = 0; i < dirs.length; i++)
	{
		var option = document.createElement('option');
		option.setAttribute('value', dirs[i]);
		mxUtils.write(option, mxResources.get(dirs[i]));
		select.appendChild(option);
	}

	// Reads the current side back from the loop's actual geometry so the value
	// matches the visible position (STYLE_DIRECTION is dead/inverted for the
	// inner-waypoint loops this control routes)
	var cur = this.getLoopDirection(state);
	select.value = (mxUtils.indexOf(dirs, cur) >= 0) ? cur : dirs[0];

	mxEvent.addListener(select, 'change', mxUtils.bind(this, function()
	{
		this.setLoopDirection(edge, select.value);
		ui.fireEvent(new mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_DIRECTION],
			'values', [select.value], 'cells', ss.cells));
	}));

	// Drops the dropdown onto its own line below the button, matching the
	// spacing between the two edge buttons (white-space: nowrap needs the break)
	if (div.firstChild != null)
	{
		mxUtils.br(div);
		select.style.marginTop = '2px';
	}

	div.appendChild(select);

	return div;
};

/**
 * Returns the side a self-loop currently sits on (a mxConstants.DIRECTION_*),
 * derived from the loop body's position relative to the source centre, or null.
 */
ArrangePanel.prototype.getLoopDirection = function(state)
{
	var source = (state != null) ? state.getVisibleTerminalState(true) : null;
	var pts = (state != null) ? state.absolutePoints : null;

	if (source == null || pts == null || pts.length < 3)
	{
		return null;
	}

	// Mean of the inner (non-terminal) points = the loop body's far side
	var mx = 0, my = 0, n = 0;

	for (var i = 1; i < pts.length - 1; i++)
	{
		if (pts[i] != null)
		{
			mx += pts[i].x;
			my += pts[i].y;
			n++;
		}
	}

	if (n == 0)
	{
		return null;
	}

	var dx = (mx / n) - source.getCenterX();
	var dy = (my / n) - source.getCenterY();

	return (Math.abs(dx) >= Math.abs(dy)) ?
		((dx >= 0) ? mxConstants.DIRECTION_EAST : mxConstants.DIRECTION_WEST) :
		((dy >= 0) ? mxConstants.DIRECTION_SOUTH : mxConstants.DIRECTION_NORTH);
};

/**
 * Re-routes the given self-loop so it sits on the chosen side, by feeding a
 * point just outside that side to the perimeter-aware getLoopAroundPoints and
 * committing the result as inner waypoints.
 */
ArrangePanel.prototype.setLoopDirection = function(edge, dir)
{
	var graph = this.editorUi.editor.graph;
	var state = graph.view.getState(edge);
	var source = (state != null) ? state.getVisibleTerminalState(true) : null;

	if (source == null)
	{
		return;
	}

	// A point just outside the chosen side (in scaled coordinates) drives the
	// perimeter-aware loop placement
	var off = 2 * graph.gridSize * graph.view.scale;
	var cx = source.getCenterX();
	var cy = source.getCenterY();
	var p = (dir == mxConstants.DIRECTION_EAST) ? new mxPoint(source.x + source.width + off, cy) :
		(dir == mxConstants.DIRECTION_WEST) ? new mxPoint(source.x - off, cy) :
		(dir == mxConstants.DIRECTION_NORTH) ? new mxPoint(cx, source.y - off) :
		new mxPoint(cx, source.y + source.height + off);

	var loop = graph.getLoopAroundPoints(state, p);

	if (loop != null)
	{
		loop = graph.keepLoopOutsideShape(state, loop);

		graph.getModel().beginUpdate();
		try
		{
			var geo = graph.getCellGeometry(edge);

			if (geo != null)
			{
				geo = geo.clone();
				geo.points = loop;
				graph.getModel().setGeometry(edge, geo);
			}

			graph.setCellStyles(mxConstants.STYLE_EDGE, 'orthogonalEdgeStyle', [edge]);
			graph.setCellStyles('innerLoopWaypoints', '1', [edge]);
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	}
};

/**
 * Adds the reverse/turn button for an edge selection (and a rotate-by-90
 * button for fully unconnected edges, issue #5076).
 */
ArrangePanel.prototype.addEdgeTurn = function(div)
{
	var ui = this.editorUi;
	var ss = ui.getSelectionState();
	var turnAction = ui.actions.get('turn');

	var btn = mxUtils.button(mxResources.get('reverse'), function(evt)
	{
		turnAction.funct(evt);
	});
	btn.setAttribute('title', mxResources.get('reverse') +
		((turnAction.shortcut != null) ? ' (' + turnAction.shortcut + ')' : ''));
	btn.className = 'geFullWidthElement';

	// Each control sits on its own line (the section uses white-space: nowrap,
	// so inline elements would otherwise sit side by side and overflow off-panel)
	if (div.firstChild != null)
	{
		mxUtils.br(div);
		btn.style.marginTop = '2px';
	}

	div.appendChild(btn);

	// Separate rotate-by-90 button for fully unconnected edges (issue #5076)
	if (!ss.connectedEdges)
	{
		mxUtils.br(div);

		var rotateBtn = mxUtils.button(mxResources.get('turn'), function(evt)
		{
			ui.actions.get('rotateEdge').funct(evt);
		});
		rotateBtn.setAttribute('title', mxResources.get('turn'));
		rotateBtn.className = 'geFullWidthElement';
		rotateBtn.style.marginTop = '2px';
		div.appendChild(rotateBtn);
	}

	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addDistribute = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	div.appendChild(this.createTitle(mxResources.get('distribute')));

	var btn = mxUtils.button(mxResources.get('horizontal'), function(evt)
	{
		graph.distributeCells(true, null, cb.checked);
	})
	
	btn.setAttribute('title', mxResources.get('horizontal'));
	btn.style.width = '104px';
	btn.style.marginRight = '2px';
	div.appendChild(btn);
	
	var btn = mxUtils.button(mxResources.get('vertical'), function(evt)
	{
		graph.distributeCells(false, null, cb.checked);
	})
	
	btn.setAttribute('title', mxResources.get('vertical'));
	btn.style.width = '104px';
	div.appendChild(btn);
	
	mxUtils.br(div);

	var panel = document.createElement('div');
	panel.style.margin = '6px 0 0 0';
	panel.style.display = 'flex';
	panel.style.justifyContent = 'center';
	panel.style.alignItems = 'center';

	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.setAttribute('id', 'spacingCheckbox');
	cb.setAttribute('title', mxResources.get('spacing'));
	cb.style.margin = '0 6px 0 0';
	panel.appendChild(cb);

	var label = document.createElement('label');
	label.style.verticalAlign = 'top';
	label.setAttribute('for', 'spacingCheckbox');
	label.setAttribute('title', mxResources.get('spacing'));
	label.style.userSelect = 'none';
	mxUtils.write(label, mxResources.get('spacing'));
	panel.appendChild(label);
	div.appendChild(panel);

	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addAngle = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = ui.getSelectionState();

	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.marginTop = '4px';
	span.style.width = '70px';
	span.style.fontWeight = 'bold';
	div.style.minHeight = '20px';
	
	var input = null;
	var update = null;
	var btn = null;
	
	if (ss.rotatable && !ss.table && !ss.row && !ss.cell)
	{
		mxUtils.write(span, mxResources.get('angle'));
		span.setAttribute('title', mxResources.get('angle'));
		div.appendChild(span);
		
		input = this.addUnitInput(div, '°', 16, 52, function()
		{
			update.apply(this, arguments);
		});
		input.setAttribute('title', mxResources.get('angle'));

		mxUtils.br(div);
	}

	// The edge reverse/turn button is rendered in the direction section
	// (addEdgeTurn); here it is only for selections that include a vertex.
	if (!ss.containsLabel && ss.vertices.length > 0)
	{
		var label = (ss.edges.length > 0) ?
			mxResources.get('turn') + ' / ' + mxResources.get('reverse') :
			mxResources.get('turn');

		btn = mxUtils.button(label, function(evt)
		{
			ui.actions.get('turn').funct(evt);
		})

		btn.setAttribute('title', label + ' (' + this.editorUi.actions.get('turn').shortcut + ')');
		btn.className = 'geFullWidthElement';
		div.appendChild(btn);

		if (input != null)
		{
			btn.style.marginTop = '10px';
		}
	}
	
	if (input != null)
	{
		var listener = mxUtils.bind(this, function(sender, evt, force)
		{
			if (force || document.activeElement != input)
			{
				ss = ui.getSelectionState();
				var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_ROTATION, 0));
				input.value = (isNaN(tmp)) ? '' : tmp  + '°';
			}
		});
	
		update = this.installInputHandler(input, mxConstants.STYLE_ROTATION, 0, 0, 360, '°', null, true);
		this.addKeyHandler(input, listener);
	
		graph.getModel().addListener(mxEvent.CHANGE, listener);
		this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
		listener();
	}

	return div;
};

/**
 *
 */
BaseFormatPanel.prototype.getUnit = function(prefix)
{
	var unit = this.editorUi.editor.graph.view.unit;
	var retUnit = '';
	
	switch(unit)
	{
		case mxConstants.POINTS:
			retUnit = 'pt';
			break;
		case mxConstants.INCHES:
			retUnit = '"';
			break;
		case mxConstants.MILLIMETERS:
			retUnit = 'mm';
			break;
		case mxConstants.METERS:
			retUnit = 'm';
	}

	return (prefix? prefix : '') + retUnit;
};

/**
 * 
 */
BaseFormatPanel.prototype.inUnit = function(pixels)
{
	return this.editorUi.editor.graph.view.formatUnitText(pixels);
};

/**
 * 
 */
BaseFormatPanel.prototype.fromUnit = function(value)
{
	var unit = this.editorUi.editor.graph.view.unit;
	
	switch(unit)
	{
		case mxConstants.POINTS:
			return value;
		case mxConstants.INCHES:
			return value * mxConstants.PIXELS_PER_INCH;
		case mxConstants.MILLIMETERS:
			return value * mxConstants.PIXELS_PER_MM;
		case mxConstants.METERS:
			return value * mxConstants.PIXELS_PER_MM * 1000;
	}
};

BaseFormatPanel.prototype.isFloatUnit = function()
{
	// Points are 0.1px-precision too, so all units parse as float
	return true;
};

/**
 * 
 */
BaseFormatPanel.prototype.getUnitStep = function()
{
	var unit = this.editorUi.editor.graph.view.unit;
	
	switch(unit)
	{
		case mxConstants.POINTS:
			return 1;
		case mxConstants.INCHES:
			return 0.1;
		case mxConstants.MILLIMETERS:
			return 0.5;
		case mxConstants.METERS:
			return 0.001;
	}
};

/**
 * 
 */
ArrangePanel.prototype.addGeometry = function(container)
{
	var panel = this;
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var model = graph.getModel();
	var rect = ui.getSelectionState();

	// transparentBounds cells store their geometry pinned at (0,0,0,0) and derive
	// their visible box from their children, so position and size are shown
	// read-only using the derived bounds rather than the stored geometry.
	var transparent = rect.vertices.length == 1 && rect.edges.length == 0 &&
		graph.isTransparentBounds(rect.vertices[0]);

	// Visible bounds of the selected transparentBounds cell in parent coordinates
	// (matching the position/size convention of the editable inputs).
	var getTransparentRect = function()
	{
		var cell = rect.vertices[0];
		var local = graph.getTransparentBounds(cell);
		var cellGeo = graph.getCellGeometry(cell);

		return (local != null && cellGeo != null) ? new mxRectangle(
			cellGeo.x + local.x, cellGeo.y + local.y,
			local.width, local.height) : null;
	};

	var div = this.createPanel();
	div.style.height = '60px';
		
	var span = document.createElement('div');
	span.className = 'geStyleLabel';
	span.style.position = 'absolute';
	span.style.fontWeight = 'bold';
	span.style.marginTop = '4px';
	span.style.maxWidth = '50px';
	mxUtils.write(span, mxResources.get('size'));
	span.setAttribute('title', mxResources.get('size'));
	div.appendChild(span);

	var widthUpdate, heightUpdate, leftUpdate, topUpdate;
	var width = this.addUnitInput(div, this.getUnit(), 87, 52, function()
	{
		widthUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	width.setAttribute('title', mxResources.get('width'));
	var height = this.addUnitInput(div, this.getUnit(), 16, 52, function()
	{
		heightUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	height.setAttribute('title', mxResources.get('height'));
	
	var autosizeBtn = document.createElement('div');
	autosizeBtn.style.backgroundImage = 'url(' + Editor.autosizeImage + ')';
	autosizeBtn.className = 'geButton';
	autosizeBtn.style.margin = '0';
	autosizeBtn.style.width = '21px';
	autosizeBtn.style.height = '21px';
	autosizeBtn.style.left = '52px';
	mxUtils.setOpacity(autosizeBtn, 50);
	autosizeBtn.setAttribute('title', mxResources.get('autosize'));

	mxEvent.addListener(autosizeBtn, 'click', function()
	{
		ui.actions.get('autosize').funct();
	});

	div.appendChild(autosizeBtn);
	
	if (rect.row)
	{
		width.style.visibility = 'hidden';
		width.nextSibling.style.visibility = 'hidden';
	}
	else
	{
		this.addLabel(div, mxResources.get('width'), 87, 64).style.marginTop = '0px';
	}
	
	this.addLabel(div, mxResources.get('height'), 16, 64).style.marginTop = '0px';
	mxUtils.br(div);

	var wrapper = document.createElement('div');
	wrapper.className = 'geFormatEntry';
	wrapper.style.marginTop = '14px';
	var opt = this.createCellOption(mxResources.get('constrainProportions'),
		mxConstants.STYLE_ASPECT, null, 'fixed', 'null');
	opt.className = 'geFullWidthElement';
	wrapper.appendChild(opt);
		
	if (!rect.cell && !rect.row)
	{
		div.appendChild(wrapper);
	}
	else
	{
		autosizeBtn.style.visibility = 'hidden';
	}
	
	var constrainCheckbox = opt.getElementsByTagName('input')[0];
	this.addKeyHandler(width, listener);
	this.addKeyHandler(height, listener);
	
	widthUpdate = this.addGeometryHandler(width, function(geo, value, cell)
	{
		value = Math.max(1, panel.fromUnit(value));
		
		if (graph.isTableCell(cell))
		{
			graph.setTableColumnWidth(cell, value - geo.width, true);
			
			// Blocks processing in caller
			return true;
		}
		else if (geo.width > 0)
		{
			if (constrainCheckbox.checked)
			{
				geo.height = Math.round((geo.height * value * 100) / geo.width) / 100;
			}
			
			geo.width = value;
		}
	});
	heightUpdate = this.addGeometryHandler(height, function(geo, value, cell)
	{
		value = Math.max(1, panel.fromUnit(value));
		
		if (graph.isTableCell(cell))
		{
			cell = model.getParent(cell);
		}
		
		if (graph.isTableRow(cell))
		{
			graph.setTableRowHeight(cell, value - geo.height);
			
			// Blocks processing in caller
			return true;
		}
		else if (geo.height > 0)
		{
			if (constrainCheckbox.checked)
			{
				geo.width = Math.round((geo.width  * value * 100) / geo.height) / 100;
			}
			
			geo.height = value;
		}
	});
	
	if (rect.resizable || rect.row || rect.cell || transparent)
	{
		container.appendChild(div);
	}

	var div2 = this.createPanel();
	div2.style.paddingBottom = '30px';

	// Size and position read as a single block, so the divider between them
	// (the position section's top border) is removed.
	div2.style.borderTop = 'none';

	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '0px';
	span.style.fontWeight = 'bold';
	mxUtils.write(span, mxResources.get('position'));
	span.setAttribute('title', mxResources.get('position'));
	div2.appendChild(span);

	var left = this.addUnitInput(div2, this.getUnit(), 87, 52, function()
	{
		leftUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	var top = this.addUnitInput(div2, this.getUnit(), 16, 52, function()
	{
		topUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());

	mxUtils.br(div2);

	// Position and size are derived from the children for transparentBounds cells,
	// so the inputs are read-only and the steppers, autosize and constrain
	// proportions options are hidden. The replacement "border" input (groupPadding)
	// is added below the position inputs, just above the automatic checkbox.
	if (transparent)
	{
		var roInputs = [width, height, left, top];

		for (var i = 0; i < roInputs.length; i++)
		{
			roInputs[i].setAttribute('readonly', 'readonly');
			mxUtils.setOpacity(roInputs[i], 60);

			if (roInputs[i].nextSibling != null)
			{
				roInputs[i].nextSibling.style.visibility = 'hidden';
			}
		}

		autosizeBtn.style.visibility = 'hidden';
		wrapper.style.display = 'none';

		// Drops the now-empty space left by the hidden constrain-proportions row.
		div.style.height = '42px';
	}

	var coordinateLabels = true;
	var dx = null;
	var dy = null;

	if (rect.movable)
	{
		if (rect.edges.length == 0 && rect.vertices.length == 1)
		{
			var geo = graph.getCellGeometry(rect.vertices[0]);

			if (geo != null && geo.relative)
			{
				mxUtils.br(div2);

				var span = document.createElement('div');
				span.style.position = 'absolute';
				span.style.width = '70px';
				span.style.marginTop = '0px';
				mxUtils.write(span, mxResources.get('relative'));
				span.setAttribute('title', mxResources.get('relative'));
				div2.appendChild(span);

				dx = this.addGenericInput(div2, ' %', 87, 52, function()
				{
					return (Math.round(geo.x * 1000) / 10);
				}, function(value)
				{
					value = parseFloat(value);
					
					if (!isNaN(value))
					{
						model.beginUpdate();
						try
						{
							geo = geo.clone();
							geo.x = parseFloat(value) / 100;
							model.setGeometry(rect.vertices[0], geo);
						}
						finally
						{
							model.endUpdate();
						}
					}
				});
				dx.setAttribute('title', mxResources.get('relative'));

				if (model.isEdge(model.getParent(rect.vertices[0])))
				{
					coordinateLabels = false;
					var dyUpdate = null;

					dy = this.addUnitInput(div2, this.getUnit(), 16, 52, function()
					{
						dyUpdate.apply(this, arguments);
					});
					dy.setAttribute('title', mxResources.get('orthogonal'));

					dyUpdate = this.addGeometryHandler(dy, function(geo, value)
					{
						geo.y = panel.fromUnit(value);
					});
				}
				else
				{
					dy = this.addGenericInput(div2, ' %', 16, 52, function()
					{
						return (Math.round(geo.y * 1000) / 10);
					}, function(value)
					{
						value = parseFloat(value);
						
						if (!isNaN(value))
						{
							model.beginUpdate();
							try
							{
								geo = geo.clone();
								geo.y = parseFloat(value) / 100;
								model.setGeometry(rect.vertices[0], geo);
							}
							finally
							{
								model.endUpdate();
							}
						}
					});
				}

				mxUtils.br(div2);
			}
		}
		container.appendChild(div2);
	}

	this.addLabel(div2, mxResources.get(coordinateLabels ? 'left' : 'line'), 87, 64);
	this.addLabel(div2, mxResources.get(coordinateLabels ? 'top' : 'orthogonal'), 16, 64);
	left.setAttribute('title', mxResources.get(coordinateLabels ? 'left' : 'line'));
	top.setAttribute('title', mxResources.get(coordinateLabels ? 'top' : 'orthogonal'));

	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		rect = ui.getSelectionState();

		if (transparent)
		{
			var tb = getTransparentRect();

			if (tb != null)
			{
				div.style.display = '';
				div2.style.display = '';
				width.value = this.inUnit(tb.width) + ' ' + this.getUnit();
				height.value = this.inUnit(tb.height) + ' ' + this.getUnit();
				left.value = this.inUnit(tb.x) + ' ' + this.getUnit();
				top.value = this.inUnit(tb.y) + ' ' + this.getUnit();

				return;
			}
		}

		if (!rect.containsLabel && rect.vertices.length == graph.getSelectionCount() &&
			rect.width != null && rect.height != null)
		{
			div.style.display = '';
			
			if (force || document.activeElement != width)
			{
				width.value = this.inUnit(rect.width) + ' ' + this.getUnit();
			}
			
			if (force || document.activeElement != height)
			{
				height.value = this.inUnit(rect.height) + ' ' + this.getUnit();
			}
		}
		else
		{
			div.style.display = 'none';
		}
		
		if (rect.vertices.length == graph.getSelectionCount() &&
			rect.vertices.length > 0 && rect.x != null &&
			rect.y != null)
		{
			var geo = graph.getCellGeometry(rect.vertices[0]);
			div2.style.display = '';
			
			if (force || document.activeElement != left)
			{
				left.value = this.inUnit(rect.x) + ' ' + this.getUnit();
			}
			
			if (force || document.activeElement != top)
			{
				top.value = this.inUnit(rect.y) + ' ' + this.getUnit();
			}

			if (geo != null && geo.relative)
			{
				if (dx != null && (force || document.activeElement != dx))
				{
					dx.value = (Math.round(geo.x * 1000) / 10) + ' %';
				}

				if (dy != null && (force || document.activeElement != dy))
				{
					if (model.isEdge(model.getParent(rect.vertices[0])))
					{
						dy.value = this.inUnit(geo.y) + ' ' + this.getUnit();
					}
					else
					{
						dy.value = (Math.round(geo.y * 1000) / 10) + ' %';
					}
				}
			}
		}
		else
		{
			div2.style.display = 'none';
		}
	});

	this.listeners.push({destroy: function() { model.removeListener(listener); }});
	model.addListener(mxEvent.CHANGE, listener);
	this.addKeyHandler(left, listener);
	this.addKeyHandler(top, listener);
	listener();
	
	leftUpdate = this.addGeometryHandler(left, function(geo, value)
	{
		value = panel.fromUnit(value);
		
		if (geo.relative)
		{
			geo.offset = (geo.offset != null) ? geo.offset : new mxPoint();
			geo.offset.x = value;
		}
		else
		{
			geo.x = value;
		}
	});
	topUpdate = this.addGeometryHandler(top, function(geo, value)
	{
		value = panel.fromUnit(value);
		
		if (geo.relative)
		{
			geo.offset = (geo.offset != null) ? geo.offset : new mxPoint();
			geo.offset.y = value;
		}
		else
		{
			geo.y = value;
		}
	});

	if (rect.movable)
	{
		if (rect.edges.length == 0 && rect.vertices.length == 1 &&
			model.isEdge(model.getParent(rect.vertices[0])))
		{
			var geo = graph.getCellGeometry(rect.vertices[0]);
			
			if (geo != null && geo.relative)
			{
				// Adds move drop down with center, start and end options
				var moveSelect = document.createElement('select');
				moveSelect.setAttribute('title', mxResources.get('move'));
				moveSelect.style.position = 'absolute';
				moveSelect.style.width = '134px';
				moveSelect.style.left = '77px';

				var titleOption = document.createElement('option');
				titleOption.setAttribute('value', 'none');
				titleOption.setAttribute('title', mxResources.get('move'));
				mxUtils.write(titleOption, mxResources.get('move') + '...');
				moveSelect.appendChild(titleOption);

				var startOption = document.createElement('option');
				startOption.setAttribute('value', 'start');
				startOption.setAttribute('title', mxResources.get('linestart'));
				mxUtils.write(startOption, mxResources.get('linestart'));
				moveSelect.appendChild(startOption);

				var centerOption = document.createElement('option');
				centerOption.setAttribute('value', 'center');
				centerOption.setAttribute('title', mxResources.get('center'));
				mxUtils.write(centerOption, mxResources.get('center'));
				moveSelect.appendChild(centerOption);

				var endOption = document.createElement('option');
				endOption.setAttribute('value', 'end');
				endOption.setAttribute('title', mxResources.get('lineend'));
				mxUtils.write(endOption, mxResources.get('lineend'));
				moveSelect.appendChild(endOption);

				mxEvent.addListener(moveSelect, 'change', function(evt)
				{
					if (moveSelect.value != 'none')
					{
						model.beginUpdate();
						try
						{
							geo = geo.clone();

							if (moveSelect.value == 'start')
							{
								geo.x = -1;
							}
							else if (moveSelect.value == 'end')
							{
								geo.x = 1;
							}
							else
							{
								geo.x = 0;
							}

							geo.y = 0;
							geo.offset = new mxPoint();
							model.setGeometry(rect.vertices[0], geo);
						}
						finally
						{
							model.endUpdate();
						}	
					}

					moveSelect.value = 'none';
				});
				
				mxUtils.br(div2);
				mxUtils.br(div2);
				div2.appendChild(moveSelect);
			}
		}
		container.appendChild(div2);
	}

	// Adds the group padding input and the "automatic" checkbox at the bottom
	// of the section for a single selected vertex.
	var groupCell = (rect.vertices.length == 1 && rect.edges.length == 0) ?
		rect.vertices[0] : null;

	// The padding input applies to all containers (incl. swimlanes): it sets
	// the groupPadding style, the gap layouts keep between the container
	// bounds and its children and, for transparentBounds cells, the border
	// added around the child-derived bounds. Cells that carry a groupPadding
	// style show it too (e.g. Mermaid/PlantUML image cells, where it is the
	// image margin). Accepts 1-4 space-separated values in CSS TRBL order
	// (Graph.parsePadding).
	var showPadding = groupCell != null &&
		(transparent || graph.isContainer(groupCell) ||
		mxUtils.getValue(rect.style, mxConstants.STYLE_GROUP_PADDING, null) != null);

	// The automatic checkbox toggles transparentBounds, which derives the
	// group's position and size from its children instead of storing them, so
	// it only applies when there are children to derive from (an empty group
	// or swimlane would collapse to wrong bounds).
	var showAuto = groupCell != null && model.getChildCount(groupCell) > 0;

	if (showPadding || showAuto)
	{
		div2.style.paddingBottom = '6px';

		// The padding input sits below the position inputs and above the
		// automatic checkbox, with its input aligned to the right column of
		// the size/position rows.
		if (showPadding)
		{
			var paddingWrapper = document.createElement('div');
			paddingWrapper.style.position = 'relative';
			paddingWrapper.style.height = '24px';
			// Clears the absolutely positioned position labels above (their
			// marginTop 10 + height 16) and adds the same gap the position row
			// has above it, so the spacing before the padding row is consistent.
			paddingWrapper.style.marginTop = '40px';

			var paddingLabel = document.createElement('span');
			paddingLabel.style.position = 'absolute';
			paddingLabel.style.left = '0px';
			paddingLabel.style.lineHeight = '24px';
			mxUtils.write(paddingLabel, mxResources.get('groupPadding'));
			paddingLabel.setAttribute('title', mxResources.get('groupPadding'));
			paddingWrapper.appendChild(paddingLabel);

			var paddingInput = document.createElement('input');
			paddingInput.setAttribute('type', 'text');
			paddingInput.style.position = 'absolute';
			paddingInput.style.left = '148px';
			paddingInput.style.width = '52px';
			paddingInput.setAttribute('title', mxResources.get('groupPadding'));
			paddingWrapper.appendChild(paddingInput);
			div2.appendChild(paddingWrapper);

			// Not installInputHandler: that plumbing is numeric-only (parseInt
			// on write and display), which would truncate a multi-value padding
			// to its first number — including on a plain focus+blur, clobbering
			// per-side values set via the layout dialogs or Edit Style. This
			// handler round-trips the raw style value and writes 1-4 numbers
			// re-joined with spaces (parseFloat per token, so no ;/= can reach
			// the style).
			var currentPadding = function()
			{
				var value = mxUtils.getValue(ui.getSelectionState().style,
					mxConstants.STYLE_GROUP_PADDING, 0);

				// The properties panel URI-encodes style values (space -> %20)
				try
				{
					value = decodeURIComponent(String(value));
				}
				catch (e)
				{
					// keep value as-is
				}

				return String(value);
			};

			var paddingListener = mxUtils.bind(this, function(sender, evt, force)
			{
				if (force || document.activeElement != paddingInput)
				{
					paddingInput.value = currentPadding();
				}
			});

			var applyPadding = mxUtils.bind(this, function(evt)
			{
				var text = paddingInput.value.trim();
				var tokens = (text == '') ? ['0'] : text.split(/\s+/);
				var valid = tokens.length <= 4;
				var values = [];

				for (var i = 0; i < tokens.length && valid; i++)
				{
					var num = parseFloat(tokens[i]);
					valid = !isNaN(num);

					if (valid)
					{
						values.push(Math.min(999, Math.max(0, num)));
					}
				}

				var value = values.join(' ');

				if (valid && value != currentPadding())
				{
					if (graph.isEditing())
					{
						graph.stopEditing(true);
					}

					var cells = ui.getSelectionState().cells;
					graph.setCellStyles(mxConstants.STYLE_GROUP_PADDING, value, cells);
					ui.fireEvent(new mxEventObject('styleChanged',
						'keys', [mxConstants.STYLE_GROUP_PADDING],
						'values', [value], 'cells', cells));
				}

				// Normalizes the display, or reverts it for invalid input
				paddingListener(null, null, true);
				mxEvent.consume(evt);
			});

			mxEvent.addListener(paddingInput, 'change', applyPadding);
			mxEvent.addListener(paddingInput, 'blur', applyPadding);

			model.addListener(mxEvent.CHANGE, paddingListener);
			this.listeners.push({destroy: function() { model.removeListener(paddingListener); }});
			this.addKeyHandler(paddingInput, paddingListener);
			paddingListener();
		}

		if (showAuto)
		{
			// Appends to the option's geFormatEntry class (flex, vertically
			// centered) rather than replacing it, so the checkbox stays
			// middle-aligned with its label.
			var autoOpt = this.createCellOption(mxResources.get('automatic'),
				'transparentBounds', null, '1', 'null');
			autoOpt.className += ' geFullWidthElement';
			autoOpt.style.marginTop = showPadding ? '6px' : '26px';
			div2.appendChild(autoOpt);
		}
	}
};

/**
 * 
 */
ArrangePanel.prototype.addGeometryHandler = function(input, fn)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var initialValue = null;
	var panel = this;
	
	function update(evt)
	{
		// Read-only inputs (e.g. the derived position/size of a transparentBounds
		// group) must never write back: their displayed value already includes the
		// derived offset, so writing it into the stored geometry corrupts it. A
		// blur fired while the panel is rebuilt would otherwise do exactly that.
		if (input.readOnly)
		{
			return;
		}

		if (input.value != '')
		{
			var value = parseFloat(input.value);

			if (isNaN(value))
			{
				input.value = initialValue + ' ' + panel.getUnit();
			}
			else if (value != initialValue)
			{
				graph.getModel().beginUpdate();
				try
				{
					var cells = ui.getSelectionState().cells;
					
					for (var i = 0; i < cells.length; i++)
					{
						if (graph.getModel().isVertex(cells[i]))
						{
							var geo = graph.getCellGeometry(cells[i]);
							
							if (geo != null)
							{
								geo = geo.clone();
								
								if (!fn(geo, value, cells[i]))
								{
									var state = graph.view.getState(cells[i]);
									
									if (state != null && graph.isRecursiveVertexResize(state))
									{
										graph.resizeChildCells(cells[i], geo);
									}
									
									graph.getModel().setGeometry(cells[i], geo);
									graph.constrainChildCells(cells[i]);
								}
							}
						}
					}
				}
				finally
				{
					graph.getModel().endUpdate();
				}
				
				initialValue = value;
				input.value = value + ' ' + panel.getUnit();
			}
		}
		
		mxEvent.consume(evt);
	};

	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);
	mxEvent.addListener(input, 'focus', function()
	{
		initialValue = input.value;
	});
	
	return update;
};

ArrangePanel.prototype.addEdgeGeometryHandler = function(input, fn)
{
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var initialValue = null;

    function update(evt)
    {
        if (input.value != '')
        {
            var value = parseFloat(input.value);

            if (isNaN(value))
            {
                input.value = initialValue + ' pt';
            }
            else if (value != initialValue)
            {
                graph.getModel().beginUpdate();
                try
                {
                    var cells = ui.getSelectionState().cells;

                    for (var i = 0; i < cells.length; i++)
                    {
                        if (graph.getModel().isEdge(cells[i]))
                        {
                            var geo = graph.getCellGeometry(cells[i]);

                            if (geo != null)
                            {
                                geo = geo.clone();
                                fn(geo, value);

                                graph.getModel().setGeometry(cells[i], geo);
                            }
                        }
                    }
                }
                finally
                {
                    graph.getModel().endUpdate();
                }

                initialValue = value;
                input.value = value + ' pt';
            }
        }

        mxEvent.consume(evt);
    };

    mxEvent.addListener(input, 'blur', update);
    mxEvent.addListener(input, 'change', update);
    mxEvent.addListener(input, 'focus', function()
    {
        // Stores the parsed number (not the "360 pt" string) so the
        // value != initialValue guard in update can detect an unchanged
        // value. Comparing a number against the formatted string always
        // reported a change, firing a spurious setGeometry on every blur;
        // combined with the focus restore in immediateRefresh that turned
        // tabbing out of these inputs into an infinite refresh loop.
        initialValue = parseFloat(input.value);
    });

    return update;
};

/**
 *
 */
ArrangePanel.prototype.addArrowGeometry = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var rect = ui.getSelectionState();
	var div = this.createPanel();
	div.style.display = 'flex';
	div.style.alignItems = 'center';

	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '0px';
	span.style.fontWeight = 'bold';

	mxUtils.write(span, mxResources.get('width'));
	span.setAttribute('title', mxResources.get('width'));
	div.appendChild(span);

	var widthUpdate;
	var width = this.addUnitInput(div, 'pt', 12, 44, function()
	{
		widthUpdate.apply(this, arguments);
	});
	width.setAttribute('title', mxResources.get('width'));

	mxUtils.br(div);
	container.appendChild(div);

	widthUpdate = mxUtils.bind(this, function(evt)
	{
		// Maximum stroke width is 999
		var value = parseInt(width.value);
		value = Math.min(999, Math.max(1, (isNaN(value)) ? 1 : value));

		if (value != mxUtils.getValue(rect.style, 'width', mxCellRenderer.defaultShapes['flexArrow'].prototype.defaultWidth))
		{
			var cells = ui.getSelectionState().cells;
			graph.setCellStyles('width', value, cells);
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['width'],
					'values', [value], 'cells', cells));
		}

		width.value = value + ' pt';
		mxEvent.consume(evt);
	});

	mxEvent.addListener(width, 'blur', widthUpdate);
	mxEvent.addListener(width, 'change', widthUpdate);

	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		rect = ui.getSelectionState();

		if (force || document.activeElement != width)
		{
			var value = mxUtils.getValue(rect.style, 'width',
				mxCellRenderer.defaultShapes['flexArrow'].prototype.defaultWidth);
			width.value = value + ' pt';
		}
	});

	this.addKeyHandler(width, listener);
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();
};

/**
 *
 */
ArrangePanel.prototype.addEdgeGeometry = function(container)
{
	var panel = this;
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var rect = ui.getSelectionState();
	var xtUpdate, ytUpdate, xsUpdate, ysUpdate;

	container.style.paddingBottom = '22px';
	var divs = this.createPanel();
	divs.style.paddingBottom = '16px';

	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '4px';
	mxUtils.write(span, mxResources.get('linestart'));
	span.setAttribute('title', mxResources.get('linestart'));
	divs.appendChild(span);

	var xs = this.addUnitInput(divs, this.getUnit(), 87, 52, function()
	{
		xsUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	xs.setAttribute('title', mxResources.get('left'));
	var ys = this.addUnitInput(divs, this.getUnit(), 16, 52, function()
	{
		ysUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	ys.setAttribute('title', mxResources.get('top'));

	container.appendChild(divs);

	var divt = this.createPanel();
	divt.style.borderTop = 'none';
	divt.style.paddingTop = '8px';
	divt.style.paddingBottom = '16px';

	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '4px';
	mxUtils.write(span, mxResources.get('lineend'));
	span.setAttribute('title', mxResources.get('lineend'));
	divt.appendChild(span);

	var xt = this.addUnitInput(divt, this.getUnit(), 87, 52, function()
	{
		xtUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	xt.setAttribute('title', mxResources.get('left'));
	var yt = this.addUnitInput(divt, this.getUnit(), 16, 52, function()
	{
		ytUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	yt.setAttribute('title', mxResources.get('top'));

	container.appendChild(divt);

	this.addLabel(container, mxResources.get('left'), 87, 62).style.fontSize = '10px';
	this.addLabel(container, mxResources.get('top'), 16, 62).style.fontSize = '10px';

	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		rect = ui.getSelectionState();
		var cell = rect.cells[0];

		if (rect.cells.length == 1 && graph.model.isEdge(cell))
		{
			var geo = graph.model.getGeometry(cell);

			if (geo != null && geo.sourcePoint != null &&
				graph.model.getTerminal(cell, true) == null)
			{
				xs.value = this.inUnit(geo.sourcePoint.x) + ' ' + this.getUnit();
				ys.value = this.inUnit(geo.sourcePoint.y) + ' ' + this.getUnit();
			}
			else
			{
				divs.style.display = 'none';
			}

			if (geo != null && geo.targetPoint != null &&
				graph.model.getTerminal(cell, false) == null)
			{
				xt.value = this.inUnit(geo.targetPoint.x) + ' ' + this.getUnit();
				yt.value = this.inUnit(geo.targetPoint.y) + ' ' + this.getUnit();
			}
			else
			{
				divt.style.display = 'none';
			}
		}
		else
		{
			divs.style.display = 'none';
			divt.style.display = 'none';
		}
	});

	this.addKeyHandler(xs, listener);
	this.addKeyHandler(ys, listener);
	this.addKeyHandler(xt, listener);
	this.addKeyHandler(yt, listener);

	xsUpdate = this.addEdgeGeometryHandler(xs, function(geo, value)
	{
		if (geo.sourcePoint != null)
		{
			geo.sourcePoint.x = panel.fromUnit(value);
		}
	});

	ysUpdate = this.addEdgeGeometryHandler(ys, function(geo, value)
	{
		if (geo.sourcePoint != null)
		{
			geo.sourcePoint.y = panel.fromUnit(value);
		}
	});

	xtUpdate = this.addEdgeGeometryHandler(xt, function(geo, value)
	{
		if (geo.targetPoint != null)
		{
			geo.targetPoint.x = panel.fromUnit(value);
		}
	});

	ytUpdate = this.addEdgeGeometryHandler(yt, function(geo, value)
	{
		if (geo.targetPoint != null)
		{
			geo.targetPoint.y = panel.fromUnit(value);
		}
	});

	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();
};

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(TextFormatPanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel.prototype.init = function()
{
	this.container.appendChild(this.addFont(this.createPanel()));
	this.container.appendChild(this.addFontOps(this.createPanel()));
};


/**
 * 
 */
TextFormatPanel.prototype.addFontOps = function(div)
{
	var copyBtn = this.addAction(div, 'copyTextStyle');
	var pasteBtn = this.addAction(div, 'pasteTextStyle');

	if (copyBtn != null && pasteBtn != null)
	{
		copyBtn.style.marginRight = '4px';
		copyBtn.style.width = '104px';
		pasteBtn.style.width = '104px';

		// Remove br between copy and paste
		if (copyBtn.nextSibling != null && copyBtn.nextSibling.nodeName == 'BR')
		{
			copyBtn.nextSibling.parentNode.removeChild(copyBtn.nextSibling);
		}
	}

	if (copyBtn != null || pasteBtn != null)
	{
		mxUtils.br(div);
	}

	var count = this.addActions(div, ['removeFormat']);

	if (count == 0 && copyBtn == null && pasteBtn == null)
	{
		div.style.display = 'none';
	}

	return div;
};


/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel.prototype.addFont = function(container)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = ui.getSelectionState();
	
	var title = this.createTitle(mxResources.get('font'));
	container.appendChild(title);

	var stylePanel = this.createPanel();
	stylePanel.className = 'geFormatEntry';
	
	if (graph.cellEditor.isContentEditing())
	{
		var cssPanel = stylePanel.cloneNode();
		
		var cssMenu = ui.toolbar.addMenu(
			ui.menus.get('formatBlock'),
			mxResources.get('style'), null, cssPanel);
		this.addArrow(cssMenu);
		cssMenu.style.margin = '0px';
		cssMenu.style.position = 'relative';
		cssMenu.classList.add('geFullWidthElement');
		container.appendChild(cssPanel);
	}
	
	var fontFamilyPanel = stylePanel.cloneNode(false);
	container.appendChild(fontFamilyPanel);
	
	var colorPanel = this.createPanel();
	var fontMenu = ui.toolbar.addMenu(
		ui.menus.get('fontFamily'),
		'Helvetica', null, fontFamilyPanel);
	this.addArrow(fontMenu);
	fontMenu.setAttribute('title', mxResources.get('fontFamily'));
	fontMenu.style.margin = '0px';
	fontMenu.style.position = 'relative';
	fontMenu.classList.add('geFullWidthElement');

	if (ss.style[mxConstants.STYLE_FONTFAMILY] == 'inherit')
	{
		fontFamilyPanel.style.display = 'none';
	}
	
	var stylePanel2 = stylePanel.cloneNode(false);
	var fontStyleItems = ui.toolbar.addItems(['bold', 'italic', 'underline'], stylePanel2, true,
		[Editor.boldImage, Editor.italicImage, Editor.underlineImage]);
	fontStyleItems[0].setAttribute('title', mxResources.get('bold') + ' (' + ui.actions.get('bold').shortcut + ')');
	fontStyleItems[1].setAttribute('title', mxResources.get('italic') + ' (' + ui.actions.get('italic').shortcut + ')');
	fontStyleItems[2].setAttribute('title', mxResources.get('underline') + ' (' + ui.actions.get('underline').shortcut + ')');
	
	var verticalItem = ui.toolbar.addItems(['vertical'], stylePanel2, true, [Editor.verticalTextImage])[0];
	container.appendChild(stylePanel2);

	var stylePanel3 = stylePanel.cloneNode(false);
	
	// Helper function to return a wrapper function does not pass any arguments
	var callFn = function(fn)
	{
		return function()
		{
			return fn();
		};
	};
	
	var left = ui.addButton(Editor.alignLeftImage, mxResources.get('left'),
		(graph.cellEditor.isContentEditing()) ?
		function(evt)
		{
			graph.cellEditor.alignText(mxConstants.ALIGN_LEFT, evt);
			ui.fireEvent(new mxEventObject('styleChanged',
				'keys', [mxConstants.STYLE_ALIGN],
				'values', [mxConstants.ALIGN_LEFT],
				'cells', ss.cells));
		} : callFn(ui.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_LEFT])), stylePanel3);
	var center = ui.addButton(Editor.alignCenterImage, mxResources.get('center'),
		(graph.cellEditor.isContentEditing()) ?
		function(evt)
		{
			graph.cellEditor.alignText(mxConstants.ALIGN_CENTER, evt);
			ui.fireEvent(new mxEventObject('styleChanged',
				'keys', [mxConstants.STYLE_ALIGN],
				'values', [mxConstants.ALIGN_CENTER],
				'cells', ss.cells));
		} : callFn(ui.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_CENTER])), stylePanel3);
	var right = ui.addButton(Editor.alignRightImage, mxResources.get('right'),
		(graph.cellEditor.isContentEditing()) ?
		function(evt)
		{
			graph.cellEditor.alignText(mxConstants.ALIGN_RIGHT, evt);
			ui.fireEvent(new mxEventObject('styleChanged',
				'keys', [mxConstants.STYLE_ALIGN],
				'values', [mxConstants.ALIGN_RIGHT],
				'cells', ss.cells));
		} : callFn(ui.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_RIGHT])), stylePanel3);
	
	// Returns the absolute font size for the given computed style
	function getAbsoluteFontSize(css)
	{
		var fontSize = (css != null) ? css.fontSize : null;
			
		if (fontSize != null && fontSize.substring(fontSize.length - 2) == 'px')
		{
			return parseFloat(fontSize);
		}
		else
		{
			return mxConstants.DEFAULT_FONTSIZE;
		}
	};

	// Sets or removes the line height on the given element
	function setLineHeight(elt, value)
	{
		if (elt != null && elt.textContent != '')
		{
			elt.style.lineHeight = '';
			var css = mxUtils.getCurrentStyle(elt);
			var lh = parseFloat(css.fontSize) * value / 100;

			if (lh != parseFloat(css.lineHeight))
			{
				elt.style.lineHeight = value + '%';
			}
			else if (elt.getAttribute('style') == '')
			{
				elt.removeAttribute('style');
			}
		}
	};
	
	// Quick hack for strikethrough
	// TODO: Add translations and toggle state
	if (graph.cellEditor.isContentEditing())
	{
		strike = ui.addButton(Editor.strikethroughImage, mxResources.get('strikethrough'),
			function()
			{
				document.execCommand('strikeThrough', false, null);
			}, stylePanel2);
	}
	
	var top = ui.addButton(Editor.alignTopImage, mxResources.get('top'),
		callFn(ui.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN],
			[mxConstants.ALIGN_TOP])), stylePanel3);
	var middle = ui.addButton(Editor.alignMiddleImage, mxResources.get('middle'),
		callFn(ui.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN],
			[mxConstants.ALIGN_MIDDLE])), stylePanel3);
	var bottom = ui.addButton(Editor.alignBottomImage, mxResources.get('bottom'),
		callFn(ui.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN],
			[mxConstants.ALIGN_BOTTOM])), stylePanel3);
	
	container.appendChild(stylePanel3);
	
	// Hack for updating UI state below based on current text selection
	// currentTable is the current selected DOM table updated below
	var sub, sup, strike, full, tableWrapper, currentTable, tableCell, tableRow;
	
	if (graph.cellEditor.isContentEditing())
	{
		top.style.display = 'none';
		middle.style.display = 'none';
		bottom.style.display = 'none';
		verticalItem.style.display = 'none';
		
		full = ui.addButton(Editor.alignJustifyImage, mxResources.get('block'),
			function()
			{
				document.execCommand('justifyfull', false, null);
			}, stylePanel3);
		full.style.marginRight = '9px';

		sub = ui.addButton(Editor.subscriptImage,
			mxResources.get('subscript') + ' (' + Editor.ctrlKey + '+,)',
			function()
			{
				document.execCommand('subscript', false, null);
			}, stylePanel3)
		sub.style.marginLeft = '10px';	

		sup = ui.addButton(Editor.superscriptImage,
			mxResources.get('superscript') + ' (' + Editor.ctrlKey + '+.)',
		function()
		{
			document.execCommand('superscript', false, null);
		}, stylePanel3)
		sub.style.marginLeft = '10px';
		
		var tmp = stylePanel3.cloneNode(false);
		tmp.style.paddingTop = '4px';
		var btns = [ui.addButton(Editor.orderedListImage, mxResources.get('numberedList'),
				function()
				{
					document.execCommand('insertorderedlist', false, null);
				}, tmp),
			ui.addButton(Editor.unorderedListImage, mxResources.get('bulletedList'),
				function()
				{
					document.execCommand('insertunorderedlist', false, null);
				}, tmp),
			ui.addButton(Editor.indentImage, mxResources.get('increaseIndent'),
				function()
				{
					document.execCommand('indent', false, null);
				}, tmp),
			ui.addButton(Editor.outdentImage, mxResources.get('decreaseIndent'),
				function()
				{
					document.execCommand('outdent', false, null);
				}, tmp),
			ui.addButton(Editor.removeFormatImage, mxResources.get('removeFormat'),
				function()
				{
					document.execCommand('removeformat', false, null);
				}, tmp),
			ui.addButton(Editor.codeImage, mxResources.get('html'),
				function()
				{
					graph.cellEditor.toggleViewMode();
				}, tmp)];
		btns[btns.length - 2].style.marginLeft = '10px';
		
		container.appendChild(tmp);
	}
	else
	{
		fontStyleItems[2].style.marginRight = '12px';
		right.style.marginRight = '12px';
	}
	
	// Label position
	var stylePanel4 = stylePanel.cloneNode(false);
	mxUtils.write(stylePanel4, mxResources.get('position'));
	stylePanel4.setAttribute('title', mxResources.get('position'));

	// Adds label position options
	var positionSelect = document.createElement('select');
	positionSelect.setAttribute('title', mxResources.get('position'));
	positionSelect.style.left = '114px';
	positionSelect.style.width = '98px';
	
	var directions = ['topLeft', 'top', 'topRight', 'left', 'center', 'right', 'bottomLeft', 'bottom', 'bottomRight'];
	var lset = {'topLeft': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM],
		'top': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_TOP, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_BOTTOM],
		'topRight': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM],
		'left': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_MIDDLE],
		'center': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE],
		'right': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE],
		'bottomLeft': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP],
		'bottom': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_TOP],
		'bottomRight': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP]};

	for (var i = 0; i < directions.length; i++)
	{
		var positionOption = document.createElement('option');
		positionOption.setAttribute('value', directions[i]);
		mxUtils.write(positionOption, mxResources.get(directions[i]));
		positionSelect.appendChild(positionOption);
	}

	stylePanel4.appendChild(positionSelect);
	
	// Writing direction
	var stylePanel5 = stylePanel4.cloneNode(false);
	mxUtils.write(stylePanel5, mxResources.get('writingDirection'));
	stylePanel5.setAttribute('title', mxResources.get('writingDirection'));

	// This is the last borderless dropdown row before the color section divider.
	// geFormatEntry rows have no vertical padding, so without a nudge the divider
	// hugs the dropdown. Add a small bottom margin so the gap below the dropdown
	// matches the gap above it (the spacing between the two dropdown rows).
	stylePanel5.style.marginBottom = '2px';

	// Adds writing direction options
	// LATER: Handle reselect of same option in all selects (change event
	// is not fired for same option so have opened state on click) and
	// handle multiple different styles for current selection
	var dirSelect = positionSelect.cloneNode(false);
	dirSelect.setAttribute('title', mxResources.get('writingDirection'));

	// NOTE: For automatic we use the value null since automatic
	// requires the text to be non formatted and non-wrapped
	var dirs = ['automatic', 'leftToRight', 'rightToLeft'];

	if (ss.html)
	{
		dirs.push('vertical-leftToRight');
		dirs.push('vertical-rightToLeft');
	}

	var dirSet = {'automatic': null,
		'leftToRight': mxConstants.TEXT_DIRECTION_LTR,
		'rightToLeft': mxConstants.TEXT_DIRECTION_RTL,
		'vertical-leftToRight': mxConstants.TEXT_DIRECTION_VERTICAL_LR,
		'vertical-rightToLeft': mxConstants.TEXT_DIRECTION_VERTICAL_RL};

	for (var i = 0; i < dirs.length; i++)
	{
		var dirOption = document.createElement('option');
		dirOption.setAttribute('value', dirs[i]);

		if (dirs[i].substring(0, 9) == 'vertical-')
		{
			mxUtils.write(dirOption, mxResources.get('vertical') +
				' (' + mxResources.get(dirs[i].substring(9)) + ')');
		}
		else
		{
			mxUtils.write(dirOption, mxResources.get(dirs[i]));
		}

		dirSelect.appendChild(dirOption);
	}

	stylePanel5.appendChild(dirSelect);
	
	if (!graph.isEditing())
	{
		container.appendChild(stylePanel4);
		
		mxEvent.addListener(positionSelect, 'change', function(evt)
		{
			graph.getModel().beginUpdate();
			try
			{
				var vals = lset[positionSelect.value];
				
				if (vals != null)
				{
					graph.setCellStyles(mxConstants.STYLE_LABEL_POSITION, vals[0], ss.cells);
					graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, vals[1], ss.cells);
					graph.setCellStyles(mxConstants.STYLE_ALIGN, vals[2], ss.cells);
					graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, vals[3], ss.cells);
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
			
			mxEvent.consume(evt);
		});

		// LATER: Update dir in text editor while editing and update style with label
		// NOTE: The tricky part is handling and passing on the auto value
		container.appendChild(stylePanel5);
		
		mxEvent.addListener(dirSelect, 'change', function(evt)
		{
			graph.setCellStyles(mxConstants.STYLE_TEXT_DIRECTION, dirSet[dirSelect.value], ss.cells);
			mxEvent.consume(evt);
		});
	}

	// Fontsize
	var input = document.createElement('input');
	input.style.position = 'absolute';
	input.style.left = '146px';
	input.style.width = '52px';
	input.setAttribute('title', mxResources.get('fontSize'));
	stylePanel2.appendChild(input);
	
	var inputUpdate = this.installInputHandler(input, mxConstants.STYLE_FONTSIZE,
		Menus.prototype.defaultFontSize, 1, 999, ' ' + Editor.fontSizeUnit, function(fontSize)
	{
		var node = graph.getSelectedEditingElement();

		if (node != null)
		{
			input.value = fontSize + ' ' + Editor.fontSizeUnit;
			document.execCommand('fontSize', false, '1');

			// Finds the new or updated element and sets the actual font size
			var fonts = graph.cellEditor.textarea.getElementsByTagName('font');

			for (var i = 0; i < fonts.length; i++)
			{
				if (fonts[i].getAttribute('size') == '1')
				{
					fonts[i].removeAttribute('size');
					fonts[i].style.fontSize = '';
					var css = mxUtils.getCurrentStyle(fonts[i]);
					
					if (fontSize != getAbsoluteFontSize(css))
					{
						fonts[i].style.fontSize = fontSize + 'px';
					}
					else if (fonts[i].getAttribute('style') == '')
					{
						fonts[i].removeAttribute('style');
					}
				}
			}
		}
	}, true);
	
	var stepper = this.createStepper(input, inputUpdate, 1, true, Menus.prototype.defaultFontSize);
	stepper.style.display = input.style.display;
	stepper.style.left = '198px';

	if (ss.style[mxConstants.STYLE_FONTSIZE] == 'inherit')
	{
		input.style.display = 'none';
		stepper.style.display = 'none';
	}
	
	stylePanel2.appendChild(stepper);
	var bgColorApply = null;
	var currentBgColor = graph.shapeBackgroundColor;
	
	var fontColorApply = null;
	var currentFontColor = graph.shapeForegroundColor;

	// Used for RBG and HEX default background color matching
	var temp = mxUtils.getLightDarkColor(graph.shapeBackgroundColor);
	var rgbBgColor = 'light-dark(' +
		mxUtils.hex2rgb(temp.light) + ', ' +
		mxUtils.hex2rgb(temp.dark) + ')';

	var bgPanel = (graph.cellEditor.isContentEditing()) ?
		// Font background color option for selection text
		this.createColorOption(mxResources.get('backgroundColor'), function()
		{
			return (currentBgColor == graph.shapeBackgroundColor ||
				currentBgColor == rgbBgColor) ? 'default' : currentBgColor;
		}, function(color)
		{
			if (graph.cellEditor.textarea != null)
			{
				if (color == 'default')
				{
					color = graph.shapeBackgroundColor;
				}

				Graph.setTextColor(graph.cellEditor.textarea, color, false);

				// Updates the cached color so the synchronous re-read of the
				// checkbox state in apply reflects the color set above, the
				// async update via updateCssHandler runs after this
				currentBgColor = color;
				ui.fireEvent(new mxEventObject('styleChanged',
					'keys', [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR],
					'values', [color], 'cells', ss.cells));
			}
		}, 'default',
		{
			install: function(apply) { bgColorApply = apply; },
			destroy: function() { bgColorApply = null; }
		}, null, null, graph.shapeBackgroundColor) :
		// Font background color option for shape
		this.createCellColorOption(mxResources.get('backgroundColor'),
			mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, 'default', null, function(color)
		{
			graph.updateLabelElements(ss.cells, function(elt)
			{
				elt.style.backgroundColor = null;
			});
		}, graph.shapeBackgroundColor);
	
	bgPanel.style.fontWeight = 'bold';

	var borderPanel = this.createCellColorOption(mxResources.get('borderColor'),
		mxConstants.STYLE_LABEL_BORDERCOLOR, 'default', null, null,
		graph.shapeForegroundColor);
	borderPanel.style.fontWeight = 'bold';
	
	// Gets default colors for selection
	var defs = (ss.vertices.length >= 1) ?
		graph.stylesheet.getDefaultVertexStyle() :
		graph.stylesheet.getDefaultEdgeStyle();

	var panel = (graph.cellEditor.isContentEditing()) ?
		// Font color option for selection text
		this.createColorOption(mxResources.get('fontColor'), function()
		{
			return currentFontColor;
		}, function(color)
		{
			if (graph.cellEditor.textarea != null)
			{
				if (color == 'default')
				{
					color = mxConstants.NONE;
				}

				Graph.setTextColor(graph.cellEditor.textarea, color, true);
				ui.fireEvent(new mxEventObject('styleChanged',
					'keys', [mxConstants.STYLE_FONTCOLOR],
					'values', [color], 'cells', ss.cells));
			}
		}, 'default',
		{
			install: function(apply) { fontColorApply = apply; },
			destroy: function() { fontColorApply = null; }
		}, null, true, (defs[mxConstants.STYLE_FONTCOLOR] != null &&
			defs[mxConstants.STYLE_FONTCOLOR] != 'default') ?
			defs[mxConstants.STYLE_FONTCOLOR] : graph.shapeForegroundColor) :
		// Font color option for shape
		this.createCellColorOption(mxResources.get('fontColor'),
			mxConstants.STYLE_FONTCOLOR, 'default', function(color)
		{
			if (color == mxConstants.NONE)
			{
				bgPanel.style.display = 'none';
			}
			else
			{
				bgPanel.style.display = '';
			}
			
			borderPanel.style.display = bgPanel.style.display;
		}, function(color)
		{
			if (color == mxConstants.NONE)
			{
				graph.setCellStyles(mxConstants.STYLE_NOLABEL, '1', ss.cells);
			}
			else
			{
				graph.setCellStyles(mxConstants.STYLE_NOLABEL, null, ss.cells);
			}
			
			graph.setCellStyles(mxConstants.STYLE_FONTCOLOR, color, ss.cells);

			graph.updateLabelElements(ss.cells, function(elt)
			{
				elt.removeAttribute('color');
				elt.style.color = null;
			});
		}, graph.shapeForegroundColor);

	if (ss.style[mxConstants.STYLE_FONTCOLOR] == 'inherit')
	{
		panel.style.display = 'none';
	}
	
	panel.style.fontWeight = 'bold';
	colorPanel.appendChild(panel);
	// Hide label background/border options for curvedText shapes
	// (SVG textPath does not support label backgrounds)
	if (ss.style[mxConstants.STYLE_SHAPE] == 'curvedText')
	{
		bgPanel.style.display = 'none';
		borderPanel.style.display = 'none';
	}

	colorPanel.appendChild(bgPanel);
	
	var textShadow = this.createCellOption(mxResources.get('shadow'),
		mxConstants.STYLE_TEXT_SHADOW, 0);
	textShadow.style.width = '100%';
	textShadow.style.fontWeight = 'bold';

	if (!Editor.enableShadowOption)
	{
		textShadow.getElementsByTagName('input')[0].setAttribute('disabled', 'disabled');
		mxUtils.setOpacity(textShadow, 60);
	}

	if (!graph.cellEditor.isContentEditing())
	{
		colorPanel.appendChild(borderPanel);
		colorPanel.appendChild(textShadow);
	}

	container.appendChild(colorPanel);

	var extraPanel = this.createPanel();
	extraPanel.style.paddingTop = '2px';
	extraPanel.style.paddingBottom = '4px';
	
	var wwCells = graph.filterSelectionCells(mxUtils.bind(this, function(cell)
	{
		var state = graph.view.getState(cell);

		return state == null ||
			graph.getModel().isEdge(cell) ||
			graph.isAutoSizeState(state);
	}));

	var state = graph.view.getState(graph.getSelectionCell());
	var formatted = mxUtils.getValue(ss.style, 'html', 0) == '1';

	// Uses svgWhiteSpace when convertToSvg is active, whiteSpace otherwise
	// (vertical text always uses foreignObject, see mxUtils.convertHtmlToSvg)
	var isSvgMode = formatted && !mxUtils.isVerticalTextDirection(ss.style[mxConstants.STYLE_TEXT_DIRECTION]) &&
		((graph.getSelectionCount() > 1 && ss.style['convertToSvg'] == '1') ||
		(graph.getSelectionCount() == 1 && state != null && state.text != null &&
		state.text.node != null && state.text.node.getElementsByTagName('foreignObject').length == 0));

	var wwStyleKey = isSvgMode ? 'svgWhiteSpace' : mxConstants.STYLE_WHITE_SPACE;
	var wwOpt = this.createCellOption(mxResources.get('wordWrap'), wwStyleKey,
		null, 'wrap', 'null', null, null, true, wwCells);
	wwOpt.style.fontWeight = 'bold';

	// Word wrap in edge labels only supported via labelWidth style
	if (wwCells.length > 0)
	{
		extraPanel.appendChild(wwOpt);
	}

	// Delegates switch of style to formattedText action as it also convertes newlines
	var htmlOpt = this.createCellOption(mxResources.get('formattedText'), 'html', 0,
		null, null, null, ui.actions.get('formattedText'));
	htmlOpt.style.fontWeight = 'bold';
	extraPanel.appendChild(htmlOpt);

	var convertToSvg = this.createCellOption(mxResources.get('lblToSvg'), 'convertToSvg', '0',
		null, null, function(cells, value)
	{
		// Syncs word wrap style when toggling convertToSvg
		for (var i = 0; i < cells.length; i++)
		{
			var cellStyle = graph.getCurrentCellStyle(cells[i]);

			if (value)
			{
				// Toggled ON: copy whiteSpace to svgWhiteSpace
				if (cellStyle[mxConstants.STYLE_WHITE_SPACE] == 'wrap')
				{
					graph.setCellStyles('svgWhiteSpace', 'wrap', [cells[i]]);
				}
			}
			else
			{
				// Toggled OFF: copy svgWhiteSpace to whiteSpace
				if (cellStyle['svgWhiteSpace'] == 'wrap')
				{
					graph.setCellStyles(mxConstants.STYLE_WHITE_SPACE, 'wrap', [cells[i]]);
				}
			}
		}
	});
	convertToSvg.style.fontWeight = 'bold';
	extraPanel.appendChild(convertToSvg);

	// Aligns the label tangentially to its connector (edges and edge labels
	// only). Overrides the manual angle in the Arrange tab while active.
	if (Editor.enableAutoRotateLabels &&
		((ss.edges.length == 1 && ss.vertices.length == 0) ||
		(ss.containsLabel && ss.edges.length == 0)))
	{
		var autoRotate = this.createCellOption(mxResources.get('autoRotateLabel'),
			'labelAutoRotate', '0', '1', '0');
		autoRotate.style.fontWeight = 'bold';
		extraPanel.appendChild(autoRotate);
	}

	var convertInput = convertToSvg.getElementsByTagName('input')[0];

	// Wrapped plain text (whiteSpace=wrap) renders via foreignObject like html=1,
	// so it can be converted to SVG; only unwrapped plain text renders as native
	// SVG already and has nothing to convert. Mirrors graph.isHtmlLabel.
	var htmlLabel = formatted || ss.style[mxConstants.STYLE_WHITE_SPACE] == 'wrap';

	if (!htmlLabel)
	{
		// Keeps a checked option enabled so that it can be unchecked
		if (!convertInput.checked)
		{
			convertToSvg.style.opacity = '0.5';
			convertInput.setAttribute('disabled', 'disabled');
		}
	}
	else
	{
		// Disables option if the conversion is not possible for any selected
		// cell's label, using a dry-run of the same code that the renderer
		// uses for the actual conversion (see mxUtils.canConvertHtmlToSvg)
		var hasUnsupported = false;
		var cells = graph.getSelectionCells();

		for (var i = 0; i < cells.length && !hasUnsupported; i++)
		{
			var cellState = graph.view.getState(cells[i]);

			// Only labels with HTML markup (html=1) can contain tags or vertical
			// writing modes that have no native SVG equivalent; plain-text labels
			// have nothing to convert and stay enabled, including whiteSpace=wrap
			// (which renders via foreignObject but holds no HTML). Gating on html=1
			// also keeps unsanitized labels out of canConvertHtmlToSvg (which
			// assigns to innerHTML): getLabelValue runs DOMPurify only for html=1,
			// so an editable=0 plain-text sibling can no longer smuggle a raw label
			// into the dry-run conversion below (stored XSS on file open).
			if (cellState != null && mxUtils.getValue(cellState.style, 'html', '0') == '1')
			{
				var label = graph.cellRenderer.getLabelValue(cellState);

				if (label != null && label.length > 0 && !mxUtils.canConvertHtmlToSvg(label, {
					dir: cellState.style[mxConstants.STYLE_TEXT_DIRECTION],
					fontSize: mxUtils.getValue(cellState.style, mxConstants.STYLE_FONTSIZE,
						mxConstants.DEFAULT_FONTSIZE)}))
				{
					hasUnsupported = true;
				}
			}
		}

		if (hasUnsupported)
		{
			// Keeps a checked option enabled so that it can be unchecked
			if (!convertInput.checked)
			{
				convertToSvg.style.opacity = '0.5';
				convertInput.setAttribute('disabled', 'disabled');
				convertToSvg.setAttribute('title',
					'Label contains unsupported HTML or vertical text for SVG conversion. ' +
					'Supported: H1-H6, P, PRE, BLOCKQUOTE, DIV, B, I, U, STRIKE, ' +
					'SUP, SUB, SPAN, FONT, BR (without background color).');
			}
			else
			{
				// Visible warning as tooltips are not available on touch devices
				var warning = document.createElement('span');
				warning.style.marginLeft = '4px';
				warning.style.cursor = 'default';
				mxUtils.write(warning, '⚠︎');
				convertToSvg.appendChild(warning);
				convertToSvg.setAttribute('title',
					'Label cannot be converted to SVG and falls back to HTML rendering. ' +
					'Uncheck to remove the style.');
			}
		}
	}

	var autosizeOpt = this.createCellOption(mxResources.get('autosizeText'),
		'autosizeText', '0', null, null, mxUtils.bind(this, function(cells, value)
	{
		if (value)
		{
			for (var i = 0; i < cells.length; i++)
			{
				if (graph.model.isVertex(cells[i]))
				{
					graph.updateAutosizeTextFontSize(cells[i]);
				}
			}
		}
	}));
	autosizeOpt.style.fontWeight = 'bold';

	// Automatic font size scales the font to the cell bounds, so it is only
	// meaningful when the cell can be resized (hidden for fixed-size labels
	// such as edge labels with resizable=0)
	if (ss.vertices.length > 0 && ss.resizable)
	{
		extraPanel.appendChild(autosizeOpt);
	}

	if (!ui.isOffline() || mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
	{
		convertToSvg.getElementsByTagName('span')[0].style.maxWidth = '172px';
		convertToSvg.appendChild(ui.menus.createHelpLink(
			'https://www.drawio.com/docs/manual/text/svg-labels/'));
	}

	var spacingPanel = this.createPanel();
	spacingPanel.style.height = '86px';

	var topUpdate, globalUpdate, leftUpdate, bottomUpdate, rightUpdate;
	var topSpacing = this.addUnitInput(spacingPanel, this.getUnit(), 87, 52, function()
	{
		topUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	topSpacing.setAttribute('title', mxResources.get('top'));
	var globalSpacing = this.addUnitInput(spacingPanel, this.getUnit(), 16, 52, function()
	{
		globalUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	globalSpacing.setAttribute('title', mxResources.get('global'));

	mxUtils.br(spacingPanel);
	this.addLabel(spacingPanel, mxResources.get('top'), 87, 64);
	this.addLabel(spacingPanel, mxResources.get('global'), 16, 64);
	mxUtils.br(spacingPanel);
	mxUtils.br(spacingPanel);

	var leftSpacing = this.addUnitInput(spacingPanel, this.getUnit(), 158, 52, function()
	{
		leftUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	leftSpacing.setAttribute('title', mxResources.get('left'));
	var bottomSpacing = this.addUnitInput(spacingPanel, this.getUnit(), 87, 52, function()
	{
		bottomUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	bottomSpacing.setAttribute('title', mxResources.get('bottom'));
	var rightSpacing = this.addUnitInput(spacingPanel, this.getUnit(), 16, 52, function()
	{
		rightUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	rightSpacing.setAttribute('title', mxResources.get('right'));

	mxUtils.br(spacingPanel);
	this.addLabel(spacingPanel, mxResources.get('left'), 158, 64);
	this.addLabel(spacingPanel, mxResources.get('bottom'), 87, 64);
	this.addLabel(spacingPanel, mxResources.get('right'), 16, 64);

	// Label width controls the wrapping width of the label independent of the
	// shape size (the labelWidth style). An empty value removes the style so the
	// label falls back to wrapping at the cell width.
	var labelWidthPanel = this.createPanel();
	labelWidthPanel.className = 'geFormatEntry';
	labelWidthPanel.style.fontWeight = 'bold';
	mxUtils.write(labelWidthPanel, mxResources.get('labelWidth'));
	labelWidthPanel.setAttribute('title', mxResources.get('labelWidth'));

	var labelWidthUpdate = mxUtils.bind(this, function(evt)
	{
		var value = (this.isFloatUnit()) ? parseFloat(labelWidth.value) : parseInt(labelWidth.value);
		value = (isNaN(value)) ? null : Math.max(1, this.fromUnit(value));

		if (value != mxUtils.getValue(ui.getSelectionState().style, mxConstants.STYLE_LABEL_WIDTH, null))
		{
			if (graph.isEditing())
			{
				graph.stopEditing(true);
			}

			var cells = ui.getSelectionState().cells;

			graph.getModel().beginUpdate();
			try
			{
				graph.setCellStyles(mxConstants.STYLE_LABEL_WIDTH, value, cells);
				ui.fireEvent(new mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_LABEL_WIDTH],
					'values', [value], 'cells', cells));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}

		labelWidth.value = (value == null) ? '' : this.inUnit(value) + ' ' + this.getUnit();
		mxEvent.consume(evt);
	});

	var labelWidth = this.addUnitInput(labelWidthPanel, this.getUnit(), 16, 52, function()
	{
		labelWidthUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	labelWidth.setAttribute('title', mxResources.get('labelWidth'));

	mxEvent.addListener(labelWidth, 'change', labelWidthUpdate);
	mxEvent.addListener(labelWidth, 'blur', labelWidthUpdate);

	if (!graph.cellEditor.isContentEditing())
	{
		var advancedSec = this.createCollapsibleSection(mxResources.get('advanced'), true);
		advancedSec.contentDiv.appendChild(extraPanel);
		advancedSec.contentDiv.appendChild(labelWidthPanel);
		container.appendChild(advancedSec.wrapper);
		var opacityPanel = this.createRelativeOption(mxResources.get('opacity'), mxConstants.STYLE_TEXT_OPACITY);
		opacityPanel.style.borderTopStyle = 'solid';
		opacityPanel.style.borderTopWidth = '1px';
		opacityPanel.style.padding = '6px 0';
		container.appendChild(opacityPanel);

		var spacingSec = this.createCollapsibleSection(mxResources.get('spacing'), true);
		spacingSec.contentDiv.appendChild(spacingPanel);
		container.appendChild(spacingSec.wrapper);
	}
	else
	{
		var selState = null;
		var lineHeightInput = null;
		
		container.appendChild(this.createRelativeOption(mxResources.get('lineheight'), null, null, function(input)
		{
			var value = (input.value == '') ? 120 : parseInt(input.value);
			value = Math.max(0, (isNaN(value)) ? 120 : value);

			if (window.getSelection)
			{
				if (selState != null)
				{
					graph.cellEditor.restoreSelection(selState);
					selState = null;
				}

				// Updates line height of selected element and all selected child elements
				var node = graph.getSelectedEditingElement();

				// Wraps all text in a div to set line height
				if (graph.cellEditor.textarea != null && node == graph.cellEditor.textarea)
				{
					var sel = window.getSelection();
					
					if (sel.getRangeAt && sel.rangeCount > 0)
					{
						// Wraps the selection in a new div
						var range = sel.getRangeAt(0);
						node = document.createElement('div');
						node.appendChild(range.extractContents());
						graph.cellEditor.textarea.innerHTML = '';
						graph.cellEditor.textarea.appendChild(node);
						sel.removeAllRanges();

						// Selects the new div
						var range = new Range();
						range.selectNodeContents(node);
						sel.addRange(range);
					}
				}

				// Only changes the line height if the selection is inside the cell
				// editor (eg. ignores a Ctrl+A selection outside the canvas)
				if (graph.cellEditor.textarea != null &&
					graph.cellEditor.textarea.contains(node))
				{
					if (node != graph.cellEditor.textarea)
					{
						setLineHeight(node, value);
					}

					// Sets line height on all selected elements
					// as the resulting line height depends on
					// the font size of the element
					var elts = node.getElementsByTagName('*');
					var selection = window.getSelection();

					for (var i = 0; i < elts.length; i++)
					{
						if (selection.containsNode(elts[i], true))
						{
							setLineHeight(elts[i], value);
						}
					}
				}
			}

			input.value = value + ' %';
		}, function(input)
		{
			// Used in CSS handler to update current value
			lineHeightInput = input;

			mxEvent.addGestureListeners(input, mxUtils.bind(this, function(evt)
			{
				if (document.activeElement == graph.cellEditor.textarea)
				{
					selState = graph.cellEditor.saveSelection();
				}
			}));
			
			mxEvent.addListener(input, 'touchstart', function()
			{
				if (document.activeElement == graph.cellEditor.textarea)
				{
					selState = graph.cellEditor.saveSelection();
				}
			});
			
			// Default value for lineHeight is 1.2
			input.value = '120 %';
		}));
		
		var insertPanel = stylePanel.cloneNode(false);
		ui.toolbar.addItems(['link', 'image'], insertPanel, true, [Editor.linkImage, Editor.imageImage]);

		var btns = [
			ui.addButton(Editor.horizontalRuleImage, mxResources.get('insertHorizontalRule'),
			function()
			{
				document.execCommand('inserthorizontalrule', false);
			}, insertPanel),
			ui.toolbar.addMenu(new Menu(mxUtils.bind(this, function(menu)
			{
				ui.menus.addInsertTableItem(menu, null, null, false);
			})), null, Editor.tableImage, insertPanel)];
		
		var wrapper2 = this.createPanel();
		wrapper2.appendChild(this.createTitle(mxResources.get('insert')));
		wrapper2.appendChild(insertPanel);
		container.appendChild(wrapper2);
		
		var tablePanel = stylePanel.cloneNode(false);
		
		var btns = [
			ui.addButton(Editor.addColumnLeftImage, mxResources.get('insertColumnBefore'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (currentTable != null)
					{
						graph.insertColumn(currentTable, (tableCell != null) ? tableCell.cellIndex : 0);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), tablePanel),
			ui.addButton(Editor.addColumnRightImage, mxResources.get('insertColumnAfter'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (currentTable != null)
					{
						graph.insertColumn(currentTable, (tableCell != null) ? tableCell.cellIndex + 1 : -1);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), tablePanel),
			ui.addButton(Editor.removeColumnImage, mxResources.get('deleteColumn'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (currentTable != null && tableCell != null)
					{
						graph.deleteColumn(currentTable, tableCell.cellIndex);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), tablePanel),
			ui.addButton(Editor.addRowAboveImage, mxResources.get('insertRowBefore'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (currentTable != null && tableRow != null)
					{
						graph.insertRow(currentTable, tableRow.sectionRowIndex);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), tablePanel),
			ui.addButton(Editor.addRowBelowImage, mxResources.get('insertRowAfter'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (currentTable != null && tableRow != null)
					{
						graph.insertRow(currentTable, tableRow.sectionRowIndex + 1);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), tablePanel),
			ui.addButton(Editor.removeRowImage, mxResources.get('deleteRow'),
			mxUtils.bind(this, function()
			{
				try
				{
					if (currentTable != null && tableRow != null)
					{
						graph.deleteRow(currentTable, tableRow.sectionRowIndex);
					}
				}
				catch (e)
				{
					ui.handleError(e);
				}
			}), tablePanel)];
	btns[2].style.marginRight = '10px';
	
	var wrapper3 = this.createPanel();
	wrapper3.appendChild(this.createTitle(mxResources.get('table')));
	wrapper3.appendChild(tablePanel);

	var tablePanel2 = stylePanel.cloneNode(false);
	
	var btns = [
		ui.addButton(Editor.strokeColorImage, mxResources.get('borderColor'),
		mxUtils.bind(this, function(evt)
		{
			if (currentTable != null)
			{
				// Converts rgb(r,g,b) values
				var color = currentTable.style.borderColor.replace(
						/\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
						function($0, $1, $2, $3) {
							return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
						});
				ui.pickColor(color, function(newColor)
				{
					var targetElt = (tableCell != null && (evt == null || !mxEvent.isShiftDown(evt))) ? tableCell : currentTable;

					if (targetElt != null)
					{
						graph.processElements(targetElt, function(elt)
						{
							elt.style.border = null;
						});

						if (newColor == null || newColor == mxConstants.NONE)
						{
							targetElt.removeAttribute('border');
							targetElt.style.border = '';
							targetElt.style.borderCollapse = '';
						}
						else
						{
							targetElt.setAttribute('border', '1');
							targetElt.style.border = '1px solid ' + newColor;
							targetElt.style.borderCollapse = 'collapse';
						}
					}
				}, null, null, null, mxResources.get('borderColor'));
			}
		}), tablePanel2),
		ui.addButton(Editor.fillColorImage, mxResources.get('backgroundColor'),
		mxUtils.bind(this, function(evt)
		{
			// Converts rgb(r,g,b) values
			if (currentTable != null)
			{
				var color = currentTable.style.backgroundColor.replace(
						/\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
						function($0, $1, $2, $3) {
							return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
						});
				ui.pickColor(color, function(newColor)
				{
					var targetElt = (tableCell != null && (evt == null || !mxEvent.isShiftDown(evt))) ? tableCell : currentTable;

					if (targetElt != null)
					{
						graph.processElements(targetElt, function(elt)
						{
							elt.style.backgroundColor = null;
						});

						if (newColor == null || newColor == mxConstants.NONE)
						{
							targetElt.style.backgroundColor = '';
						}
						else
						{
							targetElt.style.backgroundColor = newColor;
						}
					}
				}, null, null, null, mxResources.get('backgroundColor'));
			}
		}), tablePanel2),
		ui.addButton(Editor.spacingImage, mxResources.get('spacing'),
		function()
		{
			if (currentTable != null)
			{
				var value = currentTable.getAttribute('cellPadding') || 0;
				
				var dlg = new FilenameDialog(ui, value, mxResources.get('apply'),
					mxUtils.bind(this, function(newValue)
				{
					if (newValue != null && newValue.length > 0)
					{
						currentTable.setAttribute('cellPadding', newValue);
					}
					else
					{
						currentTable.removeAttribute('cellPadding');
					}
				}), mxResources.get('spacing'));
				ui.showDialog(dlg.container, 300, 80, true, true);
				dlg.init();
			}
		}, tablePanel2),
		ui.addButton(Editor.alignLeftImage, mxResources.get('left'),
		function()
		{
			if (currentTable != null)
			{
				currentTable.setAttribute('align', 'left');
			}
		}, tablePanel2),
		ui.addButton(Editor.alignCenterImage, mxResources.get('center'),
		function()
		{
			if (currentTable != null)
			{
				currentTable.setAttribute('align', 'center');
			}
		}, tablePanel2),
		ui.addButton(Editor.alignRightImage, mxResources.get('right'),
		function()
		{
			if (currentTable != null)
			{
				currentTable.setAttribute('align', 'right');
			}
		}, tablePanel2)];
		btns[2].style.marginRight = '10px';
		
		wrapper3.appendChild(tablePanel2);
		container.appendChild(wrapper3);
		
		tableWrapper = wrapper3;
	}
	
	function setSelected(elt, selected)
	{
		if (selected)
		{
			elt.classList.add('geActiveItem');
		}
		else
		{
			elt.classList.remove('geActiveItem');
		}
	};

	// Updates font style state before typing
	for (var i = 0; i < 3; i++)
	{
		(function(index)
		{
			mxEvent.addListener(fontStyleItems[index], 'click', function()
			{
				setSelected(fontStyleItems[index], fontStyleItems[index].style.backgroundImage == '');
			});
		})(i);
	}

	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		ss = ui.getSelectionState();
		var fontStyle = mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSTYLE, 0);
		setSelected(fontStyleItems[0], (fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD);
		setSelected(fontStyleItems[1], (fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC);
		setSelected(fontStyleItems[2], (fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE);
		ui.toolbar.setMenuText(fontMenu, mxUtils.getValue(ss.style, mxConstants.STYLE_FONTFAMILY,
			Menus.prototype.defaultFont));

		setSelected(verticalItem, mxUtils.getValue(ss.style, mxConstants.STYLE_HORIZONTAL, '1') == '0');
		
		if (force || document.activeElement != input)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSIZE, Menus.prototype.defaultFontSize));
			input.value = (isNaN(tmp)) ? '' : tmp + ' ' + Editor.fontSizeUnit;
		}
		
		var align = mxUtils.getValue(ss.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
		setSelected(left, align == mxConstants.ALIGN_LEFT);
		setSelected(center, align == mxConstants.ALIGN_CENTER);
		setSelected(right, align == mxConstants.ALIGN_RIGHT);
		
		var valign = mxUtils.getValue(ss.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
		setSelected(top, valign == mxConstants.ALIGN_TOP);
		setSelected(middle, valign == mxConstants.ALIGN_MIDDLE);
		setSelected(bottom, valign == mxConstants.ALIGN_BOTTOM);
		
		var pos = mxUtils.getValue(ss.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
		var vpos = mxUtils.getValue(ss.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
		
		if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_TOP)
		{
			positionSelect.value = 'topLeft';
		}
		else if (pos == mxConstants.ALIGN_CENTER && vpos == mxConstants.ALIGN_TOP)
		{
			positionSelect.value = 'top';
		}
		else if (pos == mxConstants.ALIGN_RIGHT && vpos == mxConstants.ALIGN_TOP)
		{
			positionSelect.value = 'topRight';
		}
		else if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_BOTTOM)
		{
			positionSelect.value = 'bottomLeft';
		}
		else if (pos == mxConstants.ALIGN_CENTER && vpos == mxConstants.ALIGN_BOTTOM)
		{
			positionSelect.value = 'bottom';
		}
		else if (pos == mxConstants.ALIGN_RIGHT && vpos == mxConstants.ALIGN_BOTTOM)
		{
			positionSelect.value = 'bottomRight';
		}
		else if (pos == mxConstants.ALIGN_LEFT)
		{
			positionSelect.value = 'left';
		}
		else if (pos == mxConstants.ALIGN_RIGHT)
		{
			positionSelect.value = 'right';
		}
		else
		{
			positionSelect.value = 'center';
		}
		
		var dir = mxUtils.getValue(ss.style, mxConstants.STYLE_TEXT_DIRECTION, mxConstants.DEFAULT_TEXT_DIRECTION);
		
		if (dir == mxConstants.TEXT_DIRECTION_RTL)
		{
			dirSelect.value = 'rightToLeft';
		}
		else if (dir == mxConstants.TEXT_DIRECTION_LTR)
		{
			dirSelect.value = 'leftToRight';
		}
		else if (dir == mxConstants.TEXT_DIRECTION_AUTO || !ss.html)
		{
			dirSelect.value = 'automatic';
		}
		else if (dir == mxConstants.TEXT_DIRECTION_VERTICAL_LR)
		{
			dirSelect.value = 'vertical-leftToRight';
		}
		else if (dir == mxConstants.TEXT_DIRECTION_VERTICAL_RL)
		{
			dirSelect.value = 'vertical-rightToLeft';
		}
		
		if (force || document.activeElement != globalSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING, 2));
			globalSpacing.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}

		if (force || document.activeElement != topSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_TOP, 0));
			topSpacing.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}
		
		if (force || document.activeElement != rightSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_RIGHT, 0));
			rightSpacing.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}
		
		if (force || document.activeElement != bottomSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_BOTTOM, 0));
			bottomSpacing.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}
		
		if (force || document.activeElement != leftSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_LEFT, 0));
			leftSpacing.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}

		if (force || document.activeElement != labelWidth)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_LABEL_WIDTH, ''));
			labelWidth.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}
	});

	globalUpdate = this.installInputHandler(globalSpacing, mxConstants.STYLE_SPACING, 2, -999, 999, 
			this.getUnit(' '), null, this.isFloatUnit(), true);
	topUpdate = this.installInputHandler(topSpacing, mxConstants.STYLE_SPACING_TOP, 0, -999, 999, 
			this.getUnit(' '), null, this.isFloatUnit(), true);
	rightUpdate = this.installInputHandler(rightSpacing, mxConstants.STYLE_SPACING_RIGHT, 0, -999, 999, 
			this.getUnit(' '), null, this.isFloatUnit(), true);
	bottomUpdate = this.installInputHandler(bottomSpacing, mxConstants.STYLE_SPACING_BOTTOM, 0, -999, 999, 
			this.getUnit(' '), null, this.isFloatUnit(), true);
	leftUpdate = this.installInputHandler(leftSpacing, mxConstants.STYLE_SPACING_LEFT, 0, -999, 999, 
			this.getUnit(' '), null, this.isFloatUnit(), true);

	this.addKeyHandler(input, listener);
	this.addKeyHandler(globalSpacing, listener);
	this.addKeyHandler(topSpacing, listener);
	this.addKeyHandler(rightSpacing, listener);
	this.addKeyHandler(bottomSpacing, listener);
	this.addKeyHandler(leftSpacing, listener);
	this.addKeyHandler(labelWidth, listener);

	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();
	
	if (graph.cellEditor.isContentEditing())
	{
		var propertiesPanel = null;
		var updating = false;
		
		var updateCssHandler = mxUtils.bind(this, function()
		{
			if (!updating)
			{
				updating = true;
			
				window.setTimeout(mxUtils.bind(this, function()
				{
					var node = graph.getSelectedEditingElement();

					if (node != null && graph.cellEditor.textarea != null)
					{
						var css = mxUtils.getCurrentStyle(node);
						var lineHeight = (node == graph.cellEditor.textarea ||
							node.style.lineHeight == '') ? null : node.style.lineHeight;
						var fontSize = (node == graph.cellEditor.textarea ||
							node.style.fontSize == '') ? null : getAbsoluteFontSize(css)

						// Finds first selected child element
						if (window.getSelection)
						{
							var elts = node.getElementsByTagName('*');
							var selection = window.getSelection();

							for (var i = 0; i < elts.length; i++)
							{
								if (selection.containsNode(elts[i], true) &&
									elts[i].style != null)
								{
									if (fontSize == null && elts[i].style.fontSize != '')
									{
										fontSize = parseFloat(elts[i].style.fontSize);
									}

									if (lineHeight == null && elts[i].style.lineHeight != '')
									{
										lineHeight = elts[i].style.lineHeight;
									}

									if (fontSize != null && lineHeight != null)
									{
										break;
									}
								}
							}
						}

						if (fontSize == null)
						{
							fontSize = getAbsoluteFontSize(css);
						}

						if (lineHeight == null)
						{
							var temp = node;

							while (temp != null && temp != graph.cellEditor.textarea.parentNode)
							{
								if (temp.style != null && temp.style.lineHeight != '')
								{
									lineHeight = temp.style.lineHeight;
									break;
								}

								temp = temp.parentNode;
							}
						}
						
						function getParentBlock(elt)
						{
							while (elt != null && elt != graph.cellEditor.textarea)
							{
								var css = mxUtils.getCurrentStyle(elt);

								if (css.display == 'block')
								{
									return elt;
								}

								elt = elt.parentNode;
							}

							return null;
						};
						
						function hasParentOrOnlyChild(name)
						{
							if (graph.getParentByName(node, name, graph.cellEditor.textarea) != null)
							{
								return true;
							}
							else
							{
								var child = node;
								
								while (child != null && child.childNodes.length == 1)
								{
									child = child.childNodes[0];
									
									if (child.nodeName == name)
									{
										return true;
									}
								}
							}
							
							return false;
						};
						
						function isEqualOrPrefixed(str, value)
						{
							if (str != null && value != null)
							{
								if (str == value)
								{
									return true;
								}
								else if (str.length > value.length + 1)
								{
									return str.substring(str.length - value.length - 1,
										str.length) == '-' + value;
								}
							}
							
							return false;
						};
						
						if (css != null)
						{
							setSelected(fontStyleItems[0], css.fontWeight == 'bold' ||
								css.fontWeight > 400 || hasParentOrOnlyChild('B') ||
								hasParentOrOnlyChild('STRONG'));
							setSelected(fontStyleItems[1], css.fontStyle == 'italic' ||
								hasParentOrOnlyChild('I') || hasParentOrOnlyChild('EM'));
							setSelected(fontStyleItems[2], css.textDecorationLine == 'underline' ||
								hasParentOrOnlyChild('U'));
							setSelected(strike, css.textDecorationLine == 'line-through' ||
								hasParentOrOnlyChild('STRIKE'));
							setSelected(sup, hasParentOrOnlyChild('SUP'));
							setSelected(sub, hasParentOrOnlyChild('SUB'));

							// Adds editing for block CSS styles
							var block = getParentBlock(node);
							
							if (block != null)
							{
								var blockCss = mxUtils.getCurrentStyle(block);

								function checkUnit(value, unit, input, defaultValue)
								{
									if (parseInt(value) == value)
									{
										value += unit;

										if (input != null)
										{
											input.value = value;
										}
									}

									return value;
								};

								var cssProps = [];
								
								function addLengthProperty(name, dispName)
								{
									cssProps.push({name: name, dispName: dispName, type: 'string',
										getValue: function()
										{
											return blockCss[name];
										}, valueChanged: function(newValue, input)
										{
											block.style[name] = checkUnit(newValue, 'px', input);
											
											if (newValue == '' && input != null)
											{
												input.value = blockCss[name];
											}
										}});
								};

								addLengthProperty('paddingTop', 'Padding Top');
								addLengthProperty('paddingRight', 'Padding Right');
								addLengthProperty('paddingLeft', 'Padding Left');
								addLengthProperty('paddingBottom', 'Padding Bottom');
								addLengthProperty('marginTop', 'Margin Top');
								addLengthProperty('marginRight', 'Margin Right');
								addLengthProperty('marginLeft', 'Margin Left');
								addLengthProperty('marginBottom', 'Margin Bottom');

								var newPropertiesPanel = this.createPanel();
								this.addProperties(newPropertiesPanel, cssProps, ss, true)

								if (propertiesPanel != null)
								{
									propertiesPanel.parentNode.replaceChild(newPropertiesPanel, propertiesPanel);
								}
								else
								{
									container.appendChild(newPropertiesPanel);
								}

								propertiesPanel = newPropertiesPanel;
							}
							
							if (!graph.cellEditor.isTableSelected())
							{
								var align = graph.cellEditor.align || mxUtils.getValue(ss.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);

								if (isEqualOrPrefixed(css.textAlign, 'justify'))
								{
									setSelected(full, isEqualOrPrefixed(css.textAlign, 'justify'));
									setSelected(left, false);
									setSelected(center, false);
									setSelected(right, false);
								}
								else
								{
									setSelected(full, false);
									setSelected(left, align == mxConstants.ALIGN_LEFT);
									setSelected(center, align == mxConstants.ALIGN_CENTER);
									setSelected(right, align == mxConstants.ALIGN_RIGHT);
								}
							}
							else
							{
								setSelected(full, isEqualOrPrefixed(css.textAlign, 'justify'));
								setSelected(left, isEqualOrPrefixed(css.textAlign, 'left'));
								setSelected(center, isEqualOrPrefixed(css.textAlign, 'center'));
								setSelected(right, isEqualOrPrefixed(css.textAlign, 'right'));
							}
							
							currentTable = graph.getParentByName(node, 'TABLE', graph.cellEditor.textarea);
							tableRow = (currentTable == null) ? null : graph.getParentByName(node, 'TR', currentTable);
							tableCell = (currentTable == null) ? null : graph.getParentByNames(node, ['TD', 'TH'], currentTable);
							tableWrapper.style.display = (currentTable != null) ? '' : 'none';
							
							if (document.activeElement != input)
							{
								input.value = (isNaN(fontSize)) ? '' : fontSize + ' ' + Editor.fontSizeUnit;

								if (typeof lineHeight === 'string' && lineHeight.indexOf('%') > 0)
								{
									lineHeightInput.value = lineHeight.replace('%', ' %');
								}
								else
								{
									var lh = parseFloat(lineHeight);
									
									if (!isNaN(lh))
									{
										lineHeightInput.value = Math.round(lh * 100) + ' %';
									}
									else
									{
										lineHeightInput.value = '120 %';
									}
								}
							}
							
							if (fontColorApply != null)
							{
								currentFontColor = graph.getTextColor(node, true);
								fontColorApply(currentFontColor, true);
							}
							
							if (bgColorApply != null)
							{
								currentBgColor = graph.getTextColor(node, false);
								bgColorApply(currentBgColor, true);
							}

							ui.toolbar.setMenuText(fontMenu,
								mxUtils.getCssFontFamily(css.fontFamily));
						}
					}
					
					updating = false;
				}), 0);
			}
		});
		
		mxEvent.addListener(graph.cellEditor.textarea, 'input', updateCssHandler);
		mxEvent.addListener(graph.cellEditor.textarea, 'touchend', updateCssHandler);
		mxEvent.addListener(graph.cellEditor.textarea, 'mouseup', updateCssHandler);
		mxEvent.addListener(graph.cellEditor.textarea, 'keyup', updateCssHandler);
		this.listeners.push({destroy: function()
		{
			// No need to remove listener since textarea is destroyed after edit
		}});
		updateCssHandler();
	}

	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(StyleFormatPanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.init = function()
{
	var ui = this.editorUi;
	var ss = ui.getSelectionState();
	
	if (!ss.containsLabel && ss.cells.length > 0)
	{
		if (ss.containsImage && ss.vertices.length == 1 && ss.style.shape == 'image' &&
			ss.style.image != null)
		{
			if (String(ss.style.image).substring(0, 19) == 'data:image/svg+xml;')
			{
				this.container.appendChild(this.addSvgStyles(this.createPanel()));
			}

			if (ss.style.cssVars != null)
			{
				this.container.appendChild(this.addSvgVars(this.createPanel()));
			}
		}

		if (ss.fill)
		{
			var fillSec = this.createCollapsibleSection(mxResources.get('fill'), false);
			fillSec.contentDiv.appendChild(this.addFill(this.createPanel()));
			this.container.appendChild(fillSec.wrapper);
		}

		var strokeSec = this.createCollapsibleSection(mxResources.get('line'), false);
		strokeSec.contentDiv.appendChild(this.addStroke(this.createPanel()));
		this.container.appendChild(strokeSec.wrapper);

		var lineJumpsPanel = this.addLineJumps(this.createPanel());
		var jumpsSec = this.createCollapsibleSection(mxResources.get('lineJumps'), true);
		jumpsSec.contentDiv.appendChild(lineJumpsPanel);
		this.container.appendChild(jumpsSec.wrapper);
		this.syncCollapsibleVisibility(jumpsSec.wrapper, lineJumpsPanel);

		var opacityPanel = this.createRelativeOption(mxResources.get('opacity'), mxConstants.STYLE_OPACITY);
		opacityPanel.style.borderTopStyle = 'solid';
		opacityPanel.style.borderTopWidth = '1px';
		opacityPanel.style.padding = '6px 0';
		this.container.appendChild(opacityPanel);

		var effectsSec = this.createCollapsibleSection(mxResources.get('effects'), true);
		effectsSec.contentDiv.appendChild(this.addEffects(this.createPanel()));
		this.container.appendChild(effectsSec.wrapper);
	}

	var opsPanel = this.createPanel();

	if (ss.cells.length == 1)
	{
		this.addEditOps(opsPanel);

		if (opsPanel.firstChild != null)
		{
			mxUtils.br(opsPanel);
		}
	}

	if (ss.cells.length >= 1)
	{
		this.addStyleOps(opsPanel);
	}

	if (opsPanel.firstChild != null)
	{
		this.container.appendChild(opsPanel);
	}
};

/**
 * Use browser for parsing CSS.
 */
StyleFormatPanel.prototype.getCssRules = function(css)
{
	return Graph.getCssRules(css);
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addSvgStyles = function(container)
{
	var ui = this.editorUi;
	var ss = ui.getSelectionState();
	container.style.paddingTop = '6px';
	container.style.paddingBottom = '6px';
	container.style.fontWeight = 'bold';
	container.style.display = 'none';

	try
	{
		var exp = ss.style.editableCssRules;
		
		if (exp != null)
		{
			var regex = new RegExp(exp);
			
			var data = ss.style.image.substring(ss.style.image.indexOf(',') + 1);
			var xml = (window.atob) ? decodeURIComponent(escape(atob((data)))) :
				Base64.decode(data, true);
			var svg = mxUtils.parseXml(xml);

			if (svg != null)
			{
				var singleColorMode = svg.documentElement.style.colorScheme == 'light' ||
					mxUtils.getValue(ss.style, 'darkMode', null) == '0';
				var setColorScheme = svg.documentElement.style.colorScheme == '';
				var styles = svg.getElementsByTagName('style');

				for (var i = 0; i < styles.length; i++)
				{
					var rules = this.getCssRules(mxUtils.getTextContent(styles[i]));
					
					for (var j = 0; j < rules.length; j++)
					{
						this.addSvgRule(container, rules[j], svg, styles[i],
							rules, j, regex, singleColorMode, setColorScheme);
					}
				}
			}
		}
	}
	catch (e)
	{
		// ignore
	}
	
	return container;
};

/**
 * Returns the color scheme defined in the given CSS string.
 */
StyleFormatPanel.prototype.getColorSchemeFromCss = function(cssString)
{
    var colorSchemeMatch = cssString.match(/color-scheme\s*:\s*([^;]+)/i);

    return colorSchemeMatch ? colorSchemeMatch[1].trim() : null;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addSvgRule = function(container, rule, svg, styleElem, rules,
	ruleIndex, regex, singleColorMode, setColorScheme)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	if (regex.test(rule.selectorText))
	{
		var addStyleRule = mxUtils.bind(this, function(rule, key, label, tempSingleColorMode)
		{
			var value = mxUtils.trim(rule.style.getPropertyValue(key));

			if (value != '' && value.substring(0, 4) != 'url(')
			{
				var colorValue = value;
				
				if (colorValue == 'transparent')
				{
					colorValue = mxConstants.NONE;
				}
				else
				{
					var lightDark = mxUtils.isLightDarkColor(colorValue);

					if (lightDark && tempSingleColorMode)
					{
						tempSingleColorMode = false;
					}
					else if (!lightDark && !tempSingleColorMode)
					{
						colorValue = 'light-dark(' + colorValue +
							', ' + colorValue + ')';
					}
				}
				
				var option = this.createColorOption(label + ' ' + rule.selectorText, function()
				{
					return colorValue;
				}, mxUtils.bind(this, function(color)
				{
					rules[ruleIndex].style.setProperty(key, (color == mxConstants.NONE) ?
						'transparent' : mxUtils.getLightDarkColor(color).cssText);
					var cssTxt = '';

					if (setColorScheme && mxUtils.isLightDarkColor(rules[ruleIndex].style[key]))
					{
						svg.documentElement.style.colorScheme = 'light dark';
					}
					
					for (var i = 0; i < rules.length; i++) 
					{
						cssTxt += rules[i].cssText + ' ';
					}
					
					styleElem.textContent = cssTxt;
					var xml = mxUtils.getXml(svg.documentElement);
					
					graph.setCellStyles(mxConstants.STYLE_IMAGE, 'data:image/svg+xml,' +
						((window.btoa) ? btoa(unescape(encodeURIComponent(xml))) :
							Base64.encode(xml, true)),
						ui.getSelectionState().cells);
				}), '#ffffff',
				{
					install: function(apply)
					{
						// ignore
					},
					destroy: function()
					{
						// ignore
					}
				}, null, null, null, tempSingleColorMode);
				
				container.appendChild(option);
				container.style.display = '';
			}
		});
		
		addStyleRule(rule, 'fill', mxResources.get('fill'), singleColorMode);
		addStyleRule(rule, 'stroke', mxResources.get('line'), singleColorMode);
		addStyleRule(rule, 'stop-color', mxResources.get('gradient'), singleColorMode);
	}
};

/**
 * Adds color options for the CSS variables defined in the cssVars style.
 * The value for each variable is stored in the style key of the same
 * name with a -- prefix.
 */
StyleFormatPanel.prototype.addSvgVars = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = ui.getSelectionState();
	container.style.paddingTop = '6px';
	container.style.paddingBottom = '6px';
	container.style.fontWeight = 'bold';
	container.style.display = 'none';

	var singleColorMode = mxUtils.getValue(ss.style, 'darkMode', null) == '0';

	// Respects an explicit light color scheme in embedded SVG images
	if (!singleColorMode && String(ss.style.image).substring(0, 19) == 'data:image/svg+xml;')
	{
		try
		{
			var data = ss.style.image.substring(ss.style.image.indexOf(',') + 1);
			var xml = (window.atob) ? decodeURIComponent(escape(atob((data)))) :
				Base64.decode(data, true);
			var svg = mxUtils.parseXml(xml);

			if (svg != null)
			{
				singleColorMode = svg.documentElement.style.colorScheme == 'light';
			}
		}
		catch (e)
		{
			// ignore
		}
	}

	// Sets the given CSS variable style on the given cells. A linked image
	// is first converted to a data URI and the variable is set with the
	// image in one atomic change, so that themed images are always
	// self-contained, eg. for synchronous exports. The original URL is
	// kept in the imageUrl style. If the conversion fails, then the
	// variable is not set and an error is shown.
	var setCssVar = function(name, value, cells)
	{
		var src = String(mxUtils.getValue(ui.getSelectionState().style,
			mxConstants.STYLE_IMAGE, ''));

		if (value != null && src != '' && src.substring(0, 5) != 'data:' &&
			typeof ui.editor.convertImageToDataUri === 'function')
		{
			ui.editor.convertImageToDataUri(src, function(uri)
			{
				if (uri != null && uri != src &&
					uri.substring(0, 26) == 'data:image/svg+xml;base64,')
				{
					graph.getModel().beginUpdate();
					try
					{
						graph.setCellStyles(mxConstants.STYLE_IMAGE,
							'data:image/svg+xml,' + uri.substring(26), cells);
						graph.setCellStyles('imageUrl', src, cells);
						graph.setCellStyles(name, value, cells);
					}
					finally
					{
						graph.getModel().endUpdate();
					}
				}
				else
				{
					ui.handleError({message: mxResources.get('errorLoadingFile')});
				}
			});
		}
		else
		{
			graph.setCellStyles(name, value, cells);
		}
	};

	var addVarOption = mxUtils.bind(this, function(name)
	{
		var option = this.createColorOption(name, function()
		{
			return mxUtils.getValue(ui.getSelectionState().style, '--' + name, null);
		}, function(color)
		{
			setCssVar('--' + name, (color == mxConstants.NONE) ? null :
				mxUtils.getLightDarkColor(color).cssText,
				ui.getSelectionState().cells);
		}, '#ffffff',
		{
			install: function(apply)
			{
				// ignore
			},
			destroy: function()
			{
				// ignore
			}
		}, null, null, null, singleColorMode);

		container.appendChild(option);
		container.style.display = '';
	});

	var tokens = String(mxUtils.getValue(ss.style, 'cssVars', '')).split(',');

	for (var i = 0; i < tokens.length; i++)
	{
		var name = mxUtils.trim(tokens[i]);

		// Tolerates the -- prefix in declared names
		if (name.substring(0, 2) == '--')
		{
			name = name.substring(2);
		}

		if (name != '')
		{
			addVarOption(name);
		}
	}

	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addEditOps = function(div)
{
	var ss = this.editorUi.getSelectionState();

	if (ss.cells.length == 1)
	{
		var editSelect = document.createElement('select');
		editSelect.style.position = 'relative';
		editSelect.style.marginBottom = '2px';
		editSelect.className = 'geFullWidthElement';
		
		var ops = ['edit', 'copyAsText', 'editLink', 'editShape', 'editImage',
			'editData', 'copyData', 'pasteData',
			'editConnectionPoints', 'editGeometry', 'editPolygon', 'editTooltip', 'editNote', 'editStyle'];
		var libs = null;

		if (this.editorUi.sidebar != null)
		{
			var keyStyle = this.editorUi.sidebar.getKeyStyle(ss.cells[0].style);
			libs = this.editorUi.sidebar.getLibsForStyle(keyStyle);

			// Adds open library action and updates search index when invoked
			// if no libs were found but the shape name is likely to be known
			if (libs == null && !this.editorUi.sidebar.isSearchIndexLoaded() &&
				ss.style.shape != null && String(ss.style.shape).
					substring(0, 8) == 'mxgraph.')
			{
				libs = [];
			}
		}

		if (libs != null)
		{
			ops.push('openLibrary');
		}

		for (var i = 0; i < ops.length; i++)
		{
			var action = this.editorUi.actions.get(ops[i]);

			if (action == null || action.enabled)
			{
				var editOption = document.createElement('option');
				editOption.setAttribute('value', ops[i]);
				var title = mxResources.get(ops[i]);
				mxUtils.write(editOption, title);

				if (action != null && action.shortcut != null)
				{
					title += ' (' + action.shortcut + ')';
				}

				editOption.setAttribute('title', title);
				editSelect.appendChild(editOption);
			}
		}

		if (editSelect.children.length > 1)
		{
			div.appendChild(editSelect);

			mxEvent.addListener(editSelect, 'change', mxUtils.bind(this, function(evt)
			{
				if (editSelect.value == 'openLibrary')
				{
					if (libs != null && libs.length == 0)
					{
						// Updates search index and tries again
						this.editorUi.sidebar.updateSearchIndex();
						var keyStyle = this.editorUi.sidebar.getKeyStyle(ss.cells[0].style);
						libs = this.editorUi.sidebar.getLibsForStyle(keyStyle);
					}

					if (libs != null && libs.length > 0)
					{
						this.editorUi.sidebar.openLibraries(libs);
					}
					else
					{
						this.editorUi.handleError({message: mxResources.get('objectNotFound')});
					}

					editSelect.value = 'edit';
				}
				else
				{
					var action = this.editorUi.actions.get(editSelect.value);
					editSelect.value = 'edit';

					if (action != null)
					{
						action.funct();
					}
				}
			}));
			
			if (ss.image)
			{
				var graph = this.editorUi.editor.graph;
				var state = graph.view.getState(graph.getSelectionCell());

				if (state != null && mxUtils.getValue(state.style, mxConstants.STYLE_IMAGE, null) != null)
				{
					var btn = mxUtils.button(mxResources.get('crop') + '...',
						mxUtils.bind(this, function(evt)
					{
						this.editorUi.actions.get('crop').funct();
					}));

					btn.setAttribute('title', mxResources.get('crop'));
					editSelect.style.width = '104px';
					btn.style.width = '104px';
					btn.style.position = 'relative';
					btn.style.top = '-1px';
					btn.style.marginLeft = '2px';
					btn.style.marginBottom = '1px';

					div.appendChild(btn);
				}
			}
		}
	}

	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addFill = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = ui.getSelectionState();

	// Adds gradient direction option
	var gradientSelect = document.createElement('select');
	gradientSelect.setAttribute('title', mxResources.get('gradient'));
	gradientSelect.style.position = 'absolute';
	gradientSelect.style.left = '76px';
	gradientSelect.style.width = '86px';

	var fillStyleSelect = gradientSelect.cloneNode(false);
	fillStyleSelect.setAttribute('title', mxResources.get('fill'));
	
	// Stops events from bubbling to color option event handler
	mxEvent.addListener(gradientSelect, 'click', function(evt)
	{
		mxEvent.consume(evt);
	});
	mxEvent.addListener(fillStyleSelect, 'click', function(evt)
	{
		mxEvent.consume(evt);
	});
	
	var gradientPanel = this.createCellColorOption(mxResources.get('gradient'),
		mxConstants.STYLE_GRADIENTCOLOR, 'default', function(color)
	{
		if (color == null || color == mxConstants.NONE)
		{
			gradientSelect.style.display = 'none';
		}
		else
		{
			gradientSelect.style.display = '';
		}
	}, function(color)
	{
		graph.updateCellStyles({'gradientColor': color}, graph.getSelectionCells());
	}, graph.getDefaultColor(ss.style, mxConstants.STYLE_GRADIENTCOLOR,
		graph.shapeForegroundColor, graph.shapeBackgroundColor),
		null, null, mxResources.get('gradientColor'));
	
	gradientPanel.style.fontWeight = 'bold';

	var fillKey = (ss.style.shape == 'image') ? mxConstants.STYLE_IMAGE_BACKGROUND : mxConstants.STYLE_FILLCOLOR;

	// createCellColorOption already calls setCellStyles internally with the
	// current selection. Passing setStyleFn that called setCellStyles again
	// with the closure-captured ss.cells caused color changes to leak onto
	// the cells the format panel was originally built for, when the user's
	// selection had moved on between panel build and color change.
	var fillPanel = this.createCellColorOption(mxResources.get('fill'),
		fillKey, 'default', null, null,
		graph.getDefaultColor(ss.style, fillKey, graph.shapeBackgroundColor,
		graph.shapeForegroundColor), null, null, mxResources.get('fillColor'));

	fillPanel.style.fontWeight = 'bold';
	var tmpColor = mxUtils.getValue(ss.style, fillKey, null);
	gradientPanel.style.display = (tmpColor != null && tmpColor != mxConstants.NONE &&
		ss.fill && ss.style.shape != 'image') ? '' : 'none';

	var directions = [mxConstants.DIRECTION_NORTH, mxConstants.DIRECTION_EAST,
	                  mxConstants.DIRECTION_SOUTH, mxConstants.DIRECTION_WEST,
					  mxConstants.DIRECTION_RADIAL];

	for (var i = 0; i < directions.length; i++)
	{
		var gradientOption = document.createElement('option');
		gradientOption.setAttribute('value', directions[i]);
		mxUtils.write(gradientOption, mxResources.get(directions[i]));
		gradientSelect.appendChild(gradientOption);
	}
	
	gradientPanel.appendChild(gradientSelect);
	
	var curFillStyle;

	function populateFillStyle()
	{
		fillStyleSelect.innerHTML = '';
		curFillStyle = 1;
		
		for (var i = 0; i < Editor.fillStyles.length; i++)
		{
			var fillStyleOption = document.createElement('option');
			fillStyleOption.setAttribute('value', Editor.fillStyles[i].val);
			mxUtils.write(fillStyleOption, mxResources.get(Editor.fillStyles[i].res,
				null, Editor.fillStyles[i].dispName));
			fillStyleSelect.appendChild(fillStyleOption);
		}
	};

	function populateRoughFillStyle()
	{
		fillStyleSelect.innerHTML = '';
		curFillStyle = 2;

		for (var i = 0; i < Editor.roughFillStyles.length; i++)
		{
			var fillStyleOption = document.createElement('option');
			fillStyleOption.setAttribute('value', Editor.roughFillStyles[i].val);
			mxUtils.write(fillStyleOption, mxResources.get(Editor.roughFillStyles[i].res,
				null, Editor.roughFillStyles[i].dispName));
			fillStyleSelect.appendChild(fillStyleOption);
		}

		fillStyleSelect.value = 'auto';
	};

	populateFillStyle();

	if (ss.gradient)
	{
		fillPanel.appendChild(fillStyleSelect);
	}

	var listener = mxUtils.bind(this, function()
	{
		ss = ui.getSelectionState();
		var value = mxUtils.getValue(ss.style, mxConstants.STYLE_GRADIENT_DIRECTION,
			mxConstants.DIRECTION_SOUTH);
		var fillStyle = mxUtils.getValue(ss.style, 'fillStyle', 'auto');
		
		// Handles empty string which is not allowed as a value
		if (value == '')
		{
			value = mxConstants.DIRECTION_SOUTH;
		}
		
		gradientSelect.value = value;
		container.style.display = (ss.fill) ? '' : 'none';
		
		var fillColor = mxUtils.getValue(ss.style, fillKey, null);
		
		if (!ss.fill || fillColor == null || fillColor == mxConstants.NONE ||
			ss.style.shape == 'filledEdge')
		{
			fillStyleSelect.style.display = 'none';
			gradientPanel.style.display = 'none';
		}
		else
		{
			if (ss.style.sketch == '1')
			{
				if (curFillStyle != 2)
				{
					populateRoughFillStyle()
				}
			}
			else if (curFillStyle != 1)
			{
				populateFillStyle();
			}
			
			fillStyleSelect.value = fillStyle;

			//In case of switching from sketch to regular and fill type is not there
			if (!fillStyleSelect.value)
			{
				fillStyle = 'auto';
				fillStyleSelect.value = fillStyle;
			}

			fillStyleSelect.style.display = ss.style.sketch == '1' ||
				gradientSelect.style.display == 'none'? '' : 'none';
			gradientPanel.style.display = (ss.gradient &&
				!ss.containsImage && (ss.style.sketch != '1' ||
				fillStyle == 'solid' || fillStyle == 'auto')) ?
				'' : 'none';
		}
	});
	
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();

	mxEvent.addListener(gradientSelect, 'change', function(evt)
	{
		graph.setCellStyles(mxConstants.STYLE_GRADIENT_DIRECTION, gradientSelect.value, ss.cells);
		ui.fireEvent(new mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_GRADIENT_DIRECTION],
			'values', [gradientSelect.value], 'cells', ss.cells));
		mxEvent.consume(evt);
	});
	
	mxEvent.addListener(fillStyleSelect, 'change', function(evt)
	{
		graph.setCellStyles('fillStyle', fillStyleSelect.value, ss.cells);
		ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['fillStyle'],
			'values', [fillStyleSelect.value], 'cells', ss.cells));
		mxEvent.consume(evt);
	});
	
	container.appendChild(fillPanel);
	container.appendChild(gradientPanel);

	// Makes sure every color key appeary only once
	var ignoredColors = {};

	// Adds custom colors
	var custom = this.getCustomColors();
	
	for (var i = 0; i < custom.length; i++)
	{
		if (!ignoredColors[custom[i].key])
		{
			ignoredColors[custom[i].key] = true;
			container.appendChild(this.createCellColorOption(custom[i].title,
				custom[i].key, custom[i].defaultValue, null, null,
				custom[i].defaultColorValue, custom[i].undefinedColor,
				true));
		}
	}

	// Adds custom colors from fill-/strokeColorStyles
	var addColorStyles = mxUtils.bind(this, function(colorStyles, defaultValues, defaultColor)
	{
		if (colorStyles != null)
		{
			var tokens = colorStyles.split(',');
			var defaultTokens = (defaultValues != null) ?
				defaultValues.split(',') : null;
			
			for (var i = 0; i < tokens.length; i++)
			{
				if (!ignoredColors[tokens[i]])
				{
					ignoredColors[tokens[i]] = true;
					var defaultValue = (defaultTokens != null) ?
						defaultTokens[mxUtils.mod(i,
							defaultTokens.length)] : null;
					var actualDefault = (defaultValue != null) ?
						defaultValue : 'default';
					container.appendChild(this.createCellColorOption(
						Editor.getLabelForStylename(tokens[i]),
						tokens[i], actualDefault, null, null,
						defaultColor, defaultValue, true));
				}
			}
		}
	});
	
	addColorStyles(ss.style.fillColorStyles, ss.style.defaultFillColors,
		graph.shapeBackgroundColor);
	addColorStyles(ss.style.strokeColorStyles, ss.style.defaultStrokeColors,
		graph.shapeForegroundColor);

	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.getCustomColors = function()
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = ui.getSelectionState();
	var result = [];

	if (ss.customProperties != null)
	{
		for (var key in ss.customProperties)
		{
			var prop = ss.customProperties[key];

			if (prop != null && prop.primary &&
				(prop.type == 'color' || prop.subType == 'color') &&
				(typeof(prop.isVisible) !== 'function' ||
				prop.isVisible(ss, this)))
			{
				var defaultColor = (prop.subType == 'color') ?
					prop.subDefVal : prop.defVal;
				defaultColor = (defaultColor != null) ?
					defaultColor : graph.shapeBackgroundColor;
				result.push({title: prop.dispName,
					defaultValue: defaultColor,
					defaultColorValue: (prop.defaultColor != null) ?
						prop.defaultColor : defaultColor,
					undefinedColor: prop.undefinedColor,
					key: prop.name});
			}
		}
	}

	if (ss.swimlane)
	{
		var graph = this.editorUi.editor.graph;
		result.push({title: mxResources.get('laneColor'),
			key: 'swimlaneFillColor', defaultValue: 'default',
			defaultColorValue: graph.shapeBackgroundColor});
	}
	
	return result;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addDashPattern = function(elt, pattern)
{
	var tokens = pattern.split(' ');

	if (tokens.length >= 2)
	{
		var sum = 0;

		for (var i = 0; i < tokens.length; i++)
		{
			sum += parseInt(tokens[i]);
		}
		
		var img = Graph.createSvgImage(sum, 1, '<line transform="translate(0,1)" x1="0" y1="0" x2="' + sum +
			'" y2="0" stroke-dasharray="' + pattern + '" stroke-width="2" stroke="black"/>', sum, 1);
		elt.style.backgroundImage = 'url(' + img.src + ')';
		elt.style.backgroundSize = sum + 'px 1px';
		elt.style.backgroundRepeat = 'repeat-x';
	}
	else
	{
		elt.style.borderBottomStyle = pattern;
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addStroke = function(container)
{
	var panel = this;
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = ui.getSelectionState();
	
	var colorPanel = document.createElement('div');
	colorPanel.className = 'geFormatEntry';
	
	if (!ss.stroke)
	{
		colorPanel.style.display = 'none';
	}
	
	// Adds path style option
	var styleSelect = document.createElement('select');
	styleSelect.setAttribute('title', mxResources.get('style'));
	styleSelect.style.position = 'absolute';
	styleSelect.style.left = '72px';
	styleSelect.style.width = '90px';

	var styles = ['sharp', 'rounded', 'curved'];

	for (var i = 0; i < styles.length; i++)
	{
		var styleOption = document.createElement('option');
		styleOption.setAttribute('value', styles[i]);
		mxUtils.write(styleOption, mxResources.get(styles[i]));
		styleSelect.appendChild(styleOption);
	}
	
	mxEvent.addListener(styleSelect, 'change', function(evt)
	{
		graph.getModel().beginUpdate();
		try
		{
			var keys = [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED];
			var values = ['0', '0'];
			
			if (styleSelect.value == 'rounded')
			{
				values = ['1', '0'];
			}
			else if (styleSelect.value == 'curved')
			{
				values = ['0', '1'];
			}
			
			for (var i = 0; i < keys.length; i++)
			{
				graph.setCellStyles(keys[i], values[i], ss.cells);
			}
			
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', keys,
				'values', values, 'cells', ss.cells));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
		
		mxEvent.consume(evt);
	});
	
	// Stops events from bubbling to color option event handler
	mxEvent.addListener(styleSelect, 'click', function(evt)
	{
		mxEvent.consume(evt);
	});

	var strokeKey = (ss.style.shape == 'image') ? mxConstants.STYLE_IMAGE_BORDER : mxConstants.STYLE_STROKECOLOR;
	var label = (ss.style.shape == 'image') ? mxResources.get('border') : mxResources.get('line');
	var strokeTitle = (ss.style.shape == 'image') ? mxResources.get('borderColor') : mxResources.get('strokeColor');

	var lineColor = this.createCellColorOption(label, strokeKey, 'default', null, mxUtils.bind(this, function(color)
	{
		// createCellColorOption already applied the color to the current
		// selection via setCellStyles. Avoid a second setCellStyles call
		// against the stale ss.cells closure (which leaked color changes
		// onto cells the user no longer had selected). The table-cell
		// inherit-fix below intentionally uses the fresh selection.
		if (color == null || color == mxConstants.NONE)
		{
			var freshCells = ui.getSelectionState().cells;
			var tableCells = [];

			for (var i = 0; i < freshCells.length; i++)
			{
				if (graph.isTableCell(freshCells[i]) ||
					graph.isTableRow(freshCells[i]))
				{
					tableCells.push(freshCells[i]);
				}
			}

			if (tableCells.length > 0)
			{
				graph.setCellStyles(strokeKey, 'inherit', tableCells);
			}
		}
	}), graph.shapeForegroundColor, null, null, strokeTitle);
	
	lineColor.style.fontWeight = 'bold';
	lineColor.appendChild(styleSelect);
	
	// Used if only edges selected
	var stylePanel = colorPanel.cloneNode(false);
	stylePanel.style.position = 'relative';

	var addItem = mxUtils.bind(this, function(menu, width, pattern, keys, values)
	{
		var item = this.editorUi.menus.styleChange(menu, '', keys, values, '');
		var pat = document.createElement('div');
		this.addDashPattern(pat, pattern);
		item.firstChild.firstChild.className = 'geStyleMenuItem';
		item.firstChild.firstChild.style.width = width + 'px';
		item.firstChild.firstChild.appendChild(pat);

		return item;
	});

	var dashKeys = [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN];

	function createCustomDiv(width)
	{
		var customDiv = document.createElement('div');
		mxUtils.write(customDiv, mxResources.get('custom'));
		customDiv.setAttribute('title', mxResources.get('custom'));
		customDiv.className = 'geStyleMenuItem';
		customDiv.style.textAlign = 'center';
		customDiv.style.display = 'block';
		customDiv.style.textOverflow = 'ellipsis';
		customDiv.style.overflow = 'hidden';
		customDiv.style.maxWidth = width + 'px';
		customDiv.style.fontSize = '12px';

		return customDiv;
	};
	
	var pattern = ui.toolbar.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		addItem(menu, 110, 'solid', dashKeys, [null, null]).setAttribute('title', mxResources.get('solid'));
		addItem(menu, 110, 'dashed', dashKeys, ['1', null]).setAttribute('title', mxResources.get('dashed') + ' (1)');
		addItem(menu, 110, '8 8', dashKeys, ['1', '8 8']).setAttribute('title', mxResources.get('dashed') + ' (2)');
		addItem(menu, 110, '12 12', dashKeys, ['1', '12 12']).setAttribute('title', mxResources.get('dashed') + ' (3)');
		addItem(menu, 110, '8 4 1 4', dashKeys, ['1', '8 4 1 4']).setAttribute('title', mxResources.get('dashed') + ' (4)');
		addItem(menu, 110, 'dotted', dashKeys, ['1', '1 1']).setAttribute('title', mxResources.get('dotted') + ' (1)');
		addItem(menu, 110, '1 2', dashKeys, ['1', '1 2']).setAttribute('title', mxResources.get('dotted') + ' (2)');
		addItem(menu, 110, '1 4', dashKeys, ['1', '1 4']).setAttribute('title', mxResources.get('dotted') + ' (3)');

		menu.addItem('', null, mxUtils.bind(this, function()
		{
			ui.prompt(mxResources.get('pattern'), mxUtils.getValue(ss.style, mxConstants.STYLE_DASH_PATTERN, '8 4 1 4'),
				mxUtils.bind(this, function(newValue)
				{
					ui.menus.createStyleChangeFunction(dashKeys, ['1', newValue])();
				}), true);
		})).firstChild.appendChild(createCustomDiv(110));
	})), '', null, stylePanel);

	// Used for mixed selection (vertices and edges)
	var altStylePanel = stylePanel.cloneNode(false);

	var edgeShape = ui.toolbar.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		var keys = [mxConstants.STYLE_SHAPE, mxConstants.STYLE_STARTSIZE, mxConstants.STYLE_ENDSIZE, mxConstants.STYLE_DASHED, 'width'];
		Format.processMenuIcon(this.editorUi.menus.styleChange(menu, '', keys, [null, null, null, null, null], '',
			null, null, null, true, Format.connectionImage.src)).setAttribute('title', mxResources.get('line'));
		Format.processMenuIcon(this.editorUi.menus.styleChange(menu, '', keys, ['link', null, null, null, null], '',
			null, null, null, true, Format.linkEdgeImage.src)).setAttribute('title', mxResources.get('link'));
		Format.processMenuIcon(this.editorUi.menus.styleChange(menu, '', keys, ['flexArrow', null, null, null, null], '',
			null, null, null, true, Format.arrowImage.src)).setAttribute('title', mxResources.get('arrow'));
		Format.processMenuIcon(this.editorUi.menus.styleChange(menu, '', keys, ['arrow', null, null, null, null], '',
			null, null, null, true, Format.simpleArrowImage.src)).setAttribute('title', mxResources.get('simpleArrow'));
		Format.processMenuIcon(this.editorUi.menus.styleChange(menu, '', keys, ['filledEdge', null, null, null, null], '',
			null, null, null, true, Format.filledEdgeImage.src)).setAttribute('title', 'Filled Edge');
		Format.processMenuIcon(this.editorUi.menus.styleChange(menu, '', keys, ['pipe', null, null, null, null], '',
			null, null, null, true, Format.pipeEdgeImage.src)).setAttribute('title', 'Pipe');
		Format.processMenuIcon(this.editorUi.menus.styleChange(menu, '', keys, ['wire', null, null, '1', null], '',
			null, null, null, true, Format.wireEdgeImage.src)).setAttribute('title', 'Wire');
	})), '', null, altStylePanel);

	edgeShape.setAttribute('title', mxResources.get('connection'));

	var altPattern = ui.toolbar.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		addItem(menu, 44, 'solid', dashKeys, [null, null]).setAttribute('title', mxResources.get('solid'));
		addItem(menu, 44, 'dashed', dashKeys, ['1', null]).setAttribute('title', mxResources.get('dashed') + ' (1)');
		addItem(menu, 44, '8 8', dashKeys, ['1', '8 8']).setAttribute('title', mxResources.get('dashed') + ' (2)');
		addItem(menu, 44, '12 12', dashKeys, ['1', '12 12']).setAttribute('title', mxResources.get('dashed') + ' (3)');
		addItem(menu, 44, '8 4 1 4', dashKeys, ['1', '8 4 1 4']).setAttribute('title', mxResources.get('dashed') + ' (4)');
		addItem(menu, 44, 'dotted', dashKeys, ['1', '1 1']).setAttribute('title', mxResources.get('dotted') + ' (1)');
		addItem(menu, 44, '1 2', dashKeys, ['1', '1 2']).setAttribute('title', mxResources.get('dotted') + ' (2)');
		addItem(menu, 44, '1 4', dashKeys, ['1', '1 4']).setAttribute('title', mxResources.get('dotted') + ' (3)');
		
		menu.addItem('', null, mxUtils.bind(this, function()
		{
			ui.prompt(mxResources.get('pattern'), mxUtils.getValue(ss.style, mxConstants.STYLE_DASH_PATTERN, '8 4 1 4'),
				mxUtils.bind(this, function(newValue)
				{
					ui.menus.createStyleChangeFunction(dashKeys, ['1', newValue])();
				}), true);
		})).firstChild.appendChild(createCustomDiv(44));
	})), '', null, altStylePanel);
	
	var stylePanel2 = stylePanel.cloneNode(false);

	// Stroke width
	var input = document.createElement('input');
	input.style.position = 'absolute';
	input.style.width = '52px';
	input.style.left = '148px';
	input.setAttribute('title', mxResources.get('linewidth'));
	
	stylePanel.appendChild(input);
	
	var altInput = input.cloneNode(true);
	altInput.style.width = '56px';
	altInput.style.left = '144px';
	altStylePanel.appendChild(altInput);

	function update(evt)
	{
		// Maximum stroke width is 999
		var value = panel.fromUnit(parseFloat(input.value));
		value = Math.min(999, Math.max(0, (isNaN(value)) ? 1 : value));
		
		if (value != mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1))
		{
			graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, value, ss.cells);
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_STROKEWIDTH],
					'values', [value], 'cells', ss.cells));
		}

		input.value = panel.inUnit(value) + ' ' + panel.getUnit();
		mxEvent.consume(evt);
	};

	function altUpdate(evt)
	{
		// Maximum stroke width is 999
		var value = panel.fromUnit(parseFloat(altInput.value));
		value = Math.min(999, Math.max(0, (isNaN(value)) ? 1 : value));
		
		if (value != mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1))
		{
			graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, value, ss.cells);
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_STROKEWIDTH],
					'values', [value], 'cells', ss.cells));
		}

		altInput.value = panel.inUnit(value) + ' ' + panel.getUnit();
		mxEvent.consume(evt);
	};

	var stepper = this.createStepper(input, update, this.getUnitStep(), null, null, this.isFloatUnit());
	stepper.style.display = input.style.display;
	stylePanel.appendChild(stepper);

	var altStepper = this.createStepper(altInput, altUpdate, this.getUnitStep(), null, null, this.isFloatUnit());
	altStepper.style.display = altInput.style.display;
	altStylePanel.appendChild(altStepper);
	
	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);

	mxEvent.addListener(altInput, 'blur', altUpdate);
	mxEvent.addListener(altInput, 'change', altUpdate);
	
	var edgeStyle = ui.toolbar.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		if (ss.style.shape != 'arrow')
		{
			// Each routing entry also CLEARS libavoidRouting so the choices stay
			// mutually exclusive (picking any plain routing turns auto-routing off).
			Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
				[null, null, null, null], null, null, true, Format.straightImage.src)).setAttribute('title', mxResources.get('straight'));
			Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
				['orthogonalEdgeStyle', null, null, null], null, null, true, Format.orthogonalImage.src)).setAttribute('title', mxResources.get('orthogonal'));

			// libavoid obstacle-avoiding routing: orthogonal edge + the flag, routed
			// immediately (postFn) and re-routed thereafter on move/reconnect. Only
			// shown when the extensions bundle (libavoid) is loaded (a no-op in
			// viewers / configs without extensions.min.js).
			if (typeof LibavoidRouting !== 'undefined')
			{
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
					['orthogonalEdgeStyle', null, null, '1'], null, null, true, Format.libavoidImage.src, function(graph, edges)
					{
						LibavoidRouting.autoReroute(graph, edges);
					})).setAttribute('title', mxResources.get('libavoidAutoRoute'));
			}

			Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
				['elbowEdgeStyle', 'vertical', null, null, null], null, null, true, Format.verticalElbowImage.src)).setAttribute('title', mxResources.get('horizontal'));
			Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
				['elbowEdgeStyle', null, null, null, null], null, null, true, Format.horizontalElbowImage.src)).setAttribute('title', mxResources.get('vertical'));
			Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
				['isometricEdgeStyle', null, null, null, null], null, null, true, Format.horizontalIsometricImage.src)).setAttribute('title', mxResources.get('isometric'));
			Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
				['isometricEdgeStyle', 'vertical', null, null, null], null, null, true, Format.verticalIsometricImage.src)).setAttribute('title', mxResources.get('isometric'));

			if (Graph.edgeSupportsCurved(ss.style))
			{
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
					['orthogonalEdgeStyle', '1', null, null], null, null, true, Format.curvedImage.src)).setAttribute('title', mxResources.get('curved'));
			}

			Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
				['entityRelationEdgeStyle', null, null, null], null, null, true, Format.entityImage.src)).setAttribute('title', mxResources.get('entityRelation'));
		}
	})), '', null, stylePanel2);

	edgeStyle.setAttribute('title', mxResources.get('waypoints'));

	var lineStart = ui.toolbar.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		if (ss.style.shape == 'connector' || ss.style.shape == 'flexArrow' || ss.style.shape == 'filledEdge' ||
			ss.style.shape == 'wire' || ss.style.shape == 'pipe' || ss.style.shape == 'mxgraph.basic.arc')
		{
			// Copies other marker
			var otherMarker = mxUtils.getValue(ss.style, mxConstants.STYLE_ENDARROW, mxConstants.NONE);
			var otherFill = mxUtils.getValue(ss.style, 'endFill', '1');

			if (otherMarker != mxConstants.NONE &&
				(mxUtils.getValue(ss.style, mxConstants.STYLE_STARTARROW, mxConstants.NONE) != otherMarker ||
				mxUtils.getValue(ss.style, 'startSize', '1') != mxUtils.getValue(ss.style, 'endSize', '1') ||
				mxUtils.getValue(ss.style, 'startFill', '1') != otherFill))
			{
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '',
					[mxConstants.STYLE_STARTARROW, 'startFill', 'startSize'],
					[otherMarker, otherFill, mxUtils.getValue(ss.style, 'endSize')], null, null, false,
						ui.getImageForMarker(otherMarker, otherFill, ss.style.shape, ss.style.shape))).
							setAttribute('title', mxResources.get('copy'));
			}
			
			Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
				[mxConstants.NONE, 0], null, null, false, Format.noMarkerImage.src)).setAttribute('title', mxResources.get('none'));
			
			if (ss.style.shape == 'connector' || ss.style.shape == 'filledEdge' ||
				ss.style.shape == 'wire' || ss.style.shape == 'pipe' ||
				ss.style.shape == 'mxgraph.basic.arc')
			{
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_CLASSIC, 1], null, null, false, Format.classicFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_CLASSIC_THIN, 1], null, null, false, Format.classicThinFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_OPEN, 0], null, null, false, Format.openFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_OPEN_THIN, 0], null, null, false, Format.openThinFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['openAsync', 0], null, null, false, Format.openAsyncFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_BLOCK, 1], null, null, false, Format.blockFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_BLOCK_THIN, 1], null, null, false, Format.blockThinFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['async', 1], null, null, false, Format.asyncFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_OVAL, 1], null, null, false, Format.ovalFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_DIAMOND, 1], null, null, false, Format.diamondFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_DIAMOND_THIN, 1], null, null, false, Format.diamondThinFilledMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_CLASSIC, 0], null, null, false, Format.classicMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_CLASSIC_THIN, 0], null, null, false, Format.classicThinMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_BLOCK, 0], null, null, false, Format.blockMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_BLOCK_THIN, 0], null, null, false, Format.blockThinMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['async', 0], null, null, false, Format.asyncMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_OVAL, 0], null, null, false, Format.ovalMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_DIAMOND, 0], null, null, false, Format.diamondMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					[mxConstants.ARROW_DIAMOND_THIN, 0], null, null, false, Format.diamondThinMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['box', 0], null, null, false, Format.boxMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['halfCircle', 0], null, null, false, Format.halfCircleMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['dash', 0], null, null, false, Format.dashMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['cross', 0], null, null, false, Format.crossMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['circlePlus', 0], null, null, false, Format.circlePlusMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['circle', 1], null, null, false, Format.circleMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['baseDash', 0], null, null, false, Format.baseDashMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['ERone', 0], null, null, false, Format.EROneMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['ERmandOne', 0], null, null, false, Format.ERmandOneMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['ERmany', 0], null, null, false, Format.ERmanyMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['ERoneToMany', 0], null, null, false, Format.ERoneToManyMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['ERzeroToOne', 0], null, null, false, Format.ERzeroToOneMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['ERzeroToMany', 0], null, null, false, Format.ERzeroToManyMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['doubleBlock', 0], null, null, false, Format.doubleBlockMarkerImage.src));
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'],
					['doubleBlock', 1], null, null, false, Format.doubleBlockFilledMarkerImage.src));
			}
			else
			{
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW],
					[mxConstants.ARROW_BLOCK], null, null, false, Format.blockMarkerImage.src)).
						setAttribute('title', mxResources.get('block'));
			}

			menu.div.style.width = '40px';

			window.setTimeout(mxUtils.bind(this, function()
			{
				if (menu.div != null)
				{
					mxUtils.fit(menu.div);
				}
			}), 0);
		}
	})), '', null, stylePanel2);

	var lineEnd = ui.toolbar.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		if (ss.style.shape == 'connector' || ss.style.shape == 'flexArrow' || ss.style.shape == 'filledEdge' ||
			ss.style.shape == 'wire' || ss.style.shape == 'pipe' || ss.style.shape == 'mxgraph.basic.arc')
		{
			// Copies other marker
			var otherMarker = mxUtils.getValue(ss.style, mxConstants.STYLE_STARTARROW, mxConstants.NONE);
			var otherFill = mxUtils.getValue(ss.style, 'startFill', '1');

			if (otherMarker != mxConstants.NONE &&
				(mxUtils.getValue(ss.style, mxConstants.STYLE_ENDARROW, mxConstants.NONE) != otherMarker ||
				mxUtils.getValue(ss.style, 'endSize', '1') != mxUtils.getValue(ss.style, 'startSize', '1') ||
				mxUtils.getValue(ss.style, 'endFill', '1') != otherFill))
			{
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '',
					[mxConstants.STYLE_ENDARROW, 'endFill', 'endSize'],
					[otherMarker, otherFill, mxUtils.getValue(ss.style, 'startSize')], null, null, false,
						ui.getImageForMarker(otherMarker, otherFill, ss.style.shape, ss.style.shape)),
							'scaleX(-1)').setAttribute('title', mxResources.get('copy'));
			}
			
			Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
				[mxConstants.NONE, 0], null, null, false, Format.noMarkerImage.src)).setAttribute('title', mxResources.get('none'));
			
			if (ss.style.shape == 'connector' || ss.style.shape == 'filledEdge' ||
				ss.style.shape == 'wire' || ss.style.shape == 'pipe' ||
				ss.style.shape == 'mxgraph.basic.arc')
			{
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_CLASSIC, 1], null, null, false, Format.classicFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_CLASSIC_THIN, 1], null, null, false, Format.classicThinFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_OPEN, 0], null, null, false, Format.openFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_OPEN_THIN, 0], null, null, false, Format.openThinFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['openAsync', 0], null, null, false, Format.openAsyncFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_BLOCK, 1], null, null, false, Format.blockFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_BLOCK_THIN, 1], null, null, false, Format.blockThinFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['async', 1], null, null, false, Format.asyncFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_OVAL, 1], null, null, false, Format.ovalFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_DIAMOND, 1], null, null, false, Format.diamondFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_DIAMOND_THIN, 1], null, null, false, Format.diamondThinFilledMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_CLASSIC, 0], null, null, false, Format.classicMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_CLASSIC_THIN, 0], null, null, false, Format.classicThinMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_BLOCK, 0], null, null, false, Format.blockMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_BLOCK_THIN, 0], null, null, false, Format.blockThinMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['async', 0], null, null, false, Format.asyncMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_OVAL, 0], null, null, false, Format.ovalMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_DIAMOND, 0], null, null, false, Format.diamondMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					[mxConstants.ARROW_DIAMOND_THIN, 0], null, null, false, Format.diamondThinMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['box', 0], null, null, false, Format.boxMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['halfCircle', 0], null, null, false, Format.halfCircleMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['dash', 0], null, null, false, Format.dashMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['cross', 0], null, null, false, Format.crossMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['circlePlus', 0], null, null, false, Format.circlePlusMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['circle', 0], null, null, false, Format.circleMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['baseDash', 0], null, null, false, Format.baseDashMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['ERone', 0], null, null, false, Format.EROneMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['ERmandOne', 0], null, null, false, Format.ERmandOneMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['ERmany', 0], null, null, false, Format.ERmanyMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['ERoneToMany', 0], null, null, false, Format.ERoneToManyMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['ERzeroToOne', 0], null, null, false, Format.ERzeroToOneMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['ERzeroToMany', 0], null, null, false, Format.ERzeroToManyMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['doubleBlock', 0], null, null, false, Format.doubleBlockMarkerImage.src), 'scaleX(-1)');
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'],
					['doubleBlock', 1], null, null, false, Format.doubleBlockFilledMarkerImage.src), 'scaleX(-1)');
			}
			else
			{
				Format.processMenuIcon(this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW],
					[mxConstants.ARROW_BLOCK], null, null, false, Format.blockMarkerImage.src), 'scaleX(-1)').
						setAttribute('title', mxResources.get('block'));
			}

			menu.div.style.width = '40px';

			window.setTimeout(mxUtils.bind(this, function()
			{
				if (menu.div != null)
				{
					mxUtils.fit(menu.div);
				}
			}), 0);
		}
	})), '', null, stylePanel2);

	edgeShape.style.width = '67px';
	edgeShape.style.marginRight = '2px';
	altPattern.style.width = '67px';
	altPattern.style.marginRight = '2px';
	edgeStyle.style.width = '67px';
	edgeStyle.style.marginRight = '2px';
	lineStart.style.width = '67px';
	lineStart.style.marginRight = '2px';
	lineEnd.style.width = '67px';
	lineEnd.style.marginRight = '2px';

	this.addArrow(edgeShape).appendChild(document.createElement('div'));
	this.addArrow(edgeStyle).appendChild(document.createElement('div'));
	this.addArrow(lineStart);
	this.addArrow(lineEnd);
	
	pattern.style.width = '142px';
	var symbol = this.addArrow(pattern);
	var altSymbol = this.addArrow(altPattern);
	
	var solid = document.createElement('div');
	solid.className = 'gePatternPreview';
	solid.style.width = '100px';
	solid.style.borderBottomStyle = 'solid';
	symbol.appendChild(solid);
	
	var altSolid = document.createElement('div');
	altSolid.className = 'gePatternPreview';
	altSolid.style.width = '36px';
	altSolid.style.borderBottomStyle = 'solid';
	altSymbol.appendChild(altSolid);

	container.appendChild(lineColor);
	container.appendChild(altStylePanel);
	container.appendChild(stylePanel);

	var arrowPanel = stylePanel.cloneNode(false);
	arrowPanel.style.display = 'block';
	arrowPanel.style.height = '60px';
	arrowPanel.style.paddingTop = '2px';
	arrowPanel.style.paddingBottom = '10px';
	arrowPanel.style.overflow = 'visible';
	
	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.maxWidth = '78px';
	span.style.overflow = 'hidden';
	span.style.textOverflow = 'ellipsis';
	span.style.marginTop = '4px';
	span.style.fontWeight = 'normal';
	
	mxUtils.write(span, mxResources.get('size'));
	span.setAttribute('title', mxResources.get('size'));
	arrowPanel.appendChild(span);

	var startSpacingUpdate, startSizeUpdate, endSpacingUpdate, endSizeUpdate;

	var startSize = this.addUnitInput(arrowPanel, this.getUnit(), 82, 52, function()
	{
		startSizeUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	startSize.setAttribute('title', mxResources.get('linestart'));

	var endSize = this.addUnitInput(arrowPanel, this.getUnit(), 16, 52, function()
	{
		endSizeUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	endSize.setAttribute('title', mxResources.get('lineend'));

	mxUtils.br(arrowPanel);
	
	var spacer = document.createElement('div');
	spacer.style.height = '12px';
	arrowPanel.appendChild(spacer);
	
	var spacingLabel = span.cloneNode(false);
	span = spacingLabel;
	mxUtils.write(span, mxResources.get('spacing'));
	span.setAttribute('title', mxResources.get('spacing'));
	arrowPanel.appendChild(span);

	var startSpacing = this.addUnitInput(arrowPanel, this.getUnit(), 82, 52, function()
	{
		startSpacingUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	startSpacing.setAttribute('title', mxResources.get('linestart'));

	var endSpacing = this.addUnitInput(arrowPanel, this.getUnit(), 16, 52, function()
	{
		endSpacingUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	endSpacing.setAttribute('title', mxResources.get('lineend'));

	var spacer = document.createElement('div');
	spacer.style.height = '20px';
	arrowPanel.appendChild(spacer);
	this.addLabel(arrowPanel, mxResources.get('linestart'), 82, 62).style.fontSize = '10px';
	this.addLabel(arrowPanel, mxResources.get('lineend'), 16, 62).style.fontSize = '10px';
	mxUtils.br(arrowPanel);
	
	var perimeterPanel = colorPanel.cloneNode(false);
	perimeterPanel.className = 'geFormatEntry';
	
	var span = document.createElement('div');
	mxUtils.write(span, mxResources.get('perimeter'));
	span.setAttribute('title', mxResources.get('perimeter'));
	perimeterPanel.appendChild(span);

	var perimeterUpdate;
	var perimeterSpacing = this.addUnitInput(perimeterPanel, this.getUnit(), 16, 52, function()
	{
		perimeterUpdate.apply(this, arguments);
	}, this.getUnitStep(), null, null, this.isFloatUnit());
	perimeterSpacing.setAttribute('title', mxResources.get('perimeter'));

	if (ss.edges.length == ss.cells.length)
	{
		container.appendChild(stylePanel2);
		container.appendChild(arrowPanel);
	}
	else if (ss.vertices.length == ss.cells.length)
	{
		if (ss.style.shape == 'mxgraph.basic.arc')
		{
			edgeStyle.style.visibility = 'hidden';
			container.appendChild(stylePanel2);
			spacer.style.display = 'none';
			spacingLabel.style.display = 'none';
			startSpacing.style.display = 'none';
			startSpacing.nextSibling.style.display = 'none';
			endSpacing.style.display = 'none';
			endSpacing.nextSibling.style.display = 'none';
			container.appendChild(arrowPanel);
		}

		container.appendChild(perimeterPanel);
	}
	
	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		ss = ui.getSelectionState();

		if (force || document.activeElement != input)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1));
			input.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}
		
		if (force || document.activeElement != altInput)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1));
			altInput.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}
		
		styleSelect.style.visibility = (ss.edges.length > 0 &&
			Graph.edgeSupportsCurved(ss.style)) ? '' : 'hidden';
		
		if (mxUtils.getValue(ss.style, mxConstants.STYLE_CURVED, null) == '1')
		{
			styleSelect.value = 'curved';
		}
		else if (mxUtils.getValue(ss.style, mxConstants.STYLE_ROUNDED, null) == '1')
		{
			styleSelect.value = 'rounded';
		}

		solid.style.borderBottom = '1px solid black';
		
		if (mxUtils.getValue(ss.style, mxConstants.STYLE_DASHED, null) == '1')
		{
			var pat = mxUtils.getValue(ss.style, mxConstants.STYLE_DASH_PATTERN, '');
			var tokens = String(pat).split(' ');

			if (tokens.length >= 2)
			{
				solid.style.borderBottom = '1px solid transparent';
				this.addDashPattern(solid, pat);
			}
			else
			{
				solid.style.borderBottom = '1px dashed black';
			}
		}

		altSolid.style.backgroundImage = solid.style.backgroundImage;
		altSolid.style.backgroundPosition = solid.style.backgroundPosition;
		altSolid.style.backgroundSize = solid.style.backgroundSize;
		altSolid.style.backgroundRepeat = solid.style.backgroundRepeat;
		altSolid.style.borderBottom = solid.style.borderBottom;
		
		// Updates toolbar icon for edge style
		var edgeStyleDiv = edgeStyle.getElementsByTagName('div')[1];
		
		if (edgeStyleDiv != null)
		{
			edgeStyleDiv.style.backgroundImage = 'url(' + ui.getImageForEdgeStyle(ss.style) + ')';
		}
		
		// Updates icon for edge shape
		var edgeShapeDiv = edgeShape.getElementsByTagName('div')[1];
		
		if (edgeShapeDiv != null)
		{
			edgeShapeDiv.style.backgroundImage = 'url(' + ui.getImageForEdgeShape(ss.style) + ')';
		}
		
		if (ss.edges.length == ss.cells.length)
		{
			altStylePanel.style.display = '';
			stylePanel.style.display = 'none';
		}
		else
		{
			altStylePanel.style.display = 'none';
			stylePanel.style.display = '';
		}

		if (Graph.lineJumpsEnabled && ss.edges.length > 0 &&
			ss.vertices.length == 0 && ss.lineJumps)
		{
			container.style.borderBottomStyle = 'none';
		}

		function updateArrow(marker, fill, elt, prefix)
		{
			var markerDiv = elt.getElementsByTagName('div')[0];
			
			if (markerDiv != null)
			{
				ui.updateCssForMarker(markerDiv, prefix, ss.style.shape, marker, fill);
			}
			
			return markerDiv;
		};
		
		updateArrow(mxUtils.getValue(ss.style, mxConstants.STYLE_STARTARROW, null),
				mxUtils.getValue(ss.style, 'startFill', '1'), lineStart, 'start');
		updateArrow(mxUtils.getValue(ss.style, mxConstants.STYLE_ENDARROW, null),
				mxUtils.getValue(ss.style, 'endFill', '1'), lineEnd, 'end');

		mxUtils.setOpacity(edgeStyle, (ss.style.shape == 'arrow') ? 30 : 100);			
		
		if (ss.style.shape != 'connector' && ss.style.shape != 'flexArrow' &&
			ss.style.shape != 'filledEdge' && ss.style.shape != 'wire' &&
			ss.style.shape != 'pipe' && ss.style.shape != 'mxgraph.basic.arc')
		{
			mxUtils.setOpacity(lineStart, 30);
			mxUtils.setOpacity(lineEnd, 30);
		}

		if (force || document.activeElement != startSize)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_MARKERSIZE));
			startSize.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}
		
		if (force || document.activeElement != startSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SOURCE_PERIMETER_SPACING, 0));
			startSpacing.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}

		if (force || document.activeElement != endSize)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE));
			endSize.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}
		
		if (force || document.activeElement != startSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_TARGET_PERIMETER_SPACING, 0));
			endSpacing.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}
		
		if (force || document.activeElement != perimeterSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_PERIMETER_SPACING, 0));
			perimeterSpacing.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
		}
	});
	
	startSizeUpdate = this.installInputHandler(startSize, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_MARKERSIZE, 0, 999, 
		this.getUnit(' '), null, this.isFloatUnit(), true);
	startSpacingUpdate = this.installInputHandler(startSpacing, mxConstants.STYLE_SOURCE_PERIMETER_SPACING, 0, -999, 999, 
		this.getUnit(' '), null, this.isFloatUnit(), true);
	endSizeUpdate = this.installInputHandler(endSize, mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE, 0, 999, 
		this.getUnit(' '), null, this.isFloatUnit(), true);
	endSpacingUpdate = this.installInputHandler(endSpacing, mxConstants.STYLE_TARGET_PERIMETER_SPACING, 0, -999, 999, 
		this.getUnit(' '), null, this.isFloatUnit(), true);
	perimeterUpdate = this.installInputHandler(perimeterSpacing, mxConstants.STYLE_PERIMETER_SPACING, 0, 0, 999, 
		this.getUnit(' '), null, this.isFloatUnit(), true);

	this.addKeyHandler(input, listener);
	this.addKeyHandler(startSize, listener);
	this.addKeyHandler(startSpacing, listener);
	this.addKeyHandler(endSize, listener);
	this.addKeyHandler(endSpacing, listener);
	this.addKeyHandler(perimeterSpacing, listener);

	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();

	return container;
};

/**
 * Adds UI for configuring line jumps.
 */
StyleFormatPanel.prototype.addLineJumps = function(container)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = ui.getSelectionState();
	container.style.height = '22px';
	
	if (Graph.lineJumpsEnabled && ss.edges.length > 0 &&
		ss.vertices.length == 0 && ss.lineJumps)
	{
		container.style.display = 'flex';
		container.style.alignItems = 'center';
		
		var span = document.createElement('div');
		span.style.position = 'absolute';
		span.style.maxWidth = '72px';
		span.style.overflow = 'hidden';
		span.style.textOverflow = 'ellipsis';
		
		mxUtils.write(span, mxResources.get('lineJumps'));
		span.setAttribute('title', mxResources.get('lineJumps'));
		container.appendChild(span);

		var styleSelect = document.createElement('select');
		styleSelect.setAttribute('title', mxResources.get('lineJumps'));
		styleSelect.style.left = '72px';
		styleSelect.style.width = '72px';

		var styles = ['none', 'arc', 'gap', 'sharp', 'line'];

		for (var i = 0; i < styles.length; i++)
		{
			var styleOption = document.createElement('option');
			styleOption.setAttribute('value', styles[i]);
			mxUtils.write(styleOption, mxResources.get(styles[i]));
			styleSelect.appendChild(styleOption);
		}
		
		mxEvent.addListener(styleSelect, 'change', function(evt)
		{
			graph.getModel().beginUpdate();
			try
			{
				graph.setCellStyles('jumpStyle', styleSelect.value, ss.cells);
				ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['jumpStyle'],
					'values', [styleSelect.value], 'cells', ss.cells));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
			
			mxEvent.consume(evt);
		});
		
		// Stops events from bubbling to color option event handler
		mxEvent.addListener(styleSelect, 'click', function(evt)
		{
			mxEvent.consume(evt);
		});
		
		container.appendChild(styleSelect);
		
		var jumpSizeUpdate;
		
		var jumpSize = this.addUnitInput(container, this.getUnit(), 16, 52, function()
		{
			jumpSizeUpdate.apply(this, arguments);
		}, this.getUnitStep(), null, null, this.isFloatUnit());
		jumpSize.setAttribute('title', mxResources.get('size'));

		jumpSizeUpdate = this.installInputHandler(jumpSize, 'jumpSize', Graph.defaultJumpSize,
				0, 999, this.getUnit(' '), null, this.isFloatUnit(), true);
		
		var listener = mxUtils.bind(this, function(sender, evt, force)
		{
			ss = ui.getSelectionState();
			styleSelect.value = mxUtils.getValue(ss.style, 'jumpStyle', 'none');

			if (force || document.activeElement != jumpSize)
			{
				var tmp = parseFloat(mxUtils.getValue(ss.style, 'jumpSize', Graph.defaultJumpSize));
				jumpSize.value = (isNaN(tmp)) ? '' : this.inUnit(tmp) + ' ' + this.getUnit();
			}
		});

		this.addKeyHandler(jumpSize, listener);

		graph.getModel().addListener(mxEvent.CHANGE, listener);
		this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
		listener();
	}
	else
	{
		container.style.display = 'none';
	}
	
	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addEffects = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = ui.getSelectionState();

	var table = document.createElement('table');
	table.className = 'geFullWidthElement';
	table.style.fontWeight = 'bold';
	table.style.tableLayout = 'fixed';
	var tbody = document.createElement('tbody');
	var row = document.createElement('tr');
	row.style.padding = '0px';
	var left = document.createElement('td');
	left.style.padding = '0px';
	left.style.width = '50%';
	left.style.verticalAlign = 'top';
	
	var right = left.cloneNode(true);
	right.style.paddingLeft = '8px';
	row.appendChild(left);
	row.appendChild(right);
	tbody.appendChild(row);
	table.appendChild(tbody);
	div.appendChild(table);

	var current = left;
	
	var addOption = mxUtils.bind(this, function(label, key, defaultValue, fn)
	{
		var opt = this.createCellOption(label, key, defaultValue, null, null, fn);
		opt.style.alignItems = 'top';
		current.appendChild(opt);
		current = (current == left) ? right : left;

		return opt;
	});

	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		ss = ui.getSelectionState();
		
		left.innerText = '';
		right.innerText = '';
		current = left;
		
		if (ss.rounded)
		{
			addOption(mxResources.get('rounded'), mxConstants.STYLE_ROUNDED, 0);
		}
		
		if (ss.swimlane)
		{
			addOption(mxResources.get('divider'), 'swimlaneLine', 1);
		}
		
		addOption(mxResources.get('sketch'), 'sketch', 0, function(cells, enabled)
		{
			graph.updateCellStyles({'sketch': (enabled) ? '1' : null,
				'curveFitting': (enabled) ? Editor.sketchDefaultCurveFitting : null,
				'jiggle': (enabled) ? Editor.sketchDefaultJiggle : null}, cells);
		});

		if (ss.glass)
		{
			addOption(mxResources.get('glass'), mxConstants.STYLE_GLASS, 0);
		}
		
		var option = addOption(mxResources.get('shadow'), mxConstants.STYLE_SHADOW, 0);

		if (!Editor.enableShadowOption)
		{
			option.getElementsByTagName('input')[0].setAttribute('disabled', 'disabled');
			mxUtils.setOpacity(option, 60);
		}

		if (ss.edges.length > 0 && ss.vertices.length == 0)
		{
			addOption(mxResources.get('flowAnimation', null, 'Flow Animation'), 'flowAnimation', 0);
		}
		
		// Adds primary custom shape options
		if (ss.customProperties != null)
		{
			for (var key in ss.customProperties)
			{
				var prop = ss.customProperties[key];

				if (prop != null && prop.type == 'bool' && prop.primary &&
					(typeof(prop.isVisible) !== 'function' ||
					prop.isVisible(ss, this)))
				{
					addOption(prop.dispName, key, prop.defVal ? '1' : '0');
				}
			}
		}
	});
	
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();

	return div;
}

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addStyleOps = function(div)
{
	var ss = this.editorUi.getSelectionState();

	if (ss.cells.length == 1)
	{
		this.addActions(div, ['setAsDefaultStyle']);
	}

	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramStylePanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(DiagramStylePanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramStylePanel.prototype.init = function()
{
	this.container.appendChild(this.addView(this.createPanel()));
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramStylePanel.prototype.getGlobalStyleButtons = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;

	var sketchDiv = document.createElement('div');
	sketchDiv.className = 'geFormatEntry';

	var sketchInput = document.createElement('input');
	sketchInput.setAttribute('type', 'checkbox');
	sketchInput.setAttribute('title', mxResources.get('sketch'));
	sketchInput.checked = Editor.sketchMode;
	sketchDiv.appendChild(sketchInput);
	mxUtils.write(sketchDiv, mxResources.get('sketch'));
	sketchDiv.setAttribute('title', mxResources.get('sketch'));

	mxEvent.addListener(sketchDiv, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			var value = !Editor.sketchMode;
			
			graph.updateCellStyles({'sketch': (value) ? '1' : null,
				'curveFitting': (value) ? Editor.sketchDefaultCurveFitting : null,
				'jiggle': (value) ? Editor.sketchDefaultJiggle : null},
				graph.getVerticesAndEdges());
			ui.setSketchMode(value);
			mxEvent.consume(evt);
		}
	});

	var isAllRounded = function()
	{
		var cells = graph.getVerticesAndEdges();
		var rounded = cells.length > 0;

		for (var i = 0; i < cells.length; i++)
		{
			var style = graph.getCellStyle(cells[i]);

			if (mxUtils.getValue(style, mxConstants.STYLE_ROUNDED, 0) == 0)
			{
				rounded = false;
				break;
			}
		}

		return rounded;
	};

	var roundedDiv = document.createElement('div');
	roundedDiv.className = 'geFormatEntry';

	var roundedInput = document.createElement('input');
	roundedInput.setAttribute('type', 'checkbox');
	roundedInput.setAttribute('title', mxResources.get('rounded'));
	roundedInput.checked = isAllRounded();
	roundedDiv.appendChild(roundedInput);
	mxUtils.write(roundedDiv, mxResources.get('rounded'));
	roundedDiv.setAttribute('title', mxResources.get('rounded'));

	mxEvent.addListener(roundedDiv, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			var rounded = !isAllRounded();
			graph.updateCellStyles({'rounded': (rounded) ? '1' : '0'},
				graph.getVerticesAndEdges());

			if (rounded)
			{
				graph.currentEdgeStyle['rounded'] = '1';
				graph.currentVertexStyle['rounded'] = '1';
			}
			else
			{
				delete graph.currentEdgeStyle['rounded'];
				delete graph.currentVertexStyle['rounded'];
			}

			mxEvent.consume(evt);
		}
	});

	var buttons = [roundedDiv, sketchDiv];

	if (!graph.isEnabled())
	{
		for (var i = 0; i < buttons.length; i++)
		{
			if (buttons[i].nodeName == 'BUTTON')
			{
				buttons[i].setAttribute('disabled', 'disabled');
			}
			else
			{
				var inp = buttons[i].getElementsByTagName('input');

				if (inp.length > 0)
				{
					inp[0].setAttribute('disabled', 'disabled');
				}
			}
		}
	}

	return buttons;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramStylePanel.prototype.addView = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	if (graph.isEnabled())
	{
		var createRow = function()
		{
			var opts = document.createElement('div');
			opts.className = 'geFormatEntry';

			var row = document.createElement('div');
			row.style.display = 'flex';
			row.style.alignItems = 'center';
			row.style.justifyContent = 'center';
			row.style.gap = '8px';
			row.style.width = '204px';
			opts.appendChild(row);
			div.appendChild(opts);

			return row;
		};

		var row = createRow();
		var buttons = this.getGlobalStyleButtons();

		// Natural-width slots clustered in the center; shrink with ellipsis
		// only when labels are too long to fit.
		for (var i = 0; i < buttons.length; i++)
		{
			var btn = buttons[i];
			btn.style.flex = '0 1 auto';
			btn.style.minWidth = '0';

			// geFormatEntry is display:flex, so wrap the trailing text node
			// in a span so text-overflow ellipsis can apply to the label.
			var textNode = btn.lastChild;

			if (textNode != null && textNode.nodeType == 3)
			{
				var span = document.createElement('span');
				span.style.overflow = 'hidden';
				span.style.textOverflow = 'ellipsis';
				span.style.whiteSpace = 'nowrap';
				span.style.minWidth = '0';
				span.appendChild(textNode);
				btn.appendChild(span);
			}

			row.appendChild(btn);
		}

		// Global shadow and light/dark toggle on a second line
		var row2 = createRow();

		var shadow = this.createOption(mxResources.get('shadow'), function()
		{
			return graph.shadowVisible;
		}, function(checked)
		{
			var change = new ChangePageSetup(ui);
			change.ignoreColor = true;
			change.ignoreImage = true;
			change.shadowVisible = checked;

			graph.model.execute(change);
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.shadowVisible);
				};

				graph.addListener('shadowVisibleChanged', this.listener);
			},
			destroy: function()
			{
				graph.removeListener(this.listener);
			}
		});

		shadow.style.flex = '0 1 auto';
		shadow.style.minWidth = '0';

		if (!Editor.enableShadowOption)
		{
			shadow.getElementsByTagName('input')[0].setAttribute('disabled', 'disabled');
			mxUtils.setOpacity(shadow, 60);
		}

		row2.appendChild(shadow);

		if (mxUtils.lightDarkColorSupported)
		{
			var img = document.createElement('img');
			img.setAttribute('title', mxResources.get('light') +
				'/' + mxResources.get('dark'));
			img.setAttribute('src', Editor.contrastImage);
			img.className = 'geButton';
			img.style.width = '18px';
			img.style.height = '18px';
			img.style.flex = '0 0 auto';

			mxEvent.addListener(img, 'click', function()
			{
				if (graph.isEnabled())
				{
					ui.setDarkMode(!Editor.isDarkMode());
				}
			});

			row2.appendChild(img);
		}

		if (Editor.styles != null)
		{
			this.addGraphStyles(div);
		}
	}

	return div;
};


/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramStylePanel.prototype.addGraphStyles = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var model = graph.getModel();
	var gridColor = graph.view.gridColor;
	var defaultStyles = ['fillColor', 'strokeColor', 'fontColor', 'gradientColor'];
	div.style.whiteSpace = 'normal';
	
	var updateCells = mxUtils.bind(this, function(styles, graphStyle)
	{
		var cells = graph.getVerticesAndEdges();
		
		model.beginUpdate();
		try
		{
			for (var i = 0; i < cells.length; i++)
			{
				var style = graph.getCellStyle(cells[i]);
				
				// Handles special label background color
				if (!ignoreGraphStyle && style['labelBackgroundColor'] != null)
				{
					graph.updateCellStyles({'labelBackgroundColor': (graphStyle != null) ?
						graphStyle.background : null}, [cells[i]]);
				}
				else if (ignoreGraphStyle)
				{
					graph.updateCellStyles({'labelBackgroundColor': mxConstants.NONE}, [cells[i]]);
				}
				
				var edge = model.isEdge(cells[i]);
				var newStyle = model.getStyle(cells[i]);
				var current = (edge) ? graph.currentEdgeStyle : graph.currentVertexStyle;

				for (var j = 0; j < styles.length; j++)
				{
					if ((style[styles[j]] != null && style[styles[j]] != mxConstants.NONE) ||
						(styles[j] != mxConstants.STYLE_FILLCOLOR &&
						styles[j] != mxConstants.STYLE_STROKECOLOR))
					{
						if (ignoreGraphStyle && edge && styles[j] == mxConstants.STYLE_FONTCOLOR)
						{
							newStyle = mxUtils.setStyle(newStyle, styles[j], 'default');
						}
						else
						{
							newStyle = mxUtils.setStyle(newStyle, styles[j], current[styles[j]]);
						}
					}
				}
				
				model.setStyle(cells[i], newStyle);
			}
		}
		finally
		{
			model.endUpdate();
		}
	});
			
	var removeStyles = mxUtils.bind(this, function(style, styles, defaultStyle)
	{
		if (style != null)
		{
			for (var j = 0; j < styles.length; j++)
			{
				if (((style[styles[j]] != null &&
					style[styles[j]] != mxConstants.NONE) ||
					(styles[j] != mxConstants.STYLE_FILLCOLOR &&
					styles[j] != mxConstants.STYLE_STROKECOLOR)))
				{
					style[styles[j]] = defaultStyle[styles[j]];
				}
			}
		}
	});

	var ignoreGraphStyle = true;

	var applyStyle = mxUtils.bind(this, function(style, result, cell, graphStyle, theGraph)
	{
		if (style != null)
		{
			if (cell != null)
			{
				// Handles special label background color
				if (!ignoreGraphStyle && result['labelBackgroundColor'] != null)
				{
					var bg = (graphStyle != null) ? graphStyle.background : null;
					theGraph = (theGraph != null) ? theGraph : graph;
					
					if (bg == null)
					{
						bg = theGraph.background;
					}
					
					if (bg == null)
					{
						bg = theGraph.defaultPageBackgroundColor;
					}
					
					result['labelBackgroundColor'] = bg;
				}
				else if (ignoreGraphStyle)
				{
					result['labelBackgroundColor'] = mxConstants.NONE;
				}
			}
			
			for (var key in style)
			{
				if (cell == null || ((result[key] != null &&
					result[key] != mxConstants.NONE) ||
					(key != mxConstants.STYLE_FILLCOLOR &&
					key != mxConstants.STYLE_STROKECOLOR)))
				{
					if (ignoreGraphStyle && model.isEdge(cell) &&
						key == mxConstants.STYLE_FONTCOLOR)
					{
						result[key] = 'default';
					}
					else
					{
						result[key] = style[key];
					}
				}
			}
		}
	});

	var createPreview = mxUtils.bind(this, function(commonStyle, vertexStyle, edgeStyle, graphStyle, container)
	{
		// Wrapper needed to catch events
		var div = document.createElement('div');
		div.style.position = 'relative';
		div.style.pointerEvents = 'none';
		div.style.width = '60px';
		div.style.height = '60px';
		container.appendChild(div);
		
		var graph2 = new Graph(div, null, null, graph.getStylesheet());
		graph2.shapeForegroundColor = 'light-dark(#000000, #c0c0c0)';
		graph2.shapeBackgroundColor = 'light-dark(var(--ge-panel-color), var(--ge-dark-panel-color))';
		graph2.resetViewOnRootChange = false;
		graph2.foldingEnabled = false;
		graph2.gridEnabled = false;
		graph2.autoScroll = false;
		graph2.setTooltips(false);
		graph2.setConnectable(false);
		graph2.setPanning(false);
		graph2.setEnabled(false);

		graph2.getCellStyle = function(cell, resolve)
		{
			resolve = (resolve != null) ? resolve : true;
			var result = mxUtils.clone(graph.getCellStyle.apply(this, arguments));
			var defaultStyle = graph.stylesheet.getDefaultVertexStyle();
			var appliedStyle = vertexStyle;
			
			if (model.isEdge(cell))
			{
				defaultStyle = graph.stylesheet.getDefaultEdgeStyle();
				appliedStyle = edgeStyle;	
			}
			
			removeStyles(result, defaultStyles, defaultStyle);
			applyStyle(commonStyle, result, cell, graphStyle, graph2);
			applyStyle(appliedStyle, result, cell, graphStyle, graph2);
			
			if (resolve)
			{
				result = graph.postProcessCellStyle(cell, result);
			}

			return result;
		};
		
		// Avoid HTML labels to capture events in bubble phase
		graph2.model.beginUpdate();
		try
		{
			// Scales down the font for translations wider than the preview
			var shapeLabel = mxResources.get('shape', null, 'Shape');
			var connectorLabel = mxResources.get('connector', null, 'Connector');
			var fontSize = mxUtils.getValue(graph.stylesheet.getDefaultVertexStyle(),
				mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE);
			var labelWidth = Math.max(mxUtils.getSizeForString(shapeLabel, fontSize,
				mxConstants.DEFAULT_FONTFAMILY).width, mxUtils.getSizeForString(
				connectorLabel, fontSize, mxConstants.DEFAULT_FONTFAMILY).width);
			var fontStyle = (labelWidth > 56) ? 'fontSize=' +
				Math.max(9, Math.floor(fontSize * 56 / labelWidth)) + ';' : '';

			var v1 = graph2.insertVertex(graph2.getDefaultParent(), null,
				shapeLabel, 2, 2, 56, 30, 'strokeWidth=2;' + fontStyle);
			var e1 = graph2.insertEdge(graph2.getDefaultParent(), null,
				connectorLabel, v1, v1, 'edgeStyle=orthogonalEdgeStyle;rounded=0;' +
				'orthogonalLoop=1;jettySize=auto;endSize=3;strokeWidth=2;' + fontStyle)
			e1.geometry.points = [new mxPoint(28, 46)];
			e1.geometry.offset = new mxPoint(0, 8);
		}
		finally
		{
			graph2.model.endUpdate();
		}

		// Adds dark and light mode preview
		var root = graph2.view.getDrawPane().ownerSVGElement;
			
		if (root != null)
		{
			var clone = root.cloneNode(true);
			clone.style.position = 'absolute';
			clone.style.clipPath = 'rect(0 52% 100% 0)';
			root.style.clipPath = 'rect(0 100% 100% 51%)';
			root.style.colorScheme = 'light';
			root.parentNode.appendChild(clone);
		}
	});
	
	// Entries
	var entries = document.createElement('div');
	entries.style.whiteSpace = 'normal';
	div.appendChild(entries);
	
	// Cached entries
	if (this.format.cachedStyleEntries == null)
	{
		this.format.cachedStyleEntries = [];
	}

	function addKeys(style, result)
	{
		for (var key in style)
		{
			result.push(key);
		}

		return result;
	};

	var addEntry = mxUtils.bind(this, function(commonStyle, vertexStyle, edgeStyle, graphStyle, index)
	{
		var panel = this.format.cachedStyleEntries[index];
		
		if (panel == null)
		{
			panel = document.createElement('div');
			panel.className = 'geGraphStylePreview';
	
			if (!ignoreGraphStyle && graphStyle != null && graphStyle.background != null)
			{
				panel.style.backgroundColor = graphStyle.background;
			}
			
			createPreview(commonStyle, vertexStyle, edgeStyle, graphStyle, panel); 
			
			mxEvent.addGestureListeners(panel, mxUtils.bind(this, function(evt)
			{
				panel.style.opacity = 0.6;
			}), null, mxUtils.bind(this, function(evt)
			{
				panel.style.opacity = '';
				graph.currentVertexStyle = mxUtils.clone(graph.defaultVertexStyle);
				graph.currentEdgeStyle = mxUtils.clone(graph.defaultEdgeStyle);
				
				applyStyle(commonStyle, graph.currentVertexStyle);
				applyStyle(commonStyle, graph.currentEdgeStyle);
				applyStyle(vertexStyle, graph.currentVertexStyle);
				applyStyle(edgeStyle, graph.currentEdgeStyle);

				model.beginUpdate();
				try
				{
					updateCells(addKeys(commonStyle, defaultStyles.slice()), graphStyle);
					
					if (!ignoreGraphStyle)
					{
						var change = new ChangePageSetup(ui, (graphStyle != null) ? graphStyle.background : null);
						change.ignoreImage = true;
						model.execute(change);
							
						model.execute(new ChangeGridColor(ui,
							(graphStyle != null && graphStyle.gridColor != null) ?
							graphStyle.gridColor : gridColor));
					}
				}
				finally
				{
					model.endUpdate();
				}
			}));
			
			if (!mxClient.IS_TOUCH)
			{
				mxEvent.addListener(panel, 'mouseenter', mxUtils.bind(this, function(evt)
				{
					var prev = graph.getCellStyle;
					var prevBg = graph.background;
					var prevGrid = graph.view.gridColor;
		
					if (!ignoreGraphStyle)
					{
						graph.background = (graphStyle != null) ? graphStyle.background : null;
						graph.view.gridColor = (graphStyle != null && graphStyle.gridColor != null) ?
							graphStyle.gridColor : gridColor;
					}
					
					graph.getCellStyle = function(cell, resolve)
					{
						resolve = (resolve != null) ? resolve : true;
						var result = mxUtils.clone(prev.apply(this, arguments));
						
						var defaultStyle = graph.stylesheet.getDefaultVertexStyle();
						var appliedStyle = vertexStyle;
						
						if (model.isEdge(cell))
						{
							defaultStyle = graph.stylesheet.getDefaultEdgeStyle();
							appliedStyle = edgeStyle;	
						}
						
						removeStyles(result, defaultStyles, defaultStyle);
						applyStyle(commonStyle, result, cell, graphStyle);
						applyStyle(appliedStyle, result, cell, graphStyle);
						
						if (resolve)
						{
							result = this.postProcessCellStyle(cell, result);
						}
						
						return result;
					};
					
					graph.refresh();
					graph.getCellStyle = prev;
					graph.background = prevBg;
					graph.view.gridColor = prevGrid;
				}));
				
				mxEvent.addListener(panel, 'mouseleave', mxUtils.bind(this, function(evt)
				{
					graph.refresh();
				}));
			}
			
			this.format.cachedStyleEntries[index] = panel;
		}
		
		entries.appendChild(panel);
	});
		
	// Maximum palettes to switch the switcher
	var maxEntries = 10;
	var pageCount = Math.ceil(Editor.styles.length / maxEntries);
	this.format.currentStylePage = (this.format.currentStylePage != null) ? this.format.currentStylePage : 0;
	var dots = [];
	
	var addEntries = mxUtils.bind(this, function()
	{
		if (dots.length > 0)
		{
			dots[this.format.currentStylePage].style.background = '#84d7ff';
		}
		
		for (var i = this.format.currentStylePage * maxEntries;
			i < Math.min((this.format.currentStylePage + 1) * maxEntries,
			Editor.styles.length); i++)
		{
			var s = Editor.styles[i];
			addEntry(s.commonStyle, s.vertexStyle, s.edgeStyle, s.graph, i);
		}
	});
	
	var selectPage = mxUtils.bind(this, function(index)
	{
		if (index >= 0 && index < pageCount)
		{
			dots[this.format.currentStylePage].style.background = 'transparent';
			entries.innerText = '';
			this.format.currentStylePage = index;
			addEntries();
		}
	});
	
	if (pageCount > 1)
	{
		// Selector
		var switcher = document.createElement('div');
		switcher.className = 'geSwitcher';
		switcher.style.width = '200px';
		
		for (var i = 0; i < pageCount; i++)
		{
			var dot = document.createElement('div');
			dot.className = 'geSwitcherDot';
			
			(mxUtils.bind(this, function(index, elt)
			{
				mxEvent.addListener(dot, 'click', mxUtils.bind(this, function()
				{
					selectPage(index);
				}));
			}))(i, dot);
			
			switcher.appendChild(dot);
			dots.push(dot);
		}
		
		div.appendChild(switcher);
		addEntries();
		
		if (pageCount < 15 && dots.length > 0)
		{
			var left = document.createElement('div');
			left.className = 'geButton';
			left.style.backgroundImage = 'url(' + Editor.chevronLeftImage + ')';
			
			var right = left.cloneNode(false);
			right.style.backgroundImage = 'url(' + Editor.chevronRightImage + ')';

			switcher.insertBefore(left, dots[0]);
			switcher.appendChild(right);
			
			mxEvent.addListener(left, 'click', mxUtils.bind(this, function()
			{
				selectPage(mxUtils.mod(this.format.currentStylePage - 1, pageCount));
			}));
			
			mxEvent.addListener(right, 'click', mxUtils.bind(this, function()
			{
				selectPage(mxUtils.mod(this.format.currentStylePage + 1, pageCount));
			}));
		}
	}
	else
	{
		addEntries();
	}

	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(DiagramFormatPanel, BaseFormatPanel);

/**
 * Switch to disable page view.
 */
DiagramFormatPanel.showPageView = true;

/**
 * Specifies if the background image option should be shown. Default is true.
 */
DiagramFormatPanel.prototype.showBackgroundImageOption = true;

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.init = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;

	var viewSec = this.createCollapsibleSection(mxResources.get('view'), false);
	viewSec.contentDiv.appendChild(this.addView(this.createPanel()));
	this.container.appendChild(viewSec.wrapper);

	if (graph.isEnabled())
	{
		var optSec = this.createCollapsibleSection(mxResources.get('options'), false);
		optSec.contentDiv.appendChild(this.addOptions(this.createPanel()));
		this.container.appendChild(optSec.wrapper);

		var paperSec = this.createCollapsibleSection(mxResources.get('paperSize'), true);
		paperSec.contentDiv.appendChild(this.addPaperSize(this.createPanel()));
		this.container.appendChild(paperSec.wrapper);

		this.container.appendChild(this.addStyleOps(this.createPanel()));
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addView = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;

	// Grid
	this.addGridOption(div);
	
	// Page View
	if (DiagramFormatPanel.showPageView)
	{
		div.appendChild(this.createOption(mxResources.get('pageView'), function()
		{
			return graph.pageVisible;
		}, function(checked)
		{
			ui.actions.get('pageView').funct();
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.pageVisible);
				};
				
				ui.addListener('pageViewChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		}));
	}
	
	if (graph.isEnabled())
	{
		if (this.showBackgroundImageOption)
		{
			var hasBackground = function()
			{
				return graph.backgroundImage != null || (graph.background != null &&
					graph.background != mxConstants.NONE);
			};

			var bg = this.createOption(mxResources.get('background'), hasBackground,
				function(checked)
			{
				if (checked)
				{
					var change = new ChangePageSetup(ui, graph.defaultPageBackgroundColor);
					change.ignoreImage = true;

					graph.model.execute(change);
				}
				else
				{
					graph.model.execute(new ChangePageSetup(ui, null, null));
				}
			},
			{
				install: function(apply)
				{
					this.listener = function()
					{
						apply(hasBackground());
					};

					ui.addListener('backgroundColorChanged', this.listener);
					ui.addListener('backgroundImageChanged', this.listener);
				},
				destroy: function()
				{
					ui.removeListener(this.listener);
				}
			});

			var label = bg.getElementsByTagName('span')[0];

			if (label != null)
			{
				label.style.maxWidth = '80px';
			}

			var btn = mxUtils.button(mxResources.get('change') + '...', function(evt)
			{
				ui.showBackgroundImageDialog(null,
					ui.editor.graph.backgroundImage,
					ui.editor.graph.background, true);
				mxEvent.consume(evt);
			})

			btn.style.position = 'absolute';
			btn.style.height = '22px';
			btn.style.left = '102px';
			btn.style.width = '110px';
			btn.style.maxWidth = btn.style.width;

			bg.appendChild(btn);
			div.appendChild(bg);
		}
	}
	
	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addOptions = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	if (graph.isEnabled())
	{
		// Connection arrows
		div.appendChild(this.createOption(mxResources.get('connectionArrows'), function()
		{
			return graph.connectionArrowsEnabled;
		}, function(checked)
		{
			ui.actions.get('connectionArrows').funct();
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.connectionArrowsEnabled);
				};
				
				ui.addListener('connectionArrowsChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		}));
		
		// Connection points
		div.appendChild(this.createOption(mxResources.get('connectionPoints'), function()
		{
			return graph.connectionHandler.isEnabled();
		}, function(checked)
		{
			ui.actions.get('connectionPoints').funct();
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.connectionHandler.isEnabled());
				};
				
				ui.addListener('connectionPointsChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		}));

		// Guides
		div.appendChild(this.createOption(mxResources.get('guides'), function()
		{
			return graph.graphHandler.guidesEnabled;
		}, function(checked)
		{
			ui.actions.get('guides').funct();
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.graphHandler.guidesEnabled);
				};
				
				ui.addListener('guidesEnabledChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		}));
	}

	return div;
};

/**
 * 
 */
DiagramFormatPanel.prototype.addGridOption = function(container)
{
	var fPanel = this;
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	var input = document.createElement('input');
	input.style.position = 'absolute';
	input.style.width = '50px';
	input.setAttribute('title', mxResources.get('gridSize'));
	input.value = this.inUnit(graph.getGridSize()) + ' ' + this.getUnit();

	var stepper = this.createStepper(input, update, this.getUnitStep(), null, null, this.isFloatUnit());
	input.style.display = (graph.isGridEnabled()) ? '' : 'none';
	stepper.style.display = input.style.display;

	mxEvent.addListener(input, 'keydown', function(e)
	{
		if (e.keyCode == 13)
		{
			graph.container.focus();
			mxEvent.consume(e);
		}
		else if (e.keyCode == 27)
		{
			input.value = fPanel.inUnit(graph.getGridSize()) + ' ' + fPanel.getUnit();
			graph.container.focus();
			mxEvent.consume(e);
		}
	});
	
	function update(evt)
	{
		var value = parseFloat(input.value);
		value = fPanel.fromUnit(Math.max(fPanel.inUnit(1), (isNaN(value)) ? fPanel.inUnit(10) : value));
		
		if (value != graph.getGridSize())
		{
			mxGraph.prototype.gridSize = value;
			graph.setGridSize(value)
		}

		input.value = fPanel.inUnit(value) + ' ' + fPanel.getUnit();
		mxEvent.consume(evt);
	};

	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);

	input.style.left = '100px';
	stepper.style.left = '150px';

	// Grid dark mode must take into account adaptive colors state
	var isDarkModeFn = function()
	{
		return graph.getAdaptiveColors() != 'none' &&
			Editor.isDarkMode();
	};

	var defaultGridColor = 'light-dark(' +
		mxGraphView.prototype.defaultGridColor + ',' +
			mxGraphView.prototype.defaultDarkGridColor + ')';

	var panel = this.createColorOption(mxResources.get('grid'), function()
	{
		return (graph.isGridEnabled()) ? graph.view.gridColor : null;
	}, function(color)
	{
		var enabled = graph.isGridEnabled();
		
		if (color == mxConstants.NONE)
		{
			graph.setGridEnabled(false);
		}
		else
		{
			graph.setGridEnabled(true);
			ui.setGridColor(color, isDarkModeFn());
		}
		
		input.style.display = (graph.isGridEnabled()) ? '' : 'none';
		stepper.style.display = input.style.display;
		
		if (enabled != graph.isGridEnabled())
		{
			graph.defaultGridEnabled = graph.isGridEnabled();
			ui.fireEvent(new mxEventObject('gridEnabledChanged'));
		}
	}, graph.view.gridColor,
	{
		install: function(apply)
		{
			this.listener = function()
			{
				apply((graph.isGridEnabled()) ?
					graph.view.gridColor :
					mxConstants.NONE);
			};
			
			ui.addListener('darkModeChanged', this.listener);
			ui.addListener('gridColorChanged', this.listener);
			ui.addListener('gridEnabledChanged', this.listener);
		},
		destroy: function()
		{
			ui.removeListener(this.listener);
		}
	}, null, null, defaultGridColor, true, isDarkModeFn,
		mxResources.get('gridColor'));

	panel.appendChild(input);
	panel.appendChild(stepper);
	container.appendChild(panel);
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addDocumentProperties = function(div)
{
	div.appendChild(this.createTitle(mxResources.get('options')));

	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addPaperSize = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	var accessor = PageSetupDialog.addPageFormatPanel(div, 'formatpanel', graph.pageFormat, function(pageFormat)
	{
		if (graph.pageFormat == null || graph.pageFormat.width != pageFormat.width ||
			graph.pageFormat.height != pageFormat.height)
		{
			var change = new ChangePageSetup(ui, null, null, pageFormat);
			change.ignoreColor = true;
			change.ignoreImage = true;
			
			graph.model.execute(change);
		}
	});
	
	this.addKeyHandler(accessor.widthInput, function()
	{
		accessor.set(graph.pageFormat);
	});

	this.addKeyHandler(accessor.heightInput, function()
	{
		accessor.set(graph.pageFormat);	
	});
	
	var listener = function()
	{
		accessor.set(graph.pageFormat);
	};
	
	ui.addListener('pageFormatChanged', listener);
	this.listeners.push({destroy: function() { ui.removeListener(listener); }});
	
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	
	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addStyleOps = function(div)
{
	this.addActions(div, ['editData']);
	this.addActions(div, ['clearDefaultStyle']);

	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.destroy = function()
{
	BaseFormatPanel.prototype.destroy.apply(this, arguments);
	
	if (this.gridEnabledListener)
	{
		this.editorUi.removeListener(this.gridEnabledListener);
		this.gridEnabledListener = null;
	}
};
