/*
 * $Id: Menus.js,v 1.29 2014/02/11 13:56:10 gaudenz Exp $
 * Copyright (c) 2006-2014, JGraph Ltd
 */
(function()
{
	// Adds scrollbars for menus that exceed the page height
	var mxPopupMenuShowMenu = mxPopupMenu.prototype.showMenu;
	mxPopupMenu.prototype.showMenu = function()
	{
		mxPopupMenuShowMenu.apply(this, arguments);
		
		this.div.style.overflowY = 'auto';
		this.div.style.overflowX = 'hidden';
		var h0 = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
		this.div.style.maxHeight = (h0 - 10) + 'px';
	};
	
	Menus.prototype.addLinkToItem = function(item, href)
	{
		if (item != null)
		{
			var link = document.createElement('span');
			link.setAttribute('title', mxResources.get('help'));
			link.style.cssText = 'color:blue;text-decoration:underline;margin-left:12px;cursor:help;';
			
			var icon = document.createElement('img');
			icon.setAttribute('border', '0');
			icon.setAttribute('valign', 'bottom');
			icon.setAttribute('src', Editor.helpImage);
			link.appendChild(icon);
			
			mxEvent.addGestureListeners(link, mxUtils.bind(this, function(evt)
			{
				this.editorUi.menubar.hideMenu();
				window.open(href);
				mxEvent.consume(evt);
			}));
			
			item.firstChild.nextSibling.appendChild(link);
		}
	};
	
	var menusInit = Menus.prototype.init;
	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);
		var editorUi = this.editorUi;
		var graph = editorUi.editor.graph;
		var isGraphEnabled = mxUtils.bind(graph, graph.isEnabled);
		var googleEnabled = ((urlParams['embed'] != '1' && urlParams['gapi'] != '0') ||
				(urlParams['embed'] == '1' && urlParams['gapi'] == '1')) && mxClient.IS_SVG &&
				isLocalStorage && (document.documentMode == null || document.documentMode >= 10);
		var dropboxEnabled = ((urlParams['embed'] != '1' && urlParams['db'] != '0') || (urlParams['embed'] == '1' && urlParams['db'] == '1')) &&
			mxClient.IS_SVG && (document.documentMode == null || document.documentMode > 9);
		var oneDriveEnabled = (window.location.hostname == 'www.draw.io' || window.location.hostname == 'test.draw.io' ||
				window.location.hostname == 'drive.draw.io' || window.location.hostname == 'legacy.draw.io') &&
				(((urlParams['embed'] != '1' && urlParams['od'] != '0') || (urlParams['embed'] == '1' &&
				urlParams['od'] == '1')) && !navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
				(navigator.userAgent.indexOf('MSIE') < 0 || document.documentMode >= 10));

		if (!editorUi.isOffline())
		{
			var img = new Image();
			img.src = IMAGE_PATH + '/help.png';
		}
		
		editorUi.actions.addAction('new...', function()
		{
			var compact = editorUi.isOffline();
			var dlg = new NewDialog(editorUi, compact);

			editorUi.showDialog(dlg.container, (compact) ? 350 : 620, (compact) ? 70 : 440, true, true, function(cancel)
			{
				if (cancel && editorUi.getCurrentFile() == null)
				{
					editorUi.showSplash();
				}
			});
			
			dlg.init();
		});
		
		editorUi.actions.get('print').funct = function()
		{
			editorUi.showDialog(new PrintDialog(editorUi).container, 360,
				(editorUi.pages != null && editorUi.pages.length > 1) ?
				420 : 360, true, true);
		};
		
		editorUi.actions.addAction('open...', function()
		{
			editorUi.pickFile();
		});
		
		editorUi.actions.addAction('close', function()
		{
			editorUi.fileLoaded(null);
		});
		
		editorUi.actions.addAction('editShape...', mxUtils.bind(this, function()
		{
			var cells = graph.getSelectionCells();
			
			if (graph.getSelectionCount() == 1)
			{
				var cell = graph.getSelectionCell();
				var state = graph.view.getState(cell);
				
				if (state != null && state.shape != null && state.shape.stencil != null)
				{
			    	var dlg = new EditShapeDialog(editorUi, cell, mxResources.get('editShape') + ':', 630, 400);
					editorUi.showDialog(dlg.container, 640, 480, true, false);
					dlg.init();
				}
			}
		}));
		
		editorUi.actions.addAction('revisionHistory...', function()
		{
			var file = editorUi.getCurrentFile();
			
			if (file == null || (file.constructor != DriveFile && file.constructor != DropboxFile) ||
				(editorUi.drive == null && file.constructor == DriveFile) ||
				(editorUi.dropbox == null && file.constructor == DropboxFile))
			{
				editorUi.showError(mxResources.get('error'), mxResources.get('notAvailable'), mxResources.get('ok'));
			}
			else if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
			{
				if (file.constructor == DropboxFile)
				{
					// Limit is maximum number of entries to return
					editorUi.dropbox.client.revisions(file.stat.path, {limit: 100}, function(err, stats)
					{
						editorUi.spinner.stop();
						
						if (err == null)
						{
							var revs = [];
							
							for (var i = stats.length - 1; i >= 0; i--)
							{
								(function(stat)
								{
									revs.push({modifiedDate: stat.clientModifiedAt, fileSize: stat.size, getXml: function(success, error)
									{
										editorUi.dropbox.client.readFile('/' + file.stat.path, {versionTag: stat.versionTag}, mxUtils.bind(this, function(err2, data)
										{
											if (err2 == null)
											{
												success(data);
											}
											else
											{
												error(err2);
											}
										}));
									}, getUrl: function()
									{
										return editorUi.getUrl(window.location.pathname + '?rev=' + stat.versionTag + '&chrome=0&edit=_blank') + window.location.hash;
									}});
								})(stats[i]);
							}
							
							var dlg = new RevisionDialog(editorUi, revs);
							editorUi.showDialog(dlg.container, 640, 480, true, true);
							dlg.init();
						}
						else
						{
							editorUi.handleError(err);
						}
					});
				}
				// Google Drive File
				else
				{
					editorUi.drive.executeRequest(gapi.client.drive.revisions.list({'fileId': file.getId()}), function(resp)
					{
						editorUi.spinner.stop();
						
						for (var i = 0; i < resp.items.length; i++)
						{
							(function(item)
							{
								item.getXml = function(success, error)
								{
									// Workaround for vanished head revision is to use current head revision from descriptor
									editorUi.drive.executeRequest(gapi.client.drive.revisions.get({'fileId': file.getId(),
										'revisionId': (resp.items[resp.items.length - 1] === item) ?
										file.desc.headRevisionId : item.id}), function(resp)
									{
										editorUi.drive.getXmlFile(resp, null, function(file2)
							   			{
											success(file2.getData());
							   			}, function(resp)
							   			{
							   				error(resp);
							   			});
									}, function(resp)
									{
										error(resp);
									});
								};
								
								item.getUrl = function()
								{
									return editorUi.getUrl(window.location.pathname + '?rev=' + item.id + '&chrome=0&edit=_blank') + window.location.hash;
								};
							})(resp.items[i]);
						}
	
						var dlg = new RevisionDialog(editorUi, resp.items);
						editorUi.showDialog(dlg.container, 640, 480, true, true);
						dlg.init();
					}, function(resp)
					{
						editorUi.spinner.stop();
						editorUi.handleError(resp);
					});
				}
			}
		});
		
		editorUi.actions.addAction('createRevision', function()
		{
			editorUi.actions.get('save').funct();
		}, null, null, 'Ctrl+S');

		editorUi.actions.addAction('upload...', function()
		{
			var file = editorUi.getCurrentFile();
			
			if (file != null)
			{
				// Data is pulled from global variable after tab loads
				// LATER: Change to use message passing to deal with potential cross-domain
				window.drawdata = editorUi.getFileData();
				var filename = (file.getTitle() != null) ? file.getTitle() : editorUi.defaultFilename;
				window.open(window.location.protocol + '//' + window.location.host + '/?create=drawdata&' +
						((editorUi.mode == App.MODE_DROPBOX) ? 'mode=dropbox&' : '') +
						'title=' + encodeURIComponent(filename));
			}
		});

		if (typeof(MathJax) !== 'undefined')
		{
			var action = editorUi.actions.addAction('mathematicalTypesetting', function()
			{
				editorUi.setMathEnabled(!editorUi.isMathEnabled());
			});
			
			action.setToggleAction(true);
			action.setSelectedCallback(function() { return editorUi.isMathEnabled(); });
			action.isEnabled = isGraphEnabled;
		}
		
		if (isLocalStorage)
		{
			var action = editorUi.actions.addAction('showStartScreen', function()
			{
				mxSettings.setShowStartScreen(!mxSettings.getShowStartScreen());
				mxSettings.save();
			});
			
			action.setToggleAction(true);
			action.setSelectedCallback(function() { return mxSettings.getShowStartScreen(); });
		}

		var autosaveAction = editorUi.actions.addAction('autosave', function()
		{
			editorUi.editor.setAutosave(!editorUi.editor.autosave);
		});
		
		autosaveAction.setToggleAction(true);
		autosaveAction.setSelectedCallback(function()
		{
			return autosaveAction.isEnabled() && editorUi.editor.autosave;
		});

		editorUi.actions.addAction('editGeometry...', function()
		{
			var cells = graph.getSelectionCells();
			var vertices = [];
			
			for (var i = 0; i < cells.length; i++)
			{
				if (graph.getModel().isVertex(cells[i]))
				{
					vertices.push(cells[i]);
				}
			}
			
			if (vertices.length > 0)
			{
				var dlg = new EditGeometryDialog(editorUi, vertices);
				editorUi.showDialog(dlg.container, 180, 180, true, true);
				dlg.init();
			}
		}, null, null, 'Ctrl+Shift+M');

		var copiedStyles = ['rounded', 'shadow', 'dashed', 'dashPattern', 'fontFamily', 'fontSize', 'fontColor', 'fontStyle', 'align',
		                    'verticalAlign', 'strokeColor', 'strokeWidth', 'fillColor', 'gradientColor', 'swimlaneFillColor',
		                    'textOpacity', 'gradientDirection', 'glass', 'labelBackgroundColor', 'labelBorderColor', 'opacity',
		                    'spacing', 'spacingTop', 'spacingLeft', 'spacingBottom', 'spacingRight', 'endFill', 'endArrow',
		                    'endSize', 'startStill', 'startArrow', 'startSize'];
		
		editorUi.actions.addAction('copyStyle', function()
		{
			var state = graph.view.getState(graph.getSelectionCell());
			
			if (graph.isEnabled() && state != null)
			{
				editorUi.copiedStyle = mxUtils.clone(state.style);
				
				// Handles special case for value "none"
				var cellStyle = graph.getModel().getStyle(state.cell);
				var tokens = (cellStyle != null) ? cellStyle.split(';') : [];
				
				for (var j = 0; j < tokens.length; j++)
				{
					var tmp = tokens[j];
			 		var pos = tmp.indexOf('=');
			 					 		
			 		if (pos >= 0)
			 		{
			 			var key = tmp.substring(0, pos);
			 			var value = tmp.substring(pos + 1);
			 			
			 			if (editorUi.copiedStyle[key] == null && value == 'none')
			 			{
			 				editorUi.copiedStyle[key] = 'none';
			 			}
			 		}
				}
			}
		}, null, null, 'Ctrl+Shift+C');

		editorUi.actions.addAction('pasteStyle', function()
		{
			if (graph.isEnabled() && !graph.isSelectionEmpty() && editorUi.copiedStyle != null)
			{
				graph.getModel().beginUpdate();
				
				try
				{
					var cells = graph.getSelectionCells();
					
					for (var i = 0; i < cells.length; i++)
					{
						var state = graph.view.getState(cells[i]);
						
						for (var j = 0; j < copiedStyles.length; j++)
						{
							var key = copiedStyles[j];
							var value = editorUi.copiedStyle[key];
							
							if (state.style[key] != value)
							{
								graph.setCellStyles(key, value, [cells[i]]);
							}
						}
					}
				}
				finally
				{
					graph.getModel().endUpdate();
				}
			}
		}, null, null, 'Ctrl+Shift+V');
		
		editorUi.actions.put('pageBackgroundImage', new Action(mxResources.get('backgroundImage') + '...', function()
		{
			if (!editorUi.isOffline())
			{
				var apply = function(image)
				{
					editorUi.setBackgroundImage(image);
				};
	
				var dlg = new BackgroundImageDialog(editorUi, apply);
				editorUi.showDialog(dlg.container, 320, 170, true, true);
				dlg.init();
			}
		}));
		
		action = editorUi.actions.put('shadowVisible', new Action(mxResources.get('shadow'), function()
		{
			graph.setShadowVisible(!graph.shadowVisible);
		}));
		action.setToggleAction(true);
		action.setSelectedCallback(function() { return graph.shadowVisible; });

		editorUi.actions.put('about', new Action(mxResources.get('aboutDrawio') + '...', function()
		{
			editorUi.showDialog(new AboutDialog(editorUi).container, 220, 300, true, true);
		}, null, null, 'F1'));
		
		editorUi.actions.addAction('userManual...', function()
		{
			window.open('https://support.draw.io/display/DO/Draw.io+Online+User+Manual');
		});

		editorUi.actions.addAction('support...', function()
		{
			window.open('https://support.draw.io/display/DO/draw.io+Online+Support');
		});

		editorUi.actions.addAction('exportOptionsDisabled...', function()
		{
			editorUi.handleError({message: mxResources.get('exportOptionsDisabledDetails')},
				mxResources.get('exportOptionsDisabled'));
		});

		editorUi.actions.addAction('keyboardShortcuts...', function()
		{
			if (mxClient.IS_CHROMEAPP)
			{
				window.open('https://www.draw.io/shortcuts.svg');
			}
			else if (mxClient.IS_SVG)
			{
				window.open('shortcuts.svg');
			}
			else
			{
				window.open('https://www.draw.io/?chrome=0&url=https%3A%2F%2Fwww.draw.io%2Fshortcuts.svg');
			}
		});

		editorUi.actions.addAction('feedback...', function()
		{
			var dlg = new FeedbackDialog(editorUi);
			editorUi.showDialog(dlg.container, 610, 360, true, true);
			dlg.init();
		});

		editorUi.actions.addAction('quickStart...', function()
		{
			window.open('https://www.youtube.com/watch?v=8OaMWa4R1SE&t=1');
		});
		
		action = editorUi.actions.addAction('tags...', mxUtils.bind(this, function()
		{
			if (this.tagsWindow == null)
			{
				this.tagsWindow = new TagsWindow(editorUi, document.body.offsetWidth - 380, 230, 280, 120);
				this.tagsWindow.window.addListener('show', function()
				{
					editorUi.fireEvent(new mxEventObject('tags'));
				});
				this.tagsWindow.window.addListener('hide', function()
				{
					editorUi.fireEvent(new mxEventObject('tags'));
				});
				this.tagsWindow.window.setVisible(true);
				editorUi.fireEvent(new mxEventObject('tags'));
			}
			else
			{
				this.tagsWindow.window.setVisible(!this.tagsWindow.window.isVisible());
			}
		}));
		action.setToggleAction(true);
		action.setSelectedCallback(mxUtils.bind(this, function() { return this.tagsWindow != null && this.tagsWindow.window.isVisible(); }));
		
		action = editorUi.actions.addAction('find...', mxUtils.bind(this, function()
		{
			if (this.findWindow == null)
			{
				this.findWindow = new FindWindow(editorUi, document.body.offsetWidth - 300, 110, 204, 116);
				this.findWindow.window.addListener('show', function()
				{
					editorUi.fireEvent(new mxEventObject('find'));
				});
				this.findWindow.window.addListener('hide', function()
				{
					editorUi.fireEvent(new mxEventObject('find'));
				});
				this.findWindow.window.setVisible(true);
				editorUi.fireEvent(new mxEventObject('find'));
			}
			else
			{
				this.findWindow.window.setVisible(!this.findWindow.window.isVisible());
			}
		}));
		action.setToggleAction(true);
		action.setSelectedCallback(mxUtils.bind(this, function() { return this.findWindow != null && this.findWindow.window.isVisible(); }));

		// Adds language menu to options only if localStorage is available for
		// storing the choice. We do not want to use cookies for older browsers.
		// Note that the URL param lang=XX is available for setting the language
		// in older browsers. URL param has precedence over the saved setting.
		if (mxClient.IS_CHROMEAPP || (isLocalStorage && urlParams['offline'] != '1'))
		{
			this.put('language', new Menu(mxUtils.bind(this, function(menu, parent)
			{
				var addLangItem = mxUtils.bind(this, function (id)
				{
					var lang = (id == '') ? mxResources.get('automatic') : mxLanguageMap[id];
					var item = null;
					
					if (lang != '')
					{
						item = menu.addItem(lang, null, mxUtils.bind(this, function()
						{
							mxSettings.setLanguage(id);
							mxSettings.save();
							
							// Shows dialog in new language
							mxClient.language = id;
							mxResources.loadDefaultBundle = false;
							mxResources.add(RESOURCE_BASE);
							
							editorUi.alert(mxResources.get('restartForChangeRequired'));
						}), parent);
						
						if (id == mxLanguage || (id == '' && mxLanguage == null))
						{
							menu.addCheckmark(item, Editor.checkmarkImage);
						}
					}
					
					return item;
				});
				
				var item = addLangItem('');
				menu.addSeparator(parent);

				// LATER: Sort menu by language name
				for(var langId in mxLanguageMap) 
				{
					addLangItem(langId);
				}
			})));

			// Extends the menubar with the language menu
			if (uiTheme != 'atlas')
			{
				var menusCreateMenuBar = Menus.prototype.createMenubar;
				Menus.prototype.createMenubar = function(container)
				{
					var menubar = menusCreateMenuBar.apply(this, arguments);
					
					if (menubar != null)
					{
						var langMenu = this.get('language');
						
						if (langMenu != null)
						{
							var elt = menubar.addMenu('', langMenu.funct);
							elt.setAttribute('title', mxResources.get('language'));
							elt.style.width = '16px';
							elt.style.paddingTop = '2px';
							elt.style.paddingLeft = '4px';
							elt.innerHTML = '<div class="geIcon geSprite geSprite-globe"/>';
							elt.style.zIndex = '1';
							elt.style.position = 'absolute';
							elt.style.top = '2px';
							elt.style.right = '17px';
							elt.style.display = 'block';
							
							if (!mxClient.IS_VML)
							{
								mxUtils.setOpacity(elt, 60);
							}
							
							document.body.appendChild(elt);
						}
					}
	
					return menubar;
				};
			}
		}
		
		this.put('help', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (!mxClient.IS_CHROMEAPP && editorUi.isOffline())
			{
				this.addMenuItems(menu, ['about']);
			}
			else
			{
				// No translation for menu item since help is english only
				var item = menu.addItem('Search', null, null, parent, null, null, false);
				
				var form = document.createElement('div');
				form.style.display = 'inline';
				form.innerHTML = ':<form style="display:inline;margin-left:8px;" id="rw_search_form"' +
					'target="_blank" method="get" action="https://support.draw.io/dosearchsite.action">' +
					'<input id="rw_search_query" type="text" name="queryString" size="25"></form>';
				item.firstChild.nextSibling.appendChild(form);
				item.style.backgroundColor = 'whiteSmoke';
				item.style.cursor = 'default';
				
				var realForm = form.getElementsByTagName('form')[0]
				var input = form.getElementsByTagName('input')[0];
				
				if (input != null && realForm != null)
				{
					mxEvent.addListener(realForm, 'submit', function()
					{
						// Logs search terms for improving search results
						if (editorUi.enableLogging)
						{
							var img = new Image();
							var logDomain = window.DRAWIO_LOG_URL != null ? window.DRAWIO_LOG_URL : '';
							img.src = logDomain + '/log?severity=CONFIG&msg=helpsearch:' + encodeURIComponent(input.value) + '&v=' + encodeURIComponent(EditorUi.VERSION);
						}
						
						// Workaround for blocked submit on iOS/IE11
						window.setTimeout(function()
						{
							editorUi.menubar.hideMenu();
						}, 0);
					});
					
					mxEvent.addGestureListeners(item, function(evt)
					{
						if (document.activeElement != input)
						{
							input.focus();
						}
						
						mxEvent.consume(evt);
					}, function(evt)
					{
						mxEvent.consume(evt);
					}, function(evt)
					{
						mxEvent.consume(evt);
					});

					// Sets initial focus on input element
					window.setTimeout(function()
					{
						input.focus();
					}, 0);
				}

				this.addMenuItems(menu, ['-', 'quickStart', 'userManual', 'keyboardShortcuts', '-']);
				
				if (!mxClient.IS_CHROMEAPP)
				{
					this.addMenuItems(menu, ['feedback']);
				}

				this.addMenuItems(menu, ['support', '-', 'about']);
			}

			if (urlParams['test'] == '1')
			{
				// For showing the bounding box
				mxResources.parse('showBoundingBox=Show bounding box');
				
				this.editorUi.actions.addAction('showBoundingBox', mxUtils.bind(this, function()
				{
					var b = graph.getGraphBounds();
					var tr = graph.view.translate;
					var s = graph.view.scale;
					graph.insertVertex(parent, null, '', b.x / s - tr.x, b.y / s - tr.y, b.width / s, b.height / s, 'fillColor=none;strokeColor=red;');
				}));

				this.addMenuItems(menu, ['-', 'showBoundingBox'], parent);

				// For testing local XML export
				mxResources.parse('testXmlImageExport=XML Image Export');
				
				this.editorUi.actions.addAction('testXmlImageExport', mxUtils.bind(this, function()
				{
					var bg = '#ffffff';
					var scale = 1;
					var b = 1;
					
					var imgExport = new mxImageExport();
					var bounds = graph.getGraphBounds();
					var vs = graph.view.scale;
					
		        	// New image export
					var xmlDoc = mxUtils.createXmlDocument();
					var root = xmlDoc.createElement('output');
					xmlDoc.appendChild(root);
					
				    // Renders graph. Offset will be multiplied with state's scale when painting state.
					var xmlCanvas = new mxXmlCanvas2D(root);
					xmlCanvas.translate(Math.floor((b / scale - bounds.x) / vs), Math.floor((b / scale - bounds.y) / vs));
					xmlCanvas.scale(scale / vs);
					
					var stateCounter = 0;
					
					var canvasSave = xmlCanvas.save;
					xmlCanvas.save = function()
					{
						stateCounter++;
						canvasSave.apply(this, arguments);
					};
					
					var canvasRestore = xmlCanvas.restore;
					xmlCanvas.restore = function()
					{
						stateCounter--;
						canvasRestore.apply(this, arguments);
					};
					
					var exportDrawShape = imgExport.drawShape;
					imgExport.drawShape = function(state)
					{
						mxLog.debug('entering shape', state, stateCounter);
						exportDrawShape.apply(this, arguments);
						mxLog.debug('leaving shape', state, stateCounter);
					};
					
				    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);
				    
					// Puts request data together
					var w = Math.ceil(bounds.width * scale / vs + 2 * b);
					var h = Math.ceil(bounds.height * scale / vs + 2 * b);
					
					mxLog.show();
					mxLog.debug(mxUtils.getXml(root));
					mxLog.debug('stateCounter', stateCounter);
				}));
					
				this.addMenuItems(menu, ['testXmlImageExport'], parent);
				
				mxResources.parse('animation=Animation');
				
				this.editorUi.actions.addAction('animation', mxUtils.bind(this, function()
				{
					if (this.animationWindow == null)
					{
						// LATER: Check outline window for initial placement
						this.animationWindow = new AnimationWindow(this.editorUi, (document.body.offsetWidth - 480) / 2,
							120, 640, 480);
						this.animationWindow.window.setVisible(true);
					}
					else
					{
						this.animationWindow.window.setVisible(!this.animationWindow.window.isVisible());
					}
				}));

				this.addMenuItems(menu, ['animation'], parent);

				mxResources.parse('testShowRtModel=Show RT model');
				mxResources.parse('testDebugRtModel=Debug RT model');
				mxResources.parse('testDownloadRtModel=Download RT model');
				
				this.editorUi.actions.addAction('testShowRtModel', mxUtils.bind(this, function()
				{
					if (this.editorUi.getCurrentFile() != null && this.editorUi.getCurrentFile().realtime != null)
					{
						console.log('bytesUsed', this.editorUi.getCurrentFile().realtime.rtModel.bytesUsed);
						console.log('root', this.editorUi.getCurrentFile().realtime.dumpRoot());
						this.editorUi.getCurrentFile().realtime.check();
					}
				}));
				
				this.editorUi.actions.addAction('testDebugRtModel', mxUtils.bind(this, function()
				{
					gapi.drive.realtime.debug();
				}));
				
				this.editorUi.actions.addAction('testDownloadRtModel', mxUtils.bind(this, function()
				{
					var file = this.editorUi.getCurrentFile();
					
					if (file != null && file.realtime != null &&
						editorUi.spinner.spin(document.body, mxResources.get('export')))
					{
						// LATER: Download full model dump with history
						var req = new mxXmlRequest('https://www.googleapis.com/drive/v2/files/' +
								file.getHash().substring(1) + '/realtime', null, 'GET');

						// Adds auth token
						req.setRequestHeaders = function(request)
						{
							mxXmlRequest.prototype.setRequestHeaders.apply(this, arguments);
							var token = gapi.auth.getToken().access_token;
							request.setRequestHeader('authorization', 'Bearer ' + token);	
						};
						
						req.send(function(req)
						{
							editorUi.spinner.stop();
							
							if (req.getStatus() == 200)
							{
								editorUi.saveLocalFile(req.getText(), 'realtime.txt', 'text/plain');
							}
						});
					}
				}));

				if (this.editorUi.getCurrentFile() != null && this.editorUi.getCurrentFile().realtime != null)
				{
					this.addMenuItems(menu, ['-', 'testShowRtModel', 'testDebugRtModel', 'testDownloadRtModel'], parent);
				}
				
				mxResources.parse('testShowConsole=Show Console');
				this.editorUi.actions.addAction('testShowConsole', function()
				{
					if (!mxLog.isVisible())
					{
						mxLog.show();
					}
					else
					{
						mxLog.window.fit();
					}
					
					mxLog.window.div.style.zIndex = mxPopupMenu.prototype.zIndex - 1;
				});
				this.addMenuItems(menu, ['-', 'testShowConsole']);
			}
		})));

		editorUi.actions.addAction('shapes...', function()
		{
			if (mxClient.IS_CHROMEAPP || !editorUi.isOffline())
			{
				editorUi.showDialog(new MoreShapesDialog(editorUi, true).container, 640, (isLocalStorage) ?
						((mxClient.IS_IOS) ? 480 : 460) : 440, true, true);
			}
			else
			{
				editorUi.showDialog(new MoreShapesDialog(editorUi, false).container, 360, (isLocalStorage) ?
						((mxClient.IS_IOS) ? 300 : 280) : 260, true, true);
			}
		});

		editorUi.actions.addAction('createShape...', function()
		{
			var file = editorUi.getCurrentFile();
			
			if (urlParams['embed'] == '1' || (file != null && file.isEditable()))
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 120, 120), editorUi.defaultCustomShapeStyle);
				cell.vertex = true;
				
		    	var dlg = new EditShapeDialog(editorUi, cell, mxResources.get('editShape') + ':', 630, 400);
				editorUi.showDialog(dlg.container, 640, 480, true, false);
				dlg.init();
			}
		});
		
		editorUi.actions.put('embedHtml', new Action(mxResources.get('html') + '...', function()
		{
			var dlg = new EmbedHtmlDialog(editorUi);
			editorUi.showDialog(dlg.container, 550, 400, true, true);
			dlg.init();
		}));
		
		editorUi.actions.put('embedSvg', new Action(mxResources.get('formatSvg') + '...', function()
		{
			var dlg = new EmbedSvgDialog(editorUi);
			editorUi.showDialog(dlg.container, 550, 400, true, true);
			dlg.init();
		}));
		
		editorUi.actions.put('embedIframe', new Action(mxResources.get('iframe') + '...', function()
		{
			var dlg = new IframeDialog(editorUi);
			editorUi.showDialog(dlg.container, 420, 220, true, true);
			dlg.init();
		}));
		
		editorUi.actions.put('publishLink', new Action(mxResources.get('link') + '...', function()
		{
			var dlg = new IframeDialog(editorUi, false, true);
			editorUi.showDialog(dlg.container, 420, 200, true, true);
			dlg.init();
		}));
		
		editorUi.actions.put('embedImage', new Action(mxResources.get('image') + '...', function()
		{
			var dlg = new EmbedSvgDialog(editorUi, true);
			editorUi.showDialog(dlg.container, 550, 400, true, true);
			dlg.init();
		}));
		
		editorUi.actions.put('liveImage', new Action('Live image...', function()
		{
			var dlg = new IframeDialog(editorUi, true);
			editorUi.showDialog(dlg.container, 420, 180, true, true);
			dlg.init();
		}));
		
		editorUi.actions.addAction('googleDocs...', function()
		{
			window.open('http://docsaddon.draw.io');
		});

		editorUi.actions.addAction('googleSites...', function()
		{
			var dlg = new GoogleSitesDialog(editorUi);
			editorUi.showDialog(dlg.container, 420, 256, true, true);
			dlg.init();
		});

		// Adds plugins menu item in file menu only if localStorage is available for
		// storing the plugins.
		if (isLocalStorage || mxClient.IS_CHROMEAPP)
		{
			var action = editorUi.actions.addAction('scratchpad', function()
			{
				editorUi.toggleScratchpad();
			});
			
			action.setToggleAction(true);
			action.setSelectedCallback(function() { return editorUi.scratchpad != null; });

			editorUi.actions.addAction('plugins...', function()
			{
				editorUi.showDialog(new PluginsDialog(editorUi).container, 360, 156, true, false);
			});
		}
		
		var action = editorUi.actions.addAction('search', function()
		{
			var visible = editorUi.sidebar.isEntryVisible('search');
			editorUi.sidebar.showPalette('search', !visible);
			
			if (isLocalStorage)
			{
				mxSettings.settings.search = !visible;
				mxSettings.save();
			}
		});
		
		action.setToggleAction(true);
		action.setSelectedCallback(function() { return editorUi.sidebar.isEntryVisible('search'); });
		
		if (urlParams['embed'] == '1')
		{
			editorUi.actions.get('save').funct = function(exit)
			{
				if (graph.isEditing())
				{
					graph.stopEditing();
				}
				
				var data = (urlParams['pages'] != '0' || (editorUi.pages != null && editorUi.pages.length > 1)) ?
					editorUi.getFileData(true) : mxUtils.getXml(editorUi.editor.getGraphXml());
				
				if (urlParams['proto'] == 'json')
				{
					var msg = editorUi.createLoadMessage('save');
					msg.xml = data;
					
					if (exit)
					{
						msg.exit = true;
					}
					
					data = JSON.stringify(msg);
				}
				
				var parent = window.opener || window.parent;
				parent.postMessage(data, '*');
				
				if (urlParams['modified'] != '0' && urlParams['keepmodified'] != '1')
				{
					editorUi.editor.modified = false;
					editorUi.editor.setStatus('');
				}
			};
	
			editorUi.actions.addAction('saveAndExit', function()
			{
				editorUi.actions.get('save').funct(true);
			});
			
			editorUi.actions.addAction('exit', function()
			{
				var fn = function()
				{
					var msg = (urlParams['proto'] == 'json') ? JSON.stringify({event: 'exit',
						modified: editorUi.editor.modified}) : '';
					var parent = window.opener || window.parent;
					parent.postMessage(msg, '*');
				}
				
				if (!editorUi.editor.modified)
				{
					fn();
				}
				else
				{
					editorUi.confirm(mxResources.get('allChangesLost'), fn);
				}
			});
		}
		this.put('exportAs', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (editorUi.isExportToCanvas())
			{
				menu.addItem(mxResources.get('image') + '...', null, mxUtils.bind(this, function()
				{
					editorUi.showExportDialog(false, mxResources.get('export'),
						'https://support.draw.io/display/DO/Exporting+Files',
						mxUtils.bind(this, function(scale, transparentBackground, ignoreSelection, addShadow, editable)
						{
							var val = parseInt(scale);
							
							if (!isNaN(val) && val > 0)
							{
							   	this.editorUi.exportImage(val / 100, transparentBackground, ignoreSelection, addShadow, editable);
							}
						}));
				}), parent);
			}
			
			// Disabled for standalone mode in iOS because new tab cannot be closed
			else if (!editorUi.isOffline() && (!mxClient.IS_IOS || !navigator.standalone))
			{
				menu.addItem(mxResources.get('image') + '...', null, mxUtils.bind(this, function()
				{
					editorUi.showRemoteExportDialog(mxResources.get('export'), null, mxUtils.bind(this, function(ignoreSelection, editable)
					{
						this.editorUi.downloadFile((editable) ? 'xmlpng' : 'png', null, null, ignoreSelection);
					}));
				}), parent);
			}
			
			menu.addItem(mxResources.get('formatSvg') + '...', null, mxUtils.bind(this, function()
			{
				editorUi.showExportDialog(true, mxResources.get('export'),
					'https://support.draw.io/display/DO/Exporting+Files',
					mxUtils.bind(this, function(scale, transparentBackground, ignoreSelection, addShadow, editable, embedImages)
					{
						var val = parseInt(scale);
						
						if (!isNaN(val) && val > 0)
						{
						   	this.editorUi.exportSvg(val / 100, transparentBackground, ignoreSelection, addShadow, editable, embedImages);
						}
					}));
			}), parent);

			menu.addSeparator(parent);
			
			menu.addItem(mxResources.get('formatHtmlEmbedded') + '...', null, mxUtils.bind(this, function()
			{
				this.editorUi.downloadFile('html');
			}), parent);

			// Redirects export to PDF to print in Chrome App
			if (mxClient.IS_CHROMEAPP)
			{
				menu.addItem(mxResources.get('formatPdf') + '...', null, this.editorUi.actions.get('print').funct, parent);
			}
			// Disabled for standalone mode in iOS because new tab cannot be closed
			else if (!editorUi.isOffline() && (!mxClient.IS_IOS || !navigator.standalone))
			{
				menu.addItem(mxResources.get('formatPdf') + '...', null, mxUtils.bind(this, function()
				{
					var content = document.createElement('div');
					content.style.padding = '6px';
					
					var cb2 = document.createElement('input');
					cb2.style.marginRight = '8px';
					cb2.setAttribute('type', 'checkbox');
					
					if (graph.isSelectionEmpty())
					{
						cb2.setAttribute('disabled', 'disabled');
					}
					
					content.appendChild(cb2);
					mxUtils.write(content, mxResources.get('selectionOnly'));
					mxUtils.br(content);
					
					var cb = document.createElement('input');
					cb.setAttribute('type', 'checkbox');
					cb.style.marginTop = '16px';
					cb.style.marginRight = '8px';
					
					if (!graph.pageVisible)
					{
						cb.setAttribute('checked', 'checked');
						cb.defaultChecked = true;
					}
					
					content.appendChild(cb);
					mxUtils.write(content, mxResources.get('crop'));
					
					var dlg = new CustomDialog(editorUi, content, mxUtils.bind(this, function()
					{
						var prev = graph.pageVisible;
						graph.pageVisible = !cb.checked;
						this.editorUi.downloadFile('pdf', null, null, !cb2.checked);
						graph.pageVisible = prev;
					}), null, mxResources.get('export'));
					this.editorUi.showDialog(dlg.container, 300, 120, true, true);
				}), parent);
			}

			menu.addSeparator(parent);
			menu.addItem(mxResources.get('formatXml') + '...', null, mxUtils.bind(this, function()
			{
				var noPages = editorUi.pages == null || editorUi.pages.length <= 1;
				var content = document.createElement('div');
				content.style.padding = '6px';
				
				var cb2 = document.createElement('input');
				cb2.style.marginRight = '8px';
				cb2.setAttribute('type', 'checkbox');
				
				if (graph.isSelectionEmpty())
				{
					cb2.setAttribute('disabled', 'disabled');
				}
				
				content.appendChild(cb2);
				mxUtils.write(content, mxResources.get('selectionOnly'));
				
				var cb = document.createElement('input');
				cb.setAttribute('type', 'checkbox');
				cb.setAttribute('checked', 'checked');
				cb.defaultChecked = true;
				cb.style.marginRight = '8px';
				cb.style.marginTop = '16px';
				mxUtils.br(content);
				content.appendChild(cb);
				
				if (noPages)
				{
					mxUtils.write(content, mxResources.get('compressed'));
				}
				else
				{
					mxUtils.write(content, mxResources.get('allPages'));
					
					mxEvent.addListener(cb2, 'change', function()
					{
						if (cb2.checked)
						{
							cb.setAttribute('disabled', 'disabled');
						}
						else
						{
							cb.removeAttribute('disabled');
						}
					});
				}
					
				var dlg = new CustomDialog(editorUi, content, mxUtils.bind(this, function()
				{
					editorUi.downloadFile('xml', (noPages) ? !cb.checked : null, null, !cb2.checked,
						(!noPages) ? !cb.checked : null);
				}), null, mxResources.get('export'));
				editorUi.showDialog(dlg.container, 300, 120, true, true);
			}), parent);
			
			if (!editorUi.isOffline())
			{
				menu.addSeparator(parent);
				this.addMenuItem(menu, 'export', parent).firstChild.nextSibling.innerHTML = mxResources.get('advanced') + '...';
			}
		})));

		this.editorUi.actions.addAction('chatWindowTitle...', mxUtils.bind(this.editorUi, this.editorUi.toggleChat));
		
		this.put('importFrom', new Menu(function(menu, parent)
		{
			function importFile(device)
			{
				if (device && Graph.fileSupport && !mxClient.IS_IE && !mxClient.IS_IE11)
				{
					var input = document.createElement('input');
					input.setAttribute('type', 'file');
					
					mxEvent.addListener(input, 'change', function()
					{
						if (input.files != null)
						{
							// Using null for position will disable crop of input file
							editorUi.importFiles(input.files, null, null, editorUi.maxImageSize);
						}
					});

					input.click();
				}
				else
				{
					window.openNew = false;
					window.openKey = 'import';
					
					var prevValue = Editor.useLocalStorage;
					Editor.useLocalStorage = !device;
	
					// Closes dialog after open
					window.openFile = new OpenFile(function(cancel)
					{
						editorUi.hideDialog(cancel);
					});
					
					window.openFile.setConsumer(function(xml, filename)
					{
						graph.setSelectionCells(editorUi.importXml(xml));
					});
	
					// Removes openFile if dialog is closed
					editorUi.showDialog(new OpenDialog(editorUi).container, 360, 220, true, true, function()
					{
						window.openFile = null;
					});
					
					// Extends dialog close to show splash screen
					var dlg = editorUi.dialog;
					var dlgClose = dlg.close;
					
					editorUi.dialog.close = function(cancel)
					{
						Editor.useLocalStorage = prevValue;
						dlgClose.apply(dlg, arguments);
						
						if (cancel && editorUi.getCurrentFile() == null && urlParams['embed'] != '1')
						{
							editorUi.showSplash();
						}
					};
				}
			};
			
			var doImportFile = mxUtils.bind(this, function(data, mime, filename)
			{
				if (mime == 'image/png')
				{
					editorUi.loadImage(data, mxUtils.bind(this, function(img)
	    			{
	    				editorUi.resizeImage(img, data, mxUtils.bind(this, function(data2, w2, h2)
	    				{
		    				var s = Math.min(1, Math.min(editorUi.maxImageSize / w2, editorUi.maxImageSize / h2));

							editorUi.importFile(data, mime, 0, 0, Math.round(w2 * s), Math.round(h2 * s), filename, function(cells)
							{
								editorUi.spinner.stop();
								graph.setSelectionCells(cells);
							});
	    				}), true);
	    			}));
				}
				else
				{
					editorUi.importFile(data, mime, 0, 0, 0, 0, filename, function(cells)
					{
						editorUi.spinner.stop();
						graph.setSelectionCells(cells);
					});
				}
			});
			
			function pickFileFromService(service)
			{
				// Drive requires special arguments for libraries and bypassing realtime
				service.pickFile(function(id)
				{
					if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
					{
						if (service == editorUi.dropbox)
						{
							var mime = (/(\.png)$/i.test(id)) ? 'image/png' : 'text/xml';
							
							editorUi.loadUrl(id, function(data)
							{
								doImportFile(data, mime, id);
							},
							function(resp)
							{
								editorUi.handleError(resp, (resp != null) ? mxResources.get('errorLoadingFile') : null);
							}, mime == 'image/png');
						}
						else
						{
							// NOTE The third argument in getFile says denyConvert to match
							// the existing signature in the original DriveClient which has
							// as slightly different semantic, but works the same way.
							service.getFile(id, function(file)
							{
								var mime = (/(\.png)$/i.test(file.getTitle())) ? 'image/png' : 'text/xml';
								doImportFile(file.getData(), mime, file.getTitle());
							},
							function(resp)
							{
								editorUi.handleError(resp, (resp != null) ? mxResources.get('errorLoadingFile') : null);
							}, true);
						}
					}
				}, true);
			};
			
			if (editorUi.drive != null)
			{
				// Requires special arguments for libraries and realtime
				menu.addItem(mxResources.get('googleDrive') + '...', null, function()
				{
					pickFileFromService(editorUi.drive);
				}, parent);
			}
			else if (googleEnabled)
			{
				menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}

			if (editorUi.dropbox != null)
			{
				menu.addItem(mxResources.get('dropbox') + '...', null, function()
				{
					pickFileFromService(editorUi.dropbox);
				}, parent);
			}
			else if (dropboxEnabled)
			{
				menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			if (editorUi.oneDrive != null)
			{
				menu.addItem(mxResources.get('oneDrive') + '...', null, function()
				{
					pickFileFromService(editorUi.oneDrive);
				}, parent);
			}
			else if (oneDriveEnabled)
			{
				menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			menu.addSeparator(parent);

			if (isLocalStorage && urlParams['browser'] != '0')
			{
				menu.addItem(mxResources.get('browser') + '...', null, function()
				{
					importFile(false);
				}, parent);
			}

			if (!mxClient.IS_IOS)
			{
				menu.addItem(mxResources.get('device') + '...', null, function()
				{
					importFile(true);
				}, parent);
			}

			if (!editorUi.isOffline())
			{
				menu.addSeparator(parent);
				
				menu.addItem(mxResources.get('url') + '...', null, function()
				{
					var dlg = new FilenameDialog(editorUi, '', mxResources.get('import'), function(fileUrl)
					{
						if (fileUrl != null && fileUrl.length > 0 && editorUi.spinner.spin(document.body, mxResources.get('loading')))
						{
							var mime = (/(\.png)($|\?)/i.test(fileUrl)) ? 'image/png' : 'text/xml';
							
							// Uses proxy to avoid CORS issues
							editorUi.loadUrl(PROXY_URL + '?url=' + encodeURIComponent(fileUrl), function(data)
							{
								doImportFile(data, mime, fileUrl);
							},
							function ()
							{
								editorUi.spinner.stop();
								editorUi.handleError(null, mxResources.get('errorLoadingFile'));
							}, mime == 'image/png');
						}
					}, mxResources.get('url'));
					editorUi.showDialog(dlg.container, 300, 80, true, true);
					dlg.init();
				}, parent);
			}
		})).isEnabled = isGraphEnabled;

		this.put('theme', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var item = menu.addItem(mxResources.get('kennedy'), null, function()
			{
				mxSettings.setUi('');
				mxSettings.save();
				editorUi.alert(mxResources.get('restartForChangeRequired'));
			}, parent);

			if (uiTheme != 'atlas')
			{
				menu.addCheckmark(item, Editor.checkmarkImage);
			}
			
			item = menu.addItem(mxResources.get('atlas'), null, function()
			{
				mxSettings.setUi('atlas');
				mxSettings.save();
				editorUi.alert(mxResources.get('restartForChangeRequired'));
			}, parent);
			
			if (uiTheme == 'atlas')
			{
				menu.addCheckmark(item, Editor.checkmarkImage);
			}
		})));

		this.editorUi.actions.addAction('rename...', mxUtils.bind(this, function()
		{
			var file = this.editorUi.getCurrentFile();
			
			if (file != null)
			{
				var filename = (file.getTitle() != null) ? file.getTitle() : this.editorUi.defaultFilename;
				
				var dlg = new FilenameDialog(this.editorUi, filename, mxResources.get('rename'), mxUtils.bind(this, function(title)
				{
					if (title != null && title.length > 0 && file != null && this.editorUi.spinner.spin(document.body, mxResources.get('renaming')))
					{
						// Delete old file, save new file in dropbox if autosize is enabled
						file.rename(title, mxUtils.bind(this, function(resp)
						{
							this.editorUi.spinner.stop();
						}),
						mxUtils.bind(this, function(resp)
						{
							this.editorUi.handleError(resp, (resp != null) ? mxResources.get('errorRenamingFile') : null);
						}));
					}
				}), (file.constructor == DriveFile || file.constructor == StorageFile) ?
					mxResources.get('diagramName') : null, function(name)
				{
					if (name != null && name.length > 0)
					{
						return true;
					}
					
					editorUi.showError(mxResources.get('error'), mxResources.get('invalidName'), mxResources.get('ok'));
					
					return false;
				});
				this.editorUi.showDialog(dlg.container, 300, 80, true, true);
				dlg.init();
			}
		})).isEnabled = isGraphEnabled;
		
		editorUi.actions.addAction('makeCopy...', mxUtils.bind(this, function()
		{
			var file = editorUi.getCurrentFile();
			
			if (file != null)
			{
				var title = (file.getTitle() != null) ? file.getTitle() : editorUi.defaultFilename;
				
				// Handles extension
				var extension = '';
				var dot = title.lastIndexOf('.');
				
				if (dot >= 0)
				{
					extension = title.substring(dot);
					title = title.substring(0, dot);
				}
				
				title = mxResources.get('copyOf', [title]) + extension;
				
				if (file.constructor == DriveFile)
				{
					var dlg = new CreateDialog(editorUi, title, mxUtils.bind(this, function(newTitle, mode)
					{
						// Mode is "download" if Create button is pressed, means use Google Drive
						if (mode == 'download')
						{
							mode = App.MODE_GOOGLE;
						}
						
						if (newTitle != null && newTitle.length > 0)
						{
							if (mode == App.MODE_GOOGLE)
							{
								if (editorUi.spinner.spin(document.body, mxResources.get('saving')))
								{
									// Makes sure the latest XML is in the file
									file.save(false, mxUtils.bind(this, function()
									{
										// Saveas does not update the file descriptor in Google Drive
										file.saveAs(newTitle, mxUtils.bind(this, function(resp)
										{
											editorUi.spinner.stop();
											var url = editorUi.getUrl();
											window.openWindow(url + '#G' + resp.id, null, mxUtils.bind(this, function()
											{
												window.location.hash = 'G' + resp.id;
											}));
										}), mxUtils.bind(this, function(resp)
										{
											editorUi.handleError(resp);
										}));
									}), mxUtils.bind(this, function(resp)
									{
										editorUi.handleError(resp);
									}));
								}
							}
							else
							{
								this.editorUi.createFile(newTitle, this.editorUi.getFileData(true), null, mode);
							}
						}
					}), mxUtils.bind(this, function()
					{
						editorUi.hideDialog();
					}), mxResources.get('makeCopy'), mxResources.get('create'), null,
						null, null, null, true);
					editorUi.showDialog(dlg.container, 420, 380, true, true);
					dlg.init();
				}
				else
				{
					// Creates a copy with no predefined storage
					editorUi.editor.editAsNew(editorUi.getEditBlankXml(), title);
				}
			}
		}));
		
		editorUi.actions.addAction('moveToFolder...', mxUtils.bind(this, function()
		{
			var file = editorUi.getCurrentFile();
			
			if (file.getMode() == App.MODE_GOOGLE || file.getMode() == App.MODE_ONEDRIVE)
			{
				editorUi.pickFolder(file.getMode(), mxUtils.bind(this, function(folderId)
				{
	            	if (editorUi.spinner.spin(document.body, mxResources.get('moving')))
	            	{
	            	    file.move(folderId, mxUtils.bind(this, function(resp)
	            		{
	            	    	editorUi.spinner.stop();
	        			}), mxUtils.bind(this, function(resp)
	        			{
	        				editorUi.handleError(resp);
	        			}));
	            	}
				}));
			}
		}));
		
		editorUi.actions.addAction('imgur...', mxUtils.bind(this, function()
		{
			editorUi.publishImage(mxUtils.bind(editorUi, editorUi.uploadToImgur), function(imgurId, editable)
			{
				window.open('https://imgur.com/' + imgurId);
			}, mxResources.get('open'));
		}));
				
		editorUi.actions.addAction('facebook...', mxUtils.bind(this, function()
		{
			editorUi.publishImage(mxUtils.bind(editorUi, editorUi.uploadToImgur), function(imgurId)
			{
				window.open('https://www.facebook.com/sharer.php?p[url]=' + encodeURIComponent('https://imgur.com/' + imgurId) +
						'&p[images][0]=' + encodeURIComponent(imgurId + '.png'));
			});
		}));

		editorUi.actions.addAction('twitter...', mxUtils.bind(this, function()
		{
			editorUi.publishImage(mxUtils.bind(editorUi, editorUi.uploadToImgur), function(imgurId)
			{
				window.open('https://twitter.com/intent/tweet?text=' + 
						encodeURIComponent('Check out the diagram I made with draw.io') +
						'&via=drawio&hashtags=madewithdrawio&url=' +
						encodeURIComponent('https://imgur.com/' + imgurId));
			});
		}));

		editorUi.actions.addAction('github...', mxUtils.bind(this, function()
		{
			editorUi.publishImage(mxUtils.bind(editorUi, editorUi.uploadToGithub));
		}));

		this.put('publish', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			// Disable publish in IE9- due to CORS problem when getting image from server
			// which requires cross-domain XHR but XDomainRequest has no custom headers
			// to set content type to form-encoded-data which is needed for the export.
			if (document.documentMode == null || document.documentMode >= 10)
			{
				this.addMenuItems(menu, ['imgur'], parent);
				this.addMenuItems(menu, ['twitter'], parent);
				this.addMenuItems(menu, ['facebook'], parent);

				if (typeof XMLHttpRequest !== 'undefined')
				{
					this.addMenuItems(menu, ['github'], parent);
				}
			}
			
			if (!navigator.standalone && !editorUi.isOffline())
			{
				this.addMenuItems(menu, ['publishLink'], parent);
			}
		})));

		editorUi.actions.put('offline', new Action(mxResources.get('offline') + '...', function()
		{
		    window.open('http://www.draw.io/app')
		}));
		
		editorUi.actions.put('chromeApp', new Action(mxResources.get('chromeApp') + '...', function()
		{
			window.open('https://chrome.google.com/webstore/detail/drawio-desktop/pebppomjfocnoigkeepgbmcifnnlndla')
		}));

		this.editorUi.actions.addAction('share...', mxUtils.bind(this, function()
		{
			var file = this.editorUi.getCurrentFile();
			
			if (file != null)
			{
				this.editorUi.drive.showPermissions(file.getId());
			}
		}));

		this.put('embed', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (urlParams['test'] == '1')
			{
				this.addMenuItems(menu, ['liveImage', '-'], parent);
			}
			
			this.addMenuItems(menu, ['embedImage', 'embedSvg', '-', 'embedHtml'], parent);
			
			if (!navigator.standalone && !editorUi.isOffline())
			{
				this.addMenuItems(menu, ['embedIframe'], parent);
			}

			if (!editorUi.isOffline())
			{
				this.addMenuItems(menu, ['-', 'googleSites', 'googleDocs'], parent);
			}
		})));

		// Overrides arrange menu to add insert submenu
		this.put('arrange', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['toFront', 'toBack', '-'], parent);
			this.addSubmenu('direction', menu, parent);
			this.addMenuItems(menu, ['turn', '-'], parent);
			this.addSubmenu('align', menu, parent);
			this.addSubmenu('distribute', menu, parent);
			menu.addSeparator(parent);
			this.addSubmenu('navigation', menu, parent);
			this.addSubmenu('insert', menu, parent);
			this.addSubmenu('layout', menu, parent);
			this.addMenuItems(menu, ['-', 'group', 'ungroup', 'removeFromGroup', '-', 'editGeometry', 'clearWaypoints', 'autosize'], parent);
		})));
		
		var methods = ['horizontalFlow', 'verticalFlow', '-', 'horizontalTree', 'verticalTree', '-', 'organic', 'circle', '-', 'fromText'];

		var addInsertItem = function(menu, parent, title, method)
		{
			menu.addItem(title, null, mxUtils.bind(this, function()
			{
				if (method == 'fromText')
				{
					var dlg = new ParseDialog(editorUi, title);
					editorUi.showDialog(dlg.container, 620, 420, true, false);
					editorUi.dialog.container.style.overflow = 'auto';
					dlg.init();
				}
				else
				{
					var dlg = new CreateGraphDialog(editorUi, title, method);
					editorUi.showDialog(dlg.container, 620, 420, true, false);
					// Executed after dialog is added to dom
					dlg.init();
				}
			}), parent);
		};
		
		editorUi.actions.addAction('insertText', function()
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
				var pt = (graph.isMouseInsertPoint()) ? graph.getInsertPoint() : graph.getFreeInsertPoint();
				var cell = new mxCell('Text', new mxGeometry(pt.x, pt.y, 40, 20),
			    	'text;html=1;resizable=0;autosize=1;align=left;verticalAlign=top;spacingTop=-4;points=[];');
				cell.vertex = true;
	    	    graph.startEditingAtCell(graph.addCell(cell));
			}
		}, null, null, 'Ctrl+Shift+X').isEnabled = isGraphEnabled;
		
		
		
		editorUi.actions.addAction('insertRectangle', function()
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
				var pt = (graph.isMouseInsertPoint()) ? graph.getInsertPoint() : graph.getFreeInsertPoint();
				var cell = new mxCell('', new mxGeometry(pt.x, pt.y, 120, 60), 'whiteSpace=wrap;html=1;');
				cell.vertex = true;
	    	    graph.setSelectionCell(graph.addCell(cell));
	    	    graph.scrollCellToVisible(graph.getSelectionCell());
			}
		}, null, null, 'Ctrl+K').isEnabled = isGraphEnabled;
		
		editorUi.actions.addAction('insertEllipse', function()
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
				var pt = (graph.isMouseInsertPoint()) ? graph.getInsertPoint() : graph.getFreeInsertPoint();
				var cell = new mxCell('', new mxGeometry(pt.x, pt.y, 80, 80), 'ellipse;whiteSpace=wrap;html=1;');
				cell.vertex = true;
	    	    graph.setSelectionCell(graph.addCell(cell));
	    	    graph.scrollCellToVisible(graph.getSelectionCell());
			}
		}, null, null, 'Ctrl+Shift+K').isEnabled = isGraphEnabled;
		
		this.put('insert', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['insertText', 'insertRectangle', 'insertEllipse', '-', 'insertLink', 'insertImage'], parent);
			menu.addSeparator(parent);
			
			for (var i = 0; i < methods.length; i++)
			{
				if (methods[i] == '-')
				{
					menu.addSeparator(parent);
				}
				else
				{
					addInsertItem(menu, parent, mxResources.get(methods[i]) + '...', methods[i]);
				}
			}
		})));

		this.put('openRecent', new Menu(function(menu, parent)
		{
			var recent = editorUi.getRecent();
			var count = 0;
			
			if (recent != null)
			{
				for (var i = 0; i < recent.length; i++)
				{
					(function(entry)
					{	
						count++;
						
						var modeKey = entry.mode;
						
						// Google and oneDrive use different keys
						if (modeKey == App.MODE_GOOGLE)
						{
							modeKey = 'googleDrive';
						}
						else if (modeKey == App.MODE_ONEDRIVE)
						{
							modeKey = 'oneDrive';
						}
						
						menu.addItem(entry.title + ' (' + mxResources.get(modeKey) + ')', null, function()
						{
							editorUi.loadFile(entry.id);
						}, parent);
					})(recent[i]);
				}

				menu.addSeparator(parent);
			}

			menu.addItem(mxResources.get('reset'), null, function()
			{
				editorUi.resetRecent();
			}, parent);
		}));
		
		this.put('openFrom', new Menu(function(menu, parent)
		{
			if (editorUi.drive != null)
			{
				menu.addItem(mxResources.get('googleDrive') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_GOOGLE);
				}, parent);
			}
			else if (googleEnabled)
			{
				menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			if (editorUi.dropbox != null)
			{
				menu.addItem(mxResources.get('dropbox') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_DROPBOX);
				}, parent);
			}
			else if (dropboxEnabled)
			{
				menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			if (editorUi.oneDrive != null)
			{
				menu.addItem(mxResources.get('oneDrive') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_ONEDRIVE);
				}, parent);
			}
			else if (oneDriveEnabled)
			{
				menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			menu.addSeparator(parent);

			if (isLocalStorage && urlParams['browser'] != '0')
			{
				menu.addItem(mxResources.get('browser') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_BROWSER);
				}, parent);
			}
			
			if (!mxClient.IS_IOS)
			{
				menu.addItem(mxResources.get('device') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_DEVICE);
				}, parent);
			}

			if (!editorUi.isOffline())
			{
				menu.addSeparator(parent);
				
				menu.addItem(mxResources.get('url') + '...', null, function()
				{
					var dlg = new FilenameDialog(editorUi, '', mxResources.get('open'), function(fileUrl)
					{
						if (fileUrl != null && fileUrl.length > 0)
						{
							var url = editorUi.getUrl(window.location.pathname + '?url=' + encodeURIComponent(fileUrl));
							
							if (editorUi.getCurrentFile() == null)
							{
								window.location.href = url;
							}
							else
							{
								window.openWindow(url);
							}
						}
					}, mxResources.get('url'));
					editorUi.showDialog(dlg.container, 300, 80, true, true);
					dlg.init();
				}, parent);
			}
		}));
		
		this.put('newLibrary', new Menu(function(menu, parent)
		{
			if (editorUi.drive != null)
			{
				menu.addItem(mxResources.get('googleDrive') + '...', null, function()
				{
					editorUi.showLibraryDialog(null, null, null, null, App.MODE_GOOGLE);
				}, parent);
			}
			else if (googleEnabled)
			{
				menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			if (editorUi.dropbox != null)
			{
				menu.addItem(mxResources.get('dropbox') + '...', null, function()
				{
					editorUi.showLibraryDialog(null, null, null, null, App.MODE_DROPBOX);
				}, parent);
			}
			else if (dropboxEnabled)
			{
				menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			if (editorUi.oneDrive != null)
			{
				menu.addItem(mxResources.get('oneDrive') + '...', null, function()
				{
					editorUi.showLibraryDialog(null, null, null, null, App.MODE_ONEDRIVE);
				}, parent);
			}
			else if (oneDriveEnabled)
			{
				menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			menu.addSeparator(parent);

			if (isLocalStorage && urlParams['browser'] != '0')
			{
				menu.addItem(mxResources.get('browser') + '...', null, function()
				{
					editorUi.showLibraryDialog(null, null, null, null, App.MODE_BROWSER);
				}, parent);
			}
			
			if (!mxClient.IS_IOS)
			{
				menu.addItem(mxResources.get('device') + '...', null, function()
				{
					editorUi.showLibraryDialog(null, null, null, null, App.MODE_DEVICE);
				}, parent);
			}
		}));
		
		this.put('openLibraryFrom', new Menu(function(menu, parent)
		{
			if (editorUi.drive != null)
			{
				menu.addItem(mxResources.get('googleDrive') + '...', null, function()
				{
					editorUi.pickLibrary(App.MODE_GOOGLE);
				}, parent);
			}
			else if (googleEnabled)
			{
				menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			if (editorUi.dropbox != null)
			{
				menu.addItem(mxResources.get('dropbox') + '...', null, function()
				{
					editorUi.pickLibrary(App.MODE_DROPBOX);
				}, parent);
			}
			else if (dropboxEnabled)
			{
				menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			if (editorUi.oneDrive != null)
			{
				menu.addItem(mxResources.get('oneDrive') + '...', null, function()
				{
					editorUi.pickLibrary(App.MODE_ONEDRIVE);
				}, parent);
			}
			else if (oneDriveEnabled)
			{
				menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			menu.addSeparator(parent);

			if (isLocalStorage && urlParams['browser'] != '0')
			{
				menu.addItem(mxResources.get('browser') + '...', null, function()
				{
					editorUi.pickLibrary(App.MODE_BROWSER);
				}, parent);
			}
			
			if (!mxClient.IS_IOS)
			{
				menu.addItem(mxResources.get('device') + '...', null, function()
				{
					editorUi.pickLibrary(App.MODE_DEVICE);
				}, parent);
			}

			if (!editorUi.isOffline())
			{
				menu.addSeparator(parent);
				
				menu.addItem(mxResources.get('url') + '...', null, function()
				{
					var dlg = new FilenameDialog(editorUi, '', mxResources.get('open'), function(fileUrl)
					{
						if (fileUrl != null && fileUrl.length > 0 && editorUi.spinner.spin(document.body, mxResources.get('loading')))
						{
							// Uses proxy to avoid CORS issues
							mxUtils.get(PROXY_URL + '?url=' + encodeURIComponent(fileUrl), function(req)
							{
								if (req.getStatus() == 200)
								{
									editorUi.spinner.stop();
									
									try
									{
										editorUi.loadLibrary(new UrlLibrary(this, req.getText(), fileUrl));
									}
									catch (e)
									{
										editorUi.handleError(e, mxResources.get('errorLoadingFile'));
									}
								}
								else
								{
									editorUi.spinner.stop();
									editorUi.handleError(null, mxResources.get('errorLoadingFile'));
								}
							}, function()
							{
								editorUi.spinner.stop();
								editorUi.handleError(null, mxResources.get('errorLoadingFile'));
							});
						}
					}, mxResources.get('url'));
					editorUi.showDialog(dlg.container, 300, 80, true, true);
					dlg.init();
				}, parent);
			}
		}));
		
		// Overrides edit menu to add find
		this.put('edit', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['undo', 'redo', '-', 'cut', 'copy', 'paste', 'delete', '-', 'duplicate', '-',
									 'find', '-',
			                         'editData', 'editTooltip', 'editStyle', '-', 'edit', '-', 'editLink', 'openLink', '-',
			                         'selectVertices', 'selectEdges', 'selectAll', 'selectNone', '-', 'lockUnlock']);
		})));
		
		// Overrides view menu to add search and scratchpad
		this.put('view', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ((this.editorUi.format != null) ? ['formatPanel'] : []).
				concat(['outline', 'layers', '-']));
			this.addMenuItems(menu, ['-', 'search'], parent);
			
			if (isLocalStorage || mxClient.IS_CHROMEAPP)
			{
				var item = this.addMenuItem(menu, 'scratchpad', parent);
				
				if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP)
				{
					this.addLinkToItem(item, 'https://desk.draw.io/solution/articles/16000042367-how-to-use-the-scratchpad-');
				}
			}
			
			this.addMenuItems(menu, ['shapes', '-', 'pageView', 'pageScale', '-',
			                         'scrollbars', 'tooltips', '-',
			                         'grid', 'guides'], parent);
			
			if (mxClient.IS_SVG && (document.documentMode == null || document.documentMode > 9))
			{
				this.addMenuItem(menu, 'shadowVisible', parent);
			}
			
			this.addMenuItems(menu, ['-', 'connectionArrows', 'connectionPoints', '-',
			                         'resetView', 'zoomIn', 'zoomOut'], parent);
		})));
		
		this.put('extras', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (urlParams['embed'] != '1')
			{
				this.addSubmenu('theme', menu, parent);
				menu.addSeparator(parent);
			}

			this.addMenuItems(menu, ['copyConnect', 'collapseExpand', '-'], parent);

			if (typeof(MathJax) !== 'undefined')
			{
				var item = this.addMenuItem(menu, 'mathematicalTypesetting', parent);
				this.addLinkToItem(item, 'https://desk.draw.io/solution/articles/16000032875-how-to-use-mathematical-typesetting-');
			}

			this.addMenuItems(menu, ['autosave', '-', 'createShape', 'editDiagram'], parent);

			menu.addSeparator(parent);
			
			if (urlParams['embed'] != '1' && isLocalStorage)
			{
				this.addMenuItems(menu, ['showStartScreen'], parent);
			}

			if (!editorUi.isOfflineApp() && urlParams['embed'] != '1')
			{
				this.addMenuItems(menu, ['plugins', '-'], parent);
				
				var item = this.addMenuItem(menu, 'tags', parent);
				
				if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP)
				{
					this.addLinkToItem(item, 'https://desk.draw.io/solution/articles/16000046966-how-to-use-tags');
				}
				
				this.addMenuItems(menu, ['-', 'offline'], parent);
			}
			else
			{
				menu.addSeparator(parent);
			}
			
			if (!editorUi.isOffline() && !navigator.standalone && urlParams['embed'] != '1')
			{
				this.addMenuItems(menu, ['chromeApp'], parent);
			}
		})));

		this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (urlParams['embed'] == '1')
			{
				this.addSubmenu('importFrom', menu, parent);
				this.addSubmenu('exportAs', menu, parent);
				this.addSubmenu('embed', menu, parent);

				if (urlParams['libraries'] == '1')
				{
					this.addMenuItems(menu, ['-'], parent);
					this.addSubmenu('newLibrary', menu, parent);
					this.addSubmenu('openLibraryFrom', menu, parent);
				}
				
				this.addMenuItems(menu, ['-', 'pageSetup', 'print', '-', 'save'], parent);
				
				if (urlParams['saveAndExit'] == '1')
				{
					this.addMenuItems(menu, ['saveAndExit'], parent);
				}
				
				this.addMenuItems(menu, ['exit'], parent);
			}
			else
			{
				var file = this.editorUi.getCurrentFile();
				
				if (file != null && file.constructor == DriveFile)
				{
					if (file.isRestricted())
					{
						this.addMenuItems(menu, ['exportOptionsDisabled'], parent);
					}
					
					if (file.realtime == null)
					{
						this.addMenuItems(menu, ['save', 'share', '-'], parent);
					}
					else
					{
						if (!file.isAutosave())
						{
							this.addMenuItems(menu, ['save'], parent);
						}
						
						this.addMenuItems(menu, ['share', 'chatWindowTitle', '-'], parent);
					}
				}
				else
				{
					this.addMenuItems(menu, ['new'], parent);
				}
				
				this.addSubmenu('openFrom', menu, parent);

				if (isLocalStorage)
				{
					this.addSubmenu('openRecent', menu, parent);
				}
				
				if (file != null && file.constructor == DriveFile)
				{
					this.addMenuItems(menu, ['new', '-', 'rename', 'makeCopy', 'moveToFolder'], parent);
				}
				else
				{
					this.addMenuItems(menu, ['-', 'save', 'saveAs', '-', 'rename'], parent);
					
					if (editorUi.isOfflineApp())
					{
						if (!editorUi.isOffline())
						{
							this.addMenuItems(menu, ['upload'], parent);
						}
					}
					else
					{
						this.addMenuItems(menu, ['makeCopy'], parent);
						
						if (file != null && file.constructor == OneDriveFile)
						{
							this.addMenuItems(menu, ['moveToFolder'], parent);
						}
					}
				}
				
				menu.addSeparator(parent);
				this.addSubmenu('importFrom', menu, parent);
				this.addSubmenu('exportAs', menu, parent);
				menu.addSeparator(parent);
				this.addSubmenu('embed', menu, parent);
				this.addSubmenu('publish', menu, parent);
				menu.addSeparator(parent);
				this.addSubmenu('newLibrary', menu, parent);
				this.addSubmenu('openLibraryFrom', menu, parent);
				
				if (file != null && (file.constructor == DriveFile || file.constructor == DropboxFile))
				{
					this.addMenuItems(menu, ['-', 'revisionHistory'], parent);
				}
				
				if (file != null && file.constructor == DriveFile)
				{
					this.addMenuItems(menu, ['createRevision'], parent);
				}

				this.addMenuItems(menu, ['-', 'pageSetup'], parent);
				
				// Cannot use print in standalone mode on iOS as we cannot open new windows
				if (!mxClient.IS_IOS || !navigator.standalone)
				{
					this.addMenuItems(menu, ['print'], parent);
				}
				
				this.addMenuItems(menu, ['-', 'close']);
			}
		})));
	};
})();
