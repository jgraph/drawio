/**
 * Replay plugin. To record steps in the Editor, click on Extras, Record.
 * To stop recording click Extras, Record again. Enter the delay between
 * the steps and use the URL that opens in the new window.
 */
Draw.loadPlugin(function(ui) {

	var graph = ui.editor.graph;
	var codec = new mxCodec();
	var model = graph.model;
	
	codec.lookup = function(id)
	{
		return model.getCell(id);
	};
	
	if (ui.editor.isChromelessView())
	{
		function decodeChanges(delta)
		{
			var codec2 = new mxCodec(delta.ownerDocument);
			codec2.lookup = function(id)
			{
				return model.getCell(id);
			};
			
			var changeNode = delta.firstChild.firstChild;
			var changes = [];
			
			while (changeNode != null)
			{
				var change = codec2.decode(changeNode);
				
				change.model = model;
				change.execute();
				changes.push(change);
				
				changeNode = changeNode.nextSibling;
			}
			
			return changes;
		};

		function createUndoableEdit(changes)
		{
			var edit = new mxUndoableEdit(model);
			edit.changes = changes;
			
			edit.notify = function()
			{
				// LATER: Remove changes property (deprecated)
				edit.source.fireEvent(new mxEventObject(mxEvent.CHANGE,
					'edit', edit, 'changes', edit.changes));
				edit.source.fireEvent(new mxEventObject(mxEvent.NOTIFY,
					'edit', edit, 'changes', edit.changes));
			};
			
			return edit;
		};

		function processDelta(delta)
		{
			var changes = decodeChanges(delta);
			
			if (changes.length > 0)
			{
				var edit = createUndoableEdit(changes);
				
				// No notify event here to avoid the edit from being encoded and transmitted
				// LATER: Remove changes property (deprecated)
				model.fireEvent(new mxEventObject(mxEvent.CHANGE,
					'edit', edit, 'changes', changes));
				model.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
				
				ui.chromelessResize();
			}
		};
		
		var replayData = urlParams['replay-data'];
		var delay = parseInt(urlParams['delay-delay'] || 1000);
		
		if (replayData != null)
		{
			var xmlDoc = mxUtils.parseXml(graph.decompress(replayData));
			// LATER: Avoid duplicate parsing
			ui.fileLoaded(new LocalFile(ui, mxUtils.getXml(xmlDoc.documentElement.firstChild.firstChild)));

			// Process deltas
			var delta = xmlDoc.documentElement.firstChild.nextSibling;
			
			function nextStep()
			{
				if (delta != null)
				{
					window.setTimeout(function()
					{
						processDelta(delta);
						delta = delta.nextSibling;
						nextStep();
					}, delay);
				}
			};
			
			nextStep();
		}
	}
	else
	{
		var tape = null;

		model.addListener(mxEvent.CHANGE, function(sender, evt)
	    {
	    	if (tape != null)
	    	{
		    	var changes = evt.getProperty('changes');
		    	var node = codec.encode(changes);
		    	var delta = codec.document.createElement('delta');
		    	delta.appendChild(node);
		    	tape.push(mxUtils.getXml(delta));
	    	}
	    });
		
		// Extends View menu
		mxResources.parse('record=Record');
	
	    // Adds action
	    var action = ui.actions.addAction('record...', function()
	    {
	    	if (tape == null)
	    	{
	    		var node = codec.encode(model);
		    	var state = codec.document.createElement('state');
		    	state.appendChild(node);
		    	tape =[mxUtils.getXml(state)];
	    	}
	    	else if (tape != null)
	    	{
	    		var tmp = tape;
	    		tape = null;

				var dlg = new FilenameDialog(ui, 1000, mxResources.get('apply'), function(newValue)
				{
					if (newValue != null)
					{
						var dlg = new EmbedDialog(ui, 'https://www.draw.io/?p=replay&lightbox=1&replay-delay=' +
								parseFloat(newValue) + '&replay-data=' + graph.compress('<recording>' +
								tmp.join('') + '</recording>'));
						ui.showDialog(dlg.container, 440, 240, true, true);
						dlg.init();
					}
				}, 'Delay');
				ui.showDialog(dlg.container, 300, 80, true, true);
				dlg.init();
	    	}
	    });
		
	    action.setToggleAction(true);
		action.setSelectedCallback(function() { return tape != null; });
	    
		var menu = ui.menus.get('extras');
		var oldFunct = menu.funct;
		
		menu.funct = function(menu, parent)
		{
			oldFunct.apply(this, arguments);
			
			ui.menus.addMenuItems(menu, ['-', 'record'], parent);
		};
	}
});