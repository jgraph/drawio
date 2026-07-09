/**
 * Copyright (c) 2006-2020, JGraph Holdings Ltd
 * Copyright (c) 2006-2020, draw.io AG
 */
(function()
{
	// Adds scrollbars for menus that exceed the page height
	var mxPopupMenuShowMenu = mxPopupMenu.prototype.showMenu;
	mxPopupMenu.prototype.showMenu = function()
	{
		this.div.style.overflowY = 'auto';
		this.div.style.overflowX = 'hidden';
		var h0 = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
		this.div.style.maxHeight = (h0 - (EditorUi.isElectronApp? 50 : 10)) + 'px'; //In Electron and without titlebar, the top item is not selectable

		mxPopupMenuShowMenu.apply(this, arguments);
	};
	
	// Styles for the live layout containers used by Insert > Layout and by
	// the Advanced sidebar section (Sidebar-Advanced.js) — a single source
	// so menu inserts and sidebar templates stay in sync. Both variants are
	// transparentBounds=1 containers: the stored geometry stays pinned at
	// (0,0,0,0) with the children carrying the absolute position, the
	// visible box is derived from the children expanded by groupPadding
	// (plus the swimlane title bar), and every layout run anchors at the
	// content's current top-left — parent resize (resizeLayoutRoot /
	// resizeParent) is disabled automatically for transparent roots. The
	// menu inserts a borderless group (style); the sidebar templates keep
	// the titled swimlane look (sidebarStyle). The spacing matches the
	// legacy flowLayout/treeLayout sidebar containers: 50 between
	// ranks/levels, 30 (flow) / 40 (tree) between siblings. elk.padding is
	// inert while the container is transparent (the anchor cancels it) but
	// keeps the legacy margins if transparentBounds is ever toggled off.
	// The ELK entries use the JSON childLayout form and run through the
	// layout-manager path; see CLAUDE.md "ELK childLayout containers".
	Menus.layoutContainers = (function()
	{
		var elkChildLayout = function(layout, config)
		{
			config.resizeLayoutRoot = true;

			// Pin node sizes (the Arrange dialog's default): without this the
			// applier writes ELK's node sizes back on every re-run, and ELK
			// grows nodes for their labels — a manual resize of a shape in
			// the container would be overwritten by the next run.
			config.resizeNodes = false;

			// URL-encoded so no ';' or '=' from the JSON can corrupt the
			// style-string parsing (see Graph.encodeChildLayout).
			return 'childLayout=' + Graph.encodeChildLayout(
				[{layout: layout, config: config}]) + ';';
		};

		var group = function(extra)
		{
			return 'group;transparentBounds=1;groupPadding=20;' + extra;
		};

		var swimlane = function(sideTitle, extra)
		{
			return 'swimlane;html=1;startSize=20;horizontal=' +
				((sideTitle) ? '0' : '1') + ';resizable=0;fontSize=12;' +
				'transparentBounds=1;groupPadding=20;' + extra;
		};

		var entry = function(sideTitle, width, height, extra)
		{
			return {width: width, height: height, style: group(extra),
				sidebarStyle: swimlane(sideTitle, extra)};
		};

		var topPad = '[top=40,left=20,bottom=20,right=20]';
		var leftPad = '[top=20,left=40,bottom=20,right=20]';

		return {
			horizontalFlow: entry(true, 460, 150, 'containerType=tree;' +
				elkChildLayout('elkLayered', {'elk.direction': 'RIGHT',
					'elk.layered.spacing.nodeNodeBetweenLayers': '50',
					'elk.padding': leftPad, edgeStyle: 'orthogonalEdgeStyle',
					corners: 'rounded', extractIsolated: false})),
			verticalFlow: entry(false, 270, 280, 'containerType=tree;' +
				elkChildLayout('elkLayered', {'elk.direction': 'DOWN',
					'elk.layered.spacing.nodeNodeBetweenLayers': '50',
					'elk.padding': topPad, edgeStyle: 'orthogonalEdgeStyle',
					corners: 'rounded', extractIsolated: false})),
			// edgeNode = half of nodeNode centers the shared tree-edge channel
			// between the levels (mrtree routes it at level end + edgeNode).
			// corners 'rounded' (edge mode stays 'auto') so edges drawn with
			// the session's default style get their corners normalized to the
			// seeded rounded=1 look on the next run; radial/organic/circle
			// route straight edges where corners have no visual effect.
			horizontalTree: entry(true, 300, 160, 'containerType=tree;' +
				elkChildLayout('elkTree', {'elk.direction': 'RIGHT',
					'elk.spacing.nodeNode': '40',
					'elk.spacing.edgeNode': '20', 'elk.padding': leftPad,
					corners: 'rounded'})),
			verticalTree: entry(false, 280, 180, 'containerType=tree;' +
				elkChildLayout('elkTree', {'elk.direction': 'DOWN',
					'elk.spacing.nodeNode': '40',
					'elk.spacing.edgeNode': '20', 'elk.padding': topPad,
					corners: 'rounded'})),
			radialTree: entry(false, 320, 320, 'containerType=tree;' +
				elkChildLayout('elkRadial', {'elk.padding': topPad})),
			organic: entry(false, 320, 320,
				elkChildLayout('elkOrganic', {'elk.padding': topPad})),
			circle: entry(false, 320, 320, 'childLayout=circleLayout;')
		};
	})();

	// Default style for edges seeded inside the layout containers above.
	Menus.layoutContainerEdgeStyle = 'html=1;rounded=1;curved=0;' +
		'sourcePerimeterSpacing=0;targetPerimeterSpacing=0;startSize=6;endSize=6;';

	Menus.prototype.createHelpLink = function(href)
	{
		return this.editorUi.createHelpIcon(href);
	};

	Menus.prototype.addLinkToItem = function(item, href)
	{
		if (item != null)
		{
			item.firstChild.nextSibling.appendChild(this.createHelpLink(href));
		}
	};

	/**
	 * Removes the given font from the list of custom fonts.
	 */
	Menus.prototype.removeCustomFont = function(name, url)
	{
		for (var i = 0; i < this.customFonts.length; i++)
		{
			if (this.customFonts[i].name == name &&
				this.customFonts[i].url == url)
			{
				this.customFonts.splice(i, 1);
				this.editorUi.fireEvent(
					new mxEventObject('customFontsChanged',
					'customFonts', this.customFonts));
				
				break;
			}
		}
	};

	/**
	 * Returns true if the given font is in the list of custom fonts.
	 */
	Menus.prototype.containsFont = function(name, url)
	{
		for (var i = 0; i < this.customFonts.length; i++)
		{
			if (this.customFonts[i].name == name &&
				this.customFonts[i].url == url)
			{
				return true;
			}
		}

		for (var i = 0; i < this.defaultFonts.length; i++)
		{
			var value = this.defaultFonts[i];
			
			if ((typeof value !== 'string' &&
				value.fontFamily == name &&
				value.fontUrl == url) ||
				(typeof value === 'string' &&
				value == name && url == null))
			{
				return true;
			}
		}

		return false;
	};

	/**
	 * Adds the given font to the list of custom fonts.
	 */
	Menus.prototype.addCustomFont = function(name, url)
	{
		if (name != null && !this.containsFont(name, url))
		{
			this.customFonts.push({name: name, url: url});
			this.editorUi.fireEvent(
				new mxEventObject('customFontsChanged',
				'customFonts', this.customFonts));
		}
	};

	var menusInit = Menus.prototype.init;
	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);
		var editorUi = this.editorUi;
		var graph = editorUi.editor.graph;
		var isGraphEnabled = mxUtils.bind(graph, graph.isEnabled);
		
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

			editorUi.showDialog(dlg.container, (compact) ? 350 : 620, (compact) ? 70 : 460, true, true, function(cancel)
			{
				if (editorUi.sidebar != null)
				{
					editorUi.sidebar.hideTooltip();
				}
				
				if (cancel && editorUi.getCurrentFile() == null)
				{
					editorUi.showSplash();
				}
			});
			
			dlg.init();
		});
		
		editorUi.actions.put('insertTemplate', new Action('template' + '...', function()
		{
			editorUi.openTemplateDialog();
		})).isEnabled = isGraphEnabled;

		var pageAction = mxResources.get('page');

		editorUi.actions.put('insertPage', new Action(mxResources.get('insertPage'), function()
		{
			try
			{
				editorUi.insertPage();
			}
			catch (e)
			{
				editorUi.handleError(e);
			}
		})).isEnabled = function() { return editorUi.currentPage != null; };

		editorUi.actions.put('removePage', new Action(mxResources.get('removeIt', [pageAction]), function()
		{
			editorUi.removePage(editorUi.currentPage);
		})).isEnabled = function() { return editorUi.currentPage != null; };

		editorUi.actions.put('renamePage', new Action(mxResources.get('renameIt', [pageAction]) + '...', function()
		{
			editorUi.renamePage(editorUi.currentPage);
		})).isEnabled = function() { return editorUi.currentPage != null; };

		editorUi.actions.put('duplicatePage', new Action(mxResources.get('duplicateIt', [pageAction]), function()
		{
			var page = editorUi.currentPage;
			editorUi.duplicatePage(page, mxResources.get('copyOf', [page.getName()]));
		})).isEnabled = function() { return editorUi.currentPage != null; };
		
		var shareCursorAction = editorUi.actions.addAction('shareCursor', function()
		{
			editorUi.setShareCursorPosition(!editorUi.isShareCursorPosition());;
		});
		
		shareCursorAction.setToggleAction(true);
		shareCursorAction.setSelectedCallback(function() { return editorUi.isShareCursorPosition(); });
		
		var showRemoteCursorsAction = editorUi.actions.addAction('showRemoteCursors', function()
		{
			editorUi.setShowRemoteCursors(!editorUi.isShowRemoteCursors());;
		});
		
		showRemoteCursorsAction.setToggleAction(true);
		showRemoteCursorsAction.setSelectedCallback(function() { return editorUi.isShowRemoteCursors(); });
		
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

		var meterAction = editorUi.actions.addAction('meters', function()
		{
			editorUi.editor.graph.view.setUnit(mxConstants.METERS);
		});
		
		meterAction.setToggleAction(true);
		meterAction.setSelectedCallback(function() { return editorUi.editor.graph.view.unit == mxConstants.METERS; });

		this.put('units', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['points', 'inches', 'millimeters', 'meters'], parent);
		
			if (Editor.currentTheme == 'min' ||
				Editor.currentTheme == 'simple' ||	
				Editor.currentTheme == 'sketch')
			{
				editorUi.menus.addMenuItems(menu, ['-', 'pageScale'], parent);
			}
		})));

		var pagesAction = editorUi.actions.addAction('pageTabs', function()
		{
			editorUi.setTabContainerVisible(!editorUi.isTabContainerVisible(), true);
		});
		
		pagesAction.setToggleAction(true);
		pagesAction.setSelectedCallback(function() { return editorUi.isTabContainerVisible(); });
		
		var rulerAction = editorUi.actions.addAction('ruler', function()
		{
			editorUi.setRulerVisible(!editorUi.isRulerVisible());
		});

		rulerAction.setEnabled(Editor.canvasSupported && document.documentMode != 9);
		rulerAction.setToggleAction(true);
		rulerAction.setSelectedCallback(function() { return editorUi.isRulerVisible(); });
		
        var fullscreenAction = editorUi.actions.addAction('fullscreen', function()
		{
			if (urlParams['embedInline'] == '1')
			{
				editorUi.setInlineFullscreen(!Editor.inlineFullscreen);
			}
			else
			{
				var node = (mxUtils.isAncestorNode(document.body, editorUi.container)) ?
					editorUi.container : editorUi.editor.graph.container;
			
				if (node != null)
				{
					if (document.fullscreenElement == null)
					{
						document.body.requestFullscreen();
						node.classList.add('geFullscreen');
					}
					else
					{
						document.exitFullscreen();
						node.classList.remove('geFullscreen');
					}
				}
			}
		});

		fullscreenAction.visible = urlParams['embedInline'] == '1' ||
			(window == window.top && document.fullscreenEnabled &&
			document.body.requestFullscreen != null);
		fullscreenAction.setToggleAction(true);
		
		fullscreenAction.setSelectedCallback(function()
		{
			return urlParams['embedInline'] == '1' ? 
				Editor.inlineFullscreen :
				document.fullscreenElement != null;
		});

        var lightModeAction = editorUi.actions.put('lightMode', new Action('light', function(e)
        {
			editorUi.setAndPersistDarkMode(false);
        }));

		lightModeAction.setToggleAction(true);
		lightModeAction.setSelectedCallback(function()
		{
			return !editorUi.isAutoDarkMode(true) && !Editor.isDarkMode();
		});
		
        var darkModeAction = editorUi.actions.put('darkMode', new Action('dark', function(e)
        {
			editorUi.setAndPersistDarkMode(true);
        }));

		darkModeAction.setToggleAction(true);
		darkModeAction.setSelectedCallback(function()
		{
			return !editorUi.isAutoDarkMode(true) && Editor.isDarkMode();
		});
		
        var autoModeAction = editorUi.actions.put('autoMode', new Action('automatic', function(e)
        {
			editorUi.setAndPersistDarkMode('auto');
        }));

		autoModeAction.setToggleAction(true);
		autoModeAction.setSelectedCallback(function()
		{
			return editorUi.isAutoDarkMode(true);
		});
		
		editorUi.actions.addAction('properties...', function()
		{
			editorUi.getPublicUrl(editorUi.getCurrentFile(), function(url)
			{
				var dlg = new FilePropertiesDialog(editorUi, url);
				editorUi.showDialog(dlg.container, 360, null, true, true);
				dlg.init();
			});
		}).isEnabled = isGraphEnabled;
	
		if (window.mxFreehand)
		{
			var freehandAction = editorUi.actions.put('insertFreehand', new Action('freehand', function()
			{
				if (graph.isEnabled())
				{
					if (editorUi.freehandWindow == null)
					{
						var saved = mxSettings.getWindowState('freehand');
						var fx = (saved != null && saved.x != null) ? saved.x :
							document.body.offsetWidth - 420;
						var fy = (saved != null && saved.y != null) ? saved.y : 102;
						var fw = (saved != null && saved.w != null) ? saved.w : 180;
						var fh = (saved != null && saved.h != null) ? saved.h : 126;

						editorUi.freehandWindow = new FreehandWindow(
							editorUi, fx, fy, fw, fh, true);
						editorUi.installWindowPersistence('freehand', editorUi.freehandWindow);

						if (saved != null)
						{
							editorUi.restoreWindowState('freehand', editorUi.freehandWindow);
						}
					}
					
					if (graph.freehand.isDrawing())
					{
						graph.freehand.stopDrawing();
					}
					else
					{
						graph.freehand.startDrawing();
					}
					
					editorUi.freehandWindow.window.setVisible(graph.freehand.isDrawing());
				}
			}, null, null, 'X'));
			
			freehandAction.isEnabled = function()
			{
				return isGraphEnabled();
			};

			freehandAction.setToggleAction(true);

			freehandAction.setSelectedCallback(function()
			{
				return editorUi.freehandWindow != null && editorUi.freehandWindow.window.isVisible();
			});
		}
		
		editorUi.actions.put('exportXml', new Action('formatXml' + '...', function()
		{
			var div = document.createElement('div');
			div.style.whiteSpace = 'nowrap';
			var noPages = editorUi.pages == null || editorUi.pages.length <= 1;

			var hd = document.createElement('h3');
			mxUtils.write(hd, mxResources.get('formatXml'));
			hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
			div.appendChild(hd);

			var section = document.createElement('div');
			section.className = 'geDialogSection';

			var selection = editorUi.addCheckbox(section, mxResources.get('selectionOnly'),
				false, graph.isSelectionEmpty());
			var compressed = editorUi.addCheckbox(section, mxResources.get('compressed'), Editor.defaultCompressed);
			var pages = editorUi.addCheckbox(section, mxResources.get('allPages'), !noPages, noPages);

			div.appendChild(section);

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

			editorUi.showDialog(dlg.container, 300, 200, true, true);
		}));
		
		if (Editor.enableExportUrl)
		{
			editorUi.actions.put('exportUrl', new Action('url' + '...', function()
			{
				editorUi.showPublishLinkDialog(mxResources.get('url'), null, null, null, null, null, null, null,
					function(linkTarget, linkColor, currentPage, lightbox, editLink, layers, width, height,
						tags, link, transparent, darkMode, allPages, useTagSettings, linkIcons, tooltipIcons)
					{
						var params = [];

						if (lightbox && tags)
						{
							var hiddenTagsMap = useTagSettings ? editorUi.getHiddenTagsMap() : null;
							params.push('tags=' + encodeURIComponent(
								JSON.stringify(hiddenTagsMap || {})));
						}

						var dlg = new EmbedDialog(editorUi, editorUi.createLink(linkTarget, linkColor,
							allPages, lightbox, editLink, layers, null, true, params, null,
							currentPage, null, darkMode, linkIcons, tooltipIcons));
						editorUi.showDialog(dlg.container, 450, 270, true, true, null, false, null, new mxRectangle(0, 0, 400, 250));
						dlg.init();
					}, null, true, true);
			}));
		}
		
		editorUi.actions.put('exportJson', new Action('formatJson' + '...', function()
		{
			var div = document.createElement('div');
			div.style.whiteSpace = 'nowrap';
			var noPages = editorUi.pages == null || editorUi.pages.length <= 1;

			var hd = document.createElement('h3');
			mxUtils.write(hd, mxResources.get('formatJson'));
			hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
			div.appendChild(hd);

			var section = document.createElement('div');
			section.className = 'geDialogSection';

			var graph = editorUi.editor.graph;
			var selection = editorUi.addCheckbox(section, mxResources.get('selectionOnly'),
				false, graph.isSelectionEmpty());
			var pages = editorUi.addCheckbox(section, mxResources.get('allPages'), !noPages, noPages);
			var includeCopy = editorUi.addCheckbox(section, mxResources.get('includeCopyOfMyDiagram'), false);
			var compressed = editorUi.addCheckbox(section, mxResources.get('compressed'),
				Editor.defaultCompressed, true);

			div.appendChild(section);

			// Exporting the selection only is restricted to the current page
			mxEvent.addListener(selection, 'change', function()
			{
				if (selection.checked)
				{
					pages.setAttribute('disabled', 'disabled');
				}
				else if (!noPages)
				{
					pages.removeAttribute('disabled');
				}
			});

			// Compression only applies to the included copy of the diagram
			mxEvent.addListener(includeCopy, 'change', function()
			{
				if (includeCopy.checked)
				{
					compressed.removeAttribute('disabled');
				}
				else
				{
					compressed.setAttribute('disabled', 'disabled');
				}
			});

			var dlg = new CustomDialog(editorUi, div, mxUtils.bind(this, function()
			{
				var useSelection = selection.checked && !graph.isSelectionEmpty();
				var allPages = !useSelection && !noPages && pages.checked;
				var json = editorUi.createJsonForExport(allPages, includeCopy.checked,
					includeCopy.checked && compressed.checked, useSelection);
				editorUi.saveData(editorUi.getBaseFilename(allPages) + '.json', 'json',
					JSON.stringify(json, null, 2), 'application/json');
			}), null, mxResources.get('export'));

			editorUi.showDialog(dlg.container, 300, 240, true, true);
		}));

		editorUi.actions.put('exportHtml', new Action('formatHtmlEmbedded' + '...', function()
		{
			editorUi.getPublicUrl(editorUi.getCurrentFile(), function(url)
			{
				editorUi.showHtmlDialog(mxResources.get('export'),
					'https://www.drawio.com/docs/manual/export/embed-html/', url, function(publicUrl, zoomEnabled,
					initialZoom, linkTarget, linkColor, fit, allPages, layers, tags, lightbox, editLink, theme,
					useTagSettings, linkIcons, tooltipIcons)
				{
					editorUi.createHtml(publicUrl, zoomEnabled, initialZoom, linkTarget, linkColor, fit, allPages,
						layers, tags, lightbox, editLink, mxUtils.bind(this, function(html, scriptTag)
						{
							var basename = editorUi.getBaseFilename(allPages);
							var result = '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->\n' +
								'<!DOCTYPE html>\n<html>\n<head>\n<title>' + mxUtils.htmlEntities(basename) + '</title>\n' +
								'<meta charset="utf-8"/>\n</head>\n<body>' + html + '\n' + scriptTag + '\n</body>\n</html>';
							editorUi.saveData(basename + ((basename.substring(basename.lenth - 7) ==
								'.drawio') ? '' : '.drawio') + '.html', 'html', result, 'text/html');
						}), theme, useTagSettings, linkIcons, tooltipIcons);
				});
			});
		}));
		
		editorUi.actions.put('exportPdf', new Action('formatPdf' + '...', function()
		{
			editorUi.showPrintDialog(mxResources.get('formatPdf'),
				(!EditorUi.isElectronApp && (editorUi.isOffline() || editorUi.printPdfExport)) ?
					null : mxUtils.bind(this, function(preview, args)
					{
						var pageCount = (editorUi.pages != null) ? editorUi.pages.length : 1;
						var noPages = editorUi.pages == null || editorUi.pages.length <= 1;
						var idx = editorUi.getPageIndex(editorUi.currentPage);
						var currentPage = (idx != null) ? idx + 1 : 1;
						var pageRange = (!args.allPages && (args.pagesFrom != currentPage || args.pagesTo != currentPage)) ?
							{from: Math.max(0, Math.min(pageCount - 1, args.pagesFrom - 1)),
								to: Math.max(0, Math.min(pageCount - 1, args.pagesTo - 1))} : null;
						
						editorUi.downloadFile('pdf', null, null, !args.selection, noPages ||
							(!args.allPages && args.pagesFrom == currentPage && args.pagesTo == currentPage), !args.crop,
							args.transparent, args.scale, null, args.grid, args.includeCopy, pageRange, args.border,
							args.fit, args.sheetsAcross, args.sheetsDown, args.shadows);					
					}), mxResources.get('export'));
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
				
				editorUi.fileLoaded(new LocalFile(editorUi,
					editorUi.emptyDiagramXml, null, true));
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
		
		editorUi.actions.addAction('extractText', function(ignoreSelection)
		{
			var text = graph.getIndexableText(
				(ignoreSelection || graph.isSelectionEmpty()) ? null :
				graph.getSelectionCells());
			var dlg = new EmbedDialog(editorUi, text, null,
				null, null, mxResources.get('extractText'));
			editorUi.showDialog(dlg.container, 450, 240, true, true);
			dlg.init();
		});

		editorUi.actions.addAction('editShape...', mxUtils.bind(this, function()
		{
			if (graph.getSelectionCount() == 1)
			{
				var cell = graph.getSelectionCell();
				var state = graph.view.getState(cell);
				
				if (state != null && state.shape != null && state.shape.stencil != null)
				{
			    	var dlg = new EditShapeDialog(editorUi, cell, mxResources.get('editShape'));
					editorUi.showDialog(dlg.container, 640, 480, true, false,
						null, null, null, new mxRectangle(0, 0, 300, 200));
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
					editorUi.handleError((err != null) ? err : mxResources.get('notAvailable'));
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
		}, null, null, Editor.altKey + '+' + Editor.shiftKey + '+S');
		
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
		}, null, null, null, navigator.onLine && urlParams['stealth'] != '1' && urlParams['lockdown'] != '1');

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

		// Dynamic title is implemented below
		var defaultAdaptiveColors = editorUi.actions.put('defaultAdaptiveColors', new Action('defaultAdaptiveColors',
			function()
		{
			var change = new ChangePageSetup(editorUi);
			change.ignoreColor = true;
			change.ignoreImage = true;
			change.adaptiveColors = 'default';
			
			graph.model.execute(change);
		}));

		defaultAdaptiveColors.getTitle = function()
		{
			return mxResources.get('default') + ' (' + mxResources.get(Graph.getDefaultAdaptiveColorsKey()) + ')';
		};

		defaultAdaptiveColors.setToggleAction(true);
		defaultAdaptiveColors.setSelectedCallback(function() { return graph.adaptiveColors == null; });

		var automaticAdaptiveColors = editorUi.actions.put('automaticAdaptiveColors', new Action('automatic', function()
		{
			var change = new ChangePageSetup(editorUi);
			change.ignoreColor = true;
			change.ignoreImage = true;
			change.adaptiveColors = 'auto';
			
			graph.model.execute(change);
		}));

		automaticAdaptiveColors.setToggleAction(true);
		automaticAdaptiveColors.setSelectedCallback(function() { return graph.adaptiveColors == 'auto'; });

		var simpleAdaptiveColors = editorUi.actions.put('simpleAdaptiveColors', new Action('simple', function()
		{
			var change = new ChangePageSetup(editorUi);
			change.ignoreColor = true;
			change.ignoreImage = true;
			change.adaptiveColors = 'simple';
			
			graph.model.execute(change);
		}));

		simpleAdaptiveColors.setToggleAction(true);
		simpleAdaptiveColors.setSelectedCallback(function() { return graph.adaptiveColors == 'simple'; });

		var noAdaptiveColors = editorUi.actions.put('noAdaptiveColors', new Action('none', function()
		{
			var change = new ChangePageSetup(editorUi);
			change.ignoreColor = true;
			change.ignoreImage = true;
			change.adaptiveColors = 'none';
			
			graph.model.execute(change);
		}));

		noAdaptiveColors.setToggleAction(true);
		noAdaptiveColors.setSelectedCallback(function() { return graph.adaptiveColors == 'none'; });

		this.put('adaptiveColors', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['defaultAdaptiveColors', '-',
				'automaticAdaptiveColors', 'simpleAdaptiveColors',
				'noAdaptiveColors'], parent);
		})));

		if (isLocalStorage)
		{
			var action = editorUi.actions.addAction('showStartScreen', function()
			{
				mxSettings.setShowStartScreen(!mxSettings.getShowStartScreen());
				urlParams['splash'] = (mxSettings.getShowStartScreen()) ? '1' : '0';
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
				editorUi.showDialog(dlg.container, 300, null, true, true);
				dlg.init();
			}
		}, null, null, Editor.ctrlKey + '+' + Editor.shiftKey + '+M');
		
		editorUi.actions.addAction('copyStyle', function()
		{
			if (graph.isEnabled() && graph.getSelectionCount() == 1)
			{
				var cell = graph.getSelectionCell();
				var style = graph.getCellStyle(cell, false);
				editorUi.copiedStyle = {};
				var values = [];
				var keys = [];

				for (var key in style)
				{
					values.push(style[key]);
					keys.push(key);
				}
				
				graph.copyCellStyles([cell], keys, values,
					editorUi.copiedStyle, editorUi.copiedStyle,
					null, null, null, true);
			}
		}, null, null,  Editor.altKey + '+C');

		editorUi.actions.addAction('pasteStyle', function()
		{
			if (graph.isEnabled() && !graph.isSelectionEmpty() && editorUi.copiedStyle != null)
			{
				graph.pasteCellStyles(graph.includeDescendantParts(graph.getSelectionCells()),
					editorUi.copiedStyle, editorUi.copiedStyle, true);
			}
		}, null, null,  Editor.altKey + '+V');

		editorUi.actions.addAction('copyTextStyle', function()
		{
			if (graph.isEnabled() && graph.getSelectionCount() == 1)
			{
				var cell = graph.getSelectionCell();
				var style = graph.getCellStyle(cell, false);
				editorUi.copiedTextStyle = {};

				for (var i = 0; i < Graph.pasteTextStyles.length; i++)
				{
					var key = Graph.pasteTextStyles[i];

					if (style[key] != null)
					{
						editorUi.copiedTextStyle[key] = style[key];
					}
					else if (key == 'fontStyle')
					{
						editorUi.copiedTextStyle[key] = 0;
					}
				}
			}
		}, null, null, Editor.altKey + '+' + Editor.shiftKey + '+C');

		editorUi.actions.addAction('pasteTextStyle', function()
		{
			if (graph.isEnabled() && !graph.isSelectionEmpty() && editorUi.copiedTextStyle != null)
			{
				graph.pasteTextStyles(graph.includeDescendantParts(graph.getSelectionCells()),
					editorUi.copiedTextStyle);
			}
		}, null, null, Editor.altKey + '+' + Editor.shiftKey + '+V');
		
		editorUi.actions.put('exportSvg', new Action('formatSvg' + '...', function()
		{
			editorUi.showExportDialog(mxResources.get('formatSvg'), true, mxResources.get('export'),
				'https://www.drawio.com/doc/faq/export-diagram',
				mxUtils.bind(this, function(scale, transparentBackground, ignoreSelection,
					addShadow, editable, embedImages, border, cropImage, currentPage,
					linkTarget, grid, theme, exportType, embedFonts, embedCellMetadata)
				{
					var val = parseInt(scale);
					editorUi.lastExportSvgEditable = editable;

					if (!isNaN(val) && val > 0)
					{
						editorUi.exportSvg(val / 100, transparentBackground, ignoreSelection,
							addShadow, editable, embedImages, border, !cropImage, currentPage,
							linkTarget, theme, exportType, embedFonts, null, embedCellMetadata,
							grid);
					}
				}), true, editorUi.lastExportSvgEditable, 'svg', true);
		}));

		function exportImage(format, defaultEditable, done)
		{
			if (editorUi.editor.isExportToCanvas())
			{
				editorUi.showExportDialog(mxResources.get('image'), false, mxResources.get('export'),
					'https://www.drawio.com/doc/faq/export-diagram',
					mxUtils.bind(this, function(scale, transparentBackground, ignoreSelection, addShadow, editable,
						embedImages, border, cropImage, currentPage, dummy, grid, theme, exportType, embedFonts,
						embedCellMetadata, dpi)
					{
						var val = parseInt(scale);

						if (!isNaN(val) && val > 0)
						{
							editorUi.exportImage(val / 100, transparentBackground && format == 'png',
								ignoreSelection, addShadow, editable && format == 'png', border,
								!cropImage, currentPage, format, grid, (format == 'png') ? dpi : null, theme, exportType);

							if (done != null)
							{
								done(scale, transparentBackground, ignoreSelection, addShadow,
									editable, embedImages, border, cropImage, currentPage,
									dummy, grid, theme, exportType);
							}
						}
					}), true, defaultEditable, format, true);
			}
			else if (!editorUi.isOffline() && (!mxClient.IS_IOS || !navigator.standalone))
			{
				editorUi.showRemoteExportDialog(mxResources.get('export'), null, mxUtils.bind(this,
					function(ignoreSelection, editable, transparent, scale, border)
				{
					editorUi.downloadFile((editable && format == 'png') ? 'xmlpng' : format,
						null, null, ignoreSelection, null, null, transparent, scale, border);
				}), false, true);
			}
		};
		
		editorUi.actions.put('exportPng', new Action('formatPng' + '...', function()
		{
			exportImage('png', editorUi.lastExportPngEditable, function(scale,
				transparentBackground, ignoreSelection, addShadow, editable)
			{
				editorUi.lastExportPngEditable = editable;
			});
		}));
		
		editorUi.actions.put('exportJpg', new Action('formatJpg' + '...', function()
		{
			exportImage('jpeg');
		}));
		
		editorUi.actions.put('exportWebp', new Action('formatWebp' + '...', function()
		{
			exportImage('webp');
		}));

		editorUi.actions.put('exportAnimatedGif', new Action(mxResources.get('formatAnimatedGif',
			null, 'Animated GIF') + '...', function()
		{
			editorUi.showAnimatedGifExportDialog();
		}));

		action = editorUi.actions.addAction('copyAsImage', mxUtils.bind(this, function()
		{
			var cells = mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells()));
			editorUi.copyImage(cells);
		}), null, null, Editor.ctrlKey + '+' + Editor.altKey + '+X');

		action.visible = Editor.enableNativeClipboard && editorUi.editor.isExportToCanvas();

		action = editorUi.actions.addAction('copyAsSvg', mxUtils.bind(this, function()
		{
			var cells = mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells()));
			editorUi.copySvg(cells);
		}), null, null, Editor.ctrlKey + '+' + Editor.altKey + '+' + Editor.shiftKey + '+X');

		action.visible = Editor.enableNativeClipboard && editorUi.editor.isExportToCanvas();

		action = editorUi.actions.put('shadowVisible', new Action('shadow', function()
		{
			graph.setShadowVisible(!graph.shadowVisible);
		}));
		action.setToggleAction(true);
		action.setSelectedCallback(function() { return graph.shadowVisible; });

		editorUi.actions.put('about', new Action('v' + EditorUi.VERSION, function(arg1, evt)
		{
			if (mxEvent.isShiftDown(evt) && (EditorUi.isElectronApp ||
				editorUi.isOwnGDriveDomain()))
			{
				if (urlParams['test'] == '1')
				{
					EditorUi.debug('Debug output disabled');
					urlParams['test'] = '0';
				}
				else
				{
					urlParams['test'] = '1';
					EditorUi.debug('Debug output enabled');
				}
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

		editorUi.actions.addAction('downloadDesktop...', function()
		{
			editorUi.openLink('https://get.diagrams.net/');
		});

		editorUi.actions.addAction('exportOptionsDisabled...', function()
		{
			editorUi.handleError({message: mxResources.get('exportOptionsDisabledDetails')},
				mxResources.get('exportOptionsDisabled'));
		});

		editorUi.actions.addAction('keyboardShortcuts...', function()
		{
			if (!mxClient.IS_CHROMEAPP &&
				!EditorUi.isElectronApp &&
				!navigator.standalone)
			{
				editorUi.openLink('shortcuts.svg');
			}
			else
			{
				editorUi.openLink('https://app.diagrams.net/shortcuts.svg');
			}
		});
		
		editorUi.actions.addAction('quickStart...', function()
		{
			if ('ac.draw.io' === window.location.hostname)
			{
				editorUi.openLink('https://www.youtube.com/watch?v=s5BG0705MHU');
			}
			else
			{
				editorUi.openLink('https://www.youtube.com/watch?v=Z0D96ZikMkc');
			}
		});
		
		action = editorUi.actions.addAction('tags', mxUtils.bind(this, function()
		{
			if (this.tagsWindow == null)
			{
				var saved = mxSettings.getWindowState('tags');
				var tx = (saved != null && saved.x != null) ? saved.x :
					document.body.offsetWidth - 400;
				var ty = (saved != null && saved.y != null) ? saved.y : 60;
				var tw = (saved != null && saved.w != null) ? saved.w : 212;
				var th = (saved != null && saved.h != null) ? saved.h : 200;

				this.tagsWindow = new TagsWindow(editorUi, tx, ty, tw, th);
				this.tagsWindow.window.addListener('show', mxUtils.bind(this, function()
				{
					editorUi.fireEvent(new mxEventObject('tags'));
				}));
				this.tagsWindow.window.addListener('hide', function()
				{
					editorUi.fireEvent(new mxEventObject('tags'));
				});

				editorUi.installWindowPersistence('tags', this.tagsWindow);

				if (saved != null)
				{
					editorUi.restoreWindowState('tags', this.tagsWindow);
				}

				this.tagsWindow.window.setVisible(true);

				editorUi.fireEvent(new mxEventObject('tags'));
			}
			else
			{
				this.tagsWindow.window.setVisible(!this.tagsWindow.window.isVisible());
			}
		}), null, null, Editor.ctrlKey + '+K');
		action.setToggleAction(true);
		action.setSelectedCallback(mxUtils.bind(this, function() { return this.tagsWindow != null && this.tagsWindow.window.isVisible(); }));

		action = editorUi.actions.addAction('animation', mxUtils.bind(this, function()
		{
			if (this.animationWindow == null)
			{
				var saved = mxSettings.getWindowState('animation');
				var ax = (saved != null && saved.x != null) ? saved.x :
					Math.max(0, (document.body.offsetWidth - 480) / 2);
				var ay = (saved != null && saved.y != null) ? saved.y : 120;
				var aw = (saved != null && saved.w != null) ? saved.w : 480;
				var ah = (saved != null && saved.h != null) ? saved.h : 460;

				this.animationWindow = new AnimationDialog(editorUi, ax, ay, aw, ah);
				this.animationWindow.window.addListener('show', mxUtils.bind(this, function()
				{
					editorUi.fireEvent(new mxEventObject('animation'));
				}));
				this.animationWindow.window.addListener('hide', function()
				{
					editorUi.fireEvent(new mxEventObject('animation'));
				});

				editorUi.installWindowPersistence('animation', this.animationWindow);

				if (saved != null)
				{
					editorUi.restoreWindowState('animation', this.animationWindow);
				}

				this.animationWindow.window.setVisible(true);
				editorUi.fireEvent(new mxEventObject('animation'));
			}
			else
			{
				this.animationWindow.window.setVisible(!this.animationWindow.window.isVisible());
			}
		}));
		action.setToggleAction(true);
		action.setSelectedCallback(mxUtils.bind(this, function() { return this.animationWindow != null && this.animationWindow.window.isVisible(); }));

		// Shown on aj/ac domains
		if ((EditorUi.isElectronApp ||
			(Editor.enableAi || ((Editor.config == null ||
			Editor.config.enableAi == null) &&
			(/ac\.draw\.io$/.test(window.location.hostname)) ||
			(/aj\.draw\.io$/.test(window.location.hostname)))) &&
			!editorUi.isOffline() &&
			Editor.aiActions.length > 0 &&
			editorUi.isExternalDataComms()) &&
			editorUi.getServiceName() == 'draw.io' &&
			EditorUi.isMermaidSupported())
		{
			var generateAction = editorUi.actions.put('generate', new Action('generate', function()
			{
				if (!EditorUi.isElectronApp && !Editor.enableAi)
				{
					editorUi.alert('AI features require admin approval' +
						'<br><a href="https://www.drawio.com/doc/faq/confluence-ai-options" target="_blank">Learn more</a>');
				}
				else
				{
					if (editorUi.chatWindow != null)
					{
						editorUi.chatWindow.window.setVisible(!editorUi.chatWindow.window.isVisible());
					}
					else
					{
						editorUi.openGenerateDialog('');
					}
				}
			}));

			generateAction.isEnabled = function()
			{
				return isGraphEnabled();
			};

			generateAction.setToggleAction(true);

			generateAction.setSelectedCallback(function()
			{
				return editorUi.chatWindow != null && editorUi.chatWindow.window.isVisible();
			});
		}
		
		action = editorUi.actions.addAction('findReplace', mxUtils.bind(this, function(arg1, evt)
		{
			editorUi.showSearchWindow(graph.isEnabled() && (evt == null || !mxEvent.isShiftDown(evt)));
		}), null, null, Editor.ctrlKey + '+F');
		
		var exportVsdxAction = new Action('exportVsdx', function()
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
				hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
				div.appendChild(hd);

				var section = document.createElement('div');
				section.className = 'geDialogSection';

				var pages = editorUi.addCheckbox(section, mxResources.get('allPages'), !noPages, noPages);

				div.appendChild(section);

				var dlg = new CustomDialog(editorUi, div, mxUtils.bind(this, function()
				{
					editorUi.exportVisio(!pages.checked);
				}), null, mxResources.get('export'));

				editorUi.showDialog(dlg.container, 300, 146, true, true);
			}
		});

		exportVsdxAction.getTitle = function()
		{
			return mxResources.get('formatVsdx') + ' (beta)...';
		};

		editorUi.actions.put('exportVsdx', exportVsdxAction);

		if (isLocalStorage && localStorage != null && urlParams['embed'] != '1')
		{
			editorUi.actions.addAction('configuration...', function()
			{
				// Moves show start screen option to configuration dialog in sketch
				var splashCb = document.createElement('input');
				splashCb.setAttribute('type', 'checkbox');
				splashCb.style.marginRight = '8px';
				splashCb.checked = mxSettings.getShowStartScreen();
				splashCb.defaultChecked = splashCb.checked;

				if (Editor.isSettingsEnabled() && (Editor.currentTheme == 'sketch' ||
					Editor.currentTheme == 'simple' || Editor.currentTheme == 'min'))
				{
					var showSplash = document.createElement('span');
					showSplash.style.display = 'flex';
					showSplash.style.alignItems = 'center';
					showSplash.style.cssFloat = 'right';
					showSplash.style.cursor = 'pointer';
					showSplash.style.userSelect = 'none';
					showSplash.style.marginTop = '-3px';
					showSplash.appendChild(splashCb);
					mxUtils.write(showSplash, mxResources.get('showStartScreen'));

					mxEvent.addListener(showSplash, 'click', function(evt)
					{
						if (mxEvent.getSource(evt) != splashCb)
						{	
							splashCb.checked = !splashCb.checked;
						}
					});

					header = showSplash;
				}
				
				var buttons = [[mxResources.get('reset'), function()
				{
					editorUi.confirm(mxResources.get('areYouSure'), function()
					{
						try
						{
							localStorage.removeItem(Editor.configurationKey);
							editorUi.hideDialog();
							editorUi.alert(mxResources.get('restartForChangeRequired'));
						}
						catch (e)
						{
							editorUi.handleError(e);
						}
					});
				}]];
				
				if (!editorUi.isOfflineApp() && isLocalStorage && editorUi.mode != App.MODE_ATLAS)
				{
					var pluginsAction = editorUi.actions.get('plugins');

					if (pluginsAction != null && (Editor.currentTheme == 'sketch' ||
						Editor.currentTheme == 'simple' || Editor.currentTheme == 'min'))
					{
						// TODO: Show change message only when plugins have changed
						buttons.push([mxResources.get('plugins'), pluginsAction.funct]);
					}
				}
				
				if (!EditorUi.isElectronApp)
				{
					buttons.push([mxResources.get('link'), function(evt, input)
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
								editorUi.showDialog(dlg.container, 450, 270, true, true, null, false, null, new mxRectangle(0, 0, 400, 250));
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

				if (editorUi.getServiceName() != 'atlassian' && urlParams['embed'] != '1')
				{
					buttons.push([mxResources.get('preferences'), function()
					{
						editorUi.showLocalStorageDialog(mxResources.get('preferences') + ':', Editor.settingsKey,
							[[mxResources.get('reset'), function()
							{
								editorUi.confirm(mxResources.get('areYouSure'), function()
								{
									try
									{
										localStorage.removeItem(Editor.settingsKey);
										localStorage.removeItem('.drawio-config');
										editorUi.hideDialog();
										editorUi.alert(mxResources.get('restartForChangeRequired'));
									}
									catch (e)
									{
										editorUi.handleError(e);
									}
								});
							}]]);
					}]);
				}
				
				editorUi.showConfigurationEditorDialog(mxResources.get('configuration') + ':', Editor.configurationKey,
					buttons, splashCb.parentNode, 'https://www.drawio.com/doc/faq/configure-diagram-editor',
					function()
					{
						if (splashCb.parentNode != null)
						{
							mxSettings.setShowStartScreen(splashCb.checked);
							mxSettings.save();
						}
					});
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
				var currentLanguage = mxLanguage;

				if (urlParams['lang'] == null && isLocalStorage)
				{
					currentLanguage = mxSettings.settings.language;
				}
				
				var addLangItem = mxUtils.bind(this, function (id)
				{
					var lang = (id == '') ? mxResources.get('automatic') : mxLanguageMap[id];
					var item = null;
					
					if (lang != '')
					{
						item = menu.addItem(lang, null, mxUtils.bind(this, function()
						{
							editorUi.setAndPersistLanguage(id);
						}), parent);
						
						if (id == currentLanguage || (id == '' && currentLanguage == null))
						{
							menu.addCheckmark(item, Editor.checkmarkImage);
						}
					}
					
					return item;
				});
				
				addLangItem('');
				menu.addSeparator(parent);

				// LATER: Sort menu by language name
				for(var langId in mxLanguageMap) 
				{
					addLangItem(langId);
				}
			})));
		}
		
		// Starts empty so the dialog opens with just the Add dropdown — picking
		// a layout from there builds the JSON entry via that layout's config
		// dialog. Hand-editing is still supported on top of what Add inserts.
		editorUi.customLayoutConfig = [];
		
		// Adds action for running layouts
		editorUi.actions.addAction('runLayout', function()
		{
	    	editorUi.showCustomLayoutDialog(JSON.stringify(
				editorUi.customLayoutConfig, null, 2));
		});

		// Adds action for removing user-defined colors
		editorUi.actions.put('adaptiveColors', new Action('adaptiveColors', function(evt)
		{
			if (editorUi.adaptiveColorsWindow == null)
			{
				editorUi.adaptiveColorsWindow = new AdaptiveColorsWindow(
					editorUi, document.body.offsetWidth - 520, 80, 200, 160);
			}

			editorUi.adaptiveColorsWindow.window.setVisible(true);
		}));

		// Adds fullscreen toggle to zoom menu in sketch and min
        var viewZoomMenu = this.get('viewZoom');
		var viewZoomMenuFunct = viewZoomMenu.funct;
		
		viewZoomMenu.funct = mxUtils.bind(this, function(menu, parent)
		{
			viewZoomMenuFunct.apply(this, arguments);
			
			if (Editor.currentTheme == 'sketch' || Editor.currentTheme == 'min')
			{
				this.addMenuItems(menu, ['-', 'outline', 'fullscreen'], parent);
			}
		});
		
		var layoutMenu = this.get('layout');
		var layoutMenuFunct = layoutMenu.funct;

		// Original (mxGraph) layout items are exposed via the Legacy Layouts submenu
		this.put('legacyLayout', new Menu(layoutMenuFunct));

		layoutMenu.funct = function(menu, parent)
		{
			// Re-runs the most recent layout with the same options (recorded
			// as a custom-layout array on lastLayoutSpec by executeLayoutSpec,
			// ElkLayout.run, LibavoidRouting.run and the custom layout
			// dialog); grayed out until a layout has run in this session.
			menu.addItem(mxResources.get('runLastLayout'), null, function()
			{
				// retargetSelection: as a menu gesture the replay may retarget
				// a selected layout container's childLayout, like the other
				// Arrange > Layout items (programmatic executeLayoutSpec
				// callers must not).
				editorUi.executeLayoutSpec(editorUi.lastLayoutSpec, null, true);
			}, parent, null, isGraphEnabled() && editorUi.lastLayoutSpec != null);

			menu.addSeparator(parent);

			if (typeof ElkLayout !== 'undefined')
			{
				// Resolve each menu name through ElkLayout.MENU_PRESETS (the single
				// source shared with drawio-mcp) so the algorithm + direction live
				// in one place (drawio-elk), not inline here.
				var addElk = function(name)
				{
					menu.addItem(mxResources.get(name) + '...', null, function()
					{
						var p = ElkLayout.MENU_PRESETS[name];
						ElkLayout.runWithDialog(editorUi, p.algorithm, p.options,
							mxResources.get(name));
					}, parent, null, isGraphEnabled());
				};

				addElk('verticalFlow');
				addElk('horizontalFlow');
				menu.addSeparator(parent);
				addElk('verticalTree');
				addElk('horizontalTree');
				addElk('radialTree');
				menu.addSeparator(parent);
				addElk('organic');
			}
			else
			{
				layoutMenuFunct.apply(this, arguments);
			}

			menu.addItem(mxResources.get('orgChart') + '...', null, function()
			{
				var branchOptimizer = null, parentChildSpacingVal = 20, siblingSpacingVal = 20;
				
				// Invoked when orgchart code was loaded
				var delayed = function()
				{
					if (typeof mxOrgChartLayout !== 'undefined' && branchOptimizer != null)
					{
						editorUi.tryAndHandle(mxUtils.bind(this, function()
						{
							var graph = editorUi.editor.graph;
							var orgChartLayout = new mxOrgChartLayout(graph,
								branchOptimizer, parentChildSpacingVal, siblingSpacingVal);
							var cell = graph.getDefaultParent();
							
							if (graph.model.getChildCount(graph.getSelectionCell()) > 1)
							{
								cell = graph.getSelectionCell();
							}
							
							orgChartLayout.execute(cell);
						}));
					}
				};

				var div = document.createElement('div');

				// Each label + control sits on its own block row with a bottom
				// margin, so the rows keep a consistent vertical rhythm. The old
				// inline-block flow gave the rows no inter-row spacing (the
				// label marginTop only nudged vertical-align within a row), so
				// the dropdown row sat cramped against the row below it.
				var addRow = function(labelKey, control)
				{
					var row = document.createElement('div');
					row.style.marginBottom = '8px';

					var label = document.createElement('div');
					label.style.display = 'inline-block';
					label.style.width = '180px';
					label.style.verticalAlign = 'middle';
					mxUtils.write(label, mxResources.get(labelKey) + ': ');
					row.appendChild(label);

					control.style.width = '160px';
					control.style.boxSizing = 'border-box';
					control.style.verticalAlign = 'middle';
					row.appendChild(control);

					div.appendChild(row);
				};

				var typeSelect = document.createElement('select');

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

				addRow('orgChartType', typeSelect);

				var parentChildSpacing = document.createElement('input');
				parentChildSpacing.type = 'number';
				parentChildSpacing.value = parentChildSpacingVal;

				mxEvent.addListener(parentChildSpacing, 'change', function()
				{
					parentChildSpacingVal = parentChildSpacing.value;
				});

				addRow('parentChildSpacing', parentChildSpacing);

				var siblingSpacing = document.createElement('input');
				siblingSpacing.type = 'number';
				siblingSpacing.value = siblingSpacingVal;

				mxEvent.addListener(siblingSpacing, 'change', function()
				{
					siblingSpacingVal = siblingSpacing.value;
				});

				addRow('siblingSpacing', siblingSpacing);

				// The legacy "Custom…" escape hatch is gone now that the Custom
				// Layout dialog has its own Add dropdown — picking Org Chart
				// there opens this same configuration UI and writes the JSON.
				var dlg = new CustomDialog(editorUi, div, function()
				{
					if (branchOptimizer == null)
					{
						branchOptimizer = 2;
					}

					editorUi.loadOrgChartLayouts(delayed);
				}, null, null,
					'https://www.drawio.com/docs/manual/layouts/org-chart-layout/');

				// null height = size to content (a fixed height clips the
				// third row behind a scrollbar)
				editorUi.showDialog(dlg.container, 355, null, true, true);
			}, parent, null, isGraphEnabled());

			// Circle layout has no ELK equivalent (radial is concentric rings,
			// not a single ring), so it lives alongside orgChart in the main
			// menu rather than in Legacy.
			menu.addItem(mxResources.get('circle'), null, mxUtils.bind(this, function()
			{
				editorUi.tryAndHandle(mxUtils.bind(this, function()
				{
					// A single selected layout container takes circle as its new
					// childLayout (same value as Insert > Layout > Circle).
					var container = editorUi.getSelectedLayoutContainer();

					if (container != null)
					{
						editorUi.setContainerChildLayout(container, 'circleLayout');
						return;
					}

					var layout = new mxCircleLayout(graph);

					editorUi.executeLayout(function()
					{
						var tmp = graph.getSelectionCell();

						if (tmp == null || graph.getModel().getChildCount(tmp) == 0)
						{
							tmp = graph.getDefaultParent();
						}

						layout.execute(tmp);

						if (graph.getModel().isVertex(tmp))
						{
							graph.updateGroupBounds([tmp], graph.gridSize * 2, true);
						}
					}, true);
				}));
			}), parent);

			menu.addSeparator(parent);

			if (typeof LibavoidRouting !== 'undefined')
			{
				menu.addItem(mxResources.get('orthogonalRouting') + '...', null, mxUtils.bind(this, function()
				{
					editorUi.tryAndHandle(mxUtils.bind(this, function()
					{
						editorUi.prompt(mxResources.get('spacing'), LibavoidRouting.shapeBufferDistance, mxUtils.bind(this, function(newValue)
						{
							editorUi.tryAndHandle(mxUtils.bind(this, function()
							{
								var buffer = parseFloat(newValue);
								LibavoidRouting.run(editorUi, isNaN(buffer) ? null : {shapeBufferDistance: buffer});
							}));
						}));
					}));
				}), parent);
			}

			menu.addItem(mxResources.get('parallels') + '...', null, mxUtils.bind(this, function()
			{
				editorUi.tryAndHandle(mxUtils.bind(this, function()
				{
					var layout = new mxParallelEdgeLayout(graph);
					layout.checkOverlap = true;

					editorUi.prompt(mxResources.get('spacing'), layout.spacing, mxUtils.bind(this, function(newValue)
					{
						editorUi.tryAndHandle(mxUtils.bind(this, function()
						{
							layout.spacing = newValue;

							// Records the run for Run Last Layout (replayed
							// through the shared layout-spec pipeline).
							editorUi.lastLayoutSpec = [{layout: 'mxParallelEdgeLayout',
								config: {spacing: layout.spacing, checkOverlap: true}}];

							// A single selected layout container takes the run
							// as its new childLayout instead of a one-shot run.
							var container = editorUi.getSelectedLayoutContainer();

							if (container != null)
							{
								editorUi.setContainerChildLayout(container,
									editorUi.lastLayoutSpec);
								return;
							}

							editorUi.executeLayout(function()
							{
								layout.execute(graph.getDefaultParent(), (!graph.isSelectionEmpty()) ?
									graph.getSelectionCells() : null);
							}, false);
						}));
					}));
				}));
			}), parent);

			if (typeof ElkLayout !== 'undefined')
			{
				menu.addSeparator(parent);
				editorUi.menus.addSubmenu('legacyLayout', menu, parent,
					mxResources.get('legacyLayouts'));
			}

			menu.addSeparator(parent);

			editorUi.menus.addMenuItem(menu, 'runLayout', parent, null, null, mxResources.get('custom') + '...');
		};
		
		this.put('help', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (!mxClient.IS_CHROMEAPP && (editorUi.isOffline() || navigator.standalone))
			{
				this.addMenuItems(menu, ['keyboardShortcuts', '-', 'about'], parent);
			}
			else
			{
				// No translation for menu item since help is english only
				var item = menu.addItem(mxResources.get('search') + ':',
					null, null, parent, null, null, false);
				item.style.cursor = 'default';
				
				var input = document.createElement('input');
				input.setAttribute('type', 'text');
				input.setAttribute('size', '25');
				input.style.borderWidth = '1px';
				input.style.marginLeft = '8px';

				mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function(e)
				{
					var term = mxUtils.trim(input.value);
					
					if (e.keyCode == 13 && term.length > 0)
					{
						this.editorUi.searchHelp(term);
						input.value = '';
						
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
					editorUi.actions.addAction('website...', function()
					{
						editorUi.openLink('https://www.drawio.com');
					});
					
					editorUi.actions.addAction('check4Updates', function()
					{
						editorUi.checkForUpdates();
					});

					editorUi.actions.put('desktopZoomIn', new Action('zoomIn', function()
					{
						editorUi.desktopZoomIn();
					}));

					editorUi.actions.put('desktopZoomOut', new Action('zoomOut', function()
					{
						editorUi.desktopZoomOut();
					}));

					editorUi.actions.put('desktopResetZoom', new Action('actualSize', function()
					{
						editorUi.desktopResetZoom();
					}));

					this.addMenuItems(menu, ['-', 'keyboardShortcuts', 'quickStart',
						'website', 'support', '-'], parent);

					if (urlParams['disableUpdate'] != '1')
					{
						this.addMenuItems(menu, ['check4Updates', '-'], parent);
					}

					this.addMenuItems(menu, ['desktopResetZoom', 'desktopZoomIn',
						'desktopZoomOut', '-', 'openDevTools', '-', 'about'], parent);
				}
				else
				{
					this.addMenuItems(menu, ['-', 'keyboardShortcuts',
						'quickStart', 'downloadDesktop', 'support', '-',
						'about'], parent);
				}
			}
			
			if (urlParams['test'] == '1')
			{
				menu.addSeparator(parent);
				this.addSubmenu('testDevelop', menu, parent);
			}
		})));
		
		editorUi.actions.addAction('languageCode...', function()
		{
			var lang = Graph.diagramLanguage || '';
					
			var dlg = new FilenameDialog(editorUi, lang, mxResources.get('ok'),
				mxUtils.bind(this, function(newLang)
			{
				if (newLang != null)
				{
					Graph.diagramLanguage = (newLang.length > 0) ? newLang : null;
					Graph.translateDiagram = true;
					graph.refresh();
				}
			}), mxResources.get('languageCode'), null, null,
				'https://www.drawio.com/blog/translate-diagrams');
			editorUi.showDialog(dlg.container, 340, 80, true, true);
			dlg.init();
		});
		
		this.put('diagramLanguage', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['languageCode', '-'], parent);

			var item = menu.addItem(mxResources.get('disabled'), null, function()
			{
				Graph.translateDiagram = false;
				graph.refresh();
			}, parent);

			if (!Graph.translateDiagram)
			{
				menu.addCheckmark(item, Editor.checkmarkImage);
			}
		})));

		// Only visible in test mode
		if (urlParams['test'] == '1')
		{
			mxResources.parse('testDevelop=Develop');
			mxResources.parse('showBoundingBox=Show bounding box');
			mxResources.parse('createSidebarEntry=Create Sidebar Entry');
			mxResources.parse('testCheckFile=Check File');
			mxResources.parse('testDiff=Diff/Sync');
			mxResources.parse('testChecksum=Checksum');
			mxResources.parse('testCheckPages=Check Pages');
			mxResources.parse('testFixPages=Fix Pages');
			mxResources.parse('testInspect=Inspect');
			mxResources.parse('testShowConsole=Show Console');
			mxResources.parse('testXmlImageExport=XML Image Export');
			mxResources.parse('testOptimize=Remove Inline Images');
			mxResources.parse('testPerformance=Performance');

			editorUi.actions.addAction('createSidebarEntry', mxUtils.bind(this, function()
			{
				if (!graph.isSelectionEmpty())
				{
					var cells = graph.cloneCells(graph.getSelectionCells());
					var bbox = graph.getBoundingBoxFromGeometry(cells, true);
					cells = graph.moveCells(cells, -bbox.x, -bbox.y);
					
					editorUi.showTextDialog('Create Sidebar Entry', 'this.addDataEntry(\'tag1 tag2\', ' +
						bbox.width + ', ' + bbox.height + ', \'The Title\', \'' +
						Graph.compress(mxUtils.getXml(graph.encodeCells(cells))) + '\'),');
				}
			}));
	
			editorUi.actions.addAction('showBoundingBox', mxUtils.bind(this, function()
			{
				var b = (graph.isSelectionEmpty()) ? graph.getGraphBounds() :
					graph.getBoundingBox(graph.getSelectionCells());
				var tr = graph.view.translate;
				var s = graph.view.scale;
				graph.insertVertex(graph.getDefaultParent(), null, '',
					b.x / s - tr.x, b.y / s - tr.y, b.width / s, b.height / s,
					'fillColor=none;strokeColor=red;');

				// Checking bounding boxes
				function checkBounds(shape)
				{
					return shape == null || shape.boundingBox == null || (!isNaN(shape.boundingBox.x) &&
						!isNaN(shape.boundingBox.y) && !isNaN(shape.boundingBox.width) &&
						!isNaN(shape.boundingBox.height));
				};

				var invalid = 0;
				var count = 0;

				graph.view.states.visit(function(id, state)
				{
					var valid = true;

					if (!checkBounds(state.shape))
					{
						console.log('invalid shape', state.cell.id, state.shape);
						valid = false;
					}

					if (!checkBounds(state.text))
					{
						console.log('invalid text', state.cell.id, state.text);
						valid = false;
					}

					if (!valid)
					{
						invalid++;
					}

					count++;
				});

				console.log('states checked', count, 'invalid', invalid);
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

								var keys = Object.keys(dups);
								
								if (keys.length > 0)
								{
									var log = pageId + ': ' + keys.length +
										' Duplicates: ' + keys.join(', ');
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
		    	
				editorUi.showDialog(dlg.container, 620, 460, true, true, null, null, null, new mxRectangle(0, 0, 440, 280));
				dlg.init();
			}));
	
			var snapshot = null;
			
			editorUi.actions.addAction('testDiff', mxUtils.bind(this, function()
			{
				if (editorUi.pages != null)
				{
					var buttons = [['Snapshot', function(evt, input)
					{
						try
						{
							snapshot = editorUi.getPagesForXml(editorUi.getFileData(true));
							dlg.textarea.value = 'Snapshot updated ' + new Date().toLocaleString() +
								' Checksum ' + editorUi.getHashValueForPages(snapshot);
						}
						catch (e)
						{
							editorUi.handleError(e);
						}
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
								file.patch([patch], null, true, true);
								editorUi.hideDialog();
							}
							catch (e)
							{
								editorUi.handleError(e);
							}
						}
					}, null, 'Close', null, null, null, true, null, 'Patch', null, buttons);
			    	
					if (snapshot == null)
					{
						try
						{
							snapshot = editorUi.getPagesForXml(editorUi.getFileData(true));
							dlg.textarea.value = 'Snapshot created ' + new Date().toLocaleString() +
								' Checksum ' + editorUi.getHashValueForPages(snapshot);
						}
						catch (e)
						{
							editorUi.handleError(e);
						}
					}
					else
					{
						dlg.textarea.value = JSON.stringify(editorUi.diffPages(
							snapshot, editorUi.pages), null, 2);
					}
					
					editorUi.showDialog(dlg.container, 620, 460, true, true, null, null, null, new mxRectangle(0, 0, 440, 280));
					dlg.init();
				}
				else
				{
					editorUi.alert('No pages');
				}
			}));

			editorUi.actions.addAction('testChecksum', mxUtils.bind(this, function()
			{
				var file = editorUi.getCurrentFile();

				if (editorUi.pages != null && file != null)
				{
					if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
					{
						file.getLatestVersion(function(latestFile)
						{
							editorUi.spinner.stop();

							var localChecksum = editorUi.getHashValueForPages(editorUi.pages);
							var localRev = file.getCurrentRevisionId();
							var remoteChecksum = editorUi.getHashValueForPages(
								latestFile.getShadowPages());
							var descChecksum = latestFile.getDescriptorChecksum(
								latestFile.getDescriptor());
							var remoteRev = latestFile.getCurrentRevisionId();
							
							console.log('Local File', [file],
								'modified', file.isModified(),
								'checksum', localChecksum);
							
							console.log('Remote File', [latestFile],
								'rev', remoteRev == localRev,
								'desc', descChecksum == remoteChecksum,
								'checksum', remoteChecksum);
							
							editorUi.alert('Checksums ' +
								(remoteChecksum == localChecksum ?
								'match' : 'no not match'));
						}, function(err)
						{
							console.log('Error getLatestVersion', err);
							editorUi.handleError(err);
						});
					}
				}
				else
				{
					console.log('Checksum: no file or pages');
				}
			}));

			editorUi.actions.addAction('testCheckPages', mxUtils.bind(this, function()
			{
				var file = editorUi.getCurrentFile();
				console.log('editorUi', editorUi, 'file', file);

				if (file != null && file.isRealtime())
				{
					console.log('Checksum ownPages',
						editorUi.getHashValueForPages(
							file.ownPages));
					console.log('Checksum theirPages',
						editorUi.getHashValueForPages(
							file.theirPages));
					console.log('diff ownPages/theirPages',
						editorUi.diffPages(file.ownPages,
							file.theirPages));

					var shadow = file.getShadowPages();
					
					if (shadow != null)
					{
						console.log('Checksum shadowPages',
							editorUi.getHashValueForPages(shadow));
						console.log('diff shadowPages/ownPages',
							editorUi.diffPages(shadow, file.ownPages));
						console.log('diff ownPages/shadowPages',
							editorUi.diffPages(file.ownPages, shadow));
						console.log('diff theirPages/shadowPages',
							editorUi.diffPages(file.theirPages, shadow));
					}

					if (file.sync != null && file.sync.snapshot != null)
					{
						console.log('Checksum snapshot',
							editorUi.getHashValueForPages(
								file.sync.snapshot));
						console.log('diff ownPages/snapshot',
							editorUi.diffPages(file.ownPages,
								file.sync.snapshot));
						console.log('diff theirPages/snapshot',
							editorUi.diffPages(file.theirPages,
								file.sync.snapshot));

						if (editorUi.pages != null)
						{
							console.log('diff snapshot/actualPages',
								editorUi.diffPages(file.sync.snapshot,
									editorUi.pages));
						}
					}

					if (editorUi.pages != null)
					{
						console.log('diff ownPages/actualPages',
							editorUi.diffPages(file.ownPages,
								editorUi.pages));
						console.log('diff theirPages/actualPages',
							editorUi.diffPages(file.theirPages,
								editorUi.pages));
					}
				}

				if (file != null)
				{
					console.log('Shadow pages',
						[editorUi.getXmlForPages(
							file.getShadowPages())]);
				}

				if (editorUi.pages != null)
				{
					console.log('Checksum actualPages',
						editorUi.getHashValueForPages(
							editorUi.pages));
				}
			}));
			
			editorUi.actions.addAction('testFixPages', mxUtils.bind(this, function()
			{
				console.log('editorUi', editorUi);
				var file = editorUi.getCurrentFile();

				if (file != null && file.isRealtime() &&
					file.shadowPages != null)
				{
					console.log('patching actualPages to shadowPages',
						file.patch([editorUi.diffPages(
							file.shadowPages, editorUi.pages)]));
					file.ownPages = editorUi.clonePages(editorUi.pages);
					file.theirPages = editorUi.clonePages(editorUi.pages);
					file.shadowPages = editorUi.clonePages(editorUi.pages);

					if (file.sync != null)
					{
						file.sync.snapshot = editorUi.clonePages(editorUi.pages);
					}
				}
			}));

			editorUi.actions.addAction('testOptimize', mxUtils.bind(this, function()
			{
				graph.model.beginUpdate();
				try
				{
					var all = graph.model.cells;
					var imageCount = 0;
					var images = [];
					var cells = [];

					for (var id in all)
					{
						var cell = all[id];
						var style = graph.getCurrentCellStyle(cell);
						var image = style[mxConstants.STYLE_IMAGE];

						if (image != null && image.substring(0, 5) == 'data:')
						{
							if (images[image] == null)
							{
								images[image] = (images[image] || 0) + 1;
								imageCount++;
							}

							cells.push(cell);
						}
					}

					graph.setCellStyles(mxConstants.STYLE_IMAGE, null, cells);
					console.log('Removed', imageCount, 'image(s) from', cells.length, 'cell(s): ', [cells, images]);
				}
				finally
				{
					graph.model.endUpdate();
				}
			}));
	
			editorUi.actions.addAction('testInspect', mxUtils.bind(this, function()
			{
				console.log(editorUi, graph.getModel());
			}));
			
			editorUi.actions.addAction('testXmlImageExport', mxUtils.bind(this, function()
			{
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
				xmlCanvas.translate(Math.floor((b / scale - bounds.x) / vs),
					Math.floor((b / scale - bounds.y) / vs));
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
				
				mxLog.window.div.style.zIndex = mxPopupMenu.prototype.zIndex - 2;
			});
			

			// Adds logging for performance
			var prevRevalidate = null;
			var prevSelectPage = null;
			var prevDiffPages = null;
			var prevPatchPages = null;
			var prevClonePages = null;
			var prevGetFileData = null;
			var prevGetHashValueForPages = null;
			var prevResolveCrossReferences = null;

			editorUi.actions.addAction('testPerformance', mxUtils.bind(this, function()
			{
				if (prevRevalidate != null)
				{
					graph.view.revalidate = prevRevalidate;
					prevRevalidate = null;
				}
				else
				{
					prevRevalidate = graph.view.revalidate;

					graph.view.revalidate = function()
					{
						var t0 = Date.now();
						var result = prevRevalidate.apply(this, arguments);
						EditorUi.debug('[Performance] mxGraphView.revalidate',
							[this], 'time', (Date.now() - t0) + ' ms',
							'args', arguments);
						
						return result;
					};
				}

				if (prevSelectPage != null)
				{
					editorUi.selectPage = prevSelectPage;
					prevSelectPage = null;
				}
				else
				{
					prevSelectPage = editorUi.selectPage;

					editorUi.selectPage = function()
					{
						var t0 = Date.now();
						var result = prevSelectPage.apply(this, arguments);
						EditorUi.debug('[Performance] EditorUi.selectPage',
							[this], 'time', (Date.now() - t0) + ' ms',
							'args', arguments);
						
						return result;
					};
				}

				if (prevDiffPages != null)
				{
					editorUi.diffPages = prevDiffPages;
					prevDiffPages = null;
				}
				else
				{
					prevDiffPages = editorUi.diffPages;

					editorUi.diffPages = function()
					{
						var t0 = Date.now();
						var result = prevDiffPages.apply(this, arguments);
						EditorUi.debug('[Performance] EditorUi.diffPages',
							[this], 'time', (Date.now() - t0) + ' ms',
							'args', arguments);
						
						return result;
					};
				}

				if (prevPatchPages != null)
				{
					editorUi.patchPages = prevPatchPages;
					prevPatchPages = null;
				}
				else
				{
					prevPatchPages = editorUi.patchPages;

					editorUi.patchPages = function()
					{
						var t0 = Date.now();
						var result = prevPatchPages.apply(this, arguments);
						EditorUi.debug('[Performance] EditorUi.patchPages',
							[this], 'time', (Date.now() - t0) + ' ms',
							'args', arguments);
						
						return result;
					};
				};

				if (prevClonePages != null)
				{
					editorUi.clonePages = prevClonePages;
					prevClonePages = null;
				}
				else
				{
					prevClonePages = editorUi.clonePages;

					editorUi.clonePages = function()
					{
						var t0 = Date.now();
						var result = prevClonePages.apply(this, arguments);
						EditorUi.debug('[Performance] EditorUi.clonePages',
							[this], 'time', (Date.now() - t0) + ' ms',
							'args', arguments);
						
						return result;
					};
				};

				if (prevGetHashValueForPages != null)
				{
					editorUi.getHashValueForPages = prevGetHashValueForPages;
					prevGetHashValueForPages = null;
				}
				else
				{
					prevGetHashValueForPages = editorUi.getHashValueForPages;

					editorUi.getHashValueForPages = function()
					{
						var t0 = Date.now();
						var result = prevGetHashValueForPages.apply(this, arguments);
						EditorUi.debug('[Performance] EditorUi.getHashValueForPages',
							[this], 'time', (Date.now() - t0) + ' ms',
							'args', arguments);
						
						return result;
					};
				}

				if (prevResolveCrossReferences != null)
				{
					editorUi.resolveCrossReferences = prevResolveCrossReferences;
					prevResolveCrossReferences = null;
				}
				else
				{
					prevResolveCrossReferences = editorUi.resolveCrossReferences;

					editorUi.resolveCrossReferences = function()
					{
						var t0 = Date.now();
						var result = prevResolveCrossReferences.apply(this, arguments);
						EditorUi.debug('[Performance] EditorUi.resolveCrossReferences',
							[this], 'time', (Date.now() - t0) + ' ms',
							'args', arguments);

						return result;
					};
				}

				if (prevGetFileData != null)
				{
					editorUi.getFileData = prevGetFileData;
					prevGetFileData = null;
				}
				else
				{
					prevGetFileData = editorUi.getFileData;

					editorUi.getFileData = function()
					{
						var t0 = Date.now();
						var result = prevGetFileData.apply(this, arguments);
						EditorUi.debug('[Performance] EditorUi.getFileData',
							[this], 'time', (Date.now() - t0) + ' ms',
							'args', arguments);

						return result;
					};
				}

				EditorUi.debug('[Performance]', (prevRevalidate != null) ? 'Enabled' : 'Disabled');
			}));

			this.put('testDevelop', new Menu(mxUtils.bind(this, function(menu, parent)
			{
				this.addMenuItems(menu, ['createSidebarEntry', 'showBoundingBox', '-',
					'testCheckPages', 'testChecksum', 'testFixPages', '-',
					'testCheckFile', 'testDiff', '-', 'testInspect', 'testOptimize', '-',
					'testXmlImageExport', '-'], parent);

				var item = menu.addItem(mxResources.get('testPerformance'), null, function()
				{
					editorUi.actions.get('testPerformance').funct();
				}, parent);
				
				if (prevRevalidate != null)
				{
					menu.addCheckmark(item, Editor.checkmarkImage);
				}

				this.addMenuItems(menu, ['-', 'testShowConsole'], parent);
			})));
		}
		
		editorUi.actions.put('shapes', new Action('moreShapes' + '...', function(evt)
		{
			if (mxClient.IS_CHROMEAPP || !editorUi.isOffline())
			{
				editorUi.showDialog(new MoreShapesDialog(editorUi, true).container, 680, (isLocalStorage) ?
						((mxClient.IS_IOS) ? 500 : 480) : 460, true, true);
			}
			else
			{
				editorUi.showDialog(new MoreShapesDialog(editorUi, false).container, 360, (isLocalStorage) ?
						((mxClient.IS_IOS) ? 300 : 280) : 260, true, true);
			}
		}));

		editorUi.actions.put('createShape', new Action('shape' + '...', function(evt)
		{
			if (graph.isEnabled())
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 120, 120),
					editorUi.defaultCustomShapeStyle);
				cell.vertex = true;
				
				var dlg = new EditShapeDialog(editorUi, cell, mxResources.get('editShape'));
				editorUi.showDialog(dlg.container, 640, 480, true, false,
					null, null, null, new mxRectangle(0, 0, 300, 200),
					null, 'createShape');
				dlg.init();
			}
		})).isEnabled = isGraphEnabled;

		if (!editorUi.isOffline())
		{
			if (urlParams['embed'] != '1')
			{
				editorUi.actions.put('embedNotion', new Action('notion' + '...', function()
				{
					var footer = document.createElement('div');
					footer.style.position = 'absolute';
					footer.style.bottom = '12px';
					footer.style.textAlign = 'center';
					footer.style.width = '100%';
					footer.style.left = '0px';
					var link = document.createElement('a');
					link.setAttribute('href', 'javascript:void(0);');
					link.setAttribute('target', '_blank');
					link.style.cursor = 'pointer';
					mxUtils.write(link, mxResources.get('getNotionChromeExtension'));
					footer.appendChild(link);
					
					mxUtils.setPrefixedStyle(link.style, 'transition', 'all 1s ease');
					mxUtils.setOpacity(link, 0);

					window.setTimeout(function()
					{
						mxUtils.setOpacity(link, 100);
					}, 300);
					
					mxEvent.addListener(link, 'click', function(evt)
					{
						editorUi.openLink('https://chrome.google.com/webstore/detail/drawio-for-notion/plhaalebpkihaccllnkdaokdoeaokmle');
						mxEvent.consume(evt);
					});
					
					editorUi.getPublicUrl(editorUi.getCurrentFile(), function(publicUrl)
					{
						editorUi.showPublishLinkDialog(mxResources.get('notion'), null, null, true,
							'https://www.drawio.com/blog/drawio-notion', footer, publicUrl, editorUi.getCurrentFile(),
							function(linkTarget, linkColor, currentPage, lightbox, editLink, layers, width, height,
								tags, link, transparent, darkMode, allPages, useTagSettings, linkIcons, tooltipIcons)
							{
								var params = ['border=0'];

								if (tags)
								{
									var hiddenTagsMap = useTagSettings ? editorUi.getHiddenTagsMap() : null;
									params.push('tags=' + encodeURIComponent(
										JSON.stringify(hiddenTagsMap || {})));
								}

								var dlg = new EmbedDialog(editorUi, editorUi.createLink(linkTarget, linkColor,
									true, lightbox, editLink, layers, (link == 'public') ? publicUrl : null,
									link == 'copy', params, null, currentPage, null, darkMode, linkIcons, tooltipIcons));
								editorUi.showDialog(dlg.container, 450, 270, true, true, null, false, null, new mxRectangle(0, 0, 400, 250));
								dlg.init();
							}, null, true);
					});
				}));

				editorUi.actions.addAction('microsoftOffice...', function()
				{
					editorUi.openLink('https://office.draw.io');
				});
			}

			editorUi.actions.put('embedHtml', new Action('html' + '...', function()
			{
				editorUi.getPublicUrl(editorUi.getCurrentFile(), function(url)
				{
					editorUi.showHtmlDialog(mxResources.get('create'), 'https://www.drawio.com/docs/manual/export/embed-html/',
						url, function(publicUrl, zoomEnabled, initialZoom, linkTarget, linkColor, fit, allPages, layers, tags,
							lightbox, editLink, theme, useTagSettings, linkIcons, tooltipIcons)
					{
						editorUi.createHtml(publicUrl, zoomEnabled, initialZoom, linkTarget, linkColor, fit, allPages,
							layers, tags, lightbox, editLink, mxUtils.bind(this, function(html, scriptTag)
							{
								// Comment is workaround for file data check in checkFileContent for Electron
								var dlg = new EmbedDialog(editorUi, '<!-- ' + editorUi.editor.appName + ' diagram -->\n' +
									html + '\n' + scriptTag + '\n', null, null, function()
								{
									try
									{
										var wnd = window.open();
										
										if (wnd != null && wnd.document != null)
										{
											var doc = wnd.document;

											if (document.compatMode === 'CSS1Compat')
											{
												doc.writeln('<!DOCTYPE html>');
											}
											
											doc.writeln('<html>');
											doc.writeln('<head><title>' + encodeURIComponent(mxResources.get('preview')) +
												'</title><meta charset="utf-8"></head>');
											doc.writeln('<body>');
											doc.writeln(html);
											
											var direct = mxClient.IS_EDGE;
											
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
									}
									catch (e)
									{
										editorUi.handleError(e);
									}
								});
								editorUi.showDialog(dlg.container, 450, 270, true, true, null, false, null, new mxRectangle(0, 0, 400, 250));
								dlg.init();
							}), theme, useTagSettings, linkIcons, tooltipIcons);
					});
				});
			}));

			editorUi.actions.put('liveImage', new Action('Live image...', function()
			{
				var current = editorUi.getCurrentFile();
				
				if (current != null)
				{
					editorUi.getPublicUrl(current, function(url)
					{
						if (url != null)
						{
							var dlg = new EmbedDialog(editorUi, '<img src="' + ((current.constructor != DriveFile) ?
								url : 'https://drive.google.com/uc?id=' + current.getId()) + '"/>');
							editorUi.showDialog(dlg.container, 450, 270, true, true, null, false, null, new mxRectangle(0, 0, 400, 250));
							dlg.init();
						}
						else
						{
							editorUi.handleError({message: mxResources.get('invalidPublicUrl')});
						}
					});
				}
			}));
			
			editorUi.actions.put('embedImage', new Action('image' + '...', function()
			{
				editorUi.showEmbedImageDialog(function(fit, shadow, retina, lightbox, editLink, layers, linkIcons, tooltipIcons)
				{
					if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
					{
						editorUi.createEmbedImage(fit, shadow, retina, lightbox, editLink, layers, linkIcons, tooltipIcons, function(result)
						{
							editorUi.spinner.stop();
							var dlg = new EmbedDialog(editorUi, result);
							editorUi.showDialog(dlg.container, 450, 270, true, true, null, false, null, new mxRectangle(0, 0, 400, 250));
							dlg.init();
						}, function(err)
						{
							editorUi.spinner.stop();
							editorUi.handleError(err);
						});
					}
				}, mxResources.get('image'), mxResources.get('retina'), editorUi.editor.isExportToCanvas(),
					'https://www.drawio.com/docs/manual/export/embed-diagram/');
			}));

			editorUi.actions.put('embedSvg', new Action('formatSvg' + '...', function()
			{
				editorUi.showEmbedImageDialog(function(fit, shadow, image, lightbox, editLink, layers, linkIcons, tooltipIcons)
				{
					if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
					{
						editorUi.createEmbedSvg(fit, shadow, image, lightbox, editLink, layers, linkIcons, tooltipIcons, function(result)
						{
							editorUi.spinner.stop();

							var dlg = new EmbedDialog(editorUi, result);
							editorUi.showDialog(dlg.container, 450, 270, true, true, null, false, null, new mxRectangle(0, 0, 400, 250));
							dlg.init();
						}, function(err)
						{
							editorUi.spinner.stop();
							editorUi.handleError(err);
						});
					}
				}, mxResources.get('formatSvg'), mxResources.get('image'),
					true, 'https://www.drawio.com/docs/manual/export/embed-svg/');
			}));
			
			editorUi.actions.put('embedIframe', new Action('iframe' + '...', function()
			{
				editorUi.getPublicUrl(editorUi.getCurrentFile(), function(publicUrl)
				{
					var bounds = graph.getGraphBounds();
					
					editorUi.showPublishLinkDialog(mxResources.get('iframe'), '100%',
						Math.ceil(Math.max(100, bounds.height / graph.view.scale)) + 2, null, null, null,
						publicUrl, editorUi.getCurrentFile(), function(linkTarget, linkColor,
							currentPage, lightbox, editLink, layers, width, height, tags, link,
							transparent, darkMode, allPages, useTagSettings, linkIcons, tooltipIcons)
						{
							var params = [];

							if (tags)
							{
								var hiddenTagsMap = useTagSettings ? editorUi.getHiddenTagsMap() : null;
								params.push('tags=' + encodeURIComponent(
									JSON.stringify(hiddenTagsMap || {})));
							}

							var dlg = new EmbedDialog(editorUi, '<iframe frameborder="0" style="width:' + width +
								';height:' + height + ';" src="' + editorUi.createLink(linkTarget, linkColor,
								true, lightbox, editLink, layers, (link == 'public') ? publicUrl : null,
								link == 'copy', params, null, currentPage, transparent, darkMode, linkIcons, tooltipIcons) + '"' + ((transparent) ?
								' allowtransparency="true"' : '') + '></iframe>');
							editorUi.showDialog(dlg.container, 450, 270, true, true, null, false, null, new mxRectangle(0, 0, 400, 250));
							dlg.init();
						}, true, true);
				});
			}));
		}

		editorUi.actions.put('publishLink', new Action('link' + '...', function()
		{
			editorUi.getPublicUrl(editorUi.getCurrentFile(), function(publicUrl)
			{
				editorUi.showPublishLinkDialog(null, null, null, null, null, null, publicUrl, editorUi.getCurrentFile(),
					function(linkTarget, linkColor, currentPage, lightbox, editLink, layers, width, height,
						tags, link, transparent, darkMode, allPages, useTagSettings, linkIcons, tooltipIcons)
					{
						var params = [];

						if (lightbox && tags)
						{
							var hiddenTagsMap = useTagSettings ? editorUi.getHiddenTagsMap() : null;
							params.push('tags=' + encodeURIComponent(
								JSON.stringify(hiddenTagsMap || {})));
						}

						var dlg = new EmbedDialog(editorUi, editorUi.createLink(linkTarget, linkColor,
							true, lightbox, editLink, layers, (link == 'public') ? publicUrl : null,
							link == 'copy', params, null, currentPage, null, darkMode, linkIcons, tooltipIcons));
						editorUi.showDialog(dlg.container, 450, 270, true, true, null, false, null, new mxRectangle(0, 0, 400, 250));
						dlg.init();
					}, null, true);
			});
		}, null, null, null, !editorUi.isOffline()));

		// Adds plugins menu item only if localStorage is available for storing the plugins
		if (isLocalStorage || mxClient.IS_CHROMEAPP)
		{
			var action = editorUi.actions.addAction('scratchpad', function()
			{
				editorUi.toggleScratchpad();
			});
			
			action.setToggleAction(true);
			action.setSelectedCallback(function()
			{
				return editorUi.scratchpad != null;
			});
			
			if (urlParams['plugins'] != '0')
			{
				editorUi.actions.addAction('plugins...', function()
				{
					editorUi.showDialog(new PluginsDialog(editorUi).container, 380, null, true, false);
				});
			}
		}

		if (window.matchMedia && document.getElementById('high-contrast-stylesheet') != null)
		{
			var action = editorUi.actions.addAction('highContrast', function()
			{
				editorUi.setAndPersistHighContrast(!editorUi.isHighContrast());
			});
			
			action.setToggleAction(true);
			action.setSelectedCallback(function()
			{
				return editorUi.isHighContrast();
			});
		}

		var action = editorUi.actions.addAction('search', function()
		{
			if (editorUi.sidebar != null)
			{
				var visible = editorUi.sidebar.isEntryVisible('search');
				editorUi.sidebar.showPalette('search', !visible);
				
				if (Editor.isSettingsEnabled())
				{
					mxSettings.settings.search = !visible;
					mxSettings.save();
				}
			}
		});
		
		action.label = mxResources.get('searchShapes');
		action.setToggleAction(true);
		action.setSelectedCallback(function() { return editorUi.sidebar != null &&
			editorUi.sidebar.isEntryVisible('search'); });

		editorUi.actions.get('clearDefaultStyle').funct = function(exit)
		{
			if (graph.isEnabled())
			{
				// Drop the persisted current edge style so the reset is permanent
				// (otherwise updateDefaultStyles would restore it on the next reload).
				if (typeof mxSettings !== 'undefined' && mxSettings.setCurrentEdgeStyle != null &&
					mxSettings.settings != null)
				{
					mxSettings.setCurrentEdgeStyle(null);
				}

				editorUi.clearDefaultStyle();

				if (Editor.sketchMode)
				{
					editorUi.setSketchMode(false);
				}
			}
		};
		
		if (urlParams['embed'] == '1')
		{
			editorUi.actions.get('saveAs').setEnabled(false);
			
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
					
					if (exit === true && (urlParams['saveAndExit'] == '1' ||
						urlParams['publishClose'] == '1'))
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
					editorUi.clearStatus();
				}
				
				//Add support to saving files if embedded mode is running with files
				var file = editorUi.getCurrentFile();
				
				if (file != null && file.constructor != EmbedFile &&
					(file.constructor != LocalFile || file.mode != null))
				{
					editorUi.saveFile();
				}
			};
	
			var saveAndExitAction = editorUi.actions.addAction('saveAndExit', function()
			{
				if (urlParams['toSvg'] == '1')
				{
					editorUi.sendEmbeddedSvgExport();
				}
				else
				{
					editorUi.actions.get('save').funct(true);
				}
			}, null, null, Editor.ctrlKey + '+S');
			
			saveAndExitAction.label = urlParams['publishClose'] == '1' ?
				mxResources.get('publish') : mxResources.get('saveAndExit');
			
			editorUi.actions.addAction('exit', function()
			{
				if (urlParams['embedInline'] == '1')
				{
					editorUi.sendEmbeddedSvgExport();
				}
				else
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
				}
			}, null, null, (urlParams['embedInline'] == '1') ? 'Escape' : null);
		}
		
		this.put('exportAs', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (editorUi.editor.isExportToCanvas())
			{
				this.addMenuItems(menu, ['exportPng'], parent);
				
				if (Editor.jpgSupported)
				{
					this.addMenuItems(menu, ['exportJpg'], parent);
				}

				if (Editor.webpSupported)
				{
					this.addMenuItems(menu, ['exportWebp'], parent);
				}
			}
			
			// Disabled for standalone mode in iOS because new tab cannot be closed
			else if (!editorUi.isOffline() && (!mxClient.IS_IOS || !navigator.standalone))
			{
				this.addMenuItems(menu, ['exportPng', 'exportJpg'], parent);
			}

			if (editorUi.editor.isExportToCanvas())
			{
				this.addMenuItems(menu, ['exportAnimatedGif'], parent);
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

			if (editorUi.vsdxExportEnabled() &&
				(typeof(VsdxExport) !== 'undefined' || !editorUi.isOffline()))
			{
				this.addMenuItems(menu, ['exportVsdx'], parent);
			}

			var exportItems = ['-', 'exportHtml', 'exportXml'];

			if (Editor.enableExportUrl)
			{
				exportItems.push('exportUrl');
			}

			exportItems.push('exportJson');

			this.addMenuItems(menu, exportItems, parent);

			if (!editorUi.isOffline())
			{
				menu.addSeparator(parent);
				this.addMenuItem(menu, 'export', parent).firstChild.nextSibling.innerHTML = mxResources.get('advanced') + '...';
			}

			if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp &&
				Editor.currentTheme == 'min' && !editorUi.isOffline())
			{
				this.addMenuItems(menu, ['publishLink'], parent);
			}

			if (editorUi.mode != App.MODE_ATLAS && urlParams['extAuth'] != '1' &&
				(Editor.currentTheme == 'simple' || Editor.currentTheme == 'sketch' ||
				Editor.currentTheme == 'min') && !editorUi.isOffline())
			{
				menu.addSeparator(parent);
				editorUi.menus.addSubmenu('embed', menu, parent);
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
				else if (editorUi.isModeEnabled(App.MODE_GOOGLE))
				{
					menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
					{
						// do nothing
					}, parent, null, false);
				}
			}

			if (editorUi.isModeReady(App.MODE_ONEDRIVE))
			{
				menu.addItem(mxResources.get('oneDrive') + '...', null, function()
				{
					pickFileFromService(editorUi.oneDrive);
				}, parent);
			}
			else if (editorUi.isModeEnabled(App.MODE_ONEDRIVE))
			{
				menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}

			if (editorUi.isModeReady(App.MODE_DROPBOX))
			{
				menu.addItem(mxResources.get('dropbox') + '...', null, function()
				{
					pickFileFromService(editorUi.dropbox);
				}, parent);
			}
			else if (editorUi.isModeEnabled(App.MODE_DROPBOX))
			{
				menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			menu.addSeparator(parent);
			
			if (editorUi.isModeReady(App.MODE_GITHUB))
			{
				menu.addItem(mxResources.get('github') + '...', null, function()
				{
					pickFileFromService(editorUi.gitHub);
				}, parent);
			}
			
			if (editorUi.isModeReady(App.MODE_GITLAB))
			{
				menu.addItem(mxResources.get('gitlab') + '...', null, function()
				{
					pickFileFromService(editorUi.gitLab);
				}, parent);
			}

			if (editorUi.isModeReady(App.MODE_TRELLO))
			{
				menu.addItem(mxResources.get('trello') + '...', null, function()
				{
					pickFileFromService(editorUi.trello);
				}, parent);
			}
			else if (editorUi.isModeEnabled(App.MODE_TRELLO))
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

			if (urlParams['noDevice'] != '1')
			{
				menu.addItem(mxResources.get('device') + '...', null, function()
				{
					editorUi.importLocalFile(true);
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

		this.put('dynamicAppearance', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

			if (Editor.currentTheme == 'simple')
			{
				// Elements are hidden with the following widths:
				// ViewZoom: <750
				// Insert edge: <680
				// Insert text: <660
				// Comments: <560
				// Insert Table: <500
				// Pages: <480
				// Insert Shapes: <440
				// Insert Freehand: <390
				// Share: <360
				// Insert: <320

				if (iw < 750)
				{
					this.addSubmenu('viewZoom', menu, parent, mxResources.get('zoom'));
				}

				if (iw < 460 && editorUi.isPageMenuVisible())
				{
					this.addSubmenu('pages', menu, parent);
				}

				if (iw < 320)
				{
					this.addSubmenu('insert', menu, parent);
				}

				if (iw < 360  && urlParams['embed'] != '1' &&
					editorUi.getServiceName() == 'draw.io')
				{
					this.addSubmenu('share', menu, parent);
				}
			}
		})));
		
		this.put('appearance', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (editorUi.isAutoDarkModeSupported())
			{
				var item = editorUi.menus.addMenuItem(menu, 'autoMode', parent);

				if (item != null)
				{
					item.setAttribute('title', mxResources.get('automatic') +
						' (' + mxResources.get(Editor.isDarkMode() ?
							'dark' : 'light') + ')');
				}
			}

			this.addMenuItems(menu, ['lightMode', 'darkMode', '-'], parent);
			var item = editorUi.menus.addMenuItem(menu, 'highContrast', parent);

			if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
			{
				editorUi.menus.addLinkToItem(item, 'https://github.com/jgraph/drawio/issues/4296');
			}
		})));

		editorUi.actions.addAction('addToScratchpad', function(evt)
		{
			if (!graph.isSelectionEmpty() && editorUi.addSelectionToScratchpad != null)
			{
				editorUi.addSelectionToScratchpad(evt);
			}
		});

		editorUi.actions.addAction('accounts...', function()
		{
			editorUi.toggleUserPanel();
			editorUi.userPanel.style.right = '10px';
			editorUi.userPanel.style.top = '10px';
		});

		this.put('theme', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var theme = (urlParams['sketch'] == '1') ? 'sketch' : mxSettings.getUi();
			
			var autoItem = menu.addItem(mxResources.get('automatic'), null, function()
			{
				editorUi.setCurrentTheme('');
			}, parent);
			
			var item = menu.addItem(mxResources.get('classic'), null, function()
			{
				editorUi.setCurrentTheme('kennedy');
			}, parent);

			var themeFound = false;

			if (theme == 'kennedy' || theme == 'dark')
			{
				menu.addCheckmark(item, Editor.checkmarkImage);
				themeFound = true;
			}

			for (var i = 0; i < Editor.themes.length; i++)
			{
				(mxUtils.bind(this, function(key)
				{
					item = menu.addItem(mxResources.get((key == 'min') ?
						'minimal' : key), null, function()
					{
						editorUi.setCurrentTheme(key);
					}, parent);

					if (theme == key)
					{
						menu.addCheckmark(item, Editor.checkmarkImage);
						themeFound = true;
					}
					
					if (key == 'simple')
					{
						menu.addSeparator(parent);
					}
				})(Editor.themes[i]));
			}
			
			if (!themeFound)
			{
				menu.addCheckmark(autoItem, Editor.checkmarkImage);
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
					}, null, FilenameDialog.filenameHelpLink, null, null, editorUi.editor.fileExtensions);
					this.editorUi.showDialog(dlg.container, 340, 100, true, true);
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
					var dlg = new SaveDialog(editorUi, title, mxUtils.bind(this, function(input, mode, folderId)
					{
						editorUi.hideDialog();

						file.copyFile(mxUtils.bind(this, function(resp)
						{
							file.move(folderId, mxUtils.bind(this, function(resp)
							{
								editorUi.spinner.stop();
							}), mxUtils.bind(this, function(resp)
							{
								editorUi.handleError(resp);
							}));
						}), mxUtils.bind(this, function(resp)
						{
							editorUi.handleError(resp);
						}), input.value);
					}), null, null, null, null, null, null, [App.MODE_GOOGLE], mxResources.get('ok'));
					
					editorUi.showDialog(dlg.container, 420, 150, true, false, mxUtils.bind(this, function()
					{
						editorUi.hideDialog();
					}));

					dlg.init();
				}
				else
				{
					// Creates a copy with no predefined storage
					editorUi.editor.editAsNew(this.editorUi.getFileData(true), title);
				}
			}
		}));

		// Dynamic title implemented below
		var openFolderAction = new Action('openFolder', function(evt, trigger)
		{
			var file = editorUi.getCurrentFile();

			if (file != null)
			{
				editorUi.openLink(file.getFolderUrl());
			}
		});

		openFolderAction.getTitle = function()
		{
			return mxResources.get('openIt', [mxResources.get('folder')]) + '...';
		};

		editorUi.actions.put('openFolder', openFolderAction);
		
		editorUi.actions.addAction('openFile...', mxUtils.bind(this, function()
		{
			var file = editorUi.getCurrentFile();

			if (file != null)
			{
				editorUi.openLink(file.getFileUrl());
			}
		}));
		
		editorUi.actions.addAction('moveToFolder...', mxUtils.bind(this, function()
		{
			var file = editorUi.getCurrentFile();
			
			if (file.getMode() == App.MODE_GOOGLE || file.getMode() == App.MODE_ONEDRIVE)
			{
				var dlg = new SaveDialog(editorUi, '', mxUtils.bind(this, function(input, mode, folderId)
				{
					editorUi.hideDialog();

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
				}), null, null, null, null, null, file.getMode());

				editorUi.showDialog(dlg.container, 420, 70, true, false, mxUtils.bind(this, function()
				{
					editorUi.hideDialog();
				}));
				
				dlg.init();
			}
		}));
		
		this.put('publish', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['publishLink', 'presentationMode'], parent);
		})));

		editorUi.actions.put('presentationMode', new Action('presentationMode' + '...', function()
		{
			var dark = Editor.isDarkMode();

			var backdrop = document.createElement('div');
			backdrop.style.cssText = 'position:fixed;inset:0;z-index:999;background-color:#000000';
			document.body.appendChild(backdrop);

			// Save and set urlParams for chromeless mode
			var savedParams = {};
			var paramKeys = ['pages', 'page-id', 'nav', 'layers', 'dark', 'toolbar'];

			for (var i = 0; i < paramKeys.length; i++)
			{
				savedParams[paramKeys[i]] = urlParams[paramKeys[i]];
			}

			urlParams['pages'] = '1';
			urlParams['page-id'] = (editorUi.currentPage != null) ?
				editorUi.currentPage.getId() : null;
			urlParams['nav'] = '1';
			urlParams['layers'] = '1';
			urlParams['dark'] = dark ? '1' : '0';
			urlParams['toolbar'] = '0';

			var origUpdateActionStates = EditorUi.prototype.updateActionStates;
			var origAddBeforeUnload = EditorUi.prototype.addBeforeUnloadListener;
			var origAddChromelessClick = EditorUi.prototype.addChromelessClickHandler;

			EditorUi.prototype.updateActionStates = function() {};
			EditorUi.prototype.addBeforeUnloadListener = function() {};
			EditorUi.prototype.addChromelessClickHandler = function() {};

			var ui = new EditorUi(new Editor(true), document.createElement('div'), true);

			EditorUi.prototype.updateActionStates = origUpdateActionStates;
			EditorUi.prototype.addBeforeUnloadListener = origAddBeforeUnload;
			EditorUi.prototype.addChromelessClickHandler = origAddChromelessClick;

			ui.refresh = function() {};
			ui.updateHashObject = function() {};

			var graph = ui.editor.graph;
			var lightbox = graph.container;
			lightbox.style.cssText = 'position:fixed;inset:0;overflow:hidden;outline:none;z-index:999';

			var overflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';

			// Build custom toolbar (top-right, standard dialog style)
			var toolbar = document.createElement('div');
			toolbar.style.cssText = 'position:fixed;top:10px;right:10px;z-index:1000;' +
				'display:inline-flex;align-items:center;gap:2px;' +
				'padding:4px;white-space:nowrap;cursor:default;' +
				'border:1px solid;border-radius:6px;' +
				'background-color:' + (dark ? '#2a2a2a' : '#ffffff') + ';' +
				'border-color:' + (dark ? '#505050' : '#e0e0e0') + ';' +
				'box-shadow:0 2px 6px ' + (dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)');

			var iconColor = dark ? 'invert(80%)' : 'none';

			var addToolbarButton = function(fn, img, tooltip)
			{
				var btn = document.createElement('img');
				btn.setAttribute('src', img);
				btn.setAttribute('title', tooltip || '');
				btn.setAttribute('border', '0');
				btn.style.cssText = 'width:16px;height:16px;cursor:pointer;display:block;' +
					'padding:2px;opacity:0.6;filter:' + iconColor;
				btn.className = 'geAdaptiveAsset';

				mxEvent.addListener(btn, 'mouseenter', function()
				{
					btn.style.opacity = '1';
				});

				mxEvent.addListener(btn, 'mouseleave', function()
				{
					btn.style.opacity = '0.6';
				});

				mxEvent.addListener(btn, 'click', function(evt)
				{
					fn(evt);
					mxEvent.consume(evt);
				});

				toolbar.appendChild(btn);

				return btn;
			};

			// Page navigation dropdown (added after data is loaded, when page count is known)
			var addPageNav = function()
			{
				if (ui.pages != null && ui.pages.length > 1)
				{
					var pageBtn = addToolbarButton(function(evt)
					{
						ui.showPopupMenu(function(menu, parent)
						{
							for (var i = 0; i < ui.pages.length; i++)
							{
								(function(index)
								{
									var item = menu.addItem(ui.getShortPageName(
										ui.pages[index]), null, function()
									{
										ui.selectPage(ui.pages[index]);
										ui.lightboxFit();
										ui.chromelessResize();
									});

									var id = ui.pages[index].getId();
									item.setAttribute('title', ui.pages[index].getName() +
										' (' + (index + 1) + '/' + ui.pages.length + ')' +
										((id != null) ? ' [' + id + ']' : ''));

									if (ui.pages[index] == ui.currentPage)
									{
										menu.addCheckmark(item, Editor.checkmarkImage);
									}
								})(i);
							}
						}, mxEvent.getClientX(evt), mxEvent.getClientY(evt), evt);
					}, Editor.chevronDownImage, mxResources.get('pages'));

					toolbar.insertBefore(pageBtn, toolbar.firstChild);
				}
			};

			// Zoom buttons
			addToolbarButton(function()
			{
				graph.zoomOut();
				ui.chromelessResize(false);
			}, Editor.zoomOutImage, mxResources.get('zoomOut'));

			addToolbarButton(function()
			{
				graph.zoomIn();
				ui.chromelessResize(false);
			}, Editor.zoomInImage, mxResources.get('zoomIn'));

			addToolbarButton(function()
			{
				if (graph.view.scale == 1)
				{
					ui.lightboxFit();
				}
				else
				{
					graph.zoomTo(1);
				}

				ui.chromelessResize(false);
			}, Editor.zoomFitImage, mxResources.get('smartFit'));

			addToolbarButton(function()
			{
				ui.destroy();
			}, Editor.closeImage, mxResources.get('close') + ' (Escape)');

			// Cleanup function
			var destroy = ui.destroy;

			ui.destroy = function()
			{
				mxEvent.removeListener(document.documentElement, 'keydown', keydownHandler);
				document.body.removeChild(backdrop);
				document.body.removeChild(toolbar);
				document.body.style.overflow = overflow;

				for (var i = 0; i < paramKeys.length; i++)
				{
					urlParams[paramKeys[i]] = savedParams[paramKeys[i]];
				}

				destroy.apply(this, arguments);
			};

			var keydownHandler = function(evt)
			{
				if (evt.keyCode == 27 /* Escape */)
				{
					ui.destroy();
				}
			};

			mxEvent.addListener(document.documentElement, 'keydown', keydownHandler);

			document.body.appendChild(lightbox);
			document.body.appendChild(toolbar);

			window.setTimeout(function()
			{
				try
				{
					ui.setFileData(editorUi.getFileData(true));

					// Add page navigation now that pages are loaded
					addPageNav();

					ui.lightboxFit();
					ui.chromelessResize();
				}
				catch (e)
				{
					ui.handleError(e, null, function()
					{
						ui.destroy();
					});
				}
			}, 0);
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
		})).isEnabled = isGraphEnabled;

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
			
			this.addMenuItems(menu, ['-', 'microsoftOffice', '-', 'embedNotion'], parent);
		})));

		var addInsertAction = function(method)
		{
			var title = mxResources.get(method);

			editorUi.actions.put(method, new Action(title + '...', function(evt)
			{
				var dlg = new ParseDialog(editorUi, title, method);
				editorUi.showDialog(dlg.container, 640, 420, true,
					false, null, null, null, new mxRectangle(0, 0, 440, 280));
				dlg.init();
			})).isEnabled = isGraphEnabled;
		};

		// Inserts a live layout container with a small seed graph. Replaces the
		// old CreateGraphDialog (a mini editor in a modal): the container's
		// childLayout style makes the layout manager re-run the layout whenever
		// cells inside it are added, connected or resized, so the diagram is
		// assembled directly on the canvas with the full editing UX instead.
		// Styles and seed cells mirror the Advanced sidebar layout containers.
		var addInsertLayoutAction = function(method, containerStyle, edgeStyle, seed)
		{
			editorUi.actions.put(method, new Action(mxResources.get(method), function()
			{
				if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
				{
					// transparentBounds container: the stored geometry stays
					// pinned at (0,0,0,0) and the insert position goes into
					// the children, which carry the absolute position. The
					// layout manager lays the seed out on insert, anchored
					// at the seeds' top-left.
					var container = new mxCell('',
						new mxGeometry(0, 0, 0, 0), containerStyle);
					container.vertex = true;

					var pt = graph.getFreeInsertPoint();
					var vertices = [];

					for (var i = 0; i < seed.nodes.length; i++)
					{
						var v = new mxCell(seed.nodes[i], new mxGeometry(
							pt.x + 20, pt.y + 20, 100, 40),
							'whiteSpace=wrap;html=1;');
						v.vertex = true;
						vertices.push(container.insert(v));
					}

					for (var i = 0; i < seed.edges.length; i++)
					{
						var e = new mxCell('', new mxGeometry(), edgeStyle);
						e.geometry.relative = true;
						e.edge = true;
						vertices[seed.edges[i][0]].insertEdge(e, true);
						vertices[seed.edges[i][1]].insertEdge(e, false);
						container.insert(e);
					}

					insertCell(container);
				}
			})).isEnabled = isGraphEnabled;
		};

		// Container styles are shared with the Advanced sidebar templates via
		// Menus.layoutContainers (see the static above). Trees/radial/organic
		// pass no edge treatment (edgeStyle 'auto', corners 'keep') — the same
		// defaults the Arrange > Layout dialog uses for the non-layered
		// algorithms.
		var treeSeed = {nodes: ['Root', 'Child 1', 'Child 2'], edges: [[0, 1], [0, 2]]};
		var flowSeed = {nodes: ['Start', 'Task', 'Task', 'End'],
			edges: [[0, 1], [0, 2], [1, 3], [2, 3]]};

		var addLayoutContainerAction = function(name, seed)
		{
			addInsertLayoutAction(name, Menus.layoutContainers[name].style,
				Menus.layoutContainerEdgeStyle, seed);
		};

		addLayoutContainerAction('horizontalFlow', flowSeed);
		addLayoutContainerAction('verticalFlow', flowSeed);
		addLayoutContainerAction('horizontalTree', treeSeed);
		addLayoutContainerAction('verticalTree', treeSeed);
		addLayoutContainerAction('radialTree', treeSeed);
		addLayoutContainerAction('organic', treeSeed);
		addLayoutContainerAction('circle', treeSeed);

		addInsertAction('mermaid');
		addInsertAction('fromText');
		addInsertAction('formatSql');

		// Always available: both outputs (editable diagram group and static
		// SVG image) parse locally with the native converter and need no
		// PlantUML server
		addInsertAction('plantUml');
		
		var insertCell = function(cell)
		{
    		graph.getModel().beginUpdate();
    		try
    	    {
    			cell = graph.addCell(cell);
    	    	graph.fireEvent(new mxEventObject('cellsInserted', 'cells', [cell]));

				if (graph.model.isVertex(cell) && graph.isAutoSizeCell(cell))
				{
					graph.updateCellSize(cell);
				}
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
		
		var insertVertex = function(value, w, h, style, pt)
		{
			var cell = new mxCell(value, new mxGeometry(0, 0, w, h), style);
			cell.vertex = true;

			if (pt == null)
			{
				pt = graph.getCenterInsertPoint(graph.getBoundingBoxFromGeometry([cell], true));
			}

			cell.geometry.x = pt.x;
    	    cell.geometry.y = pt.y;

			return insertCell(cell);
		};
		
		var insertEdge  = function(value, length, style, pt)
		{
			if (pt == null)
			{
				pt = graph.getCenterInsertPoint(graph.getBoundingBoxFromGeometry([cell], true));
			}

			var cell = new mxCell('', new mxGeometry(0, 0, length, 0), style);
			cell.geometry.setTerminalPoint(pt, true);
			cell.geometry.setTerminalPoint(new mxPoint(pt.x + cell.geometry.width, pt.y), false);
			cell.geometry.points = [];
			cell.geometry.relative = true;
			cell.edge = true;

			return insertCell(cell);
		};
		
		editorUi.actions.put('insertText', new Action('text', function(evt)
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
    			graph.startEditingAtCell(insertVertex('Text', 60, 30, graph.appendFontSize(
					Editor.defaultTextStyle, graph.vertexFontSize), (evt != null &&
					!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) &&
					graph.isMouseInsertPoint()) ? graph.getInsertPoint() : null));
			}
		}, null, null, 'A')).isEnabled = isGraphEnabled;
		
		editorUi.actions.put('insertRectangle', new Action('rectangle', function(evt)
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
    	    	insertVertex('', 120, 60, 'whiteSpace=wrap;html=1;', (evt != null &&
					!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) &&
					graph.isMouseInsertPoint()) ? graph.getInsertPoint() : null);
			}
		}, null, null, 'D')).isEnabled = isGraphEnabled;
		
		editorUi.actions.put('insertNote', new Action('note', function(evt)
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
    	    	insertVertex('', 160, 160, Editor.defaultNoteStyle,
					(evt != null && !mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) &&
					graph.isMouseInsertPoint()) ? graph.getInsertPoint() : null);
			}
		}, null, null, 'S')).isEnabled = isGraphEnabled;

		editorUi.actions.put('insertEllipse', new Action('ellipse', function(evt)
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
    	    	insertVertex('', 80, 80, 'ellipse;whiteSpace=wrap;html=1;', (evt != null &&
					!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) &&
					graph.isMouseInsertPoint()) ? graph.getInsertPoint() : null);
			}
		}, null, null, 'F')).isEnabled = isGraphEnabled;
		
		editorUi.actions.put('insertRhombus', new Action('rhombus', function(evt)
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
    	    	insertVertex('', 80, 80, 'rhombus;whiteSpace=wrap;html=1;', (evt != null &&
					!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) &&
					graph.isMouseInsertPoint()) ? graph.getInsertPoint() : null);
			}
		}, null, null, 'R')).isEnabled = isGraphEnabled;

		editorUi.actions.put('insertEdge', new Action('line', function(evt)
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
    	    	insertEdge('', graph.defaultEdgeLength, 'edgeStyle=none;orthogonalLoop=1;jettySize=auto;html=1;',
					(evt != null && !mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) &&
					graph.isMouseInsertPoint()) ? graph.getInsertPoint() : null);
			}
		}, null, null, 'C')).isEnabled = isGraphEnabled;

		editorUi.actions.put('insertPolygon', new Action('polygon' + '...', function(evt)
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
				var dlg = new PolygonDialog(editorUi, null, function(style)
				{
					var cell = new mxCell('', new mxGeometry(0, 0, 80, 80), style);
					cell.vertex = true;

					var pt = (evt != null && !mxEvent.isControlDown(evt) &&
						!mxEvent.isMetaDown(evt) && graph.isMouseInsertPoint()) ?
						graph.getInsertPoint() : null;

					if (pt == null)
					{
						pt = graph.getCenterInsertPoint(
							graph.getBoundingBoxFromGeometry([cell], true));
					}

					cell.geometry.x = pt.x;
					cell.geometry.y = pt.y;

					return insertCell(cell);
				});
				editorUi.showDialog(dlg.container, 680, 540, true, true,
					function() { dlg.destroy(); },
					null, null, new mxRectangle(0, 0, 740, 600),
					null, 'insertPolygon');
				dlg.init();
			}
		})).isEnabled = isGraphEnabled;

		var toggleShapes = editorUi.actions.put('toggleShapes', new Action('shapes', function()
        {
			if (editorUi.sidebarWindow != null)
			{
				editorUi.sidebarWindow.window.setVisible(
					!editorUi.sidebarWindow.window.isVisible());
			}
			else
			{
				editorUi.toggleShapesPanel(!editorUi.isShapesPanelVisible());
			}
        }, null, null, Editor.ctrlKey + '+' + Editor.shiftKey + '+K'));

		toggleShapes.setToggleAction(true);
		toggleShapes.setSelectedCallback(mxUtils.bind(this, function()
		{
			return (editorUi.sidebarWindow != null && editorUi.sidebarWindow.window.isVisible()) ||
				(editorUi.sidebarWindow == null && editorUi.hsplitPosition > 0);
		}));
		
		// Shape picker action for passiveScroll mode (shows inline shape picker instead of shapes panel)
		editorUi.actions.put('showShapePicker', new Action(mxResources.get('shapes') + '...', function()
		{
			var screenPt = graph._contextMenuScreenPoint;
			var x = (screenPt != null) ? screenPt.x : graph.container.clientWidth / 2;
			var y = (screenPt != null) ? screenPt.y : graph.container.clientHeight / 2;

			editorUi.showShapePicker(x, y);
		}));

		this.put('insert', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (Editor.passiveScroll)
			{
				editorUi.menus.addMenuItems(menu, ['showShapePicker'], parent);
				editorUi.menus.addSubmenu('table', menu, parent);
				menu.addSeparator(parent);
				editorUi.menus.addMenuItems(menu, ['insertRectangle', 'insertEllipse', 'insertRhombus',
					'-', 'insertEdge', 'insertNote', '-', 'insertText', 'insertLink',
					'-', 'insertImage', 'createShape', 'insertPolygon', '-'], parent);

				if (editorUi.insertTemplateEnabled && !editorUi.isOffline())
				{
					editorUi.menus.addMenuItems(menu, ['insertTemplate'], parent);
				}

				editorUi.menus.addMenuItems(menu, ['-', 'insertFreehand', 'generate', '-'], parent);
				editorUi.menus.addSubmenu('layout', menu, parent);
				editorUi.menus.addSubmenu('insertAdvanced', menu, parent, mxResources.get('advanced'));
			}
			else if (Editor.currentTheme == 'sketch')
			{
				editorUi.menus.addMenuItems(menu, ['toggleShapes'], parent);
				editorUi.menus.addSubmenu('table', menu, parent);
				menu.addSeparator(parent);
				editorUi.menus.addMenuItems(menu, ['insertText', 'insertLink', '-',
					'insertImage', 'createShape', 'insertPolygon', '-'], parent);

				if (editorUi.insertTemplateEnabled && !editorUi.isOffline())
				{
					editorUi.menus.addMenuItems(menu, ['insertTemplate'], parent);
				}

				if (EditorUi.isMermaidSupported())
				{
					editorUi.menus.addMenuItems(menu, ['mermaid'], parent);
				}

				editorUi.menus.addMenuItems(menu, ['-', 'insertFreehand', 'generate', '-'], parent);
				editorUi.menus.addSubmenu('layout', menu, parent);
				editorUi.menus.addSubmenu('insertAdvanced', menu, parent, mxResources.get('advanced'));
			}
			else
			{
				this.addMenuItems(menu, ['insertRectangle', 'insertEllipse', 'insertRhombus',
					'-', 'insertEdge', 'insertNote', '-', 'insertText', 'insertLink',
					'-', 'insertImage', 'createShape', 'insertPolygon', '-'], parent);

				if (editorUi.insertTemplateEnabled && !editorUi.isOffline())
				{
					this.addMenuItems(menu, ['insertTemplate'], parent);
				}

				if (EditorUi.isMermaidSupported())
				{
					this.addMenuItems(menu, ['mermaid'], parent);
				}

				editorUi.menus.addMenuItems(menu, ['-', 'insertFreehand', 'generate', '-'], parent);

				if (uiTheme == 'min' || Editor.currentTheme == 'simple')
				{
					this.addSubmenu('layout', menu, parent);
					this.addSubmenu('insertLayout', menu, parent, mxResources.get('insert'));
					menu.addSeparator(parent);
					this.addSubmenu('table', menu, parent);
				}
				else
				{
					this.addSubmenu('insertLayout', menu, parent, mxResources.get('layout'));
				}

				this.addSubmenu('insertAdvanced', menu, parent, mxResources.get('advanced'));
			}
		})));

        this.put('table', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			editorUi.menus.addInsertTableCellItem(menu, parent);
		})));

		this.put('insertLayout', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['horizontalFlow', 'verticalFlow', '-',
				'horizontalTree', 'verticalTree', 'radialTree', '-',
				'organic', 'circle'], parent);
		})));

		editorUi.actions.put('csv', new Action(mxResources.get('csv') + '...', function()
		{
			graph.popupMenuHandler.hideMenu();
			editorUi.showImportCsvDialog();
		})).isEnabled = isGraphEnabled;

        this.put('insertAdvanced', new Menu(mxUtils.bind(this, function(menu, parent)
        {
			this.addMenuItems(menu, ['fromText', 'plantUml',
				'formatSql', 'csv'], parent);
			
			if (Editor.currentTheme == 'simple' || Editor.currentTheme == 'min')
			{
				this.addMenuItems(menu, ['-', 'createShape', 'editDiagram'], parent);
			}
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
			else if (editorUi.isModeEnabled(App.MODE_GOOGLE))
			{
				menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}
			
			if (editorUi.isModeReady(App.MODE_ONEDRIVE))
			{
				menu.addItem(mxResources.get('oneDrive') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_ONEDRIVE);
				}, parent);
			}
			else if (editorUi.isModeEnabled(App.MODE_ONEDRIVE))
			{
				menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}

			if (editorUi.isModeReady(App.MODE_M365))
			{
				menu.addItem(mxResources.get('m365') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_M365);
				}, parent);
			}
			else if (editorUi.isModeEnabled(App.MODE_M365))
			{
				menu.addItem(mxResources.get('m365') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}

			if (editorUi.isModeReady(App.MODE_DROPBOX))
			{
				menu.addItem(mxResources.get('dropbox') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_DROPBOX);
				}, parent);
			}
			else if (editorUi.isModeEnabled(App.MODE_DROPBOX))
			{
				menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
				{
					// do nothing
				}, parent, null, false);
			}

			menu.addSeparator(parent);
			
			if (editorUi.isModeReady(App.MODE_GITHUB))
			{
				menu.addItem(mxResources.get('github') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_GITHUB);
				}, parent);
			}
			
			if (editorUi.isModeReady(App.MODE_GITLAB))
			{
				menu.addItem(mxResources.get('gitlab') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_GITLAB);
				}, parent);
			}

			if (editorUi.isModeReady(App.MODE_TRELLO))
			{
				menu.addItem(mxResources.get('trello') + '...', null, function()
				{
					editorUi.pickFile(App.MODE_TRELLO);
				}, parent);
			}
			else if (editorUi.isModeEnabled(App.MODE_TRELLO))
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
			if (urlParams['noDevice'] != '1')
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
								window.geOpenWindow(((mxClient.IS_CHROMEAPP) ?
									'https://app.diagrams.net/' : 'https://' + location.host + '/') +
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
					else if (editorUi.isModeEnabled(App.MODE_GOOGLE))
					{
						menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
						{
							// do nothing
						}, parent, null, false);
					}
				}

				if (editorUi.isModeReady(App.MODE_ONEDRIVE))
				{
					menu.addItem(mxResources.get('oneDrive') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_ONEDRIVE);
					}, parent);
				}
				else if (editorUi.isModeEnabled(App.MODE_ONEDRIVE))
				{
					menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
					{
						// do nothing
					}, parent, null, false);
				}

				if (editorUi.isModeReady(App.MODE_DROPBOX))
				{
					menu.addItem(mxResources.get('dropbox') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_DROPBOX);
					}, parent);
				}
				else if (editorUi.isModeEnabled(App.MODE_DROPBOX))
				{
					menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
					{
						// do nothing
					}, parent, null, false);
				}
				
				menu.addSeparator(parent);
				
				if (editorUi.isModeReady(App.MODE_GITHUB))
				{
					menu.addItem(mxResources.get('github') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_GITHUB);
					}, parent);
				}
				
				if (editorUi.isModeReady(App.MODE_GITLAB))
				{
					menu.addItem(mxResources.get('gitlab') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_GITLAB);
					}, parent);
				}

				if (editorUi.isModeReady(App.MODE_TRELLO))
				{
					menu.addItem(mxResources.get('trello') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_TRELLO);
					}, parent);
				}
				else if (editorUi.isModeEnabled(App.MODE_TRELLO))
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
				if (urlParams['noDevice'] != '1')
				{
					menu.addItem(mxResources.get('device') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, App.MODE_DEVICE);
					}, parent);
				}

				if (urlParams['confLib'] == '1')
				{
					menu.addItem(mxResources.get('confluenceCloud') + '...', null, function()
					{
						editorUi.showLibraryDialog(null, null, null, null, 'CONF_LIB');
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
					else if (editorUi.isModeEnabled(App.MODE_GOOGLE))
					{
						menu.addItem(mxResources.get('googleDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
						{
							// do nothing
						}, parent, null, false);
					}
				}

				if (editorUi.isModeReady(App.MODE_ONEDRIVE))
				{
					menu.addItem(mxResources.get('oneDrive') + '...', null, function()
					{
						editorUi.pickLibrary(App.MODE_ONEDRIVE);
					}, parent);
				}
				else if (editorUi.isModeEnabled(App.MODE_ONEDRIVE))
				{
					menu.addItem(mxResources.get('oneDrive') + ' (' + mxResources.get('loading') + '...)', null, function()
					{
						// do nothing
					}, parent, null, false);
				}

				if (editorUi.isModeReady(App.MODE_DROPBOX))
				{
					menu.addItem(mxResources.get('dropbox') + '...', null, function()
					{
						editorUi.pickLibrary(App.MODE_DROPBOX);
					}, parent);
				}
				else if (editorUi.isModeEnabled(App.MODE_DROPBOX))
				{
					menu.addItem(mxResources.get('dropbox') + ' (' + mxResources.get('loading') + '...)', null, function()
					{
						// do nothing
					}, parent, null, false);
				}
				
				menu.addSeparator(parent);
				
				if (editorUi.isModeReady(App.MODE_GITHUB))
				{
					menu.addItem(mxResources.get('github') + '...', null, function()
					{
						editorUi.pickLibrary(App.MODE_GITHUB);
					}, parent);
				}
				
				if (editorUi.isModeReady(App.MODE_GITLAB))
				{
					menu.addItem(mxResources.get('gitlab') + '...', null, function()
					{
						editorUi.pickLibrary(App.MODE_GITLAB);
					}, parent);
				}

				if (editorUi.isModeReady(App.MODE_TRELLO))
				{
					menu.addItem(mxResources.get('trello') + '...', null, function()
					{
						editorUi.pickLibrary(App.MODE_TRELLO);
					}, parent);
				}
				else if (editorUi.isModeEnabled(App.MODE_TRELLO))
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
				if (urlParams['noDevice'] != '1')
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
											editorUi.loadLibrary(new UrlLibrary(
												editorUi, req.getText(), fileUrl));
											editorUi.showSidebar();
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
			this.addMenuItems(menu, ['undo', 'redo', '-', 'cut', 'copy', 'copyAsImage', 'copyAsSvg', 'paste',
				'delete', '-', 'duplicate', '-', 'findReplace', '-', 'editData', 'editTooltip', '-',
				'editStyle',  'editGeometry', 'editPolygon', 'editConnectionPoints', '-', 'edit', '-',
				'editLink', 'openLink', '-', 'selectVertices', 'selectEdges', 'selectAll', 'selectNone', '-',
				'lockUnlock']);
		})));

		var action = editorUi.actions.addAction('comments', mxUtils.bind(this, function()
		{
			if (this.commentsWindow == null)
			{
				var saved = mxSettings.getWindowState('comments');
				var cmx = (saved != null && saved.x != null) ? saved.x :
					document.body.offsetWidth - 380;
				var cmy = (saved != null && saved.y != null) ? saved.y : 120;
				var cmw = (saved != null && saved.w != null) ? saved.w : 300;
				var cmh = (saved != null && saved.h != null) ? saved.h : 350;

				this.commentsWindow = new CommentsWindow(editorUi, cmx, cmy, cmw, cmh);
				this.commentsWindow.window.addListener('show', function()
				{
					editorUi.fireEvent(new mxEventObject('comments'));
				});
				this.commentsWindow.window.addListener('hide', function()
				{
					editorUi.fireEvent(new mxEventObject('comments'));
				});

				editorUi.installWindowPersistence('comments', this.commentsWindow);

				if (saved != null)
				{
					editorUi.restoreWindowState('comments', this.commentsWindow);
				}
				else
				{
					this.commentsWindow.window.setVisible(true);
				}

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
		
		// Extends toolbar dropdown
		var viewPanelsMenu = this.get('viewPanels');
		
		viewPanelsMenu.funct = function(menu, parent)
		{
			var file = editorUi.getCurrentFile();
			editorUi.menus.addMenuItems(menu, ['toggleShapes', 'format', 'ruler', '-',
				'findReplace', 'layers', 'tags', 'outline', '-'], parent);

			if (editorUi.commentsSupported())
			{
				editorUi.menus.addMenuItems(menu, ['-', 'comments'], parent);
			}
			
			if (file != null && file.isRealtimeEnabled() && file.isRealtimeSupported())
			{
				editorUi.menus.addMenuItems(menu, ['-', 'showRemoteCursors', 'shareCursor'], parent);
			}

			editorUi.menus.addMenuItems(menu, ['-', 'fullscreen'], parent);
		};

		// Overrides view menu to add search and scratchpad
		this.put('view', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (Editor.currentTheme == 'simple')
			{
				var file = editorUi.getCurrentFile();
				editorUi.menus.addMenuItems(menu, ['toggleShapes', 'format'], parent);
	
				if (editorUi.isPageMenuVisible())
				{
					editorUi.menus.addMenuItems(menu, ['pageTabs'], parent);
				}

				editorUi.menus.addMenuItems(menu, ['ruler', '-', 'search'], parent);

				if (isLocalStorage || mxClient.IS_CHROMEAPP)
				{
					var item = editorUi.menus.addMenuItem(menu, 'scratchpad', parent);
					
					if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
					{
						editorUi.menus.addLinkToItem(item, 'https://www.drawio.com/doc/faq/scratchpad');
					}
				}
				
				editorUi.menus.addMenuItems(menu, ['-', 'findReplace',
					'layers', 'tags', 'outline', '-'], parent);
				
				if (editorUi.commentsSupported())
				{
					editorUi.menus.addMenuItems(menu, ['comments'], parent);
				}
				
				if (file != null && file.isRealtimeEnabled() && file.isRealtimeSupported())
				{
					this.addMenuItems(menu, ['showRemoteCursors'], parent);
				}

				this.addMenuItems(menu, ['-', 'fullscreen'], parent);
			}
			else
			{
				this.addMenuItems(menu, (['format', 'outline', 'layers', 'tags']).
					concat((editorUi.commentsSupported()) ?
					['comments', '-'] : ['-']));
				
				this.addMenuItems(menu, ['-', 'search'], parent);
				
				if (isLocalStorage || mxClient.IS_CHROMEAPP)
				{
					var item = this.addMenuItem(menu, 'scratchpad', parent);
					
					if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
					{
						this.addLinkToItem(item, 'https://www.drawio.com/doc/faq/scratchpad');
					}
				}
				
				this.addMenuItems(menu, ['toggleShapes', '-', 'pageView', 'pageScale']);
				this.addSubmenu('units', menu, parent);
				menu.addSeparator(parent);

				if (editorUi.isPageMenuVisible())
				{
					editorUi.menus.addMenuItems(menu, ['pageTabs'], parent);
				}

				this.addMenuItems(menu, ['ruler', '-', 'tooltips', 'animations',
					'-', 'grid', 'guides', '-', 'connectionArrows', 'connectionPoints', '-',
					'resetView', 'zoomIn', 'zoomOut'], parent);

				if (urlParams['sketch'] != '1')
				{
					this.addMenuItems(menu, ['-', 'fullscreen'], parent);
				}
			}
		})));

		// Edit cell menu
		this.put('editCell', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			// Last entry edits cell label
			this.addMenuItems(menu, ['editLink', 'editShape', 'editImage', 'crop', '-',
				'editData', 'copyData', 'pasteData', '-', 'editPolygon', 'editConnectionPoints',
				'editGeometry', '-', 'editTooltip', 'editStyle', '-', 'edit'], parent);
		})));
				
		// Current page menu
		this.put('currentPage', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var page = editorUi.currentPage;

			if (page != null)
			{
				this.addMenuItems(menu, ['renamePage', 'removePage'], parent);

				if (editorUi.pages.length > 1)
				{
					editorUi.menus.addSubmenu('movePage', menu, parent, mxResources.get('move'));
					menu.addSeparator(parent);
				}

				this.addMenuItems(menu, ['-', 'duplicatePage'], parent);

				if (urlParams['embed'] != 1)
				{
					if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp && editorUi.getServiceName() == 'draw.io')
					{
						menu.addItem(mxResources.get('openInNewWindow'), null, mxUtils.bind(this, function()
						{
							editorUi.editor.editAsNew(editorUi.getFileData(true, null, null, null, true, true));
						}), parent);
					}
				}
			}
		})));

		// Pages menu
		this.put('pages', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var page = editorUi.currentPage;

			if (!editorUi.editor.graph.isLightboxView())
			{
				this.addMenuItems(menu, ['insertPage', '-'], parent);
			}
			
			if (editorUi.pages != null)
			{
				for (var i = 0; i < editorUi.pages.length; i++)
				{
					(mxUtils.bind(this, function(index)
					{
						var item = null;

						if (editorUi.pages[index] == page && !editorUi.editor.graph.isLightboxView() &&
							editorUi.editor.graph.isEnabled())
						{
							item = editorUi.menus.addSubmenu('currentPage', menu, parent,
								editorUi.getShortPageName(page));
						}
						else
						{
							item = menu.addItem(editorUi.getShortPageName(editorUi.pages[index]),
								null, mxUtils.bind(this, function()
							{
								editorUi.selectPage(editorUi.pages[index]);
							}), parent);
						}

						var id = editorUi.pages[index].getId();
						item.setAttribute('title', editorUi.pages[index].getName() +
							' (' + (index + 1) + '/' + editorUi.pages.length + ')' +
							((id != null) ? ' [' + id + ']' : ''));
						
						// Adds checkmark to current page
						if (editorUi.pages[index] == page)
						{
							menu.addCheckmark(item, Editor.checkmarkImage);
						}
					}))(i);
				}

				if (!editorUi.editor.graph.isLightboxView())
				{
					menu.addSeparator(parent);

					menu.addItem(mxResources.get('deleteAll'), null, mxUtils.bind(this, function()
					{
						graph.getModel().beginUpdate();
						try
						{
							for (var i = editorUi.pages.length; i >= 0; i--)
							{
								editorUi.removePage(editorUi.pages[i]);
							}
						}
						catch (e)
						{
							editorUi.handleError(e);
						}
						finally
						{
							graph.getModel().endUpdate();
						}

						editorUi.actions.get('resetView').funct();
					}), parent, null, editorUi.editor.graph.isEnabled());
				}
			}
		})));
		
		if (EditorUi.isElectronApp)
		{
			var enableSpellCheck = urlParams['enableSpellCheck'] == '1';

			var spellCheckAction = editorUi.actions.addAction('spellCheck', function()
			{
				editorUi.toggleSpellCheck();
				enableSpellCheck = !enableSpellCheck;
				editorUi.alert(mxResources.get('restartForChangeRequired'));
			});
			
			spellCheckAction.setToggleAction(true);
			spellCheckAction.setSelectedCallback(function() { return enableSpellCheck; });

			var enableStoreBkp = urlParams['enableStoreBkp'] == '1';

			var storeBkpAction = editorUi.actions.addAction('autoBkp', function()
			{
				editorUi.toggleStoreBkp();
				enableStoreBkp = !enableStoreBkp;
			});
			
			storeBkpAction.setToggleAction(true);
			storeBkpAction.setSelectedCallback(function() { return enableStoreBkp; });

			var enableGoogleFonts = urlParams['isGoogleFontsEnabled'] == '1';
			
			var googleFontsAction = editorUi.actions.addAction('googleFonts', function()
			{
				editorUi.toggleGoogleFonts();
				enableGoogleFonts = !enableGoogleFonts;
				editorUi.alert(mxResources.get('restartForChangeRequired'));
			});

			googleFontsAction.setToggleAction(true);
			googleFontsAction.setSelectedCallback(function() { return enableGoogleFonts; });

			editorUi.actions.addAction('openDevTools', function()
			{
				editorUi.openDevTools();
			});

			editorUi.actions.addAction('drafts...', function()
			{
				var dlg = new FilenameDialog(editorUi, (EditorUi.draftSaveDelay / 1000) + '',
					mxResources.get('apply'), mxUtils.bind(this, function(newValue)
				{
					var val = parseInt(newValue);
					
					if (val >= 0)
					{
						EditorUi.draftSaveDelay = val * 1000;
						EditorUi.enableDrafts = val > 0;  //Disable if zero
						mxSettings.setDraftSaveDelay(val);
						mxSettings.save();		
					}
				}), mxResources.get('draftSaveInt'));
				editorUi.showDialog(dlg.container, 320, 80, true, true);
				dlg.init();
			});
		}
		
		var langMenu = this.get('language');

		this.put('extras', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			// Compatiblity code for live UI switch and static UI
			if (Editor.currentTheme == 'simple' ||
				Editor.currentTheme == 'sketch' ||
				Editor.currentTheme == 'min')
			{
				if (urlParams['embed'] != '1' && urlParams['extAuth'] != '1' &&
					editorUi.mode != App.MODE_ATLAS)
				{
					editorUi.menus.addSubmenu('theme', menu, parent);
				}
				
				if (langMenu != null && (urlParams['embed'] != '1' || urlParams['lang'] == null))
				{
					editorUi.menus.addSubmenu('language', menu, parent);
				}
				
				if ((urlParams['embed'] != '1' || urlParams['atlas'] == '1') &&
					urlParams['extAuth'] != '1' && urlParams['embedInline'] != '1')
				{
					editorUi.menus.addSubmenu('appearance', menu, parent);
				}

				menu.addSeparator(parent);

				editorUi.menus.addSubmenu('units', menu, parent);
				editorUi.menus.addMenuItems(menu, ['-', 'copyConnect',
					'collapseExpand', '-', 'tooltips', 'animations', '-'], parent);

				var file = editorUi.getCurrentFile();

				if (Editor.currentTheme != 'simple')
				{
					if (file != null && file.isRealtimeEnabled() && file.isRealtimeSupported())
					{
						this.addMenuItems(menu, ['showRemoteCursors'], parent);
					}
					
					editorUi.menus.addMenuItems(menu, ['ruler', '-'], parent);
				}

				if (EditorUi.isElectronApp)
				{
					editorUi.menus.addMenuItems(menu, ['-', 'googleFonts', 'spellCheck', 'autoBkp', 'drafts', '-'], parent);
				}

				this.addSubmenu('diagramLanguage', menu, parent);
				menu.addSeparator(parent);

				if (editorUi.mode != App.MODE_ATLAS)
				{
					editorUi.menus.addMenuItem(menu, 'configuration', parent);
				}

				// Adds trailing separator in case new plugin entries are added
				menu.addSeparator(parent);
			}
			else
			{
				if (urlParams['embed'] != '1' && urlParams['extAuth'] != '1' &&
					editorUi.mode != App.MODE_ATLAS)
				{
					this.addSubmenu('theme', menu, parent);
				}

				if (urlParams['embed'] != '1' || urlParams['lang'] == null)
				{
					this.addSubmenu('language', menu, parent);
				}
				
				if (urlParams['embed'] != '1' || urlParams['atlas'] == '1')
				{
					editorUi.menus.addSubmenu('appearance', menu, parent);
				}

				if (EditorUi.isElectronApp)
				{
					this.addMenuItems(menu, ['-', 'googleFonts', 'spellCheck', 'autoBkp', 'drafts', '-'], parent);
				}
				
				menu.addSeparator(parent);

				if (typeof(MathJax) !== 'undefined')
				{
					var item = this.addMenuItem(menu, 'mathematicalTypesetting', parent);
					
					if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
					{
						this.addLinkToItem(item, 'https://www.drawio.com/doc/faq/math-typesetting');
					}
				}
				
				if (urlParams['embed'] != '1')
				{
					var file = editorUi.getCurrentFile();

					if (file != null && file.isRealtimeEnabled() && file.isRealtimeSupported())
					{
						this.addMenuItems(menu, ['-', 'showRemoteCursors', 'shareCursor'], parent);
					}

					menu.addSeparator(parent);
					
					if (isLocalStorage || mxClient.IS_CHROMEAPP)
					{
						this.addMenuItems(menu, ['showStartScreen'], parent);
					}

					this.addMenuItems(menu, ['autosave'], parent);
				}

				this.addMenuItems(menu, ['-', 'copyConnect', 'collapseExpand', '-'], parent);
				this.addSubmenu('diagramLanguage', menu, parent);
				this.addMenuItems(menu, ['editDiagram', '-'], parent);

				if (!editorUi.isOfflineApp() && isLocalStorage)
				{
					this.addMenuItem(menu, 'plugins', parent);
				}
	
				this.addMenuItems(menu, ['configuration'], parent);
			}
		})));

		this.put('movePage', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var currentPage = editorUi.currentPage;
			var current = editorUi.getPageIndex(currentPage);

			if (editorUi.pages != null)
			{
				for (var i = 0; i < editorUi.pages.length; i++)
				{
					if (i != current)
					{
						(function(index)
						{
							menu.addItem(editorUi.getShortPageName(editorUi.pages[index]), null, function()
							{
								editorUi.movePage(current, index);
								editorUi.scrollToPage(currentPage, true);
							}, parent);
						})(i);
					}
				}
			}
		})));

		this.put('share', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			if (!editorUi.isStandaloneApp())
			{
				var err = (editorUi.isOffline(true)) ?
					mxResources.get('offline') :
					editorUi.getNetworkStatus();

				if (err != null)
				{
					menu.addItem(err, null, null, parent, null, false);
					menu.addSeparator(parent);
				}

				editorUi.menus.addMenuItems(menu, ['share'], parent);
			}

			this.addMenuItem(menu, 'publishLink', parent, null,
				null, mxResources.get('publish') + '...');

			if (!EditorUi.isElectronApp && editorUi.isOwnGDriveDomain() &&
				editorUi.getServiceName() == 'draw.io' && !navigator.standalone)
			{
				this.addMenuItem(menu, 'presentationMode', parent);
			}

			if (editorUi.getMainUser() != null)
			{
				this.addMenuItems(menu, ['accounts'], parent);
			}
		})));

		this.put('diagram', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var file = editorUi.getCurrentFile();

			if (Editor.currentTheme != 'simple')
			{
				editorUi.menus.addSubmenu('extras', menu, parent, mxResources.get('settings'));
				menu.addSeparator(parent);
			}

			// Compatiblity code for live UI switch and static UI
			var sketchTheme = Editor.currentTheme == 'simple' ||
				Editor.currentTheme == 'sketch';
			
			if (mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
			{
				editorUi.menus.addMenuItems(menu, ['new', 'open'], parent);
				editorUi.menus.addSubmenu('openRecent', menu, parent);
				editorUi.menus.addMenuItems(menu,
					['-', 'synchronize', 'properties', '-',
					'save', 'saveAs', '-'], parent);
			}
			else if (editorUi.mode == App.MODE_ATLAS)
			{
				if (urlParams['noSaveBtn'] != '1' &&
					urlParams['embedInline'] != '1')
				{
					editorUi.menus.addMenuItems(menu, ['-', 'save'], parent);
				}
				
				if (urlParams['saveAndExit'] == '1' || 
					(urlParams['noSaveBtn'] == '1' &&
					urlParams['saveAndExit'] != '0') || editorUi.mode == App.MODE_ATLAS)
				{
					editorUi.menus.addMenuItems(menu, ['saveAndExit'], parent);
					
					if (file != null && file.isRevisionHistorySupported())
					{
						editorUi.menus.addMenuItems(menu, ['revisionHistory'], parent);
					}
				}
				
				menu.addSeparator(parent);
			}
			else if (editorUi.mode == App.MODE_ATLAS)
			{
				editorUi.menus.addMenuItems(menu, ['save', 'synchronize', '-'], parent);
			}
			else if (urlParams['noFileMenu'] != '1')
			{
				editorUi.menus.addSubmenu('file', menu, parent);
				menu.addSeparator(parent);

				if (Editor.currentTheme == 'min')
				{
					editorUi.menus.addMenuItems(menu, ['toggleShapes', 'format',
						'layers', 'tags', '-', 'findReplace'], parent);
			
					if (editorUi.commentsSupported())
					{
						editorUi.menus.addMenuItems(menu, ['comments'], parent);
					}
					
					menu.addSeparator(parent);
				}
			}
			
			editorUi.menus.addSubmenu('exportAs', menu, parent);
			
			if (mxClient.IS_CHROMEAPP || EditorUi.isElectronApp || editorUi.getServiceName() == 'atlassian')
			{
				editorUi.menus.addMenuItems(menu, ['import'], parent);
			}
			else if (urlParams['noFileMenu'] != '1')
			{
				editorUi.menus.addSubmenu('importFrom', menu, parent);
			}
	
			if (Editor.currentTheme != 'simple' && Editor.currentTheme != 'min')
			{
				editorUi.menus.addMenuItems(menu, ['-',  'findReplace'], parent);
		
				if (editorUi.commentsSupported())
				{
					editorUi.menus.addMenuItems(menu, ['comments', '-'], parent);
				}

				editorUi.menus.addMenuItems(menu, ['toggleShapes', 'format',
					'layers', 'tags', '-'], parent);
				editorUi.menus.addMenuItems(menu, ['pageSetup'], parent);
			}
			else if (Editor.currentTheme != 'min')
			{
				this.addMenuItems(menu, ['-'], parent);
				this.addSubmenu('newLibrary', menu, parent);
				this.addSubmenu('openLibraryFrom', menu, parent);
			}

			// Sketch already shows pageSetup just above; keep it adjacent to
			// print without a separator. Simple/min add pageSetup here.
			if (Editor.currentTheme != 'sketch')
			{
				menu.addSeparator(parent);
			}

			if (Editor.currentTheme == 'simple' || Editor.currentTheme == 'min')
			{
				editorUi.menus.addMenuItems(menu, ['pageSetup'], parent);
			}

			// Cannot use print in standalone mode on iOS as we cannot open new windows
			if (urlParams['noFileMenu'] != '1' && (!mxClient.IS_IOS || !navigator.standalone))
			{
				editorUi.menus.addMenuItems(menu, ['print'], parent);
			}
	
			if (!sketchTheme && Editor.currentTheme != 'min')
			{
				if (file != null && editorUi.fileNode != null && urlParams['embedInline'] != '1')
				{
					var filename = (file.getTitle() != null) ?
						file.getTitle() : editorUi.defaultFilename;
					
					if (!/(\.html)$/i.test(filename))
					{
						this.addMenuItems(menu, ['-', 'properties']);
					}
				}
			}
	
			menu.addSeparator(parent);
			
			if (Editor.currentTheme == 'simple')
			{
				editorUi.menus.addSubmenu('extras', menu, parent, mxResources.get('settings'));
				menu.addSeparator(parent);
			}

			editorUi.menus.addSubmenu('help', menu, parent);
			menu.addSeparator(parent);

			if (urlParams['embed'] == '1')
			{
				if (urlParams['noSaveBtn'] != '1' &&
					urlParams['embedInline'] != '1')
				{
					editorUi.menus.addMenuItems(menu, ['save'], parent);
				}
				
				if (urlParams['saveAndExit'] == '1' || 
					(urlParams['noSaveBtn'] == '1' &&
					urlParams['saveAndExit'] != '0'))
				{
					editorUi.menus.addMenuItems(menu, ['saveAndExit'], parent);
					
					if (file != null && file.isRevisionHistorySupported())
					{
						editorUi.menus.addMenuItems(menu, ['revisionHistory'], parent);
					}
				}
			}

			if (urlParams['embed'] == '1' || editorUi.mode == App.MODE_ATLAS)
			{
				if (urlParams['noExitBtn'] != '1' || editorUi.mode == App.MODE_ATLAS)
				{
					editorUi.menus.addMenuItems(menu, ['exit'], parent);
				}
			}
			
			if (urlParams['embed'] != '1' && file != null && typeof AtlasFile == 'undefined') // Exclude Atlasian plugin
			{
				editorUi.menus.addMenuItems(menu, ['-', 'close'], parent);
			}
		})));

		this.put('save', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var file = editorUi.getCurrentFile();
			
			if (file != null && (file.constructor == DriveFile || file.constructor == OneDriveFile))
			{
				editorUi.menus.addMenuItems(menu, ['save', 'makeCopy', '-', 'rename', 'moveToFolder'], parent);
			}
			else
			{
				editorUi.menus.addMenuItems(menu, ['save', 'saveAs', '-', 'rename'], parent);
				this.addMenuItems(menu, [(editorUi.isOfflineApp()) ? 'upload' : 'makeCopy'], parent);
			}
			
			editorUi.menus.addMenuItems(menu, ['-', 'autosave'], parent);
	
			if (file != null && file.isRevisionHistorySupported())
			{
				editorUi.menus.addMenuItems(menu, ['-', 'revisionHistory'], parent);
			}
		})));

		this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			// Compatiblity code for live UI switch and static UI
			var minTheme = Editor.currentTheme == 'simple' ||
				Editor.currentTheme == 'sketch' ||
				Editor.currentTheme == 'min';

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
				
				if (urlParams['embedInline'] != '1')
				{
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
				}
				
				if (urlParams['noExitBtn'] != '1')
				{
					this.addMenuItems(menu, ['exit'], parent);
				}
			}
			else if (minTheme)
			{
				var file = editorUi.getCurrentFile();
				editorUi.menus.addMenuItems(menu, ['new'], parent);
				editorUi.menus.addSubmenu('openFrom', menu, parent);

				if (isLocalStorage)
				{
					this.addSubmenu('openRecent', menu, parent);
				}
				
				menu.addSeparator(parent);
				editorUi.menus.addMenuItems(menu, ['-', 'save'], parent);

				if (file == null || file.constructor != DriveFile)
				{
					editorUi.menus.addMenuItems(menu, ['saveAs'], parent);
				}

				if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp &&
					file != null && (file.constructor != LocalFile ||
					file.fileHandle != null))
				{
					editorUi.menus.addMenuItems(menu, ['synchronize'], parent);
				}

				menu.addSeparator(parent);

				if (file != null)
				{
					if (Editor.currentTheme != 'simple' &&
						(file.constructor == DriveFile ||
						file.constructor == GitHubFile ||
						file.constructor == OneDriveFile))
					{
						editorUi.menus.addMenuItems(menu, ['share'], parent);
					}

					if ((Editor.currentTheme == 'sketch' || Editor.currentTheme == 'min') &&
						!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp)
					{
						this.addMenuItem(menu, 'publishLink', parent, null, null,
							mxResources.get('publish') + '...');
					}

					if ((Editor.currentTheme == 'sketch' || Editor.currentTheme == 'min') &&
						!EditorUi.isElectronApp && editorUi.isOwnGDriveDomain() &&
						editorUi.getServiceName() == 'draw.io' && !navigator.standalone)
					{
						this.addMenuItem(menu, 'presentationMode', parent);
					}
				}

				menu.addSeparator(parent);

				if (file != null && file.isRenamable())
				{
					this.addMenuItems(menu, ['rename'], parent);
				}
				
				if (editorUi.isOfflineApp())
				{
					this.addMenuItems(menu, ['upload'], parent);
				}
				else
				{
					editorUi.menus.addMenuItems(menu, ['makeCopy'], parent);

					if (file != null)
					{
						if (file.constructor == OneDriveFile ||
							file.constructor == DriveFile)
						{
							editorUi.menus.addMenuItems(menu, ['moveToFolder'], parent);
						}

						menu.addSeparator(parent);

						if (file.getFolderUrl() != null)
						{
							editorUi.menus.addMenuItems(menu, ['openFolder'], parent);
						}

						if (file.getFileUrl() != null)
						{
							editorUi.menus.addMenuItems(menu, ['openFile'], parent);
						}
					}
				}
				
				menu.addSeparator(parent);

				if (file != null && file.isRevisionHistorySupported())
				{
					editorUi.menus.addMenuItems(menu, ['revisionHistory'], parent);
				}

				if (file != null && editorUi.fileNode != null && urlParams['embedInline'] != '1')
				{
					var filename = (file.getTitle() != null) ?
						file.getTitle() : editorUi.defaultFilename;

					if ((file.constructor == DriveFile && file.sync != null &&
						file.sync.isConnected()) || !/(\.html)$/i.test(filename))
					{
						this.addMenuItems(menu, ['properties'], parent);
					}
				}

				if (Editor.currentTheme == 'simple')
				{
					editorUi.menus.addMenuItems(menu, ['-', 'autosave'], parent);
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
						this.addLinkToItem(item, 'https://www.drawio.com/doc/faq/synchronize');
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
					this.addMenuItems(menu, ['new', '-', 'rename', 'makeCopy',
						'openFolder', 'moveToFolder'], parent);
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
							this.addLinkToItem(item, 'https://www.drawio.com/doc/faq/synchronize');
						}
					}
					
					this.addMenuItems(menu, ['-', 'save', 'saveAs', '-'], parent);
					
					if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp &&
						editorUi.getServiceName() == 'draw.io' &&
						!editorUi.isOfflineApp() && file != null)
					{
						this.addMenuItems(menu, ['share', '-'], parent);
					}
					
					if (file != null && file.isRenamable())
					{
						this.addMenuItems(menu, ['rename'], parent);
					}
					
					if (editorUi.isOfflineApp())
					{
						this.addMenuItems(menu, ['upload'], parent);
					}
					else
					{
						this.addMenuItems(menu, ['makeCopy'], parent);

						if (file != null)
						{
							if (file.constructor == OneDriveFile)
							{
								this.addMenuItems(menu, ['moveToFolder'], parent);
							}

							if (file.getFolderUrl() != null)
							{
								editorUi.menus.addMenuItems(menu, ['openFolder'], parent);
							}
						}
					}
				}
				
				menu.addSeparator(parent);
				this.addSubmenu('importFrom', menu, parent);
				this.addSubmenu('exportAs', menu, parent);

				if (!editorUi.isOffline())
				{
					menu.addSeparator(parent);
					this.addSubmenu('embed', menu, parent);
					this.addSubmenu('publish', menu, parent);
				}

				menu.addSeparator(parent);
				this.addSubmenu('newLibrary', menu, parent);
				this.addSubmenu('openLibraryFrom', menu, parent);

				if (editorUi.isRevisionHistorySupported())
				{
					this.addMenuItems(menu, ['-', 'revisionHistory'], parent);
				}
				
				if (file != null && editorUi.fileNode != null && urlParams['embedInline'] != '1')
				{
					var filename = (file.getTitle() != null) ?
						file.getTitle() : editorUi.defaultFilename;
					
					if ((file.constructor == DriveFile && file.sync != null &&
						file.sync.isConnected()) || !/(\.html)$/i.test(filename))
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
		
		//Replace the default font family menu
		this.put('fontFamily', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var addItem = mxUtils.bind(this, function(fontName, fontUrl, deletable, fontLabel, tooltip)
			{
				var graph = editorUi.editor.graph;

				var tr = this.styleChange(menu, (fontLabel != null) ? fontLabel : fontName,
					[mxConstants.STYLE_FONTFAMILY, 'fontSource', 'FType'],
					[fontName, (fontUrl != null) ? encodeURIComponent(fontUrl) : null, null],
					null, parent, function()
				{
					graph.setFont(fontName, fontUrl);
					editorUi.fireEvent(new mxEventObject('styleChanged',
						'keys', [mxConstants.STYLE_FONTFAMILY, 'fontSource', 'FType'],
						'values', [fontName, (fontUrl != null) ? encodeURIComponent(fontUrl) : null, null],
						'cells', [graph.cellEditor.getEditingCell()]));
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
				});
				
				if (deletable)
				{
					var img = document.createElement('img');
					img.className = 'geAdaptiveAsset';
					img.setAttribute('src', Editor.crossImage);
					img.setAttribute('title', mxResources.get('delete'));
					img.setAttribute('valign', 'absmiddle');
					img.setAttribute('border', '0');
					img.style.position = 'relative';
					img.style.top = '2px';
					img.style.width = '14px';
					img.style.cursor = 'default';
					img.style.margin = '0 3px';
					tr.firstChild.nextSibling.nextSibling.appendChild(img);
					
					mxEvent.addListener(img, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', mxUtils.bind(this, function(evt)
					{
						this.removeCustomFont(fontName, fontUrl);
						this.editorUi.hideCurrentMenu();
						mxEvent.consume(evt);
					}));
				}
				
				Graph.addFont(fontName, fontUrl);
				tr.firstChild.nextSibling.style.fontFamily = mxUtils.parseCssFontFamily(fontName);
				
				var tooltip = (fontLabel != null) ? fontLabel : fontName;
						
				if (fontUrl != null)
				{
					tooltip += ' (' + fontUrl + ')';
				}

				tr.setAttribute('title', tooltip);
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
			
			// Adds custom user-defined fonts from local storage
			for (var i = 0; i < this.customFonts.length; i++)
			{
				addEntry(this.customFonts[i]);
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
					addItem(entries[i].name, entries[i].url,
						true, entries[i].label);
				}

				menu.addSeparator(parent);
			}
			
			menu.addItem(mxResources.get('reset'), null, mxUtils.bind(this, function()
			{
				this.customFonts = [];
				editorUi.fireEvent(new mxEventObject('customFontsChanged'));
			}), parent);
			
			menu.addSeparator(parent);
			
			menu.addItem(mxResources.get('custom') + '...', null, mxUtils.bind(this, function()
			{
				var graph = this.editorUi.editor.graph;
				var curFontName = graph.getStylesheet().getDefaultVertexStyle()
					[mxConstants.STYLE_FONTFAMILY];
				var curType = 's';
				var curUrl = null;
				
				// Handles in-place editing custom fonts via font family lookup
				if (graph.isEditing())
				{
					var node = graph.getSelectedEditingElement();

					if (node != null)
					{
						var css = mxUtils.getCurrentStyle(node);

						if (css != null)
						{
							curFontName = mxUtils.getCssFontFamily(css.fontFamily);

							// Finds the URL for the current font by finding the nearest parent element
							// with a data-font-src attribute or the fontSource attribute from the cell
							var state = graph.getView().getState(graph.cellEditor.getEditingCell());
							var curUrl = (state != null) ? state.style['fontSource'] : null;
			    			
			    			if (curUrl != null)
			    			{
				    			curUrl = decodeURIComponent(curUrl);
							}

							var temp = node;

							while (temp != null && temp != graph.cellEditor.textarea)
							{
								if (temp.nodeType == mxConstants.NODETYPE_ELEMENT)
								{
									if (temp.getAttribute('data-font-src') != null)
									{
										curUrl = temp.getAttribute('data-font-src');
										break;
									}
									else if (temp.getAttribute('face') == curFontName)
									{
										// Means that a system font is used for the element
										curUrl = null;
										break;
									}
								}

								temp = temp.parentNode;
							}
							
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
						this.addCustomFont(fontName, fontUrl);

						if (graph.isEditing())
						{
							graph.setFont(fontName, fontUrl);
						}
						else
						{
							graph.getModel().beginUpdate();
							
							try
							{
								graph.stopEditing(false);
								graph.setCellStyles(mxConstants.STYLE_FONTFAMILY, fontName);
								graph.setCellStyles('fontSource', (fontUrl != null) ?
									encodeURIComponent(fontUrl) : null);
								graph.setCellStyles('FType', null);
							}
							finally
							{
								graph.getModel().endUpdate();
							}
						}
					}
				}));
				this.editorUi.showDialog(dlg.container, 380, null, true, true);
				dlg.init();
			}), parent, null, true);
		})));
	};
})();
