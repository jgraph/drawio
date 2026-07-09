/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
/**
 * Installing themes.
 */
Editor.themes.unshift('simple');
Editor.themes.push('sketch');
Editor.themes.push('atlas');

(function()
{
	/**
	 *
	 */
	EditorUi.prototype.switchCssForTheme = function(value)
	{
		var node = (mxUtils.isAncestorNode(document.body, this.container)) ?
			this.container : this.editor.graph.container;
		
		if (node != null)
		{
			if (value == 'kennedy')
			{
				node.classList.add('geClassic');
			}
			else
			{
				node.classList.remove('geClassic');
			}

			if (value == 'sketch')
			{
				node.classList.add('geSketch');
			}

			if (value == 'simple' || value == 'sketch')
			{
				node.classList.add('geSimple');
			}
			else
			{
				node.classList.remove('geSimple');
			}
		}
	};
	
	/**
	 *
	 */
	var editorUiCreateMainMenuForTheme = EditorUi.prototype.createMainMenuForTheme;

	EditorUi.prototype.createMainMenuForTheme = function(value)
	{
		if (value == 'simple' || value == 'sketch')
		{
			if (this.sketchMainMenuElt == null)
			{
				this.sketchMainMenuElt = document.createElement('div');

				var elt = this.createMenu((value == 'simple') ? 'view' : 'diagram',
					(value == 'simple') ? Editor.thinViewImage : Editor.menuImage);
				this.sketchMainMenuElt.appendChild(elt);

				var deleteElt = this.createMenuItem('delete', Editor.trashImage);
				var undoElt = this.createMenuItem('undo', Editor.undoImage);
				var redoElt = this.createMenuItem('redo', Editor.redoImage);

				this.dependsOnLanguage(mxUtils.bind(this, function()
				{
					elt.setAttribute('title', mxResources.get(
						(value == 'simple') ? 'view' : 'diagram'));
					deleteElt.setAttribute('title', mxResources.get('delete'));
					undoElt.setAttribute('title', mxResources.get('undo'));
					redoElt.setAttribute('title', mxResources.get('redo'));
				}));

				if (value == 'simple')
				{
					this.sketchMainMenuElt.className = 'geToolbarContainer geSimpleMainMenu';
				}
				else
				{
					this.container.appendChild(this.sketchMainMenuElt);
					this.sketchMainMenuElt.className = 'geToolbarContainer geSketchMainMenu';
					this.sketchMainMenuElt.appendChild(deleteElt);
					this.sketchMainMenuElt.appendChild(undoElt);
					this.sketchMainMenuElt.appendChild(redoElt);
				}

				this.container.appendChild(this.sketchMainMenuElt);
			}
		}
		else
		{
			editorUiCreateMainMenuForTheme.apply(this, arguments);
		}		
	};
	
	/**
	 *
	 */
	var editorUiCreateFooterMenuForTheme = EditorUi.prototype.createFooterMenuForTheme;

	EditorUi.prototype.createFooterMenuForTheme = function(value)
	{
		if (value == 'simple' || value == 'sketch')
		{
			if (this.sketchFooterMenuElt == null)
			{
				var pageMenu = this.createPageMenuTab(false, value != 'simple');
				var pagesElt = this.createMenu('pages', Editor.thinNoteImage);
				var undoElt = this.createMenuItem('undo', Editor.thinUndoImage);
				var redoElt = this.createMenuItem('redo', Editor.thinRedoImage);
				var deleteElt = this.createMenuItem('delete', Editor.thinDeleteImage);
				var zoomOutElt = this.createMenuItem('zoomOut', Editor.zoomOutImage);
				var zoomInElt = this.createMenuItem('zoomIn', Editor.zoomInImage);
				var fullscreenElt = this.createMenuItem('fullscreen', Editor.fullscreenImage);
				var exitElt = this.createMenuItem('exit', Editor.closeImage);
	
				this.dependsOnLanguage(mxUtils.bind(this, function()
				{
					pagesElt.setAttribute('title', mxResources.get('pages'));
					undoElt.setAttribute('title', mxResources.get('undo'));
					redoElt.setAttribute('title', mxResources.get('redo'));
					deleteElt.setAttribute('title', mxResources.get('delete'));
					zoomOutElt.setAttribute('title', mxResources.get('zoomOut'));
					zoomInElt.setAttribute('title', mxResources.get('zoomIn'));
					fullscreenElt.setAttribute('title', mxResources.get('fullscreen'));
					exitElt.setAttribute('title', mxResources.get('exit'));
				}));
				
				this.sketchFooterMenuElt = document.createElement('div');
				this.sketchFooterMenuElt.className = 'geToolbarContainer geFooterToolbar';
				var footer = this.sketchFooterMenuElt;

				if (value != 'simple')
				{
					pageMenu.className = 'geButton gePageMenu';
					pageMenu.style.backgroundImage = 'url(' + Editor.arrowDownImage + ')';
					footer.appendChild(pageMenu);

					var pageName = document.createElement('span');
					pageMenu.innerText = '';
					pageMenu.appendChild(pageName);
					
					var updatePageName = mxUtils.bind(this, function()
					{
						pageName.innerText = '';

						if (this.currentPage != null)
						{
							mxUtils.write(pageName, this.currentPage.getName());
							var n = (this.pages != null) ? this.pages.length : 1;
							var idx = this.getPageIndex(this.currentPage);
							idx = (idx != null) ? idx + 1 : 1;
							var id = this.currentPage.getId();
							pageMenu.setAttribute('title', this.currentPage.getName() +
								' (' + idx + '/' + n + ')' + ((id != null) ?
								' [' + id + ']' : ''));
						}
					});

					this.editor.addListener('pagesPatched', updatePageName);
					this.editor.addListener('pageSelected', updatePageName);
					this.editor.addListener('pageRenamed', updatePageName);
					this.editor.addListener('fileLoaded', updatePageName);
					updatePageName();

					// Page menu only visible for multiple pages
					var pagesVisibleChanged = mxUtils.bind(this, function()
					{
						pageMenu.style.display = (this.isPageMenuVisible()) ? '' : 'none';
					});

					this.addListener('editInlineStart', mxUtils.bind(this, function()
					{
						pagesVisibleChanged();
						updatePageName();
					}));
					
					this.addListener('fileDescriptorChanged', pagesVisibleChanged);
					this.addListener('pagesVisibleChanged', pagesVisibleChanged);
					this.editor.addListener('pagesPatched', pagesVisibleChanged);
					pagesVisibleChanged();

					footer.appendChild(zoomOutElt);
				}

				var zoomInput = this.createZoomInput(value != 'simple');
				footer.appendChild(zoomInput);

				if (value == 'simple')
				{
					undoElt.style.marginLeft = 'auto';
					footer.appendChild(pagesElt);
					footer.appendChild(undoElt);
					footer.appendChild(redoElt);
					footer.appendChild(deleteElt);

					// Page menu only visible for multiple pages
					var refreshMenu = mxUtils.bind(this, function()
					{
						var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
						var eo = (urlParams['embed'] == '1' && this.buttonContainer != null) ?
							(this.buttonContainer.offsetWidth || 300) : 0;

						pagesElt.style.display = (iw < 480 + eo) ? 'none' : '';
						zoomInput.style.display = (iw < 750 + eo) ? 'none' : '';
						deleteElt.style.display = (iw < 290 + eo) ? 'none' : '';
						undoElt.style.display = (iw < 360 + eo) ? 'none' : '';
						redoElt.style.display = (iw < 360 + eo) ? 'none' : '';
					});

					mxEvent.addListener(window, 'resize', refreshMenu);
					refreshMenu();
				}

				if (value != 'simple')
				{
					footer.appendChild(zoomInElt);
				}

				if (urlParams['embedInline'] == '1')
				{
					footer.appendChild(fullscreenElt);

					var inlineFullscreenChanged = mxUtils.bind(this, function()
					{
						fullscreenElt.style.backgroundImage = 'url(' + ((!Editor.inlineFullscreen) ?
							Editor.fullscreenImage : Editor.fullscreenExitImage) + ')';
						this.inlineSizeChanged();
						this.editor.graph.refresh();
						this.fitWindows();
					});

					this.addListener('editInlineStart', mxUtils.bind(this, function()
					{
						fullscreenElt.style.backgroundImage = 'url(' + ((!Editor.inlineFullscreen) ?
							Editor.fullscreenImage : Editor.fullscreenExitImage) + ')';
					}));
					
					this.addListener('inlineFullscreenChanged', inlineFullscreenChanged);
					footer.appendChild(exitElt);
				}

				if (value == 'simple')
				{
					this.sketchFooterMenuElt.style.cssText = 'position:relative;gap:6px;' +
						'flex-shrink:0;flex-grow:0.5;';
					this.sketchMainMenuElt.appendChild(this.sketchFooterMenuElt);
				}
				else
				{
					this.container.appendChild(this.sketchFooterMenuElt);
				}
			}
		}
		else
		{
			editorUiCreateFooterMenuForTheme.apply(this, arguments);
		}
	};

	/**
	 *
	 */
	var editorUiCreatePickerMenuForTheme = EditorUi.prototype.createPickerMenuForTheme;

	EditorUi.prototype.createPickerMenuForTheme = function(value)
	{
		if (value == 'simple' || value == 'sketch')
		{
			if (this.sketchPickerMenuElt == null)
			{
				var graph = this.editor.graph;
				this.sketchPickerMenuElt = document.createElement('div');
				this.sketchPickerMenuElt.className = 'geToolbarContainer';

				if (value == 'sketch')
				{
					this.sketchPickerMenuElt.classList.add('geVerticalToolbar');
				}

				var picker = this.sketchPickerMenuElt;

				var foldImg = document.createElement('a');
				foldImg.className = 'geButton';
				foldImg.style.height = '18px';
				foldImg.style.opacity = '0.4';
				foldImg.style.backgroundImage = 'url(' + Editor.expandMoreImage + ')';
				foldImg.setAttribute('title', mxResources.get('collapseExpand'));
				
				var freehandElt = this.createMenuItem('insertFreehand', (value == 'simple') ?
					Editor.thinGestureImage : Editor.freehandImage, true);
				var generateElt = this.createMenuItem('generate', (value == 'simple') ?
					Editor.thinSparklesImage : Editor.sparklesImage, true);
				var layoutElt = this.createMenu('layout', Editor.layoutImage);
				var insertElt = this.createMenu('insert', (value == 'simple') ?
					Editor.thinAddCircleImage : Editor.addBoxImage);
				var tableElt = this.createMenu('table', Editor.thinTableImage);
				var shapesElt = insertElt.cloneNode(true);
				shapesElt.style.backgroundImage = 'url(' + ((value == 'simple') ?
					Editor.thinShapesImage : Editor.shapesImage) + ')';
				shapesElt.setAttribute('title', mxResources.get('shapes'));
				this.addShapePicker(shapesElt, value == 'simple');
				var collapsed = false;
				var tw = 28;
				var th = 28;
	
				var initPicker = mxUtils.bind(this, function(force)
				{
					if (force || (document.body != null &&
						document.body.contains(picker)))
					{
						if (!graph.isEnabled() && urlParams['embedInline'] != '1')
						{
							freehandElt.classList.add('mxDisabled');
							layoutElt.classList.add('mxDisabled');
							insertElt.classList.add('mxDisabled');
							tableElt.classList.add('mxDisabled');
							shapesElt.classList.add('mxDisabled');
						}
						else
						{
							freehandElt.classList.remove('mxDisabled');
							layoutElt.classList.remove('mxDisabled');
							insertElt.classList.remove('mxDisabled');
							tableElt.classList.remove('mxDisabled');
							shapesElt.classList.remove('mxDisabled');
						}

						function addKey(elt, key, kx, ky)
						{
							if (elt != null)
							{
								kx = (kx != null) ? kx : 30;
								ky = (ky != null) ? ky : 26;

								if (elt.querySelector('.geShortcutKey') == null)
								{
									var div = document.createElement('div');
									div.className = 'geShortcutKey';
									mxUtils.write(div, key);
									elt.appendChild(div);
								}
							}
						};
						
						function addElt(elt, title, cursor, key, kx, ky)
						{
							if (title != null)
							{
								elt.setAttribute('title', title);
							}
							
							picker.appendChild(elt);

							if (value != 'simple' && key != null)
							{
								addKey(elt, key, kx, ky);
							}

							if (!graph.isEnabled() && urlParams['embedInline'] != '1')
							{
								elt.classList.add('mxDisabled');
							}
							
							return elt;
						};

						picker.innerText = '';
						
						if (!collapsed)
						{
							var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
							var eo = (urlParams['embed'] == '1' && this.buttonContainer != null) ?
								(this.buttonContainer.offsetWidth || 300) : 0;

							// Thinner previews in simple toolbar
							if (value == 'simple')
							{
								this.sidebar.graph.cellRenderer.minSvgStrokeWidth = 0.9;
							}

							if (value != 'simple' || iw >= 660 + eo)
							{
								var textElt = this.sidebar.createVertexTemplate(graph.appendFontSize(Editor.defaultTextStyle,
									graph.vertexFontSize), 60, 30, 'Text', mxResources.get('text') + ' (A)', true, false,
									null, value != 'simple', null, tw, th, value == 'simple' ?
										Editor.thinTextImage : null, true);
								addElt(textElt, mxResources.get('text') + ' (A)', null, 'A', 32);
							}

							var boxElt = this.sidebar.createVertexTemplate('rounded=0;whiteSpace=wrap;html=1;', 160, 80, '',
								mxResources.get('rectangle') + ' (D)', true, false, null, value != 'simple', null, tw, th,
								(value == 'simple') ? Editor.thinRectangleImage : null)

							if (value == 'simple')
							{
								if (iw >= 600 + eo)
								{
									addElt(boxElt, mxResources.get('rectangle') + ' (D)', null, 'D');
								}

								if (iw >= 400 + eo)
								{
									this.sketchPickerMenuElt.appendChild(shapesElt);
								}

								if (iw >= 460 + eo)
								{
									addElt(freehandElt, mxResources.get('freehand') + ' (X)', null, 'X');
								}

								if (iw >= 500 + eo && this.actions.get('generate') != null)
								{
									addElt(generateElt, mxResources.get('generate'));
								}

								if (iw >= 580 + eo)
								{
									this.sketchPickerMenuElt.appendChild(layoutElt);
								}

								if (iw >= 540 + eo)
								{
									this.sketchPickerMenuElt.appendChild(tableElt);
								}
							}
							else
							{
								addElt(this.sidebar.createVertexTemplate(Editor.defaultNoteStyle, 160, 160, '',
									mxResources.get('note') + ' (S)', true, false, null, true, null, tw, th),
									mxResources.get('note') + ' (S)', null, 'S');
								addElt(boxElt, mxResources.get('rectangle') + ' (D)', null, 'D');
								addElt(this.sidebar.createVertexTemplate('ellipse;whiteSpace=wrap;html=1;', 160, 100, '',
									mxResources.get('ellipse') + ' (F)', true, false, null, true, null, tw, th),
									mxResources.get('ellipse') + ' (F)', null, 'F');

								var edgeStyle = 'edgeStyle=none;orthogonalLoop=1;jettySize=auto;html=1;';
								var cell = new mxCell('', new mxGeometry(0, 0, this.editor.graph.defaultEdgeLength + 20, 0), edgeStyle);
								cell.geometry.setTerminalPoint(new mxPoint(0, 0), true);
								cell.geometry.setTerminalPoint(new mxPoint(cell.geometry.width, 0), false);
								cell.geometry.points = [];
								cell.geometry.relative = true;
								cell.edge = true;
								
								addElt(this.sidebar.createEdgeTemplateFromCells([cell],
									cell.geometry.width, cell.geometry.height, mxResources.get('line') + ' (C)',
									true, null, value != 'simple', false, null, tw, th),
									mxResources.get('line') + ' (C)', null, 'C');
								
								cell = cell.clone();
								cell.style = edgeStyle + 'shape=flexArrow;rounded=1;startSize=8;endSize=8;';
								cell.geometry.width = this.editor.graph.defaultEdgeLength + 20;
								cell.geometry.setTerminalPoint(new mxPoint(0, 20), true);
								cell.geometry.setTerminalPoint(new mxPoint(cell.geometry.width, 20), false);
				
								addElt(this.sidebar.createEdgeTemplateFromCells([cell],
									cell.geometry.width, 40, mxResources.get('arrow'),
									true, null, true, false, null, tw, th),
									mxResources.get('arrow'));
								
								addElt(freehandElt, mxResources.get('freehand') + ' (X)', null, 'X');

								if (this.actions.get('generate') != null)
								{
									addElt(generateElt, mxResources.get('generate'));
								}

								this.sketchPickerMenuElt.appendChild(layoutElt);
								this.sketchPickerMenuElt.appendChild(shapesElt);
							}
							
							if (value != 'simple' || iw > 320)
							{
								this.sketchPickerMenuElt.appendChild(insertElt);
							}
						}

						if (value != 'simple' && urlParams['embedInline'] != '1')
						{
							picker.appendChild(foldImg);
						}

						this.sidebar.graph.cellRenderer.minSvgStrokeWidth = this.sidebar.minThumbStrokeWidth;
					}
				});
				
				mxEvent.addListener(foldImg, 'click', mxUtils.bind(this, function()
				{
					if (collapsed)
					{
						picker.classList.remove('geCollapsedToolbar');
						foldImg.style.backgroundImage = 'url(' + Editor.expandMoreImage + ')';
						collapsed = false;
						initPicker();
					}
					else
					{				
						picker.innerText = '';
						picker.appendChild(foldImg);
						picker.classList.add('geCollapsedToolbar');
						foldImg.style.backgroundImage = 'url(' + Editor.expandLessImage + ')';
						collapsed = true;
					}
				}));
				
				var lastWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
				var currentThread = null;
				
				mxEvent.addListener(window, 'resize', function()
				{
					var currentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

					if (currentWidth != lastWidth)
					{
						lastWidth = currentWidth;

						if (currentThread != null)
						{
							window.clearTimeout(currentThread);
						}

						currentThread = window.setTimeout(function()
						{
							currentThread = null;
							initPicker();
						}, 200);
					}
				});

				this.editor.addListener('fileLoaded', initPicker);
				this.addListener('sketchModeChanged', initPicker);
				this.addListener('currentThemeChanged', initPicker);
				this.addListener('languageChanged', initPicker);
				this.addListener('lockedChanged', initPicker);

				initPicker(true);

				if (value == 'simple')
				{
					this.sketchPickerMenuElt.style.cssText = 'position:relative;white-space:nowrap;user-select:none;' +
						'display:flex;align-items:center;justify-content:flex-end;flex-grow:1;gap:6px;' +
						'flex-shrink:0;';
					this.sketchMainMenuElt.appendChild(this.sketchPickerMenuElt);
				}
				else
				{
					this.container.appendChild(this.sketchPickerMenuElt);
				}

				// Disables built-in pan and zoom on touch devices
				if (mxClient.IS_POINTER)
				{
					this.sketchPickerMenuElt.style.touchAction = 'none';
				}
			}
		}
		else
		{
			editorUiCreatePickerMenuForTheme.apply(this, arguments);
		}
	};

	/**
	 *
	 */
	var editorUiCreateMenubarForTheme = EditorUi.prototype.createMenubarForTheme;

	EditorUi.prototype.createMenubarForTheme = function(value)
	{
		if (value == 'simple' || value == 'sketch')
		{
			if (this.sketchMenubarElt == null)
			{
				this.sketchMenubarElt = document.createElement('div');
				this.sketchMenubarElt.className = 'geToolbarContainer';

				var css = 'display:flex;white-space:nowrap;user-select:none;justify-content:flex-end;' +
					'align-items:center;flex-wrap:nowrap;gap:6px;';

				if (value == 'simple')
				{
					this.sketchMenubarElt.style.cssText = 'position:relative;' +
						((urlParams['embed'] != '1') ? 'flex-grow:0.5;overflow:visible;' : '') +
						'flex-shrink:0;' + css;

					if (this.commentElt == null)
					{
						this.commentElt = this.createMenuItem('comments', Editor.thinCommentImage, true);
						this.commentElt.style.backgroundSize = '24px';
					}

					if (this.shareElt == null && urlParams['embed'] != '1' &&
						this.getServiceName() == 'draw.io')
					{
						this.shareElt = this.createMenu('share', Editor.thinUserAddImage);
						this.shareElt.style.backgroundSize = '24px';
						this.shareElt.style.flexShrink = '0';
						
						if (this.isStandaloneApp())
						{
							this.shareElt.style.backgroundImage = 'url(' +
								Editor.thinShareImage + ')';
						}
						else
						{
							var networkListener = mxUtils.bind(this, function()
							{
								var title = mxResources.get('share');
								var img = Editor.thinUserAddImage;
								var status = this.getNetworkStatus();

								if (status != null)
								{
									title = title + ' (' + status + ')';
									img = Editor.thinUserFlashImage;
								}

								this.shareElt.style.backgroundImage = 'url(' + img + ')';
								this.shareElt.setAttribute('title', title);
							});

							this.addListener('realtimeStateChanged', networkListener);
							this.editor.addListener('statusChanged', networkListener);
							mxEvent.addListener(window, 'offline', networkListener);
							mxEvent.addListener(window, 'online', networkListener);
							networkListener();
						}
					}	
				}
				else
				{
					this.sketchMenubarElt.style.cssText = 'position:absolute;right:12px;top:10px;height:44px;' +
						'border-radius:4px;overflow:hidden;user-select:none;max-width:calc(100% - 170px);' +
						'box-sizing:border-box;justify-content:flex-end;z-index:1;padding:7px 12px;' + css;
					this.container.appendChild(this.sketchMenubarElt);
				}

				if (urlParams['embedInline'] != '1')
				{
					// Moves menu away if picker overlaps
					var refreshMenu = mxUtils.bind(this, function()
					{
						if (Editor.currentTheme == 'sketch')
						{
							var overflow = (this.sketchPickerMenuElt.offsetTop -
								this.sketchPickerMenuElt.offsetHeight / 2 < 58);
							this.sketchMainMenuElt.style.left = (overflow) ? '70px' : '10px';
							this.sketchMenubarElt.style.maxWidth = (overflow) ? 
								'calc(100% - 230px)' : 'calc(100% - 170px)';
						}
						else if (Editor.currentTheme == 'simple')
						{
							var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
							var eo = (urlParams['embed'] == '1' && this.buttonContainer != null) ?
								(this.buttonContainer.offsetWidth || 300) : 0;

							if (this.commentElt != null)
							{
								this.commentElt.style.display = (iw > 560 + eo && this.commentsSupported()) ? '' : 'none';
							}

							if (this.shareElt != null)
							{
								this.shareElt.style.display = (iw > 360 + eo) ? '' : 'none';
							}

							if (this.overflowMenuElt != null)
							{
								this.overflowMenuElt.style.display = (iw < 750 + eo) ? '' : 'none';
							}
						}
					});

					refreshMenu();
					mxEvent.addListener(window, 'resize', refreshMenu);
					this.editor.addListener('fileLoaded', refreshMenu);
				}

				if (urlParams['embed'] != '1' && this.getServiceName() != 'atlassian')
				{
					this.installStatusMinimizer(this.sketchMenubarElt);
				}

				this.dependsOnLanguage(mxUtils.bind(this, function()
				{
					if (this.commentElt != null)
					{
						this.commentElt.setAttribute('title', mxResources.get('comments'));
					}

					if (this.shareElt != null)
					{
						this.shareElt.setAttribute('title', mxResources.get('share'));
					}

					if (this.mainMenuElt != null)
					{
						this.mainMenuElt.setAttribute('title', mxResources.get('diagram'));
					}

					if (this.formatElt != null)
					{
						this.formatElt.setAttribute('title', mxResources.get('format'));
					}
				}));
			}

			if (value == 'simple')
			{
				if (this.commentElt != null)
				{
					this.sketchMenubarElt.appendChild(this.commentElt);
				}

				if (this.buttonContainer != null)
				{
					this.sketchMenubarElt.appendChild(this.buttonContainer);
				}
				
				if (this.shareElt != null)
				{
					this.sketchMenubarElt.appendChild(this.shareElt);
				}
				
				if (this.mainMenuElt == null)
				{
					this.mainMenuElt = this.createMenu('diagram', Editor.thinMenuImage);
				}

				this.sketchMenubarElt.appendChild(this.mainMenuElt);

				if (this.formatElt == null)
				{
					this.formatElt = this.createMenuItem('format', Editor.thinFormatImage, true);
					this.formatElt.style.marginLeft = (urlParams['embed'] != '1') ? 'auto' : '0';

					var updateFormatElt = mxUtils.bind(this, function()
					{
						if (this.formatWidth > 0)
						{
							this.formatElt.classList.add('geActiveItem');
						}
						else
						{
							this.formatElt.classList.remove('geActiveItem');
						}
					});

					this.addListener('formatWidthChanged', updateFormatElt);
					updateFormatElt();
				}

				this.sketchMenubarElt.appendChild(this.formatElt);
			}

			if (this.statusContainer != null)
			{
				this.statusContainer.style.flexGrow = '1';
				this.statusContainer.style.flexShrink = '1';
				this.statusContainer.style.marginTop = '0px';

				if (value != 'simple')
				{
					this.sketchMenubarElt.appendChild(this.statusContainer);
				}
				else
				{
					this.statusContainer.style.justifyContent = 'center';
					this.statusContainer.style.minWidth = '0';
					this.statusContainer.style.overflow = 'hidden';

					if (urlParams['embed'] != '1')
					{
						this.statusContainer.style.width = '22%';
					}
				}
			}
			
			if (value == 'simple')
			{
				if (this.overflowMenuElt == null)
				{
					this.overflowMenuElt = this.createMenu('dynamicAppearance', Editor.thinDoubleArrowRightImage);
					this.overflowMenuElt.style.backgroundSize = '24px';
					this.overflowMenuElt.style.display = 'inline-block';
					this.overflowMenuElt.style.flexShrink = '0';
					this.overflowMenuElt.style.display = 'none';
					this.overflowMenuElt.removeAttribute('title');
				}

				this.sketchMenubarElt.appendChild(this.overflowMenuElt);
				this.sketchMainMenuElt.appendChild(this.statusContainer);
				this.sketchMainMenuElt.appendChild(this.sketchMenubarElt);
			}
			else if (this.buttonContainer != null)
			{
				this.sketchMenubarElt.appendChild(this.buttonContainer);
			}
		}
		else
		{
			editorUiCreateMenubarForTheme.apply(this, arguments);
		}
	};

})();
