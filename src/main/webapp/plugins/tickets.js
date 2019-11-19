/**
 * Freshdesk ticket plugin. Drag tickets into the diagram. Tickets are
 * updated on file open, page select and via Extras, Update Tickets.
 * 
 * Drag freshdesk tickets into the diagram. Domain must match deskDomain.freshdesk.com.
 * 
 * Use #C to configure the client as follows:
 * 
 * https://www.draw.io/?p=tickets#C%7B"ticketsConfig"%3A %7B"deskApiKey"%3A"YOUR_API_KEY"%2C"deskDomain"%3A"YOUR_DOMAIN"%7D%7D
 * 
 * Use an additional "open" variable in the config JSON to open a file after parsing as follows:
 * 
 * ...#_TICKETS%7B"ticketsConfig"%3A %7B"deskApiKey"%3A"YOUR_API_KEY"%2C"deskDomain"%3A"YOUR_DOMAIN"%7D%2C"open"%3A"ID_WITH_PREFIX"%7D
 * 
 * Required JSON parameters:
 * - deskApiKey=api_key (see user profile)
 * - deskDomain=subdomain (subdomain.freshdesk.com)
 * 
 * Optional JSON parameters:
 * - deskStatus: Lookup for status codes (code => string)
 * - deskTypes: Lookup for ticket types (string => story, task, subTask, feature,
 * bug, techTask, epic, improvement, fault, change, access, purchase or itHelp)
 * 
 * The current configuration is stored in localStorage under ".tickets-config". Use
 * https://jgraph.github.io/drawio-tools/tools/convert.html for URI encoding.
 */
Draw.loadPlugin(function(ui)
{
	var config = null;
	var deskDomain = null;
	var deskApiKey = null;
	var graph = ui.editor.graph;
	
	var deskPriority = {'1': 'minor', '2': 'major',
		'3': 'critical', '4': 'blocker'};
	var deskTypes = {'Question': 'story', 'Incident': 'techTask', 'Problem': 'fault',
		'Feature Request': 'feature', 'Lead': 'purchase'};
	var deskStatus = {'2': 'Open', '3': 'Pending', '4': 'Resolved', '5': 'Closed',
		'6': 'Waiting on Customer', '7': 'Waiting on Third Party',
		'8': 'Resolved Internally'};
	var deskStatusWidth = {};
	
	function configure()
	{
		deskDomain = 'https://' + config.deskDomain + '.freshdesk.com';
		deskApiKey = config.deskApiKey;
		
		deskTypes = config.deskTypes || deskTypes;
		deskStatus = config.deskStatus || deskStatus;
		deskStatusWidth = {};

		// Precomputes text widths for custom ticket status
		var div = document.createElement('div');
		div.style.fontFamily = 'Arial,Helvetica';
		div.style.visibility = 'hidden';
		div.style.position = 'absolute';
		div.style.fontSize = '11px';
		
		document.body.appendChild(div);
		
		for (var key in deskStatus)
		{
			div.innerHTML = '';
			mxUtils.write(div, deskStatus[key]);
			deskStatusWidth[key] = div.clientWidth + 4;
		}

		document.body.removeChild(div);
	};
	
	if (window.location.hash != null && window.location.hash.substring(0, 9) == '#_TICKETS')
	{
		try
		{
			var temp = JSON.parse(decodeURIComponent(
				window.location.hash.substring(9)));
			
			if (temp != null && temp.ticketsConfig != null)
			{
				config = temp.ticketsConfig;
				configure();
				ui.fileLoaded(new LocalFile(ui, ui.emptyDiagramXml, this.defaultFilename, true));
				ui.editor.setStatus('Drag tickets from <a href="' + deskDomain +
					'/a/tickets/filters/all_tickets" target="_blank">' +
					deskDomain + '</a>');
			}
		}
		catch (e)
		{
			console.error(e);
		}
	}

	function isDeskLink(link)
	{
		if (deskDomain != null)
		{
			var dl = deskDomain.length;
			
			return config != null && link.substring(0, dl) == deskDomain &&
				(link.substring(dl, dl + 18) == '/helpdesk/tickets/' ||
				link.substring(dl, dl + 11) == '/a/tickets/');
		}
		else
		{
			return false;
		}
	};
	
	function getIdForDeskLink(link)
	{
		return link.substring(link.lastIndexOf('/') + 1);
	};
	
	function getDeskTicket(id, fn)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', deskDomain + '/api/v2/tickets/' + id);
		xhr.setRequestHeader('Authorization', 'Basic ' + btoa(deskApiKey + ':x'));

		xhr.onload = function ()
		{
			if (xhr.status >= 200 && xhr.status <= 299)
			{
				fn(JSON.parse(xhr.responseText), xhr);
			}
			else
			{
				fn(null, xhr);
			}
		};
		
		xhr.onerror = function ()
		{
			fn(null, xhr);
		};

		xhr.send();
	};
	
	function updateStyle(cell, ticket)
	{
		var type = (ticket.type != null) ? deskTypes[ticket.type] : 'bug';
		var status = deskStatus[ticket.status] || 'Unknown';
		var priority = deskPriority[ticket.priority];
		var sw = deskStatusWidth[ticket.status];
		var prev = cell.style;
		
		cell.style = mxUtils.setStyle(cell.style, 'issueType', type);
		cell.style = mxUtils.setStyle(cell.style, 'issueStatus', status);
		cell.style = mxUtils.setStyle(cell.style, 'issueStatusWidth', sw);
		cell.style = mxUtils.setStyle(cell.style, 'issuePriority', priority);
		
		return prev != cell.style;
	};
	
	function shortString(s, max)
	{
		if (s.length > max)
		{
			return s.substring(0, max) + '...';
		}
		else
		{
			return s;
		}
	}
	
	function updateData(cell, ticket)
	{
		var changed = false;
		
		function setAttr(key, value)
		{
			var prev = cell.value.getAttribute(key);
			value = value || '';
			
			if (prev != value)
			{
				cell.value.setAttribute(key, value);
				
				return true;
			}
			else
			{
				return false;
			}
		};
		
		changed = setAttr('abstract', shortString(ticket.description_text, 600)) |
			setAttr('email_config_id', ticket.email_config_id) |
			setAttr('requester_id', ticket.requester_id) |
			setAttr('group_id', ticket.group_id) |
			setAttr('created_at', ticket.created_at) |
			setAttr('updated_at', ticket.updated_at) |
			setAttr('due_by', ticket.due_by) |
			setAttr('tags', ticket.tags.join(' '));
		
		for (var key in ticket.custom_fields)
		{
			changed = changed | setAttr(key, ticket.custom_fields[key]);
		}

		return changed;
	};
	
	function updateTickets(spin)
	{
		if (config != null && (!spin || ui.spinner.spin(document.body, mxResources.get('loading') + '...')))
		{
			var validate = false;
			var pending = 0;
			
			graph.view.states.visit(function(id, state)
			{
				var link = graph.getLinkForCell(state.cell);
				
				if (link != null && isDeskLink(link))
				{
					var id = getIdForDeskLink(link);
					pending++;
					
					getDeskTicket(id, function(ticket, req)
					{
						pending--;
						
						if (ticket != null)
						{
							// Expression must execute both calls
							if (updateStyle(state.cell, ticket) |
								updateData(state.cell, ticket))
							{
								graph.view.invalidate(state.cell, true, false);
								state.style = null;
								validate = true;
							}
						}
						
						if (pending == 0)
						{
							if (spin)
							{
								ui.spinner.stop();
							}
							
							if (validate)
							{
								graph.view.validate();
							}
						}
					})
				}
			});
			
			if (spin && pending == 0)
			{
				ui.spinner.stop();
			}
		}
	};
	
	function getCellForLink(link)
	{
		for (var key in graph.view.states.map)
		{
			var cell = graph.view.states.map[key].cell;
			
			if (link == graph.getLinkForCell(cell))
			{
				return cell;
			}
		}
	};

	// Adds resource for action
	mxResources.parse('updateTickets=Update Tickets...');

	// Adds action
	ui.actions.addAction('updateTickets', function()
	{
		updateTickets(true);
	});
	
	// Updates tickets in opened files
	ui.editor.addListener('fileLoaded', function()
	{
		updateTickets(false);
	});

	// Updates tickets when page changes
	ui.editor.addListener('pageSelected', function()
	{
		updateTickets(false);
	});

	// Adds menu item
	var menu = ui.menus.get('extras');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		ui.menus.addMenuItems(menu, ['-', 'updateTickets'], parent);
	};

	// Intercepts ticket URLs
	var uiInsertTextAt = ui.insertTextAt;
	
	ui.insertTextAt = function(text, dx, dy, html, asImage, crop, resizeImages)
	{
		if (isDeskLink(text))
		{
			var cell = getCellForLink(text);
			
			if (cell != null)
			{
				// Selects existing ticket with same link
				graph.setSelectionCell(cell);
				graph.scrollCellToVisible(graph.getSelectionCell());
			}
			else if (ui.spinner.spin(document.body, mxResources.get('loading') + '...'))
			{
				// Creates new shape
				var id = getIdForDeskLink(text);
				
				getDeskTicket(id, function(ticket, req)
				{
					ui.spinner.stop();
					
					if (ticket != null)
					{
						var cell = null;
						
				    	graph.getModel().beginUpdate();
				    	try
				    	{
				    		cell = graph.insertVertex(graph.getDefaultParent(), null,
				    			'%title%\n\n<b>Updated:</b> %updated_at% ' +
				    			'(<a href="' + deskDomain + '/contacts/%requester_id%">From</a>)',
								graph.snap(dx), graph.snap(dy), 200, 50,
								'html=1;whiteSpace=wrap;overflow=hidden;shape=mxgraph.atlassian.issue;' +
								'fontSize=12;verticalAlign=top;align=left;spacingTop=25;' +
								'strokeColor=#A8ADB0;fillColor=#EEEEEE;backgroundOutline=1;');
				    		
				    		graph.setLinkForCell(cell, text);
				    		cell.value.setAttribute('title', shortString(ticket.subject, 40));
				    		cell.value.setAttribute('subject', ticket.subject);
							cell.value.setAttribute('placeholders', '1');
							cell.value.setAttribute('ticket_id', id);
				    		updateData(cell, ticket);
							updateStyle(cell, ticket);

				    		// Adds ticket ID label
				    		var label1 = new mxCell('%ticket_id%', new mxGeometry(0, 0, 60, 20),
						   		'strokeColor=none;fillColor=none;part=1;resizable=0;align=left;' +
						   		'autosize=1;points=[];deletable=0;editable=0;connectable=0;');
						   	graph.setAttributeForCell(label1, 'placeholders', '1');
						   	label1.geometry.relative = true;
						   	label1.geometry.offset = new mxPoint(20, 0);
						   	label1.vertex = true;
						   	cell.insert(label1);
				    		
				    		graph.updateCellSize(cell);
				    		cell.geometry.width = Math.max(220, cell.geometry.width);
				    		cell.geometry.height += 10;
				    	}
				    	finally
				    	{
				    		graph.getModel().endUpdate();
				    	}
				    	
						graph.setSelectionCell(cell);
					}
					else
					{
						var err = req.status
						
						try
						{
							err = JSON.parse(req.responseText);
						}
						catch (e)
						{
							// ignore
						}
						
						ui.handleError({message: err.message});
					}
				});
			}
			
	    	return null;
		}
		else
		{
			return uiInsertTextAt.apply(this, arguments);
		}
	};
});
