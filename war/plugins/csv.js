/**
 * Explore plugin.
 */
Draw.loadPlugin(function(ui)
{
	// Adds resource for action
	mxResources.parse('fromCsv=From CSV...');
	
	// Return array of string values, or NULL if CSV string not well formed.
	function CSVtoArray(text)
	{
	    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
	    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
	    // Return NULL if input string is not well formed CSV string.
	    if (!re_valid.test(text)) return null;
	    var a = [];                     // Initialize array to receive values.
	    text.replace(re_value, // "Walk" the string using replace with callback.
	        function(m0, m1, m2, m3) {
	            // Remove backslash from \' in single quoted values.
	            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
	            // Remove backslash from \" in double quoted values.
	            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
	            else if (m3 !== undefined) a.push(m3);
	            return ''; // Return empty string.
	        });
	    // Handle special case of empty last value.
	    if (/,\s*$/.test(text)) a.push('');
	    return a;
	};
	

	var defaultCsvValue = '##\n' +
		'## Example CSV import. Use ## for comments and # for configuration. Paste CSV below.\n' +
		'##\n' +
		'#\n' +
		'## Node label with placeholders and HTML.\n' +
		'## Default is \'%name_of_first_column%\'.\n' +
		'#\n' +
		'# label: %name%<br><i style="color:gray;">%position%</i><br><a href="mailto:%email%">Email</a>\n' +
		'#\n' +
		'## Node style (placeholders are replaced once).\n' +
		'## Default is the current style for nodes.\n' +
		'#\n' +
		'# style: label;image=%image%;whiteSpace=wrap;html=1;rounded=1;fillColor=%fill%;strokeColor=%stroke%;\n' +
		'#\n' +
		'## Connections between rows ("from": source colum, "to": target column).\n' +
		'## Label, style and invert are optional. Defaults are \'\', current style and false.\n' +
		'## The target column may contain a comma-separated list of values.\n' +
		'## Multiple connect entries are allowed.\n' +
		'#\n' +
		'# connect: {"from": "manager", "to": "name", "invert": true, "label": "manages", \\\n' +
		'#          "style": "curved=1;endArrow=blockThin;endFill=1;fontSize=11;"}\n' +
		'# connect: {"from": "refs", "to": "id", "style": "curved=1;fontSize=11;"}\n' +
		'#\n' +
		'## Node width. Possible value are px or auto. Default is auto.\n' +
		'#\n' +
		'# width: auto\n' +
		'#\n' +
		'## Node height. Possible value are px or auto. Default is auto.\n' +
		'#\n' +
		'# height: auto\n' +
		'#\n' +
		'## Padding for autosize. Default is 0.\n' +
		'#\n' +
		'# padding: -26\n' +
		'#\n' +
		'## Comma-separated list of ignored columns for metadata.\n' +
		'#\n' +
		'# ignore: id,image,fill,stroke\n' +
		'#\n' +
		'## Column to be renamed to link attribute (used as link).\n' +
		'#\n' +
		'# link: url\n' +
		'#\n' +
		'## Spacing between nodes. Default is 40.\n' +
		'#\n' +
		'# nodespacing: 40\n' +
		'#\n' +
		'## Spacing between parallel edges. Default is 40.\n' +
		'#\n' +
		'# edgespacing: 40\n' +
		'#\n' +
		'## Name of layout. Possible values are auto, none, verticaltree, horizontaltree,\n' +
		'## verticalflow, horizontalflow, organic, circle. Default is auto.\n' +
		'#\n' +
		'# layout: auto\n' +
		'#\n' +
		'## ---- CSV below this line ----\n' +
		'name,position,id,location,manager,email,fill,stroke,refs,url,image\n' +
		'Evan Miller,CFO,emi,Office 1,,me@example.com,#dae8fc,#6c8ebf,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-9-2-128.png\n' +
		'Edward Morrison,Brand Manager,emo,Office 2,Evan Miller,me@example.com,#d5e8d4,#82b366,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-10-3-128.png\n' +
		'Ron Donovan,System Admin,rdo,Office 3,Evan Miller,me@example.com,#d5e8d4,#82b366,"emo,tva",https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-2-128.png\n' +
		'Tessa Valet,HR Director,tva,Office 4,Evan Miller,me@example.com,#d5e8d4,#82b366,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-3-128.png\n';
	
	var dlg = null;

	// Adds action
	ui.actions.addAction('fromCsv', function()
	{
		if (dlg == null)
		{
    		dlg = new TextareaDialog(ui, mxResources.get('fromCsv') + ':',
    			defaultCsvValue, function(newValue)
			{
    			try
    			{
		    		var lines = newValue.split('\n');
		    		var cells = [];
		    		
		    		if (lines.length > 0)
		    		{
		        		// Internal lookup table
		        		var lookups = {};
		        		
		        		// Default values
		        		var style = null;
		        		var width = 'auto';
		        		var height = 'auto';
		        		var edgespacing = 40;
		        		var nodespacing = 40;
		        		var padding = 0;
		        		
		        		var graph = ui.editor.graph;
						var view = graph.view;
						var bds = graph.getGraphBounds();

						// Delayed after optional layout
		    			var afterInsert = function()
		    			{
		    				graph.setSelectionCells(select);
				    		graph.scrollCellToVisible(graph.getSelectionCell());
		    			};
		    				
						// Computes unscaled, untranslated graph bounds
		    			var pt = graph.getFreeInsertPoint();
						var x0 = pt.x;
						var y0 = pt.y;
						var y = y0;
		
		    			// Default label value depends on column names
		        		var label = null;
		        		
		    			// Default layout to run.
		        		var layout = 'auto';
		        		
		        		// Name of the attribute that contains the parent reference
		        		var parent = null;
		        		
		        		// Name of the attribute that contains the references for creating edges
		        		var edges = [];
	
		        		// Name of the column for hyperlinks
		        		var link = null;
		        		
		        		// String array of names to remove from metadata
		        		var ignore = null;
		        		
		        		// Read processing instructions first
		        		var index = 0;
		        		
		        		while (index < lines.length && lines[index].charAt(0) == '#')
		        		{
		        			var text = lines[index];
		        			index++;
		        			
		        			while (index < lines.length && text.charAt(text.length - 1) == '\\' &&
		        				lines[index].charAt(0) == '#')
		        			{
		        				text = text.substring(0, text.length - 1) + mxUtils.trim(lines[index].substring(1));
		        				index++;
		        			}
		        			
		        			if (text.charAt(1) != '#')
		        			{
			    				// Processing instruction
			    				var idx = text.indexOf(':');
			    				
			    				if (idx > 0)
			    				{
				    				var key = mxUtils.trim(text.substring(1, idx));
				    				var value = mxUtils.trim(text.substring(idx + 1));
			
				    				if (key == 'label')
				    				{
				    					label = graph.sanitizeHtml(value);
				    				}
				    				else if (key == 'style')
				    				{
				    					style = value;
				    				}
				    				else if (key == 'width')
				    				{
				    					width = value;
				    				}
				    				else if (key == 'height')
				    				{
				    					height = value;
				    				}
				    				else if (key == 'ignore')
				    				{
				    					ignore = value.split(',');
				    				}
				    				else if (key == 'connect')
				    				{
				    					edges.push(JSON.parse(value));
				    				}
				    				else if (key == 'link')
				    				{
				    					link = value;
				    				}
				    				else if (key == 'padding')
				    				{
				    					padding = parseFloat(value);
				    				}
				    				else if (key == 'edgespacing')
				    				{
				    					edgespacing = parseFloat(value);
				    				}
				    				else if (key == 'nodespacing')
				    				{
				    					nodespacing = parseFloat(value);
				    				}
				    				else if (key == 'layout')
				    				{
				    					layout = value;
				    				}
			    				}
		        			}
		        		}
		        		
		    			var keys = CSVtoArray(lines[index]);
		    			
		    			if (label == null)
		    			{
		    				label = '%' + keys[0] + '%';
		    			}
		    			
		    			if (edges != null)
						{
	    					for (var e = 0; e < edges.length; e++)
	    					{
	    						if (lookups[edges[e].to] == null)
	    						{
	    							lookups[edges[e].to] = {};
	    						}
	    					}
						}
		    			
		        		graph.model.beginUpdate();
		        		try
		        		{
			    			for (var i = index + 1; i < lines.length; i++)
				    		{
		    	    			var values = CSVtoArray(lines[i]);
		    	    			
			    				if (values.length == keys.length)
				    			{
					    			var cell = new mxCell(label, new mxGeometry(x0, y,
					    				0, 0), style || 'whiteSpace=wrap;html=1;');
									cell.vertex = true;
									
									for (var j = 0; j < values.length; j++)
						    		{
										graph.setAttributeForCell(cell, keys[j], values[j]);
						    		}
									
									graph.setAttributeForCell(cell, 'placeholders', '1');
									cell.style = graph.replacePlaceholders(cell, cell.style);
									
			    					for (var e = 0; e < edges.length; e++)
			    					{
			    						lookups[edges[e].to][cell.getAttribute(edges[e].to)] = cell;
			    					}
									
									if (link != null && link != 'link')
									{
										graph.setLinkForCell(cell, cell.getAttribute(link));
										
										// Removes attribute
										graph.setAttributeForCell(cell, link, null);
									}
									
									// Removes ignored attributes after processing above
									if (ignore != null)
									{
										for (var j = 0; j < ignore.length; j++)
							    		{
											graph.setAttributeForCell(cell, ignore[j], null);
							    		}
									}
									
									// Sets the size
									var size = ui.editor.graph.getPreferredSizeForCell(cell);
									
									cell.geometry.width = (width == 'auto') ? size.width + padding : parseFloat(width);
									cell.geometry.height = (height == 'auto') ? size.height + padding : parseFloat(height);
									y += cell.geometry.height + nodespacing;

									cells.push(graph.addCell(cell));
				    			}
				    		}
			    			
			    			if (style == null)
			    			{
			    				graph.fireEvent(new mxEventObject('cellsInserted', 'cells', cells));
			    			}
			    			
							var roots = cells.slice();
							var select = cells.slice();
	
	    					for (var e = 0; e < edges.length; e++)
	    					{
		    					var edge = edges[e];
	
	    						for (var i = 0; i < cells.length; i++)
			    				{
	    							var cell = cells[i];
	
			    					var tmp = cell.getAttribute(edge.from);
			    					
			    					if (tmp != null)
			    					{
			    						// Removes attribute
				    					graph.setAttributeForCell(cell, edge.from, null);
			    						var refs = tmp.split(',');
				    					
				    					for (var j = 0; j < refs.length; j++)
				        				{
				    						var ref = lookups[edge.to][refs[j]];
				    						
				    						if (ref != null)
				    						{
				    							select.push(graph.insertEdge(null, null, edge.label || '',
					    							(edge.invert) ? ref : cell, (edge.invert) ? cell : ref,
									    			edge.style || graph.createCurrentEdgeStyle()));
				    							mxUtils.remove((edge.invert) ? cell : ref, roots);
				    						}
				        				}
			    					}
		    					}
		    				}
	    					
	    					var edgeLayout = new mxParallelEdgeLayout(graph);
		    				edgeLayout.spacing = edgespacing;
    						
	    					var postProcess = function()
	    					{
	    						edgeLayout.execute(graph.getDefaultParent());
	    						
			    	    		// Aligns cells to grid and/or rounds positions
	    						for (var i = 0; i < cells.length; i++)
			    				{
	    							var geo = graph.getCellGeometry(cells[i]);
	    							geo.x = Math.round(graph.snap(geo.x));
	    							geo.y = Math.round(graph.snap(geo.y));
	    							
	    							if (width == 'auto')
	    							{
	    								geo.width = Math.round(graph.snap(geo.width));	
	    							}
	    							
	    							if (height == 'auto')
	    							{
	    								geo.height = Math.round(graph.snap(geo.height));	
	    							}
			    				}
	    					};
	    					
	    					if (layout == 'circle')
	    					{
	    						var circleLayout = new mxCircleLayout(graph);
			    				circleLayout.resetEdges = false;
			    				
			    				var circleLayoutIsVertexIgnored = circleLayout.isVertexIgnored;
			    				
		    	    			// Ignore other cells
			    				circleLayout.isVertexIgnored = function(vertex)
			    				{
			    					return circleLayoutIsVertexIgnored.apply(this, arguments) ||
			    						mxUtils.indexOf(cells, vertex) < 0;
			    				};
	    						
	    			    		ui.executeLayout(function()
	    			    		{
	    			    			circleLayout.execute(graph.getDefaultParent());
	    			    			postProcess();
	    			    		}, true, afterInsert);
			    				
			    				afterInsert = null;
	    					}
	    					else if (layout == 'horizontaltree' || layout == 'verticaltree' ||
	    						(layout == 'auto' && select.length == 2 * cells.length - 1 && roots.length == 1))
			    			{
				    			// Required for layouts to work with new cells
				    			graph.view.validate();
				    			
			    				var treeLayout = new mxCompactTreeLayout(graph, layout == 'horizontaltree');
			    				treeLayout.levelDistance = nodespacing;
			    				treeLayout.edgeRouting = false;
			    				
			    				ui.executeLayout(function()
			    	    		{
			    					treeLayout.execute(graph.getDefaultParent(), (roots.length > 0) ? roots[0] : null);
			    	    		}, true, afterInsert);
			    				
			    				afterInsert = null;
			    			}
			    			else if (layout == 'horizontalflow' || layout == 'verticalflow' ||
			    					(layout == 'auto' && roots.length == 1))
			    			{
				    			// Required for layouts to work with new cells
				    			graph.view.validate();
				    			
				    			var flowLayout = new mxHierarchicalLayout(graph,
				    				(layout == 'horizontalflow') ? mxConstants.DIRECTION_WEST : mxConstants.DIRECTION_NORTH);
				    			flowLayout.intraCellSpacing = nodespacing;
				    			
				        		ui.executeLayout(function()
				        		{
				        			flowLayout.execute(graph.getDefaultParent(), select);
				        			
				        			// Workaround for flow layout moving cells to origin
				        			graph.moveCells(select, x0, y0);
				        		}, true, afterInsert);
					    			
				    			afterInsert = null;
				    		}
			    			else if (layout == 'organic' || (layout == 'auto' &&
			    					select.length > cells.length))
			    			{
				    			// Required for layouts to work with new cells
				    			graph.view.validate();
				    			
			    				var organicLayout = new mxFastOrganicLayout(graph);
			    				organicLayout.forceConstant = nodespacing * 3;
			    				organicLayout.resetEdges = false;
		
			    				var organicLayoutIsVertexIgnored = organicLayout.isVertexIgnored;
	
		    	    			// Ignore other cells
			    				organicLayout.isVertexIgnored = function(vertex)
			    				{
			    					return organicLayoutIsVertexIgnored.apply(this, arguments) ||
			    						mxUtils.indexOf(cells, vertex) < 0;
			    				};
	
			    				var edgeLayout = new mxParallelEdgeLayout(graph);
			    				edgeLayout.spacing = edgespacing;
			    				
			    	    		ui.executeLayout(function()
			    	    		{
			    	    			organicLayout.execute(graph.getDefaultParent());
	    			    			postProcess();
			    	    		}, true, afterInsert);
			    	    		
			    	    		afterInsert = null;
			    			}
			    			
			    			ui.hideDialog();
		        		}
		        		finally
		        		{
		        			graph.model.endUpdate();
		        		}
						
		        		if (afterInsert != null)
		        		{
		        			afterInsert();
		        		}
		    		}
    			}
        		catch (e)
        		{
        			ui.handleError(e);
        		}
			}, null, null, 620, 430, null, true, true);
		}
		
		ui.showDialog(dlg.container, 640, 520, true, true);
		dlg.init();
	});
	
	var menu = ui.menus.get('insert');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		ui.menus.addMenuItems(menu, ['fromCsv'], parent);
	};
});
