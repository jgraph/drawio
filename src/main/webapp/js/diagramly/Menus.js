/**
 * Copyright (c) 2006-2020, JGraph Ltd
 * Copyright (c) 2006-2020, draw.io AG
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
	
	Menus.prototype.createHelpLink = function(href)
	{
		var link = document.createElement('span');
		link.setAttribute('title', mxResources.get('help'));
		link.style.cssText = 'color:blue;text-decoration:underline;margin-left:8px;cursor:help;';
		
		var icon = document.createElement('img');
		mxUtils.setOpacity(icon, 50);
		icon.style.height = '16px';
		icon.style.width = '16px';
		icon.setAttribute('border', '0');
		icon.setAttribute('valign', 'bottom');
		icon.setAttribute('src', Editor.helpImage);
		link.appendChild(icon);
		
		mxEvent.addGestureListeners(link, mxUtils.bind(this, function(evt)
		{
			this.editorUi.hideCurrentMenu();
			this.editorUi.openLink(href);
			mxEvent.consume(evt);
		}));
		
		return link;
	};

	Menus.prototype.addLinkToItem = function(item, href)
	{
		if (item != null)
		{
			item.firstChild.nextSibling.appendChild(this.createHelpLink(href));
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
			window.location.hostname == 'drive.draw.io' || window.location.hostname == 'app.diagrams.net') &&
			(((urlParams['embed'] != '1' && urlParams['od'] != '0') || (urlParams['embed'] == '1' && urlParams['od'] == '1')) &&
			!mxClient.IS_IOS && (navigator.userAgent.indexOf('MSIE') < 0 || document.documentMode >= 10));
		var trelloEnabled = urlParams['tr'] == '1' && mxClient.IS_SVG && (document.documentMode == null ||
			document.documentMode > 9);

		if (!mxClient.IS_SVG && !editorUi.isOffline())
		{
			var img = new Image();
			img.src = IMAGE_PATH + '/help.png';
		}
		
		if (urlParams['noFileMenu'] == '1')
		{
			this.defaultMenuItems = this.defaultMenuItems.filter(function(m)
			{
				return m != 'file';
			});
		}

		editorUi.actions.addAction('new...', function()
		{
			var compact = editorUi.isOffline();
			var dlg = new NewDialog(editorUi, compact, !(editorUi.mode == App.MODE_DEVICE && 'chooseFileSystemEntries' in window));

			editorUi.showDialog(dlg.container, (compact) ? 350 : 620, (compact) ? 70 : 440, true, true, function(cancel)
			{
				if (cancel && editorUi.getCurrentFile() == null)
				{
					editorUi.showSplash();
				}
			});
			
			dlg.init();
		});

		editorUi.actions.put('insertTemplate', new Action(mxResources.get('template') + '...', function()
		{
			var dlg = new NewDialog(editorUi, null, false, function(xml)
			{
				editorUi.hideDialog();
				
				if (xml != null)
				{
					var insertPoint = editorUi.editor.graph.getFreeInsertPoint();
					graph.setSelectionCells(editorUi.importXml(xml,
						Math.max(insertPoint.x, 20),
						Math.max(insertPoint.y, 20),
						true, null, null, true));
					graph.scrollCellToVisible(graph.getSelectionCell());
				}
			}, null, null, null, null, null, null, null, null, null, null,
				false, mxResources.get('insert'));

			editorUi.showDialog(dlg.container, 620, 440, true, true);
		})).isEnabled = isGraphEnabled;
		
		var pointAction = editorUi.actions.addAction('points', function()
		{
			editorUi.editor.graph.view.setUnit(mxConstants.POINTS);
		});
		
		pointAction.setToggleAction(true);
		pointAction.setSelectedCallback(function() { return editorUi.editor.graph.view.unit == mxConstants.POINTS; });
		
		var inchAction = editorUi.actions.addAction('inches', function()
		{
			editorUi.editor.graph.view.setUnit(mxConstants.INCHES);
		});
		
		inchAction.setToggleAction(true);
		inchAction.setSelectedCallback(function() { return editorUi.editor.graph.view.unit == mxConstants.INCHES; });
		
		var mmAction = editorUi.actions.addAction('millimeters', function()
		{
			editorUi.editor.graph.view.setUnit(mxConstants.MILLIMETERS);
		});
		
		mmAction.setToggleAction(true);
		mmAction.setSelectedCallback(function() { return editorUi.editor.graph.view.unit == mxConstants.MILLIMETERS; });

		this.put('units', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['points', /*'inches',*/ 'millimeters'], parent);
		})));
		
		var rulerAction = editorUi.actions.addAction('ruler', function()
		{
			mxSettings.setRulerOn(!mxSettings.isRulerOn());
			mxSettings.save();
			
			if (editorUi.ruler != null)
			{
				editorUi.ruler.destroy();
				editorUi.ruler = null;
				editorUi.refresh();
			}
			else
			{
				editorUi.ruler = new mxDualRuler(editorUi, editorUi.editor.graph.view.unit);
				editorUi.refresh();
			}
		});
		rulerAction.setEnabled(editorUi.canvasSupported && document.documentMode != 9);
		rulerAction.setToggleAction(true);
		rulerAction.setSelectedCallback(function() { return editorUi.ruler != null; });
		
        var fullscreenAction = editorUi.actions.addAction('fullscreen', function()
		{
			if (document.fullscreenElement == null)
			{
				document.body.requestFullscreen();
			}
			else
			{
				document.exitFullscreen();
			}
		});
		fullscreenAction.visible = document.fullscreenEnabled && document.body.requestFullscreen != null;
		fullscreenAction.setToggleAction(true);
		fullscreenAction.setSelectedCallback(function() { return document.fullscreenElement != null; });
		
		editorUi.actions.addAction('properties...', function()
		{
			var dlg = new FilePropertiesDialog(editorUi);
			editorUi.showDialog(dlg.container, 320, 120, true, true);
			dlg.init();
		}).isEnabled = isGraphEnabled;
	
		if (window.mxFreehand)
		{
			editorUi.actions.put('insertFreehand', new Action(mxResources.get('freehand') + '...', function(evt)
			{
				if (graph.isEnabled())
				{
					if (this.freehandWindow == null)
					{
						this.freehandWindow = new FreehandWindow(editorUi, document.body.offsetWidth - 420, 102, 176, 104);
					}
					
					if (graph.freehand.isDrawing())
					{
						graph.freehand.stopDrawing();
					}
					else
					{
						graph.freehand.startDrawing();
					}
					
					this.freehandWindow.window.setVisible(graph.freehand.isDrawing());
				}
			})).isEnabled = function()
			{
				return isGraphEnabled() && mxClient.IS_SVG;
			};
		}
		
		editorUi.actions.put('exportXml', new Action(mxResources.get('formatXml') + '...', function()
		{
			var div = document.createElement('div');
			div.style.whiteSpace = 'nowrap';
			var noPages = editorUi.pages == null || editorUi.pages.length <= 1;
			
			var hd = document.createElement('h3');
			mxUtils.write(hd, mxResources.get('formatXml'));
			hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:4px';
			div.appendChild(hd);
			
			var selection = editorUi.addCheckbox(div, mxResources.get('selectionOnly'),
				false, graph.isSelectionEmpty());
			var compressed = editorUi.addCheckbox(div, mxResources.get('compressed'), true);
			var pages = editorUi.addCheckbox(div, mxResources.get('allPages'), !noPages, noPages);
			pages.style.marginBottom = '16px';
			
			mxEvent.addListener(selection, 'change', function()
			{
				if (selection.checked)
				{
					pages.setAttribute('disabled', 'disabled');
				}
				else
				{
					pages.removeAttribute('disabled');
				}
			});
			
			var dlg = new CustomDialog(editorUi, div, mxUtils.bind(this, function()
			{
				editorUi.downloadFile('xml', !compressed.checked, null,
					!selection.checked, noPages || !pages.checked);
			}), null, mxResources.get('export'));
			
			editorUi.showDialog(dlg.container, 300, 180, true, true);
		}));
		
		editorUi.actions.put('exportUrl', new Action(mxResources.get('url') + '...', function()
		{
			editorUi.showPublishLinkDialog(mxResources.get('url'), true, null, null,
				function(linkTarget, linkColor, allPages, lightbox, editLink, layers)
			{
				var dlg = new EmbedDialog(editorUi, editorUi.createLink(linkTarget,
					linkColor, allPages, lightbox, editLink, layers, null, true));
				editorUi.showDialog(dlg.container, 440, 240, true, true);
				dlg.init();
			});
		}));
		
		editorUi.actions.put('exportHtml', new Action(mxResources.get('formatHtmlEmbedded') + '...', function()
		{
			if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
			{
				editorUi.getPublicUrl(editorUi.getCurrentFile(), function(url)
				{
					editorUi.spinner.stop();
					
					editorUi.showHtmlDialog(mxResources.get('export'), null, url, function(publicUrl, zoomEnabled,
						initialZoom, linkTarget, linkColor, fit, allPages, layers, lightbox, editLink)
					{
						editorUi.createHtml(publicUrl, zoomEnabled, initialZoom, linkTarget, linkColor,
							fit, allPages, layers, lightbox, editLink, mxUtils.bind(this, function(html, scriptTag)
							{
								var basename = editorUi.getBaseFilename(allPages);
								var result = '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->\n' +
									'<!DOCTYPE html>\n<html>\n<head>\n<title>' + mxUtils.htmlEntities(basename) + '</title>\n' +
									'<meta charset="utf-8"/>\n</head>\n<body>' + html + '\n' + scriptTag + '\n</body>\n</html>';
								editorUi.saveData(basename + '.html', 'html', result, 'text/html');
							}));
					});
				});
			}
		}));
		
		editorUi.actions.put('exportPdf', new Action(mxResources.get('formatPdf') + '...', function()
		{
			if (!EditorUi.isElectronApp && (editorUi.isOffline() || editorUi.printPdfExport))
			{
				// Export PDF action for chrome OS (same as print with different dialog title)
				editorUi.showDialog(new PrintDialog(editorUi, mxResources.get('formatPdf')).container, 360,
						(editorUi.pages != null && editorUi.pages.length > 1 && (editorUi.editor.editable ||
						urlParams['hide-pages'] != '1')) ?
						450 : 370, true, true);
			}
			else
			{
				var noPages = editorUi.pages == null || editorUi.pages.length <= 1;
				var div = document.createElement('div');
				div.style.whiteSpace = 'nowrap';
				
				var hd = document.createElement('h3');
				mxUtils.write(hd, mxResources.get('formatPdf'));
				hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:4px';
				div.appendChild(hd);
				
				var cropEnableFn = function()
				{
					if (allPages != this && this.checked)
					{
						crop.removeAttribute('disabled');
						crop.checked = !graph.pageVisible;
					}
					else
					{
						crop.setAttribute('disabled', 'disabled');
						crop.checked = false;
					}
				};
				
				var dlgH = 180;
				
				if (editorUi.pdfPageExport && !noPages)
				{
					var allPages = editorUi.addRadiobox(div, 'pages', mxResources.get('allPages'), true);
					var currentPage = editorUi.addRadiobox(div, 'pages', mxResources.get('currentPage'), false);
					var selection = editorUi.addRadiobox(div, 'pages', mxResources.get('selectionOnly'), false, graph.isSelectionEmpty());
					var crop = editorUi.addCheckbox(div, mxResources.get('crop'), false, true);
					var grid = editorUi.addCheckbox(div, mxResources.get('grid'), false, false);
					
					mxEvent.addListener(allPages, 'change', cropEnableFn);
					mxEvent.addListener(currentPage, 'change', cropEnableFn);
					mxEvent.addListener(selection, 'change', cropEnableFn);
					dlgH += 60;
				}
				else
				{
					var selection = editorUi.addCheckbox(div, mxResources.get('selectionOnly'),
							false, graph.isSelectionEmpty());
					var crop = editorUi.addCheckbox(div, mxResources.get('crop'),
							!graph.pageVisible || !editorUi.pdfPageExport,
							!editorUi.pdfPageExport);
					var grid = editorUi.addCheckbox(div, mxResources.get('grid'), false, false);
					
					// Crop is only enabled if selection only is selected
					if (!editorUi.pdfPageExport)
					{
						mxEvent.addListener(selection, 'change', cropEnableFn);	
					}
				}
				
				var isDrawioWeb = !mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp &&
					editorUi.getServiceName() == 'draw.io';

				var transparentBkg = null, include = null;
					
				if (EditorUi.isElectronApp || isDrawioWeb)
				{
					include = editorUi.addCheckbox(div,
							mxResources.get('includeCopyOfMyDiagram'), true);
					dlgH += 30;
				}
				
				if (isDrawioWeb)
				{
					transparentBkg = editorUi.addCheckbox(div,
							mxResources.get('transparentBackground'), false);
					
					dlgH += 30;
				}
				
				var dlg = new CustomDialog(editorUi, div, mxUtils.bind(this, function()
				{
					editorUi.downloadFile('pdf', null, null, !selection.checked,
						noPages? true : !allPages.checked, !crop.checked, transparentBkg != null && transparentBkg.checked, null,
						null, grid.checked, include != null && include.checked);
				}), null, mxResources.get('export'));
				editorUi.showDialog(dlg.container, 300, dlgH, true, true);
			}
		}));
		
		editorUi.actions.addAction('open...', function()
		{
			editorUi.pickFile();
		});
		
		editorUi.actions.addAction('close', function()
		{
			var currentFile = editorUi.getCurrentFile();
			
			function fn()
			{
				if (currentFile != null)
				{
					currentFile.removeDraft();
				}
				
				editorUi.fileLoaded(null);
			};
			
			if (currentFile != null && currentFile.isModified())
			{
				editorUi.confirm(mxResources.get('allChangesLost'), null, fn,
					mxResources.get('cancel'), mxResources.get('discardChanges'));
			}
			else
			{
				fn();
			}
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
			if (!editorUi.isRevisionHistorySupported())
			{
				editorUi.showError(mxResources.get('error'), mxResources.get('notAvailable'), mxResources.get('ok'));
			}
			else if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
			{
				editorUi.getRevisions(mxUtils.bind(this, function(revs, restoreFn)
				{
					editorUi.spinner.stop();
					var dlg = new RevisionDialog(editorUi, revs, restoreFn);
					editorUi.showDialog(dlg.container, 640, 480, true, true);
					dlg.init();
				}), mxUtils.bind(this, function(err)
				{
					editorUi.handleError(err);
				}));
			}
		});
		
		editorUi.actions.addAction('createRevision', function()
		{
			editorUi.actions.get('save').funct();
		}, null, null, Editor.ctrlKey + '+S');
		
		var action = editorUi.actions.addAction('synchronize', function()
		{
			editorUi.synchronizeCurrentFile(DrawioFile.SYNC == 'none');
		}, null, null, 'Alt+Shift+S');
		
		// Changes the label if synchronization is disabled
		if (DrawioFile.SYNC == 'none')
		{
			action.label = mxResources.get('refresh');
		}
		
		editorUi.actions.addAction('upload...', function()
		{
			var file = editorUi.getCurrentFile();
			
			if (file != null)
			{
				// Data is pulled from global variable after tab loads
				// LATER: Change to use message passing to deal with potential cross-domain
				window.drawdata = editorUi.getFileData();
				var filename = (file.getTitle() != null) ? file.getTitle() : editorUi.defaultFilename;
				editorUi.openLink(window.location.protocol + '//' + window.location.host + '/?create=drawdata&' +
						((editorUi.mode == App.MODE_DROPBOX) ? 'mode=dropbox&' : '') +
						'title=' + encodeURIComponent(filename), null, true);
			}
		});

		if (typeof(MathJax) !== 'undefined')
		{
			var action = editorUi.actions.addAction('mathematicalTypesetting', function()
			{
				var change = new ChangePageSetup(editorUi);
				change.ignoreColor = true;
				change.ignoreImage = true;
				change.mathEnabled = !editorUi.isMathEnabled();
				
				graph.model.execute(change);
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
				editorUi.showDialog(dlg.container, 200, 270, true, true);
				dlg.init();
			}
		}, null, null, Editor.ctrlKey + '+Shift+M');

		var currentStyle = null;
		
		editorUi.actions.addAction('copyStyle', function()
		{
			if (graph.isEnabled() && !graph.isSelectionEmpty())
			{
				currentStyle = graph.copyStyle(graph.getSelectionCell())
			}
		}, null, null, Editor.ctrlKey + '+Shift+C');

		editorUi.actions.addAction('pasteStyle', function()
		{
			if (graph.isEnabled() && !graph.isSelectionEmpty() && currentStyle != null)
			{
				graph.pasteStyle(currentStyle, graph.getSelectionCells())
			}
		}, null, null, Editor.ctrlKey + '+Shift+V');
		
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

		editorUi.actions.put('exportSvg', new Action(mxResources.get('formatSvg') + '...', function()
		{
			editorUi.showExportDialog(mxResources.get('formatSvg'), true, mxResources.get('export'),
				'https://www.diagrams.net/doc/faq/export-diagram',
				mxUtils.bind(this, function(scale, transparentBackground, ignoreSelection, addShadow, editable,
					embedImages, border, cropImage, currentPage, linkTarget, grid, keepTheme, exportType)
				{
					var val = parseInt(scale);
					
					if (!isNaN(val) && val > 0)
					{
						editorUi.exportSvg(val / 100, transparentBackground, ignoreSelection,
							addShadow, editable, embedImages, border, !cropImage, false,
							linkTarget, keepTheme, exportType);
					}
				}), true, null, 'svg', true);
		}));
		
		editorUi.actions.put('exportPng', new Action(mxResources.get('formatPng') + '...', function()
		{
			if (editorUi.isExportToCanvas())
			{
				editorUi.showExportDialog(mxResources.get('image'), false, mxResources.get('export'),
					'https://www.diagrams.net/doc/faq/export-diagram',
					mxUtils.bind(this, function(scale, transparentBackground, ignoreSelection, addShadow, editable,
						embedImages, border, cropImage, currentPage, dummy, grid, keepTheme, exportType)
					{
						var val = parseInt(scale);
						
						if (!isNaN(val) && val > 0)
						{
							editorUi.exportImage(val / 100, transparentBackground, ignoreSelection,
								addShadow, editable, border, !cropImage, false, null, grid, null,
								keepTheme, exportType);
						}
					}), true, true, 'png', true);
			}
			else if (!editorUi.isOffline() && (!mxClient.IS_IOS || !navigator.standalone))
			{
				editorUi.showRemoteExportDialog(mxResources.get('export'), null, mxUtils.bind(this, function(ignoreSelection, editable, transparent, scale, border)
				{
					editorUi.downloadFile((editable) ? 'xmlpng' : 'png', null, null, ignoreSelection, null, null, transparent, scale, border);
				}), false, true);
			}
		}));
		
		editorUi.actions.put('exportJpg', new Action(mxResources.get('formatJpg') + '...', function()
		{
			if (editorUi.isExportToCanvas())
			{
				editorUi.showExportDialog(mxResources.get('image'), false, mxResources.get('export'),
					'https://www.diagrams.net/doc/faq/export-diagram',
					mxUtils.bind(this, function(scale, transparentBackground, ignoreSelection, addShadow, editable,
						embedImages, border, cropImage, currentPage, dummy, grid, keepTheme, exportType)
					{
						var val = parseInt(scale);
						
						if (!isNaN(val) && val > 0)
						{
							editorUi.exportImage(val / 100, false, ignoreSelection,
								addShadow, false, border, !cropImage, false, 'jpeg',
								grid, null, keepTheme, exportType);
						}
					}), true, false, 'jpeg', true);
			}
			else if (!editorUi.isOffline() && (!mxClient.IS_IOS || !navigator.standalone))
			{
				editorUi.showRemoteExportDialog(mxResources.get('export'), null, mxUtils.bind(this, function(ignoreSelection, editable, tranaparent, scale, border)
				{
					editorUi.downloadFile('jpeg', null, null, ignoreSelection, null, null, null, scale, border);
				}), true, true);
			}
		}));

		action = editorUi.actions.addAction('copyAsImage', mxUtils.bind(this, function()
		{
			var cells = mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells()));
			var xml = mxUtils.getXml((cells.length == 0) ? editorUi.editor.getGraphXml() : graph.encodeCells(cells));
			editorUi.copyImage(cells, xml);
		}));

		// Disabled in Safari as operation is not allowed
		action.visible = Editor.enableNativeCipboard && editorUi.isExportToCanvas() && !mxClient.IS_SF;
		
		action = editorUi.actions.put('shadowVisible', new Action(mxResources.get('shadow'), function()
		{
			graph.setShadowVisible(!graph.shadowVisible);
		}));
		action.setToggleAction(true);
		action.setSelectedCallback(function() { return graph.shadowVisible; });

		editorUi.actions.put('about', new Action(mxResources.get('about') + ' ' + EditorUi.VERSION + '...', function()
		{
			if (editorUi.isOffline() || mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
			{
				editorUi.alert(editorUi.editor.appName + ' ' + EditorUi.VERSION);
			}
			else
			{
				editorUi.openLink('https://www.diagrams.net/');
			}
		}));
		
		editorUi.actions.addAction('support...', function()
		{
			if (EditorUi.isElectronApp)
			{
				editorUi.openLink('https://github.com/jgraph/drawio-desktop/wiki/Getting-Support');
			}
			else
			{
				editorUi.openLink('https://github.com/jgraph/drawio/wiki/Getting-Support');
			}
		});

		editorUi.actions.addAction('exportOptionsDisabled...', function()
		{
			editorUi.handleError({message: mxResources.get('exportOptionsDisabledDetails')},
				mxResources.get('exportOptionsDisabled'));
		});

		editorUi.actions.addAction('keyboardShortcuts...', function()
		{
			if (mxClient.IS_SVG && !mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp)
			{
				editorUi.openLink('shortcuts.svg');
			}
			else
			{
				editorUi.openLink('https://viewer.diagrams.net/#Uhttps%3A%2F%2Fviewer.diagrams.net%2Fshortcuts.svg');
			}
		});

		editorUi.actions.addAction('feedback...', function()
		{
			var dlg = new FeedbackDialog(editorUi);
			editorUi.showDialog(dlg.container, 610, 360, true, false);
			dlg.init();
		});

		editorUi.actions.addAction('quickStart...', function()
		{
			editorUi.openLink('https://www.youtube.com/watch?v=Z0D96ZikMkc');
		});
		
		editorUi.actions.addAction('forkme', function()
		{
			if (EditorUi.isElectronApp)
			{
				editorUi.openLink('https://github.com/jgraph/drawio-desktop');
			}
			else
			{
				editorUi.openLink('https://github.com/jgraph/drawio');
			}
		}).label = 'Fork me on GitHub...';
		
		editorUi.actions.addAction('downloadDesktop...', function()
		{
			editorUi.openLink('https://get.diagrams.net/');
		});
		
		action = editorUi.actions.addAction('tags...', mxUtils.bind(this, function()
		{
			if (this.tagsWindow == null)
			{
				this.tagsWindow = new TagsWindow(editorUi, document.body.offsetWidth - 380, 230, 300, 120);
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

		action = editorUi.actions.addAction('findReplace...', mxUtils.bind(this, function(arg1, evt)
		{
			var findReplace = graph.isEnabled() && (evt == null || !mxEvent.isShiftDown(evt));
			var evtName = (findReplace) ? 'findReplace' : 'find';
			var name = evtName + 'Window';
			
			if (this[name] == null)
			{
				var w = (findReplace) ? ((uiTheme == 'min') ? 330 : 300) : 240;
				var h = (findReplace) ? ((uiTheme == 'min') ? 304 : 288) : 170;
				this[name] = new FindWindow(editorUi,
					document.body.offsetWidth - (w + 20),
					100, w, h, findReplace);
				this[name].window.addListener('show', function()
				{
					editorUi.fireEvent(new mxEventObject(evtName));
				});
				this[name].window.addListener('hide', function()
				{
					editorUi.fireEvent(new mxEventObject(evtName));
				});
				this[name].window.setVisible(true);
			}
			else
			{
				this[name].window.setVisible(!this[name].window.isVisible());
			}
		}), null, null, Editor.ctrlKey + '+F');
		action.setToggleAction(true);
		action.setSelectedCallback(mxUtils.bind(this, function()
		{
			var name = (graph.isEnabled()) ? 'findReplaceWindow' : 'findWindow';
			
			return this[name] != null && this[name].window.isVisible();
		}));
		
		editorUi.actions.put('exportVsdx', new Action(mxResources.get('formatVsdx') + ' (beta)...', function()
		{
			var noPages = editorUi.pages == null || editorUi.pages.length <= 1;
			
			if (noPages)
			{
				editorUi.exportVisio();
			}
			else
			{
				var div = document.createElement('div');
				div.style.whiteSpace = 'nowrap';

				var hd = document.createElement('h3');
				mxUtils.write(hd, mxResources.get('formatVsdx'));
				hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:4px';
				div.appendChild(hd);
				
				var pages = editorUi.addCheckbox(div, mxResources.get('allPages'), !noPages, noPages);
				pages.style.marginBottom = '16px';
				
				var dlg = new CustomDialog(editorUi, div, mxUtils.bind(this, function()
				{
					editorUi.exportVisio(!pages.checked);
				}), null, mxResources.get('export'));
				
				editorUi.showDialog(dlg.container, 300, 110, true, true);
			}
		}));
		
		if (isLocalStorage && localStorage != null && urlParams['embed'] != '1')
		{
			editorUi.actions.addAction('configuration...', function()
			{
				// Add help, link button
				var value = localStorage.getItem(Editor.configurationKey);
				
				var buttons = [[mxResources.get('reset'), function(evt, input)
				{
					editorUi.confirm(mxResources.get('areYouSure'), function()
					{
						try
						{
							localStorage.removeItem(Editor.configurationKey);
							
							if (mxEvent.isShiftDown(evt))
							{
								localStorage.removeItem('.drawio-config');
								localStorage.removeItem('.mode');
							}
							
							editorUi.hideDialog();
							editorUi.alert(mxResources.get('restartForChangeRequired'));
						}
						catch (e)
						{
							editorUi.handleError(e);
						}
					});
				}]];
				
				if (!EditorUi.isElectronApp)
				{
					buttons.push([mxResources.get('share'), function(evt, input)
					{
						if (input.value.length > 0)
						{
							try
							{
								var obj = JSON.parse(input.value);
								var url = window.location.protocol + '//' + window.location.host +
									'/' + editorUi.getSearch() + '#_CONFIG_' +
									Graph.compress(JSON.stringify(obj));
								var dlg = new EmbedDialog(editorUi, url);
								editorUi.showDialog(dlg.container, 440, 240, true);
								dlg.init();
							}
							catch (e)
							{
								editorUi.handleError(e);	
							}
						}
						else
						{
							editorUi.handleError({message: mxResources.get('invalidInput')});
						}
					}])
				}

		    	var dlg = new TextareaDialog(editorUi, mxResources.get('configuration') + ':',
		    		(value != null) ? JSON.stringify(JSON.parse(value), null, 2) : '', function(newValue)
				{
					if (newValue != null)
					{
						try
						{
							if (newValue.length > 0)
							{
								var obj = JSON.parse(newValue);
								
								localStorage.setItem(Editor.configurationKey, JSON.stringify(obj));
							}
							else
							{
								localStorage.removeItem(Editor.configurationKey);
							}

							editorUi.hideDialog();
							editorUi.alert(mxResources.get('restartForChangeRequired'));
						}
						catch (e)
						{
							editorUi.handleError(e);	
						}
					}
				}, null, null, null, null, null, true, null, null,
					'https://www.diagrams.net/doc/faq/configure-diagram-editor',
					buttons);
		    	
		    	dlg.textarea.style.width = '600px';
		    	dlg.textarea.style.height = '380px';
				editorUi.showDialog(dlg.container, 620, 460, true, false);
				dlg.init();
			});
		}
		
		// Adds language menu to options only if localStorage is available for
		// storing the choice. We do not want to use cookies for older browsers.
		// Note that the URL param lang=XX is available for setting the language
		// in older browsers. URL param has precedence over the saved setting.
		if (mxClient.IS_CHROMEAPP || isLocalStorage)
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
			var menusCreateMenuBar = Menus.prototype.createMenubar;
			Menus.prototype.createMenubar = function(container)
			{
				var menubar = menusCreateMenuBar.apply(this, arguments);
				
				if (menubar != null && urlParams['noLangIcon'] != '1')
				{
					var langMenu = this.get('language');
					
					if (langMenu != null)
					{
						var elt = menubar.addMenu('', langMenu.funct);
						elt.setAttribute('title', mxResources.get('language'));
						elt.style.width = '16px';
						elt.style.paddingTop = '2px';
						elt.style.paddingLeft = '4px';
						elt.style.zIndex = '1';
						elt.style.position = 'absolute';
						elt.style.display = 'block';
						elt.style.cursor = 'pointer';
						elt.style.right = '17px';
						
						if (uiTheme == 'atlas')
						{
							elt.style.top = '6px';
							elt.style.right = '15px';
						}
						else if (uiTheme == 'min')
						{
							elt.style.top = '2px';
						}
						else
						{
							elt.style.top = '0px';
						}

						var icon = document.createElement('div');
						icon.style.backgroundImage = 'url(' + Editor.globeImage + ')';
						icon.style.backgroundPosition = 'center center';
						icon.style.backgroundRepeat = 'no-repeat';
						icon.style.backgroundSize = '19px 19px';
						icon.style.position = 'absolute';
						icon.style.height = '19px';
						icon.style.width = '19px';
						icon.style.marginTop = '2px';
						icon.style.zIndex = '1';
						elt.appendChild(icon);
						mxUtils.setOpacity(elt, 40);
						
						if (uiTheme == 'atlas' || uiTheme == 'dark')
						{
							elt.style.opacity = '0.85';
							elt.style.filter = 'invert(100%)';
						}

						document.body.appendChild(elt);
					}
				}

				return menubar;
			};
		}
		
		editorUi.customLayoutConfig = [{'layout': 'mxHierarchicalLayout',
			'config':
			{'orientation': 'west',
			'intraCellSpacing': 30,
			'interRankCellSpacing': 100,
			'interHierarchySpacing': 60,
			'parallelEdgeSpacing': 10}}];
		
		// Adds action
		editorUi.actions.addAction('runLayout', function()
		{
	    	var dlg = new TextareaDialog(editorUi, 'Run Layouts:',
	    		JSON.stringify(editorUi.customLayoutConfig, null, 2),
	    		function(newValue)
			{
				if (newValue.length > 0)
				{
					try
					{
						var layoutList = JSON.parse(newValue);
						editorUi.executeLayoutList(layoutList)
						editorUi.customLayoutConfig = layoutList;
					}
					catch (e)
					{
						editorUi.handleError(e);
						
						if (window.console != null)
						{
							console.error(e);
						}
					}
				}
			}, null, null, null, null, null, true, null, null,
				'https://www.diagrams.net/doc/faq/apply-layouts');
	    	
	    	dlg.textarea.style.width = '600px';
	    	dlg.textarea.style.height = '380px';
			editorUi.showDialog(dlg.container, 620, 460, true, true);
			dlg.init();
		});
		
		var layoutMenu = this.get('layout');
		var layoutMenuFunct = layoutMenu.funct;
		
		layoutMenu.funct = function(menu, parent)
		{
			layoutMenuFunct.apply(this, arguments);

			menu.addItem(mxResources.get('orgChart'), null, function()
			{
				var branchOptimizer = null, parentChildSpacingVal = 20, siblingSpacingVal = 20, notExecuted = true;
				
				// Invoked when orgchart code was loaded
				var delayed = function()
				{
					editorUi.loadingOrgChart = false;
					editorUi.spinner.stop();
					
					if (typeof mxOrgChartLayout !== 'undefined' && branchOptimizer != null && notExecuted)
					{
						var graph = editorUi.editor.graph;
						var orgChartLayout = new mxOrgChartLayout(graph, branchOptimizer, parentChildSpacingVal, siblingSpacingVal);
						
						var cell = graph.getDefaultParent();
						
						if (graph.model.getChildCount(graph.getSelectionCell()) > 1)
						{
							cell = graph.getSelectionCell();
						}
						
						orgChartLayout.execute(cell);
						notExecuted = false;
					}
				};
				
				// Invoked from dialog
				function doLayout()
				{
					if (typeof mxOrgChartLayout === 'undefined' && !editorUi.loadingOrgChart && !editorUi.isOffline(true))
					{
						if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
						{
							editorUi.loadingOrgChart = true;
							
							if (urlParams['dev'] == '1')
							{
								mxscript('js/orgchart/bridge.min.js', function()
								{
									mxscript('js/orgchart/bridge.collections.min.js', function()
									{
										mxscript('js/orgchart/OrgChart.Layout.min.js', function()
										{
											mxscript('js/orgchart/mxOrgChartLayout.js', delayed);											
										});		
									});	
								});
							}
							else
							{
								mxscript('js/extensions.min.js', delayed);
							}
						}
					}
					else
					{
						delayed();
					}
				};

				var div = document.createElement('div');
				
				var title = document.createElement('div');
				title.style.marginTop = '6px';
				title.style.display = 'inline-block';
				title.style.width = '140px';
				mxUtils.write(title, mxResources.get('orgChartType') + ': ');
				
				div.appendChild(title);
				
				var typeSelect = document.createElement('select');
				typeSelect.style.width = '200px';
				typeSelect.style.boxSizing = 'border-box';
				
				//Types are hardcoded here since the code is not loaded yet
				var typesArr = [mxResources.get('linear'),
					mxResources.get('hanger2'),
					mxResources.get('hanger4'),
					mxResources.get('fishbone1'),
					mxResources.get('fishbone2'),
					mxResources.get('1ColumnLeft'),
					mxResources.get('1ColumnRight'),
					mxResources.get('smart')
				];
				
				for (var i = 0; i < typesArr.length; i++)
				{
					var option = document.createElement('option');
					mxUtils.write(option, typesArr[i]);
					option.value = i;
					
					if (i == 2)
					{
						option.setAttribute('selected', 'selected');
					}
					
					typeSelect.appendChild(option);
				}
					
				mxEvent.addListener(typeSelect, 'change', function()
				{
					branchOptimizer = typeSelect.value;
				});
				
				div.appendChild(typeSelect);
				
				title = document.createElement('div');
				title.style.marginTop = '6px';
				title.style.display = 'inline-block';
				title.style.width = '140px';
				mxUtils.write(title, mxResources.get('parentChildSpacing') + ': ');
				div.appendChild(title);
				
				var parentChildSpacing = document.createElement('input');
				parentChildSpacing.type = 'number';
				parentChildSpacing.value = parentChildSpacingVal;
				parentChildSpacing.style.width = '200px';
				parentChildSpacing.style.boxSizing = 'border-box';
				div.appendChild(parentChildSpacing);
				
				mxEvent.addListener(parentChildSpacing, 'change', function()
				{
					parentChildSpacingVal = parentChildSpacing.value;
				});
				
				title = document.createElement('div');
				title.style.marginTop = '6px';
				title.style.display = 'inline-block';
				title.style.width = '140px';
				mxUtils.write(title, mxResources.get('siblingSpacing') + ': ');
				div.appendChild(title);
				
				var siblingSpacing = document.createElement('input');
				siblingSpacing.type = 'number';
				siblingSpacing.value = siblingSpacingVal;
				siblingSpacing.style.width = '200px';
				siblingSpacing.style.boxSizing = 'border-box';
				div.appendChild(siblingSpacing);
				
				mxEvent.addListener(siblingSpacing, 'change', function()
				{
					siblingSpacingVal = siblingSpacing.value;
				});
				
				var dlg = new CustomDialog(editorUi, div, function()
				{
					if (branchOptimizer == null)
					{
						branchOptimizer = 2;
					}
					
					doLayout();
				});
				
				editorUi.showDialog(dlg.container, 355, 125, true, true);
			}, parent, null, isGraphEnabled());
						
			menu.addSeparator(parent);
		
			menu.addItem(mxResources.get('parallels'), null, mxUtils.bind(this, function()
			{
				// Keeps parallel edges apart
				var layout = new mxParallelEdgeLayout(graph);
				layout.checkOverlap = true;
				layout.spacing = 20;
				
	    		editorUi.executeLayout(function()
	    		{
	    			layout.execute(graph.getDefaultParent(), (!graph.isSelectionEmpty()) ?
	    				graph.getSelectionCells() : null);
	    		}, false);
			}), parent);
			
			menu.addSeparator(parent);
			editorUi.menus.addMenuItem(menu, 'runLayout', parent, null, null, mxResources.get('apply') + '...');
		};
		
		this.put('help', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (!mxClient.IS_CHROMEAPP && editorUi.isOffline())
			{
				this.addMenuItems(menu, ['about'], parent);
			}
			else
			{
				// No translation for menu item since help is english only
				var item = menu.addItem('Search:', null, null, parent, null, null, false);
				item.style.backgroundColor = Editor.isDarkMode() ? '#505759' : 'whiteSmoke';
				item.style.cursor = 'default';
				
				var input = document.createElement('input');
				input.setAttribute('type', 'text');
				input.setAttribute('size', '25');
				input.style.marginLeft = '8px';

				mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function(e)
				{
					var term = mxUtils.trim(input.value);
					
					if (e.keyCode == 13 && term.length > 0)
					{
						this.editorUi.openLink('https://www.google.com/search?q=site%3Adiagrams.net+inurl%3A%2Fdoc%2Ffaq%2F+' +
							encodeURIComponent(term));
						input.value = '';
						EditorUi.logEvent({category: 'SEARCH-HELP', action: 'search', label: term});
						
						window.setTimeout(mxUtils.bind(this, function()
						{
							this.editorUi.hideCurrentMenu();
						}), 0);
					}
	                else if (e.keyCode == 27)
	                {
	                    input.value = '';
	                }
				}));
				
				item.firstChild.nextSibling.appendChild(input);
				
				mxEvent.addGestureListeners(input, function(evt)
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
				
				window.setTimeout(function()
				{
					input.focus();
				}, 0);

				if (EditorUi.isElectronApp)
				{
					console.log('electron help menu');
					this.addMenuItems(menu, ['-', 'keyboardShortcuts', 'quickStart',
						'support', '-', 'forkme', '-', 'about'], parent);

				}
				else
				{
					this.addMenuItems(menu, ['-', 'keyboardShortcuts', 'quickStart',
						'support', '-', 'forkme', 'downloadDesktop', '-', 'about'], parent);
				}
			}
			
			if (urlParams['test'] == '1')
			{
				menu.addSeparator(parent);
				this.addSubmenu('testDevelop', menu, parent);
			}
		})));

		// Experimental
		mxResources.parse('diagramLanguage=Diagram Language');
		editorUi.actions.addAction('diagramLanguage...', function()
		{
			var lang = prompt('Language Code', Graph.diagramLanguage || '');
			
			if (lang != null)
			{
				Graph.diagramLanguage = (lang.length > 0) ? lang : null;
				graph.refresh();
			}
		});
		
		// Only visible in test mode
		if (urlParams['test'] == '1')
		{
			mxResources.parse('testDevelop=Develop');
			mxResources.parse('showBoundingBox=Show bounding box');
			mxResources.parse('createSidebarEntry=Create Sidebar Entry');
			mxResources.parse('testCheckFile=Check File');
			mxResources.parse('testDiff=Diff/Sync');
			mxResources.parse('testInspect=Inspect');
			mxResources.parse('testShowConsole=Show Console');
			mxResources.parse('testXmlImageExport=XML Image Export');
			mxResources.parse('testDownloadRtModel=Export RT model');
			mxResources.parse('testImportRtModel=Import RT model');

			editorUi.actions.addAction('createSidebarEntry', mxUtils.bind(this, function()
			{
				if (!graph.isSelectionEmpty())
				{
					var cells = graph.cloneCells(graph.getSelectionCells());
					var bbox = graph.getBoundingBoxFromGeometry(cells);
					cells = graph.moveCells(cells, -bbox.x, -bbox.y);
					
					editorUi.showTextDialog('Create Sidebar Entry', 'this.addDataEntry(\'tag1 tag2\', ' +
						bbox.width + ', ' + bbox.height + ', \'The Title\', \'' +
						Graph.compress(mxUtils.getXml(graph.encodeCells(cells))) + '\'),');
				}
			}));
	
			editorUi.actions.addAction('showBoundingBox', mxUtils.bind(this, function()
			{
				var b = graph.getGraphBounds();
				var tr = graph.view.translate;
				var s = graph.view.scale;
				graph.insertVertex(graph.getDefaultParent(), null, '',
					b.x / s - tr.x, b.y / s - tr.y, b.width / s, b.height / s,
					'fillColor=none;strokeColor=red;');
			}));
	
			editorUi.actions.addAction('testCheckFile', mxUtils.bind(this, function()
			{
				var xml = (editorUi.pages != null && editorUi.getCurrentFile() != null) ?
					editorUi.getCurrentFile().getAnonymizedXmlForPages(editorUi.pages) : '';

		    	var dlg = new TextareaDialog(editorUi, 'Paste Data:', xml,
		    		function(newValue)
				{
					if (newValue.length > 0)
					{
						try
						{
							if (newValue.charAt(0) != '<')
							{
								newValue = Graph.decompress(newValue);
								mxLog.debug('See console for uncompressed XML');
								console.log('xml', newValue);
							}
							
							var doc = mxUtils.parseXml(newValue);
							var pages = editorUi.getPagesForNode(doc.documentElement, 'mxGraphModel');
							
							if (pages != null && pages.length > 0)
							{
								try
								{
									var checksum = editorUi.getHashValueForPages(pages);
									mxLog.debug('Checksum: ', checksum);
								}
								catch (e)
								{
									mxLog.debug('Error: ', e.message);
								}
							}
							else
							{
								mxLog.debug('No pages found for checksum');
							}

							// Checks for duplicates
							function checkModel(node)
							{
								var pageId = node.parentNode.id;
								var all = node.childNodes;
								var allIds = {};
								var childs = {};
								var root = null;
								var dups = {};
								
								for (var i = 0; i < all.length; i++)
								{
									var el = all[i];
									
									if (el.id != null && el.id.length > 0)
									{
										if (allIds[el.id] == null)
										{
											allIds[el.id] = el.id;
											var pid = el.getAttribute('parent');
											
											if (pid == null)
											{
												if (root != null)
												{
													mxLog.debug(pageId + ': Multiple roots: ' + el.id);
												}
												else
												{
													root = el.id;
												}
											}
											else
											{
												if (childs[pid] == null)
												{
													childs[pid] = [];
												}
												
												childs[pid].push(el.id);
											}
										}
										else
										{
											dups[el.id] = el.id;
										}
									}
								}
								
								if (Object.keys(dups).length > 0)
								{
									var log = pageId + ': ' + Object.keys(dups).length + ' Duplicates: ' + Object.keys(dups).join(', ');
									mxLog.debug(log + ' (see console)');
								}
								else
								{
									mxLog.debug(pageId + ': Checked');
								}
								
								// Checks tree for cycles
								var visited = {};
								
								function visit(id)
								{
									if (visited[id] == null)
									{
										visited[id] = true;
										
										if (childs[id] != null)
										{
											while (childs[id].length > 0)
											{
												var temp = childs[id].pop();
												visit(temp);
											}
											
											delete childs[id];
										}
									}
									else
									{
										mxLog.debug(pageId + ': Visited: ' + id);
									}
								};
								
								if (root == null)
								{
									mxLog.debug(pageId + ': No root');
								}
								else
								{
									visit(root);
									
									if (Object.keys(visited).length != Object.keys(allIds).length)
									{
										mxLog.debug(pageId + ': Invalid tree: (see console)');
										console.log(pageId + ': Invalid tree', childs);
									}
								}
							};
							
							var roots = doc.getElementsByTagName('root');
							
							for (var i = 0; i < roots.length; i++)
							{
								checkModel(roots[i]);
							}
							
							mxLog.show();
						}
						catch (e)
						{
							editorUi.handleError(e);
							
							if (window.console != null)
							{
								console.error(e);
							}
						}
					}
				});
		    	
		    	dlg.textarea.style.width = '600px';
		    	dlg.textarea.style.height = '380px';
				editorUi.showDialog(dlg.container, 620, 460, true, true);
				dlg.init();
			}));
	
			var snapshot = null;
			
			editorUi.actions.addAction('testDiff', mxUtils.bind(this, function()
			{
				if (editorUi.pages != null)
				{
					var buttons = [['Snapshot', function(evt, input)
					{
						snapshot = editorUi.getPagesForNode(mxUtils.parseXml(
							editorUi.getFileData(true)).documentElement);
						dlg.textarea.value = 'Snapshot updated ' + new Date().toLocaleString();
					}], ['Diff', function(evt, input)
					{
						try
						{
							dlg.textarea.value = JSON.stringify(editorUi.diffPages(
								snapshot, editorUi.pages), null, 2);
						}
						catch (e)
						{
							editorUi.handleError(e);
						}
					}]];
					
			    	var dlg = new TextareaDialog(editorUi, 'Diff/Sync:', '',
			    		function(newValue)
					{
						var file = editorUi.getCurrentFile();
						
						if (newValue.length > 0 && file != null)
						{
							try
							{
								var patch = JSON.parse(newValue);
								file.patch([patch], null, true);
								editorUi.hideDialog();
							}
							catch (e)
							{
								editorUi.handleError(e);
							}
						}
					}, null, 'Close', null, null, null, true, null, 'Patch', null, buttons);
			    	
			    	dlg.textarea.style.width = '600px';
			    	dlg.textarea.style.height = '380px';


					if (snapshot == null)
					{
						snapshot = editorUi.getPagesForNode(mxUtils.parseXml(
							editorUi.getFileData(true)).documentElement);
						dlg.textarea.value = 'Snapshot created ' + new Date().toLocaleString();
					}
					else
					{
						dlg.textarea.value = JSON.stringify(editorUi.diffPages(
							snapshot, editorUi.pages), null, 2);
					}
					
					editorUi.showDialog(dlg.container, 620, 460, true, true);
					dlg.init();
				}
				else
				{
					editorUi.alert('No pages');
				}
			}));
	
			editorUi.actions.addAction('testInspect', mxUtils.bind(this, function()
			{
				console.log(editorUi, graph.getModel());
			}));
			
			editorUi.actions.addAction('testXmlImageExport', mxUtils.bind(this, function()
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

			editorUi.actions.addAction('testShowConsole', function()
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
			
			this.put('testDevelop', new Menu(mxUtils.bind(this, function(menu, parent)
			{
				this.addMenuItems(menu, ['createSidebarEntry', 'showBoundingBox', '-',
					'testCheckFile', 'testDiff', '-', 'testInspect', '-',
					'testXmlImageExport', '-', 'testShowConsole'], parent);
			})));
		}

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

		editorUi.actions.put('createShape', new Action(mxResources.get('shape') + '...', function(evt)
		{
			if (graph.isEnabled())
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 120, 120), editorUi.defaultCustomShapeStyle);
				cell.vertex = true;
			
		    	var dlg = new EditShapeDialog(editorUi, cell, mxResources.get('editShape') + ':', 630, 400);
				editorUi.showDialog(dlg.container, 640, 480, true, false);
				dlg.init();
			}
		})).isEnabled = isGraphEnabled;
		
		editorUi.actions.put('embedHtml', new Action(mxResources.get('html') + '...', function()
		{
			if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
			{
				editorUi.getPublicUrl(editorUi.getCurrentFile(), function(url)
				{
					editorUi.spinner.stop();
					
					editorUi.showHtmlDialog(mxResources.get('create'), 'https://www.diagrams.net/doc/faq/embed-html-options',
						url, function(publicUrl, zoomEnabled, initialZoom, linkTarget, linkColor, fit, allPages, layers, lightbox, editLink)
					{
						editorUi.createHtml(publicUrl, zoomEnabled, initialZoom, linkTarget, linkColor,
							fit, allPages, layers, lightbox, editLink, mxUtils.bind(this, function(html, scriptTag)
							{
								var dlg = new EmbedDialog(editorUi, html + '\n' + scriptTag, null, null, function()
								{
									var wnd = window.open();
									var doc = wnd.document;
									
									if (doc != null)
									{
										if (document.compatMode === 'CSS1Compat')
										{
											doc.writeln('<!DOCTYPE html>');
										}
										
										doc.writeln('<html>');
										doc.writeln('<head><title>' + encodeURIComponent(mxResources.get('preview')) +
											'</title><meta charset="utf-8"></head>');
										doc.writeln('<body>');
										doc.writeln(html);
										
										var direct = mxClient.IS_IE || mxClient.IS_EDGE || document.documentMode != null;
										
										if (direct)
										{
											doc.writeln(scriptTag);
										}
										
										doc.writeln('</body>');
										doc.writeln('</html>');
										doc.close();
										
										// Adds script tag after closing page and delay to fix timing issues
										if (!direct)
										{
											var info = wnd.document.createElement('div');
											info.marginLeft = '26px';
											info.marginTop = '26px';
											mxUtils.write(info, mxResources.get('updatingDocument'));
	
											var img = wnd.document.createElement('img');
											img.setAttribute('src', window.location.protocol + '//' + window.location.hostname +
												'/' + IMAGE_PATH + '/spin.gif');
											img.style.marginLeft = '6px';
											info.appendChild(img);
											
											wnd.document.body.insertBefore(info, wnd.document.body.firstChild);
											
											window.setTimeout(function()
											{
												var script = document.createElement('script');
												script.type = 'text/javascript';
												script.src = /<script.*?src="(.*?)"/.exec(scriptTag)[1];
												doc.body.appendChild(script);
												
												info.parentNode.removeChild(info);
											}, 20);
										}
									}
									else
									{
										editorUi.handleError({message: mxResources.get('errorUpdatingPreview')});
									}
								});
								editorUi.showDialog(dlg.container, 440, 240, true, true);
								dlg.init();
							}));
					});
				});
			}
		}));
		
		editorUi.actions.put('liveImage', new Action('Live image...', function()
		{
			var current = editorUi.getCurrentFile();
			
			if (current != null && editorUi.spinner.spin(document.body, mxResources.get('loading')))
			{
				editorUi.getPublicUrl(editorUi.getCurrentFile(), function(url)
				{
					editorUi.spinner.stop();
					
					if (url != null)
					{
						var dlg = new EmbedDialog(editorUi, '<img src="' + ((current.constructor != DriveFile) ?
							url : 'https://drive.google.com/uc?id=' + current.getId()) + '"/>');
						editorUi.showDialog(dlg.container, 440, 240, true, true);
						dlg.init();
					}
					else
					{
						editorUi.handleError({message: mxResources.get('invalidPublicUrl')});
					}
				});
			}
		}));
		
		editorUi.actions.put('embedImage', new Action(mxResources.get('image') + '...', function()
		{
			editorUi.showEmbedImageDialog(function(fit, shadow, retina, lightbox, editLink, layers)
			{
				if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
				{
					editorUi.createEmbedImage(fit, shadow, retina, lightbox, editLink, layers, function(result)
					{
						editorUi.spinner.stop();
						var dlg = new EmbedDialog(editorUi, result);
						editorUi.showDialog(dlg.container, 440, 240, true, true);
						dlg.init();
					}, function(err)
					{
						editorUi.spinner.stop();
						editorUi.handleError(err);
					});
				}
			}, mxResources.get('image'), mxResources.get('retina'), editorUi.isExportToCanvas());
		}));

		editorUi.actions.put('embedSvg', new Action(mxResources.get('formatSvg') + '...', function()
		{
			editorUi.showEmbedImageDialog(function(fit, shadow, image, lightbox, editLink, layers)
			{
				if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
				{
					editorUi.createEmbedSvg(fit, shadow, image, lightbox, editLink, layers, function(result)
					{
						editorUi.spinner.stop();
						
						var dlg = new EmbedDialog(editorUi, result);
						editorUi.showDialog(dlg.container, 440, 240, true, true);
						dlg.init();
					}, function(err)
					{
						editorUi.spinner.stop();
						editorUi.handleError(err);
					});
				}
			}, mxResources.get('formatSvg'), mxResources.get('image'),
				true, 'https://www.diagrams.net/doc/faq/embed-svg.html');
		}));
		
		editorUi.actions.put('embedIframe', new Action(mxResources.get('iframe') + '...', function()
		{
			var bounds = graph.getGraphBounds();
			
			editorUi.showPublishLinkDialog(mxResources.get('iframe'), null, '100%',
				Math.ceil(bounds.height / graph.view.scale) + 2,
				function(linkTarget, linkColor, allPages, lightbox, editLink, layers, width, height)
			{
				if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
				{
					editorUi.getPublicUrl(editorUi.getCurrentFile(), function(url)
					{
						editorUi.spinner.stop();
						
						var dlg = new EmbedDialog(editorUi, '<iframe frameborder="0" style="width:' + width +
							';height:' + height + ';" src="' + editorUi.createLink(linkTarget, linkColor,
							allPages, lightbox, editLink, layers, url) + '"></iframe>');
						editorUi.showDialog(dlg.container, 440, 240, true, true);
						dlg.init();
					});
				}
			}, true);
		}));

		editorUi.actions.put('embedNotion', new Action(mxResources.get('notion') + '...', function()
		{
			editorUi.showPublishLinkDialog(mxResources.get('notion'), null, null, null,
				function(linkTarget, linkColor, allPages, lightbox, editLink, layers, width, height)
			{
				if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
				{
					editorUi.getPublicUrl(editorUi.getCurrentFile(), function(url)
					{
						editorUi.spinner.stop();
						
						var dlg = new EmbedDialog(editorUi, editorUi.createLink(linkTarget, linkColor,
							allPages, lightbox, editLink, layers, url, null, ['border=0'], true));
						editorUi.showDialog(dlg.container, 440, 240, true, true);
						dlg.init();
					});
				}
			}, true);
		}));
		
		editorUi.actions.put('publishLink', new Action(mxResources.get('link') + '...', function()
		{
			editorUi.showPublishLinkDialog(null, null, null, null,
				function(linkTarget, linkColor, allPages, lightbox, editLink, layers)
			{
				if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
				{
					editorUi.getPublicUrl(editorUi.getCurrentFile(), function(url)
					{
						editorUi.spinner.stop();
						var dlg = new EmbedDialog(editorUi, editorUi.createLink(linkTarget,
							linkColor, allPages, lightbox, editLink, layers, url));
						editorUi.showDialog(dlg.container, 440, 240, true, true);
						dlg.init();
					});
				}
			});
		}));

		editorUi.actions.addAction('microsoftOffice...', function()
		{
			editorUi.openLink('https://office.draw.io');
		});

		editorUi.actions.addAction('googleDocs...', function()
		{
			editorUi.openLink('http://docsaddon.draw.io');
		});

		editorUi.actions.addAction('googleSlides...', function()
		{
			editorUi.openLink('https://slidesaddon.draw.io');
		});

		editorUi.actions.addAction('googleSheets...', function()
		{
			editorUi.openLink('https://sheetsaddon.draw.io');
		});

		editorUi.actions.addAction('googleSites...', function()
		{
			if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
			{
				editorUi.getPublicUrl(editorUi.getCurrentFile(), function(url)
				{
					editorUi.spinner.stop();
					var dlg = new GoogleSitesDialog(editorUi, url);
					editorUi.showDialog(dlg.container, 420, 256, true, true);
					dlg.init();
				});
			}
		});

		// Adds plugins menu item only if localStorage is available for storing the plugins
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
				editorUi.showDialog(new PluginsDialog(editorUi).container, 360, 170, true, false);
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
				
				//Add support to saving files if embedded mode is running with files
				var file = editorUi.getCurrentFile();
				
				if (file != null && file.constructor != EmbedFile && (file.constructor != LocalFile || file.mode != null))
				{
					editorUi.saveFile();
				}
			};
	
			var saveAndExitAction = editorUi.actions.addAction('saveAndExit', function()
			{
				editorUi.actions.get('save').funct(true);
			});
			
			saveAndExitAction.label = urlParams['publishClose'] == '1' ? mxResources.get('publish') : mxResources.get('saveAndExit');
			
			editorUi.actions.addAction('exit', function()
			{
				var fn = function()
				{
					editorUi.editor.modified = false;
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
					editorUi.confirm(mxResources.get('allChangesLost'), null, fn,
						mxResources.get('cancel'), mxResources.get('discardChanges'));
				}
			});
		}
		
		this.put('exportAs', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (editorUi.isExportToCanvas())
			{
				this.addMenuItems(menu, ['exportPng'], parent);
				
				if (editorUi.jpgSupported)
				{
					this.addMenuItems(menu, ['exportJpg'], parent);
				}
			}
			
			// Disabled for standalone mode in iOS because new tab cannot be closed
			else if (!editorUi.isOffline() && (!mxClient.IS_IOS || !navigator.standalone))
			{
				this.addMenuItems(menu, ['exportPng', 'exportJpg'], parent);
			}
			
			this.addMenuItems(menu, ['exportSvg', '-'], parent);
			
			// Redirects export to PDF to print in Chrome App
			if (editorUi.isOffline() || editorUi.printPdfExport)
			{
				this.addMenuItems(menu, ['exportPdf'], parent);
			}
			// Disabled for standalone mode in iOS because new tab cannot be closed
			else if (!editorUi.isOffline() && (!mxClient.IS_IOS || !navigator.standalone))
			{
				this.addMenuItems(menu, ['exportPdf'], parent);
			}

			if (!mxClient.IS_IE && (typeof(VsdxExport) !== 'undefined' || !editorUi.isOffline()))
			{
				this.addMenuItems(menu, ['exportVsdx'], parent);
			}

			this.addMenuItems(menu, ['-', 'exportHtml', 'exportXml', 'exportUrl'], parent);

			if (!editorUi.isOffline())
			{
				menu.addSeparator(parent);
				this.addMenuItem(menu, 'export', parent).firstChild.nextSibling.innerHTML = mxResources.get('advanced') + '...';
			}
		})));

		this.put('importFrom', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var doImportFile = mxUtils.bind(this, function(data, mime, filename)
			{
				// Gets insert location
				var view = graph.view;
				var bds = graph.getGraphBounds();
				var x = graph.snap(Math.ceil(Math.max(0, bds.x / view.scale - view.translate.x) + 4 * graph.gridSize));
				var y = graph.snap(Math.ceil(Math.max(0, (bds.y + bds.height) / view.scale - view.translate.y) + 4 * graph.gridSize));

				if (data.substring(0, 11) == 'data:image/')
				{
					editorUi.loadImage(data, mxUtils.bind(this, function(img)
	    			{
			    		var resizeImages = true;
			    		
			    		var doInsert = mxUtils.bind(this, function()
			    		{
		    				editorUi.resizeImage(img, data, mxUtils.bind(this, function(data2, w2, h2)
	    	    			{
	    		    			var s = (resizeImages) ? Math.min(1, Math.min(editorUi.maxImageSize / w2, editorUi.maxImageSize / h2)) : 1;
	
    							editorUi.importFile(data, mime, x, y, Math.round(w2 * s), Math.round(h2 * s), filename, function(cells)
    							{
    								editorUi.spinner.stop();
    								graph.setSelectionCells(cells);
    								graph.scrollCellToVisible(graph.getSelectionCell());
    							});
	    	    			}), resizeImages);
			    		});
			    		
			    		if (data.length > editorUi.resampleThreshold)
			    		{
			    			editorUi.confirmImageResize(function(doResize)
	    					{
	    						resizeImages = doResize;
	    						doInsert();
	    					});
			    		}
			    		else
		    			{
			    			doInsert();
		    			}
	    			}), mxUtils.bind(this, function()
	    			{
	    				editorUi.handleError({message: mxResources.get('cannotOpenFile')});
	    			}));
				}
				else
				{
					editorUi.importFile(data, mime, x, y, 0, 0, filename, function(cells)
					{
						editorUi.spinner.stop();
						graph.setSelectionCells(cells);
						graph.scrollCellToVisible(graph.getSelectionCell());
					});
				}
			});
			
			var getMimeType = mxUtils.bind(this, function(filename)
			{
				var mime = 'text/xml';
				
				if (/\.png$/i.test(filename))
				{
					mime = 'image/png';
				}
				else if (/\.jpe?g$/i.test(filename))
				{
					mime = 'image/jpg';
				}
				else if (/\.gif$/i.test(filename))
				{
					mime = 'image/gif';
				}
				else if (/\.pdf$/i.test(filename))
				{
					mime = 'application/pdf';
				}
				
				return mime;
			});
			
			function pickFileFromService(service)
			{
				// Drive requires special arguments for libraries and bypassing realtime
				service.pickFile(function(id)
				{
					if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
					{
						// NOTE The third argument in getFile says denyConvert to match
						// the existing signature in the original DriveClient which has
						// as slightly different semantic, but works the same way.
						service.getFile(id, function(file)
						{
							var mime = (file.getData().substring(0, 11) == 'data:image/') ? getMimeType(file.getTitle()) : 'text/xml';
							
							// Imports SVG as images
							if (/\.svg$/i.test(file.getTitle()) && !editorUi.editor.isDataSvg(file.getData()))
							{
								file.setData(Editor.createSvgDataUri(file.getData()));
								mime = 'image/svg+xml';
							}
							
							doImportFile(file.getData(), mime, file.getTitle());
						},
						function(resp)
						{
							editorUi.handleError(resp, (resp != null) ? mxResources.get('errorLoadingFile') : null);
						}, service == editorUi.drive);
					}
				}, true);
			};
		
			if (typeof(google) != 'undefined' && typeof(google.picker) != 'undefined')
			{
				if (editorUi.drive != null)
				{
					// Requires special arguments for libraries and realtime
					menu.addItem(mxResources.get('googleDrive') + '...', null, function()
					{
						pickFileFromService(editorUi.drive);
					}, parent);
				}
				else if (googleEnabled && typeof window.DriveClient === 'function')
				{
					menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
					{
						// do nothing
					}, parent, null, false);
				}
			}

			if (editorUi.oneDrive != null)
			{
				menu.addItem(mxResources.get('oneDrive') + '...', null, function()
				{
					pickFileFromService(editorUi.oneDrive);
				}, parent);
			}
			else if (oneDriveEnabled && typeof window.OneDriveClient === 'function')
			{
				menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
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
			else if (dropboxEnabled && typeof window.DropboxClient === 'function')
			{
				menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			menu.addSeparator(parent);
			
			if (editorUi.gitHub != null)
			{
				menu.addItem(mxResources.get('github') + '...', null, function()
				{
					pickFileFromService(editorUi.gitHub);
				}, parent);
			}
			
			if (editorUi.gitLab != null)
			{
				menu.addItem(mxResources.get('gitlab') + '...', null, function()
				{
					pickFileFromService(editorUi.gitLab);
				}, parent);
			}

			if (editorUi.trello != null)
			{
				menu.addItem(mxResources.get('trello') + '...', null, function()
				{
					pickFileFromService(editorUi.trello);
				}, parent);
			}
			else if (trelloEnabled && typeof window.TrelloClient === 'function')
			{
				menu.addItem(mxResources.get('trello') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			menu.addSeparator(parent);

			if (isLocalStorage && urlParams['browser'] != '0')
			{
				menu.addItem(mxResources.get('browser') + '...', null, function()
				{
					editorUi.importLocalFile(false);
				}, parent);
			}

			menu.addItem(mxResources.get('device') + '...', null, function()
			{
				editorUi.importLocalFile(true);
			}, parent);

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
							editorUi.editor.loadUrl(PROXY_URL + '?url=' + encodeURIComponent(fileUrl), function(data)
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
		}))).isEnabled = isGraphEnabled;

		this.put('theme', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var theme = (urlParams['sketch'] == '1') ? 'sketch' : mxSettings.getUi();

			var item = menu.addItem(mxResources.get('automatic'), null, function()
			{
				mxSettings.setUi('');
				editorUi.alert(mxResources.get('restartForChangeRequired'));
			}, parent);
			
			if (theme != 'kennedy' && theme != 'atlas' &&
				theme != 'dark' && theme != 'min' &&
				theme != 'sketch')
			{
				menu.addCheckmark(item, Editor.checkmarkImage);
			}

			menu.addSeparator(parent);
			
			item = menu.addItem(mxResources.get('default'), null, function()
			{
				mxSettings.setUi('kennedy');
				editorUi.alert(mxResources.get('restartForChangeRequired'));
			}, parent);

			if (theme == 'kennedy')
			{
				menu.addCheckmark(item, Editor.checkmarkImage);
			}

			item = menu.addItem(mxResources.get('minimal'), null, function()
			{
				mxSettings.setUi('min');
				editorUi.alert(mxResources.get('restartForChangeRequired'));
			}, parent);
			
			if (theme == 'min')
			{
				menu.addCheckmark(item, Editor.checkmarkImage);
			}
			
			item = menu.addItem(mxResources.get('atlas'), null, function()
			{
				mxSettings.setUi('atlas');
				editorUi.alert(mxResources.get('restartForChangeRequired'));
			}, parent);
			
			if (theme == 'atlas')
			{
				menu.addCheckmark(item, Editor.checkmarkImage);
			}
			
			item = menu.addItem(mxResources.get('dark'), null, function()
			{
				mxSettings.setUi('dark');
				editorUi.alert(mxResources.get('restartForChangeRequired'));
			}, parent);
			
			if (theme == 'dark')
			{
				menu.addCheckmark(item, Editor.checkmarkImage);
			}
			
			menu.addSeparator(parent);
			
			item = menu.addItem(mxResources.get('sketch'), null, function()
			{
				mxSettings.setUi('sketch');
				editorUi.alert(mxResources.get('restartForChangeRequired'));
			}, parent);
			
			if (theme == 'sketch')
			{
				menu.addCheckmark(item, Editor.checkmarkImage);
			}
		})));

		var renameAction = this.editorUi.actions.addAction('rename...', mxUtils.bind(this, function()
		{
			var file = this.editorUi.getCurrentFile();
			
			if (file != null)
			{
				if (file.constructor == LocalFile && file.fileHandle != null)
				{
					editorUi.showSaveFilePicker(mxUtils.bind(editorUi, function(fileHandle, desc)
					{
						file.invalidFileHandle = null;
						file.fileHandle = fileHandle;
						file.title = desc.name;
						file.desc = desc;
						editorUi.save(desc.name);
					}), null, editorUi.createFileSystemOptions(file.getTitle()));
				}
				else
				{
					var filename = (file.getTitle() != null) ? file.getTitle() : this.editorUi.defaultFilename;
					
					var dlg = new FilenameDialog(this.editorUi, filename, mxResources.get('rename'), mxUtils.bind(this, function(title)
					{
						if (title != null && title.length > 0 && file != null && title != file.getTitle() &&
							this.editorUi.spinner.spin(document.body, mxResources.get('renaming')))
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
					}, null, null, null, null, editorUi.editor.fileExtensions);
					this.editorUi.showDialog(dlg.container, 340, 90, true, true);
					dlg.init();
				}
			}
		}));
		
		renameAction.isEnabled = function()
		{
			return this.enabled && isGraphEnabled.apply(this, arguments);
		}
		
		renameAction.visible = urlParams['embed'] != '1';
		
		editorUi.actions.addAction('makeCopy...', mxUtils.bind(this, function()
		{
			var file = editorUi.getCurrentFile();
			
			if (file != null)
			{
				var title = editorUi.getCopyFilename(file);

				if (file.constructor == DriveFile)
				{
					var dlg = new CreateDialog(editorUi, title, mxUtils.bind(this, function(newTitle, mode)
					{
						if (mode == '_blank')
						{
							editorUi.editor.editAsNew(editorUi.getFileData(), newTitle);
						}
						else
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
										// Saveas does not update the file descriptor in Google Drive
										file.saveAs(newTitle, mxUtils.bind(this, function(resp)
										{
											// Replaces file descriptor in-place and saves
											file.desc = resp;
											
											// Makes sure the latest XML is in the file
											file.save(false, mxUtils.bind(this, function()
											{
												editorUi.spinner.stop();
												file.setModified(false);
												file.addAllSavedStatus();
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
									editorUi.createFile(newTitle, editorUi.getFileData(true), null, mode);
								}
							}
						}
					}), mxUtils.bind(this, function()
					{
						editorUi.hideDialog();
					}), mxResources.get('makeCopy'), mxResources.get('create'), null,
						null, true, null, true, null, null, null, null,
						editorUi.editor.fileExtensions);
					editorUi.showDialog(dlg.container, 420, 380, true, true);
					dlg.init();
				}
				else
				{
					// Creates a copy with no predefined storage
					editorUi.editor.editAsNew(this.editorUi.getFileData(true), title);
				}
			}
		}));
		
		editorUi.actions.addAction('moveToFolder...', mxUtils.bind(this, function()
		{
			var file = editorUi.getCurrentFile();
			
			if (file.getMode() == App.MODE_GOOGLE || file.getMode() == App.MODE_ONEDRIVE)
			{
				var isInRoot = false;
				
				if (file.getMode() == App.MODE_GOOGLE && file.desc.parents != null)
				{
					for (var i = 0; i < file.desc.parents.length; i++)
					{
						if (file.desc.parents[i].isRoot)
						{
							isInRoot = true;
							break;
						}
					}
				}
				
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
				}), null, true, isInRoot);
			}
		}));
		
		this.put('publish', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['publishLink'], parent);
		})));

		editorUi.actions.put('useOffline', new Action(mxResources.get('useOffline') + '...', function()
		{
			editorUi.openLink('https://app.draw.io/')
		}));
		
		editorUi.actions.put('downloadDesktop', new Action(mxResources.get('downloadDesktop') + '...', function()
		{
			editorUi.openLink('https://get.draw.io/')
		}));

		this.editorUi.actions.addAction('share...', mxUtils.bind(this, function()
		{
			try
			{
				var file = editorUi.getCurrentFile();
				
				if (file != null)
				{
					file.share();
				}
			}
			catch (e)
			{
				editorUi.handleError(e);
			}
		}));

		this.put('embed', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var file = editorUi.getCurrentFile();
			
			if (file != null && (file.getMode() == App.MODE_GOOGLE ||
				file.getMode() == App.MODE_GITHUB) && /(\.png)$/i.test(file.getTitle()))
			{
				this.addMenuItems(menu, ['liveImage', '-'], parent);
			}
			
			this.addMenuItems(menu, ['embedImage', 'embedSvg', '-', 'embedHtml'], parent);
			
			if (!navigator.standalone && !editorUi.isOffline())
			{
				this.addMenuItems(menu, ['embedIframe'], parent);
			}

			if (urlParams['embed'] != '1' && !editorUi.isOffline())
			{
				this.addMenuItems(menu, ['-', 'googleDocs', 'googleSlides', 'googleSheets', '-', 'microsoftOffice', '-', 'embedNotion'], parent);
			}
		})));

		var addInsertItem = function(menu, parent, title, method)
		{
			if (method != 'plantUml' || (EditorUi.enablePlantUml && !editorUi.isOffline()))
			{
				menu.addItem(title, null, mxUtils.bind(this, function()
				{
					if (method == 'fromText' || method == 'formatSql' ||
						method == 'plantUml' || method == 'mermaid')
					{
						var dlg = new ParseDialog(editorUi, title, method);
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
				}), parent, null, isGraphEnabled());
			}
		};
		
		var insertVertex = function(value, w, h, style)
		{
			var cell = new mxCell(value, new mxGeometry(0, 0, w, h), style);
			cell.vertex = true;

			var pt = graph.getCenterInsertPoint(graph.getBoundingBoxFromGeometry([cell], true));
			cell.geometry.x = pt.x;
    	    cell.geometry.y = pt.y;
		
    		graph.getModel().beginUpdate();
    		try
    	    {
    			cell = graph.addCell(cell);
    	    	graph.fireEvent(new mxEventObject('cellsInserted', 'cells', [cell]));
    	    }
    		finally
    		{
    			graph.getModel().endUpdate();
    		}
		
    		graph.scrollCellToVisible(cell);
    		graph.setSelectionCell(cell);
    		graph.container.focus();

    		if (graph.editAfterInsert)
    		{
    	        graph.startEditing(cell);
    		}
    		
    		// Async call is workaroun for touch events resetting hover icons
    		window.setTimeout(function()
    		{
	    		if (editorUi.hoverIcons != null)
				{
					editorUi.hoverIcons.update(graph.view.getState(cell));
				}
    		}, 0);
    		
	    	return cell;
		};
		
		editorUi.actions.put('insertText', new Action(mxResources.get('text'), function()
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
    			graph.startEditingAtCell(insertVertex('Text', 40, 20, 'text;html=1;resizable=0;autosize=1;' +
    				'align=center;verticalAlign=middle;points=[];fillColor=none;strokeColor=none;rounded=0;'));
			}
		}), null, null, Editor.ctrlKey + '+Shift+X').isEnabled = isGraphEnabled;
		
		editorUi.actions.put('insertRectangle', new Action(mxResources.get('rectangle'), function()
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
    	    	insertVertex('', 120, 60, 'whiteSpace=wrap;html=1;');
			}
		}), null, null, Editor.ctrlKey + '+K').isEnabled = isGraphEnabled;

		editorUi.actions.put('insertEllipse', new Action(mxResources.get('ellipse'), function()
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
    	    	insertVertex('', 80, 80, 'ellipse;whiteSpace=wrap;html=1;');
			}
		}), null, null, Editor.ctrlKey + '+Shift+K').isEnabled = isGraphEnabled;
		
		editorUi.actions.put('insertRhombus', new Action(mxResources.get('rhombus'), function()
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
    	    	insertVertex('', 80, 80, 'rhombus;whiteSpace=wrap;html=1;');
			}
		})).isEnabled = isGraphEnabled;
		
		var addInsertMenuItems = mxUtils.bind(this, function(menu, parent, methods)
		{
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
		});
		
		this.put('insert', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['insertRectangle', 'insertEllipse',
				'insertRhombus', '-', 'insertText', 'insertLink', '-',
				'createShape', 'insertFreehand', '-', 'insertImage'], parent);

			if (editorUi.insertTemplateEnabled && !editorUi.isOffline())
			{
				this.addMenuItems(menu, ['insertTemplate'], parent);
			}
			
			menu.addSeparator(parent);
			this.addSubmenu('insertLayout', menu, parent, mxResources.get('layout'));
			this.addSubmenu('insertAdvanced', menu, parent, mxResources.get('advanced'));
		})));

		this.put('insertLayout', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			addInsertMenuItems(menu, parent, ['horizontalFlow', 'verticalFlow', '-', 'horizontalTree',
				'verticalTree', 'radialTree', '-', 'organic', 'circle']);
		})));

        this.put('insertAdvanced', new Menu(mxUtils.bind(this, function(menu, parent)
        {
			addInsertMenuItems(menu, parent, ['fromText', 'plantUml', 'mermaid', '-', 'formatSql']);
			
			menu.addItem(mxResources.get('csv') + '...', null, function()
			{
				editorUi.showImportCsvDialog();
			}, parent, null, isGraphEnabled());
        })));
        
		this.put('openRecent', new Menu(function(menu, parent)
		{
			var recent = editorUi.getRecent();

			if (recent != null)
			{
				for (var i = 0; i < recent.length; i++)
				{
					(function(entry)
					{
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
			else if (googleEnabled && typeof window.DriveClient === 'function')
			{
				menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
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
			else if (oneDriveEnabled && typeof window.OneDriveClient === 'function')
			{
				menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
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
			else if (dropboxEnabled && typeof window.DropboxClient === 'function')
			{
				menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}

			menu.addSeparator(parent);
			
			if (editorUi.gitHub != null)
			{
				menu.addItem(mxResources.get('github') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_GITHUB);
				}, parent);
			}
			
			if (editorUi.gitLab != null)
			{
				menu.addItem(mxResources.get('gitlab') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_GITLAB);
				}, parent);
			}

			if (editorUi.trello != null)
			{
				menu.addItem(mxResources.get('trello') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_TRELLO);
				}, parent);
			}
			else if (trelloEnabled && typeof window.TrelloClient === 'function')
			{
				menu.addItem(mxResources.get('trello') + ' (' + mxResources.get('loading') + '...)', null, function()
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
			
			//if (!mxClient.IS_IOS)
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
							if (editorUi.getCurrentFile() == null)
							{
								window.location.hash = '#U' + encodeURIComponent(fileUrl);
							}
							else
							{
								window.openWindow(((mxClient.IS_CHROMEAPP) ?
									'https://www.draw.io/' : 'https://' + location.host + '/') +
									window.location.search + '#U' + encodeURIComponent(fileUrl));
							}
						}
					}, mxResources.get('url'));
					editorUi.showDialog(dlg.container, 300, 80, true, true);
					dlg.init();
				}, parent);
			}
		}));
		
		if (Editor.enableCustomLibraries)
		{
			this.put('newLibrary', new Menu(function(menu, parent)
			{
				if (typeof(google) != 'undefined' && typeof(google.picker) != 'undefined')
				{
					if (editorUi.drive != null)
					{
						menu.addItem(mxResources.get('googleDrive') + '...', null, function()
						{
							editorUi.showLibraryDialog(null, null, null, null, App.MODE_GOOGLE);
						}, parent);
					}
					else if (googleEnabled && typeof window.DriveClient === 'function')
					{
						menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
						{
							// do nothing
						}, parent, null, false);
					}
				}

				if (editorUi.oneDrive != null)
				{
					menu.addItem(mxResources.get('oneDrive') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_ONEDRIVE);
					}, parent);
				}
				else if (oneDriveEnabled && typeof window.OneDriveClient === 'function')
				{
					menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
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
				else if (dropboxEnabled && typeof window.DropboxClient === 'function')
				{
					menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
					{
						// do nothing
					}, parent, null, false);
				}
				
				menu.addSeparator(parent);
				
				if (editorUi.gitHub != null)
				{
					menu.addItem(mxResources.get('github') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_GITHUB);
					}, parent);
				}
				
				if (editorUi.gitLab != null)
				{
					menu.addItem(mxResources.get('gitlab') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_GITLAB);
					}, parent);
				}
				
				if (editorUi.trello != null)
				{
					menu.addItem(mxResources.get('trello') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_TRELLO);
					}, parent);
				}
				else if (trelloEnabled && typeof window.TrelloClient === 'function')
				{
					menu.addItem(mxResources.get('trello') + ' (' + mxResources.get('loading') + '...)', null, function()
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
				
				//if (!mxClient.IS_IOS)
				{
					menu.addItem(mxResources.get('device') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_DEVICE);
					}, parent);
				}
			}));
	
			this.put('openLibraryFrom', new Menu(function(menu, parent)
			{
				if (typeof(google) != 'undefined' && typeof(google.picker) != 'undefined')
				{
					if (editorUi.drive != null)
					{
						menu.addItem(mxResources.get('googleDrive') + '...', null, function()
						{
							editorUi.pickLibrary(App.MODE_GOOGLE);
						}, parent);
					}
					else if (googleEnabled && typeof window.DriveClient === 'function')
					{
						menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
						{
							// do nothing
						}, parent, null, false);
					}
				}

				if (editorUi.oneDrive != null)
				{
					menu.addItem(mxResources.get('oneDrive') + '...', null, function()
					{
						editorUi.pickLibrary(App.MODE_ONEDRIVE);
					}, parent);
				}
				else if (oneDriveEnabled && typeof window.OneDriveClient === 'function')
				{
					menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
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
				else if (dropboxEnabled && typeof window.DropboxClient === 'function')
				{
					menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
					{
						// do nothing
					}, parent, null, false);
				}
				
				menu.addSeparator(parent);
				
				if (editorUi.gitHub != null)
				{
					menu.addItem(mxResources.get('github') + '...', null, function()
					{
						editorUi.pickLibrary(App.MODE_GITHUB);
					}, parent);
				}
				
				if (editorUi.gitLab != null)
				{
					menu.addItem(mxResources.get('gitlab') + '...', null, function()
					{
						editorUi.pickLibrary(App.MODE_GITLAB);
					}, parent);
				}
				
				if (editorUi.trello != null)
				{
					menu.addItem(mxResources.get('trello') + '...', null, function()
					{
						editorUi.pickLibrary(App.MODE_TRELLO);
					}, parent);
				}
				else if (trelloEnabled && typeof window.TrelloClient === 'function')
				{
					menu.addItem(mxResources.get('trello') + ' (' + mxResources.get('loading') + '...)', null, function()
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
				
				//if (!mxClient.IS_IOS)
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
								var realUrl = fileUrl;
								
								if (!editorUi.editor.isCorsEnabledForUrl(fileUrl))
								{
									realUrl = PROXY_URL + '?url=' + encodeURIComponent(fileUrl);
								}
								
								// Uses proxy to avoid CORS issues
								mxUtils.get(realUrl, function(req)
								{
									if (req.getStatus() >= 200 && req.getStatus() <= 299)
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
				
				if (urlParams['confLib'] == '1')
				{
					menu.addSeparator(parent);
					
					menu.addItem(mxResources.get('confluenceCloud') + '...', null, function()
					{
						editorUi.showRemotelyStoredLibrary(mxResources.get('libraries'));
					}, parent);
				}
			}));
		}

		// Overrides edit menu to add find, copyAsImage editGeometry
		this.put('edit', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['undo', 'redo', '-', 'cut', 'copy', 'copyAsImage', 'paste',
				'delete', '-', 'duplicate', '-', 'findReplace', '-', 'editData', 'editTooltip', '-',
				'editStyle',  'editGeometry', '-', 'edit', '-', 'editLink', 'openLink', '-',
                'selectVertices', 'selectEdges', 'selectAll', 'selectNone', '-', 'lockUnlock']);
		})));

		var action = editorUi.actions.addAction('comments', mxUtils.bind(this, function()
		{
			if (this.commentsWindow == null)
			{
				// LATER: Check outline window for initial placement
				this.commentsWindow = new CommentsWindow(editorUi, document.body.offsetWidth - 380, 120, 300, 350);
				//TODO Are these events needed?
				this.commentsWindow.window.addListener('show', function()
				{
					editorUi.fireEvent(new mxEventObject('comments'));
				});
				this.commentsWindow.window.addListener('hide', function()
				{
					editorUi.fireEvent(new mxEventObject('comments'));
				});
				this.commentsWindow.window.setVisible(true);
				editorUi.fireEvent(new mxEventObject('comments'));
			}
			else
			{
				var isVisible = !this.commentsWindow.window.isVisible();
				this.commentsWindow.window.setVisible(isVisible);
				
				this.commentsWindow.refreshCommentsTime();

				if (isVisible && this.commentsWindow.hasError) 
				{
					this.commentsWindow.refreshComments();
				}				
			}
		}));
		action.setToggleAction(true);
		action.setSelectedCallback(mxUtils.bind(this, function() { return this.commentsWindow != null && this.commentsWindow.window.isVisible(); }));

		// Destroys comments window to force update or disable if not supported
		editorUi.editor.addListener('fileLoaded', mxUtils.bind(this, function()
		{
			if (this.commentsWindow != null)
			{
				this.commentsWindow.destroy();
				this.commentsWindow = null;
			}
		}));
		
		// Extends toolbar dropdown to add comments
		var viewPanelsMenu = this.get('viewPanels');
		var viewPanelsFunct = viewPanelsMenu.funct;
		
		viewPanelsMenu.funct = function(menu, parent)
		{
			viewPanelsFunct.apply(this, arguments);
			
			if (editorUi.commentsSupported())
			{
				editorUi.menus.addMenuItems(menu, ['comments'], parent);
			}
		};

		// Overrides view menu to add search and scratchpad
		this.put('view', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ((this.editorUi.format != null) ? ['formatPanel'] : []).
				concat(['outline', 'layers']).concat((editorUi.commentsSupported()) ?
				['comments', '-'] : ['-']));
			
			this.addMenuItems(menu, ['-', 'search'], parent);
			
			if (isLocalStorage || mxClient.IS_CHROMEAPP)
			{
				var item = this.addMenuItem(menu, 'scratchpad', parent);
				
				if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
				{
					this.addLinkToItem(item, 'https://www.diagrams.net/doc/faq/scratchpad');
				}
			}
			
			this.addMenuItems(menu, ['shapes', '-', 'pageView', 'pageScale']);
			this.addSubmenu('units', menu, parent);				
			this.addMenuItems(menu, ['-', 'scrollbars', 'tooltips', 'ruler', '-',
                'grid', 'guides'], parent);
			
			if (mxClient.IS_SVG && (document.documentMode == null || document.documentMode > 9))
			{
				this.addMenuItem(menu, 'shadowVisible', parent);
			}
			
			this.addMenuItems(menu, ['-', 'connectionArrows', 'connectionPoints', '-',
			                         'resetView', 'zoomIn', 'zoomOut'], parent);

			if (urlParams['sketch'] != '1')
			{
				 this.addMenuItems(menu, ['-', 'fullscreen'], parent);
			}
		})));
		
		this.put('extras', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (urlParams['noLangIcon'] == '1')
			{
				this.addSubmenu('language', menu, parent);
				menu.addSeparator(parent);
			}
			
			if (urlParams['embed'] != '1')
			{
				this.addSubmenu('theme', menu, parent);
				menu.addSeparator(parent);
			}

			if (typeof(MathJax) !== 'undefined')
			{
				var item = this.addMenuItem(menu, 'mathematicalTypesetting', parent);
				
				if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
				{
					this.addLinkToItem(item, 'https://www.diagrams.net/doc/faq/math-typesetting');
				}
			}
			
			this.addMenuItems(menu, ['copyConnect', 'collapseExpand', '-'], parent);
			
			if (urlParams['embed'] != '1' && (isLocalStorage || mxClient.IS_CHROMEAPP))
			{
				this.addMenuItems(menu, ['showStartScreen'], parent);
			}

			if (urlParams['embed'] != '1')
			{
				this.addMenuItems(menu, ['autosave'], parent);
			}
			
			menu.addSeparator(parent);
			
			if (!editorUi.isOfflineApp() && isLocalStorage)
			{
				this.addMenuItem(menu, 'plugins', parent);
			}

			this.addMenuItems(menu, ['tags', '-', 'editDiagram'], parent);
	
			if (Graph.translateDiagram)
			{
				this.addMenuItems(menu, ['diagramLanguage']);
			}
			
			this.addMenuItems(menu, ['-', 'configuration'], parent);
			
			// Adds trailing separator in case new plugin entries are added
			menu.addSeparator(parent);
			
			if (urlParams['newTempDlg'] == '1')
			{
				editorUi.actions.addAction('templates', function()
				{
					var tempDlg = new TemplatesDialog();
					editorUi.showDialog(tempDlg.container, tempDlg.width, tempDlg.height, true, false, null, false, true);
					tempDlg.init(editorUi, function(xml){console.log(xml)}, null,
							null, null, 'user', function(callback, username)
					{
						setTimeout(function(){
							username? callback([
								{url: '123', title: 'Test 1Test 1Test 1Test 1Test 1Test 1Test 11Test 1Test 11Test 1Test 1dgdsgdfg fdg dfgdfg dfg dfg'},
								{url: '123', title: 'Test 2', imgUrl: 'https://www.google.com.eg/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'},
								{url: '123', title: 'Test 3', changedBy: 'Ashraf Teleb', lastModifiedOn: 'Yesterday'},
								{url: '123', title: 'Test 4'},
								{url: '123', title: 'Test 5'},
								{url: '123', title: 'Test 6'}
							]) : callback([
								{url: '123', title: 'Test 4', imgUrl: 'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg'},
								{url: '123', title: 'Test 5'},
								{url: '123', title: 'Test 6'},
								{url: '123', title: 'Test 1Test 1Test 1Test 1Test 1Test 1Test 11Test 1Test 11Test 1Test 1dgdsgdfg fdg dfgdfg dfg dfg'},
								{url: '123', title: 'Test 2', imgUrl: 'https://www.google.com.eg/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'},
								{url: '123', title: 'Test 3', changedBy: 'Ashraf Teleb', lastModifiedOn: 'Yesterday'}
							]);
							console.log(username);
						}, 1000);
					}, function(str, callback, username)
					{
						setTimeout(function(){
							callback(username? [
								{url: '123', title: str +'Test 1Test 1Test 1Test 1Test 1Test 1Test 1'},
								{url: '123', title: str +'Test 2'},
								{url: '123', title: str +'Test 3'},
								{url: '123', title: str +'Test 4'},
								{url: '123', title: str +'Test 5'},
								{url: '123', title: str +'Test 6'}
							]: [
								{url: '123', title: str +'Test 5'},
								{url: '123', title: str +'Test 6'},
								{url: '123', title: str +'Test 1Test 1Test 1Test 1Test 1Test 1Test 1'},
								{url: '123', title: str +'Test 2'},
								{url: '123', title: str +'Test 3'},
								{url: '123', title: str +'Test 4'}
							]);
						}, 2000);						
					}, null);
				});
				this.addMenuItem(menu, 'templates', parent);
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
				
				if (editorUi.isRevisionHistorySupported())
				{
					this.addMenuItems(menu, ['-', 'revisionHistory'], parent);
				}
				
				this.addMenuItems(menu, ['-', 'pageSetup', 'print', '-', 'rename'], parent);
				
				if (urlParams['noSaveBtn'] == '1')
				{
					if (urlParams['saveAndExit'] != '0')
					{
						this.addMenuItems(menu, ['saveAndExit'], parent);
					}
				}
				else
				{
					this.addMenuItems(menu, ['save'], parent);
					
					if (urlParams['saveAndExit'] == '1')
					{
						this.addMenuItems(menu, ['saveAndExit'], parent);
					}
				}
				
				if (urlParams['noExitBtn'] != '1')
				{
					this.addMenuItems(menu, ['exit'], parent);
				}
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
					
					this.addMenuItems(menu, ['save', '-', 'share'], parent);
					
					var item = this.addMenuItem(menu, 'synchronize', parent);
					
					if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
					{
						this.addLinkToItem(item, 'https://www.diagrams.net/doc/faq/synchronize');
					}
					
					menu.addSeparator(parent);
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
					if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp &&
						file != null && (file.constructor != LocalFile ||
						file.fileHandle != null))
					{	
						menu.addSeparator(parent);
						var item = this.addMenuItem(menu, 'synchronize', parent);
						
						if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
						{
							this.addLinkToItem(item, 'https://www.diagrams.net/doc/faq/synchronize');
						}
					}
					
					this.addMenuItems(menu, ['-', 'save', 'saveAs', '-'], parent);
					
					if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp &&
						editorUi.getServiceName() == 'draw.io' &&
						!editorUi.isOfflineApp() && file != null)
					{
						this.addMenuItems(menu, ['share', '-'], parent);
					}
					
					this.addMenuItems(menu, ['rename'], parent);
					
					if (editorUi.isOfflineApp())
					{
						if (navigator.onLine && urlParams['stealth'] != '1' && urlParams['lockdown'] != '1')
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
				
				if (editorUi.isRevisionHistorySupported())
				{
					this.addMenuItems(menu, ['-', 'revisionHistory'], parent);
				}
				
				if (file != null && editorUi.fileNode != null)
				{
					var filename = (file.getTitle() != null) ?
						file.getTitle() : editorUi.defaultFilename;
					
					if (!/(\.html)$/i.test(filename) &&
						!/(\.svg)$/i.test(filename))
					{
						this.addMenuItems(menu, ['-', 'properties']);
					}
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
		
		/**
		 * External Fonts undoable change
		 */
		function ChangeExtFonts(ui, extFonts, customFonts)
		{
			this.ui = ui;
			this.extFonts = extFonts;
			this.previousExtFonts = extFonts;
			this.customFonts = customFonts;
			this.prevCustomFonts = customFonts;
		};

		/**
		 * Implementation of the undoable External Fonts Change.
		 */
		ChangeExtFonts.prototype.execute = function()
		{
			var graph = this.ui.editor.graph;
			this.customFonts = this.prevCustomFonts;
			this.prevCustomFonts = this.ui.menus.customFonts;
			this.ui.fireEvent(new mxEventObject('customFontsChanged', 'customFonts', this.customFonts));
			
			this.extFonts = this.previousExtFonts;
			var tmp = graph.extFonts;
			
			for (var i = 0; tmp != null && i < tmp.length; i++)
			{
				var fontElem = document.getElementById('extFont_' + tmp[i].name);
				
				if (fontElem != null)
				{
					fontElem.parentNode.removeChild(fontElem);
				}
			}
			
			graph.extFonts = [];
			
			for (var i = 0; this.previousExtFonts != null && i < this.previousExtFonts.length; i++)
			{
				this.ui.editor.graph.addExtFont(this.previousExtFonts[i].name, this.previousExtFonts[i].url);
			}
			
			this.previousExtFonts = tmp;
		};

		//Replace the default font family menu
		this.put('fontFamily', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var addItem = mxUtils.bind(this, function(fontName, fontUrl, deletable, fontLabel, tooltip)
			{
				var graph = this.editorUi.editor.graph;

				var tr = this.styleChange(menu, fontLabel || fontName,
					(urlParams['ext-fonts'] != '1') ?
						[mxConstants.STYLE_FONTFAMILY, 'fontSource', 'FType'] : [mxConstants.STYLE_FONTFAMILY],
					(urlParams['ext-fonts'] != '1') ?
						[fontName, (fontUrl != null) ? encodeURIComponent(fontUrl) : null, null] : [fontName],
					null, parent, function()
				{
					if (urlParams['ext-fonts'] != '1')
					{
						graph.setFont(fontName, fontUrl);
					}
					else
					{
						document.execCommand('fontname', false, fontName);
						//Add the font to the file in case it was a previous font from the settings
						graph.addExtFont(fontName, fontUrl);
					}
				}, function()
				{
					graph.updateLabelElements(graph.getSelectionCells(), function(elt)
					{
						elt.removeAttribute('face');
						elt.style.fontFamily = null;
						
						if (elt.nodeName == 'PRE')
						{
							graph.replaceElement(elt, 'div');
						}
					});
					
					//Add the font to the file in case it was a previous font from the settings
					if (urlParams['ext-fonts'] == '1')
					{
						graph.addExtFont(fontName, fontUrl);
					}
				});
				
				if (deletable)
				{
					var img = document.createElement('span');
					img.className = 'geSprite geSprite-delete';
					img.style.cursor = 'pointer';
					img.style.display = 'inline-block';
					tr.firstChild.nextSibling.nextSibling.appendChild(img);
					
					mxEvent.addListener(img, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', mxUtils.bind(this, function(evt)
					{
						if (urlParams['ext-fonts'] != '1')
						{
							delete Graph.recentCustomFonts[fontName.toLowerCase()];
							
							for (var i = 0; i < this.customFonts.length; i++)
							{
								if (this.customFonts[i].name == fontName &&
									this.customFonts[i].url == fontUrl)
								{
									this.customFonts.splice(i, 1);
									editorUi.fireEvent(new mxEventObject('customFontsChanged'));
									
									break;
								}
							}
						}
						else
						{
							var extFonts = mxUtils.clone(this.editorUi.editor.graph.extFonts);
							
							if (extFonts != null && extFonts.length > 0)
							{
								for (var i = 0; i < extFonts.length; i++)
								{
									if (extFonts[i].name == fontName)
									{
										extFonts.splice(i, 1);
										break;
									}
								}
							}
							
							var customFonts = mxUtils.clone(this.customFonts);
							
							for (var i = 0; i < customFonts.length; i++)
							{
								if (customFonts[i].name == fontName)
								{
									customFonts.splice(i, 1);
									break;
								}
							}
							
							var change = new ChangeExtFonts(this.editorUi, extFonts, customFonts);
							this.editorUi.editor.graph.model.execute(change);
						}
						
						this.editorUi.hideCurrentMenu();
						mxEvent.consume(evt);
					}));
				}
				
				Graph.addFont(fontName, fontUrl);
				tr.firstChild.nextSibling.style.fontFamily = fontName;
				
				if (tooltip != null)
				{
					tr.setAttribute('title', tooltip);
				}
			});
			
			var reserved = {};

			for (var i = 0; i < this.defaultFonts.length; i++)
			{
				var value = this.defaultFonts[i];
				
				if (typeof value === 'string')
				{
					addItem(value);
				}
				else if (value.fontFamily != null && value.fontUrl != null)
				{
					reserved[encodeURIComponent(value.fontFamily) + '@' +
						encodeURIComponent(value.fontUrl)] = true;
					addItem(value.fontFamily, value.fontUrl);
				}
			}

			menu.addSeparator(parent);
			
			if (urlParams['ext-fonts'] != '1')
			{
				// Special entries in the font menu are composed of custom fonts
				// from the local storage and actual used fonts in the file
				var duplicates = {};
				var fontNames = {};
				var entries = [];
				
				function addEntry(entry)
				{
					var key = encodeURIComponent(entry.name) +
						((entry.url == null) ? '' :
						'@' + encodeURIComponent(entry.url));
						
					if (!reserved[key])
					{
						var label = entry.name;
						var counter = 0;
						
						while (fontNames[label.toLowerCase()] != null)
						{
							label = entry.name + ' (' + (++counter) + ')';
						}
						
						if (duplicates[key] == null)
						{
							entries.push({name: entry.name, url: entry.url,
								label: label, title: entry.url});
							fontNames[label.toLowerCase()] = entry;
							duplicates[key] = entry;
						}
					}
				};
				
				// Adds custom user defined fonts from local storage
				for (var i = 0; i < this.customFonts.length; i++)
				{
					addEntry(this.customFonts[i]);
				}
				
				// Adds fonts that were recently used in the editor
				for (var key in Graph.recentCustomFonts)
				{
					addEntry(Graph.recentCustomFonts[key]);
				}
				
				// Sorts by label
				entries.sort(function(a, b)
				{
					if (a.label < b.label)
					{
						return -1;
					}
					else if (a.label > b.label)
					{
						return 1;
					}
					else
					{
						return 0;
					}
				});
				
				if (entries.length > 0)
				{
					for (var i = 0; i < entries.length; i++)
					{
						addItem(entries[i].name, entries[i].url, true,
							entries[i].label, entries[i].url);
					}
	
					menu.addSeparator(parent);
				}
				
				menu.addItem(mxResources.get('reset'), null, mxUtils.bind(this, function()
				{
					Graph.recentCustomFonts = {};
					this.customFonts = [];
					editorUi.fireEvent(new mxEventObject('customFontsChanged'));
				}), parent);
				
				menu.addSeparator(parent);
			}
			else
			{
				//Load custom fonts already in the Graph
				var extFonts = this.editorUi.editor.graph.extFonts;
				
				//Merge external fonts with custom fonts
				if (extFonts != null && extFonts.length > 0)
				{
					var custMap = {}, changed = false;
					
					for (var i = 0; i < this.customFonts.length; i++)
					{
						custMap[this.customFonts[i].name] = true;
					}
					
					for (var i = 0; i < extFonts.length; i++)
					{
						if (!custMap[extFonts[i].name])
						{
							this.customFonts.push(extFonts[i]);
							changed = true;
						}
					}
					
					if (changed)
					{
						this.editorUi.fireEvent(new mxEventObject('customFontsChanged', 'customFonts', this.customFonts));
					}
				}
				
				if (this.customFonts.length > 0)
				{
					for (var i = 0; i < this.customFonts.length; i++)
					{
						var name = this.customFonts[i].name, url = this.customFonts[i].url;
						addItem(name, url, true);
						
						//Load external fonts without saving them to the file
						this.editorUi.editor.graph.addExtFont(name, url, true);
					}
					
					menu.addSeparator(parent);
					
					menu.addItem(mxResources.get('reset'), null, mxUtils.bind(this, function()
					{
						var change = new ChangeExtFonts(this.editorUi, [], []);
						editorUi.editor.graph.model.execute(change);
					}), parent);
					
					menu.addSeparator(parent);
				}
			}
			
			menu.addItem(mxResources.get('custom') + '...', null, mxUtils.bind(this, function()
			{
				var graph = this.editorUi.editor.graph;
				var curFontName = graph.getStylesheet().getDefaultVertexStyle()
					[mxConstants.STYLE_FONTFAMILY];
				var curType = 's';
				var curUrl = null;
				
				// Handles in-place editing custom fonts via font family lookup
				if (urlParams['ext-fonts'] != '1' && graph.isEditing())
				{
					var node = graph.getSelectedEditingElement();

					if (node != null)
					{
						var css = mxUtils.getCurrentStyle(node);

						if (css != null)
						{
							curFontName = Graph.stripQuotes(css.fontFamily);
							curUrl = Graph.getFontUrl(curFontName, null);
							
							if (curUrl != null)
							{
			    				if (Graph.isGoogleFontUrl(curUrl))
			    				{
			    					curUrl = null;
			    					curType = 'g';
			    				}
			    				else
			    				{
			    					curType = 'w';
			    				}
							}
						}
					}
				}
				else
				{
			    	var state = graph.getView().getState(graph.getSelectionCell());
			    	
			    	if (state != null)
			    	{
			    		curFontName = state.style[mxConstants.STYLE_FONTFAMILY] || curFontName;
			    		
			    		if (urlParams['ext-fonts'] != '1')
			    		{
			    			var temp = state.style['fontSource'];
			    			
			    			if (temp != null)
			    			{
				    			temp = decodeURIComponent(temp);
								
			    				if (Graph.isGoogleFontUrl(temp))
			    				{
			    					curType = 'g';
			    				}
			    				else
			    				{
			    					curType = 'w';
				    				curUrl = temp;
			    				}
			    			}
			    		}
			    		else
			    		{
			    			curType = state.style['FType'] || curType;
			    		
			    			if (curType == 'w')
			    			{
				    			var extFonts = this.editorUi.editor.graph.extFonts;
				    			var webFont = null;
				    			
				    			if (extFonts != null)
			    				{
				    				webFont = extFonts.find(function(ef)
		    						{
				    					return ef.name == curFontName;
		    						});
				    			}
				    			
				    			// TODO: Resource is not defined
				    			curUrl = webFont != null? webFont.url : mxResources.get('urlNotFound', null, 'URL not found');
			    			}
			    		}
			    	}
				}
		    	
    			if (curUrl != null && curUrl.substring(0, PROXY_URL.length) == PROXY_URL)
				{
    				curUrl = decodeURIComponent(curUrl.substr((PROXY_URL + '?url=').length));
				}
		    	
		    	// Saves the current selection state
		    	var selState = null;
		    	
		    	if (document.activeElement == graph.cellEditor.textarea)
				{
					selState = graph.cellEditor.saveSelection();
				}
		    	
				var dlg = new FontDialog(this.editorUi, curFontName, curUrl, curType, mxUtils.bind(this, function(fontName, fontUrl, type)
				{
					// Restores the selection state
					if (selState != null)
					{
						graph.cellEditor.restoreSelection(selState);
						selState = null;
					}
					
					if (fontName != null && fontName.length > 0)
					{
						if (urlParams['ext-fonts'] != '1' && graph.isEditing())
						{
							graph.setFont(fontName, fontUrl);
						}
						else
						{
							graph.getModel().beginUpdate();
							
							try
							{
								graph.stopEditing(false);
								
								if (urlParams['ext-fonts'] != '1')
								{
									graph.setCellStyles(mxConstants.STYLE_FONTFAMILY, fontName);
									graph.setCellStyles('fontSource', (fontUrl != null) ?
										encodeURIComponent(fontUrl) : null);
									graph.setCellStyles('FType', null);
								}
								else
								{
									graph.setCellStyles(mxConstants.STYLE_FONTFAMILY, fontName);
									
									if (type != 's')
									{
										graph.setCellStyles('FType', type);
										
										if (fontUrl.indexOf('http://') == 0)
										{
											fontUrl = PROXY_URL + '?url=' + encodeURIComponent(fontUrl);
										}
										
										this.editorUi.editor.graph.addExtFont(fontName, fontUrl);
									}
								}
								
								var addToCustom = true;
								
								for (var i = 0; i < this.customFonts.length; i++)
								{
									if (this.customFonts[i].name == fontName)
									{
										addToCustom = false;
										break;
									}
								}
								
								if (addToCustom)
								{
									this.customFonts.push({name: fontName, url: fontUrl});
									this.editorUi.fireEvent(new mxEventObject('customFontsChanged', 'customFonts', this.customFonts));
								}
							}
							finally
							{
								graph.getModel().endUpdate();
							}
						}
					}
				}));
				this.editorUi.showDialog(dlg.container, 380, 250, true, true);
				dlg.init();
			}), parent, null, true);
		})));
	};
})();