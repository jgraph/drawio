/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
/**
 * Sample plugin.
 */
Draw.loadPlugin(function(ui) {

	// Adds numbered toggle property
	Editor.commonVertexProperties.push({name: 'numbered', dispName: 'Numbered', type: 'bool', defVal: true, isVisible: function(state, format)
	{
		var graph = format.editorUi.editor.graph;

		return graph.view.redrawNumberShape != null;
	}, onChange: function(graph, newValue)
	{
		graph.refresh();
	}});

	var graph = ui.editor.graph;
	var enabled = true;
	var counter = 0;
	
	var graphViewResetValidationState = graph.view.resetValidationState;
	
	graph.view.resetValidationState = function()
	{
		graphViewResetValidationState.apply(this, arguments);
		this.numberCounter = 0;
	};
	
	// Numbers the vertices in the walk over all cells. Incremental validations
	// call stateValidated for the validated states in the order of that walk
	// but do not call validateCellState recursively.
	var graphViewStateValidated = graph.view.stateValidated;
	
	graph.view.stateValidated = function(state)
	{
		if (graph.model.isVertex(state.cell))
		{
			if (enabled && mxUtils.getValue(state.style, 'numbered', 1) == 1)
			{
				// The numbers depend on the states before this state in the
				// walk (see mxGraphView.validateInvalidCells)
				this.fullValidationRequired = true;
				this.numberCounter++;
			}
			
			this.redrawNumberShape(state);
		}
		
		return graphViewStateValidated.apply(this, arguments);
	};
	
	graph.view.redrawNumberShape = function(state)
	{
		var numbered = mxUtils.getValue(state.style, 'numbered', 1) == 1;
		var value = '<div style="padding:2px;border:1px solid gray;background:yellow;border-radius:2px;">' +
			(this.numberCounter) + '</div>';

		// Uses its own label since enumerate (see Editor.js) removes the
		// secondLabel of states that are not enumerated
		if (enabled && numbered && graph.model.isVertex(state.cell) &&
			state.shape != null && state.numberLabel == null)
		{
			state.numberLabel = new mxText(value, new mxRectangle(),
					mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM);

			// Styles the label
			state.numberLabel.size = 12;
			state.numberLabel.dialect = mxConstants.DIALECT_STRICTHTML;
			graph.cellRenderer.initializeLabel(state, state.numberLabel);
		}
		
		if (state.numberLabel != null)
		{
			if (!numbered)
			{
				state.numberLabel.destroy();
				state.numberLabel = null;
			}
			else
			{
				var scale = graph.getView().getScale();
				var bounds = new mxRectangle(state.x + state.width - 4 * scale, state.y + 4 * scale, 0, 0);
				state.numberLabel.value = value;
				state.numberLabel.state = state;
				state.numberLabel.scale = scale;
				state.numberLabel.bounds = bounds;
				state.numberLabel.redraw();
			}
		}
	};

	// Destroys the shape number
	var destroy = graph.cellRenderer.destroy;
	graph.cellRenderer.destroy = function(state)
	{
		destroy.apply(this, arguments);
		
		if (state.numberLabel != null)
		{
			state.numberLabel.destroy();
			state.numberLabel = null;
		}
	};
	
	var getShapesForState = graph.cellRenderer.getShapesForState;
	
	graph.cellRenderer.getShapesForState = function(state)
	{
		var shapes = getShapesForState.apply(this, arguments);
		shapes.push(state.numberLabel);
		
		return shapes;
	};
	
	// Extends View menu
	mxResources.parse('number=Number');

    // Adds action
    var action = ui.actions.addAction('number...', function()
    {
		enabled = !enabled;
		graph.refresh();
    });
	
    action.setToggleAction(true);
	action.setSelectedCallback(function() { return enabled; });
    
	var menu = ui.menus.get((urlParams['sketch'] == '1') ? 'extras' : 'view');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		ui.menus.addMenuItems(menu, ['-', 'number'], parent);
	};
	
	// Forces refresh if file was loaded before plugin
	if (ui.getCurrentFile() != null)
	{
		graph.refresh();
	}
});
