/**
 * Update plugin. Use updateUrl and updateInterval (optional, default is 60000ms)
 * in the meta data of the diagram to configure the plugin. It will send the XML
 * of the current page to the given URL as a POST request (with a parameter called
 * xml) and allows for the following type of XML response (with CORS headers):
 * 
 * <updates>
 * <update ...>
 * </updates>
 * 
 * Where update must contain an id attribute to reference the cell in the diagram.
 * 
 * - An optional value attribute that contains XML markup is used as the value for
 * the cell, with label and tooltip for the label and tooltip, respectively.
 * Additionally, placeholders="1" can be used to enable placeholders in the label
 * or tooltip of the cell.
 * 
 * - An optional replace-value attribute that contains 1 can be specified to
 * replace the value of the cell. Default is to add the attributes of the XML
 * value specified above to the existing value of the cell. (Attributes with
 * an empty string value are removed.)
 * 
 * - An optional style attribute that contains the cell style is used to replace
 * the existing cell style.
 * 
 * - An optional icon attribute that contains JSON is used to add an icon to the
 * given cell. The object value that the icon attribute is parsed to may contain
 * a tooltip (string), align ("left"|"center"|"right", default is "right"), valign
 * (top|middle|bottom, default is bottom) and append (true|false, default is false)
 * for adding or replacing existing icons. The image attribute is an object value
 * with src, width and height for defining the icon to be displayed (default is
 * mxGraph.warningImage). An empty string for the attribute removes all icons.
 * 
 * See below for an example XML.
 */
Draw.loadPlugin(function(editorUi)
{
	if (editorUi.editor.chromeless)
	{
		var graph = editorUi.editor.graph;
		var interval = 60000;
		
		function createOverlay(desc)
		{
			var overlay = new mxCellOverlay(desc.image || graph.warningImage,
				desc.tooltip, desc.align, desc.valign, desc.offset);

			// Installs a handler for clicks on the overlay
			overlay.addListener(mxEvent.CLICK, function(sender, evt)
			{
				editorUi.alert(desc.tooltip);
			});
			
			return overlay;
		};
		
		function parseUpdates(xml)
		{
			if (xml != null && xml.length > 0)
			{
				var doc = mxUtils.parseXml(xml);
				
				if (doc != null && doc.documentElement != null)
				{
					var model = graph.getModel();
					var nodes = doc.documentElement.getElementsByTagName('update');
					
					if (nodes != null && nodes.length > 0)
					{
						model.beginUpdate();

						try
						{
							for (var i = 0; i < nodes.length; i++)
							{
								// Resolves the cell ID
								var cell = model.getCell(nodes[i].getAttribute('id'));

								if (cell != null)
								{
									// Changes the value
									try
									{
										var value = nodes[i].getAttribute('value');
										
										if (value != null)
										{
											var node = mxUtils.parseXml(value).documentElement;

											if (node != null)
											{
												if (nodes[i].getAttribute('replace-value') == '1')
												{
													graph.model.setValue(cell, node);
												}
												else
												{
													var attrs = node.attributes;
													
													for (var j = 0; j < attrs.length; j++)
													{
														graph.setAttributeForCell(cell, attrs[j].nodeName,
															(attrs[j].nodeValue.length > 0) ? attrs[j].nodeValue : null);
													}
												}
											}
										}
									}
									catch (e)
									{
										console.log('Error in value for ' + cell.id + ': ' + e);
									}
									
									// Changes the style
									try
									{
										var style = nodes[i].getAttribute('style');
										
										if (style != null)
										{
											graph.model.setStyle(cell, style);
										}
									}
									catch (e)
									{
										console.log('Error in style for ' + cell.id + ': ' + e);
									}
									
									// Adds or removes an overlay icon
									try
									{
										var icon = nodes[i].getAttribute('icon');
										
										if (icon != null)
										{
											var desc = (icon.length > 0) ? JSON.parse(icon) : null;
											
											if (desc == null || !desc.append)
											{
												graph.removeCellOverlays(cell);
											}
											
											if (desc != null)
											{
												graph.addCellOverlay(cell, createOverlay(desc));
											}
										}
									}
									catch (e)
									{
										console.log('Error in icon for ' + cell.id + ': ' + e);
									}
								}
							} // for
						}
						finally
						{
							model.endUpdate();
						}
					}
				}
			}
		};
		
		var currentThread = null;
		
		function scheduleUpdates()
		{
			var root = editorUi.editor.graph.getModel().getRoot();
			var result = false;
			
			if (root.value != null && typeof(root.value) == 'object')
			{
				interval = parseInt(root.value.getAttribute('updateInterval') || interval);
				var url = root.value.getAttribute('updateUrl');
				
				if (url != null)
				{
					var currentXml = mxUtils.getXml(editorUi.editor.getGraphXml());
					
					function doUpdate()
					{
						if (url === 'demo')
						{
							parseUpdates(mxUtils.getXml(createDemoResponse().documentElement));	
							schedule();
						}
						else
						{
							mxUtils.post(url, 'xml=' + encodeURIComponent(currentXml), function(req)
							{
								if (root === editorUi.editor.graph.getModel().getRoot())
								{
									if (req.getStatus() >= 200 && req.getStatus() <= 300)
									{
										parseUpdates(mxUtils.getXml(req.getDocumentElement()));
										schedule();
									}
									else
									{
										editorUi.handleError({message: mxResources.get('error') + ' ' +
											req.getStatus()});
									}
								}
							}, function(err)
							{
								editorUi.handleError(err);
							});
						}
					};
					
					function schedule()
					{
						currentThread = window.setTimeout(doUpdate, interval);
					};
					
					doUpdate();
					result = true;
				}
			}
			
			return result;
		};
		
		function startUpdates()
		{
			var result = scheduleUpdates();
			
			if (result)
			{
				editorUi.editor.addListener('pageSelected', function()
				{
					window.clearTimeout(currentThread);
					scheduleUpdates();
				});
			}
			
			return result;
		};
		
		function createDemoResponse()
		{
			var doc = mxUtils.createXmlDocument();
			var status = doc.createElement('updates');
			
			for (var id in graph.model.cells)
			{
				var cell = graph.model.cells[id];
				
				if (graph.model.isVertex(cell))
				{
					// For the purpose of the demo we flag stuff to update with update="1".
					// This is not needed for the general case.
					if (cell.value != null && typeof(cell.value) == 'object' &&
						cell.value.getAttribute('update') == '1')
					{
						if (Math.random() > 0.5)
						{
							var update = doc.createElement('update');
							update.setAttribute('id', cell.id);
							update.setAttribute('value', '<object tooltip="%load%% Done" load="' +
								Math.round(Math.random() * 100) + '" placeholders="1">');
							update.setAttribute('style', cell.style + ';fillColor=#d5e8d4;gradientColor=white;');
							update.setAttribute('icon', JSON.stringify({tooltip: 'Running', align: "right",
								valign: "top", image: {src: IMAGE_PATH + '/spin.gif', width: 12, height: 12}}));
							status.appendChild(update);
							
							// Adds another icon
							if (Math.random() > 0.5)
							{
								var update = doc.createElement('update');
								update.setAttribute('id', cell.id);
								update.setAttribute('icon', JSON.stringify({tooltip: 'Locked', append: true,
									image: {src: IMAGE_PATH + '/locked.png', width: 12, height:12}}));
								status.appendChild(update);
							}
						}
						else
						{
							var update = doc.createElement('update');
							update.setAttribute('id', cell.id);
							update.setAttribute('style', cell.style + ';fillColor=#d4e1f5;gradientColor=white;');
							update.setAttribute('value', '<object tooltip="">');
							update.setAttribute('icon', '');
							status.appendChild(update);
						}						
					}
				}
			}

			doc.appendChild(status);
			
			return doc;
		};
		
		// Wait for file to be loaded if no animation data is present
		if (!startUpdates())
		{
			editorUi.editor.addListener('fileLoaded', startUpdates);
		}
	}
});
