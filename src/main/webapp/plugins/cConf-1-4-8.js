/**
 * Plugin for embed mode in Confluence Connect post version 1.4.8
 */
Draw.loadPlugin(function(ui)
{
	// Extracts macro data from JSON protocol
	var macroData = {};
	
	mxEvent.addListener(window, 'message', mxUtils.bind(this, function(evt)
	{
		var data = evt.data;

		try
		{
			data = JSON.parse(data);
			
			if (data.action == 'load')
			{
				if (data.macroData != null) 
				{
					macroData = data.macroData;
				}
				
				macroData.diagramDisplayName = data.title;
			}
		}
		catch (e)
		{
			data = null;
		}
	}));
	
	// Creates actions
	var action = ui.actions.put('viewerToolbarTop', new Action(mxResources.get('top'), function()
	{
		macroData.tbstyle = 'top';
	}));
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return macroData.tbstyle != 'inline' && macroData.tbstyle != 'hidden' });
	
	action = ui.actions.put('viewerToolbarMiddle', new Action(mxResources.get('embed'), function()
	{
		macroData.tbstyle = 'inline';
	}));
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return macroData.tbstyle == 'inline'; });
	
	action = ui.actions.put('viewerToolbarHidden', new Action(mxResources.get('hidden'), function()
	{
		macroData.tbstyle = 'hidden';
	}));
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return macroData.tbstyle == 'hidden'; });
	
	action = ui.actions.put('viewerLightbox', new Action(mxResources.get('lightbox'), function()
	{
		macroData.lbox = (macroData.lbox != '0') ? '0' : '1';
	}));
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return macroData.lbox != '0'; });

	action = ui.actions.put('linksAuto', new Action(mxResources.get('automatic'), function()
	{
		macroData.links = 'auto';
	}));
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return macroData.links != 'blank' && macroData.links != 'self'; });
	
	action = ui.actions.put('linksBlank', new Action(mxResources.get('openInNewWindow'), function()
	{
		macroData.links = 'blank';
	}));
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return macroData.links == 'blank'; });
	
	action = ui.actions.put('linksSelf', new Action(mxResources.get('openInThisWindow'), function()
	{
		macroData.links = 'self';
	}));
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return macroData.links == 'self'; });

	action = ui.actions.put('viewerZoom', new Action(mxResources.get('zoom') + '...', function()
	{
		var dlg = new FilenameDialog(ui, (parseFloat(macroData.zoom || 1) * 100) + '%',
			mxResources.get('apply'), function(newValue)
		{
			if (newValue != null)
			{
				var val = parseInt(newValue);
				
				if (!isNaN(val))
				{
					macroData.zoom = val / 100;			
				}
			}
		}, mxResources.get('zoom'));
		ui.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}));
	
	// Creates viewer toolbar menu
	mxResources.parse('viewerMenu=Viewer');
	mxResources.parse('viewerToolbar=Toolbar');
	mxResources.parse('viewerLightbox=Lightbox');
	mxResources.parse('viewerLinks=Links');
	
	ui.menus.put('viewerMenu', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		ui.menus.addMenuItems(menu, ['viewerLightbox', 'viewerZoom', '-'], parent);
		ui.menus.addSubmenu('viewerToolbar', menu, parent);
		ui.menus.addSubmenu('viewerLinks', menu, parent);
	})));

	ui.menus.put('viewerToolbar', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		ui.menus.addMenuItems(menu, ['viewerToolbarTop', 'viewerToolbarMiddle',
			'viewerToolbarHidden'], parent);
	})));

	ui.menus.put('viewerLinks', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		ui.menus.addMenuItems(menu, ['linksAuto', 'linksBlank', 'linksSelf'], parent);
	})));

	var renameAction = ui.actions.get("rename"); 

	renameAction.visible = true;
	
	renameAction.isEnabled = function()
	{
		return macroData.diagramDisplayName != null;
	}
	
	renameAction.funct = function()
	{
		var dlg = new FilenameDialog(ui, macroData.diagramDisplayName || "",
				mxResources.get('rename'), function(newName)
		{
			if (newName != null && newName.length > 0)
			{
				macroData.diagramDisplayName = newName;
				var parent = window.opener || window.parent;
				parent.postMessage(JSON.stringify({event: 'rename', name: newName}), '*'); 
				//Update file name in the UI
				var tmp = document.createElement('span');
				mxUtils.write(tmp, mxUtils.htmlEntities(newName));
				
				if (ui.embedFilenameSpan != null)
				{
					ui.embedFilenameSpan.parentNode.removeChild(ui.embedFilenameSpan);
				}

				ui.buttonContainer.appendChild(tmp);
				ui.embedFilenameSpan = tmp;
			}
		}, mxResources.get('rename'), function(name)
		{
			var err = "";
			if (name == null || name.length == 0)
			{
				err = 'Filename too short';
			}
			else if (/[&\*+=\\;/{}|\":<>\?~]/g.test(name))
			{        
				err = 'Invalid characters \\ / | : { } < > & + ? = ; * " ~';
			}
			else
			{
				return true;
			}
			
			ui.showError(mxResources.get('error'), err, mxResources.get('ok'));
			return false;
		});
		ui.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}
	
	// Adds Viewer menu at bottom of Extras menu
	var menu = ui.menus.get('extras');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		menu.addSeparator(parent);
		ui.menus.addSubmenu('viewerMenu', menu, parent);
	};
	
	// Returns modified macro data to client
	var uiCreateLoadMessage = ui.createLoadMessage;
	
	ui.createLoadMessage = function(eventName)
	{
		var msg = uiCreateLoadMessage.apply(this, arguments);
		
		if (eventName == 'export')
		{
			msg.macroData = macroData;
		}

		return msg;
	};
	
	var lic = urlParams['lic'];
	
	if (lic != null && lic == 'active')
	{
		ui.hideFooter();
	}
	else
	{
		// Display footer and alter it
		var td = document.getElementById('geFooterItem2');
		
		if (td != null)
		{
			td.innerHTML = '<a title="faq" href="/wiki/plugins/servlet/upm" target="_blank">' +
			'<img border="0" align="absmiddle" style="margin-top:-4px;"/>Please license draw.io to enable all functionality</a>';
		}
		
		td = document.getElementById('geFooterItem1');	
	
		if (td != null)
		{
			td.parentNode.removeChild(td);
		}
		
		td = document.getElementById('geFooterItem3');
	
		if (td != null)
		{
			td.parentNode.removeChild(td);
		}
	}
});
