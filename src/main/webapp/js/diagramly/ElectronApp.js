window.PLUGINS_BASE_PATH = '.';
window.OPEN_URL = 'https://www.draw.io/open';
window.TEMPLATE_PATH = 'templates';
window.DRAW_MATH_URL = window.mxIsElectron5? 'math' : 'https://www.draw.io/math';
FeedbackDialog.feedbackUrl = 'https://log.draw.io/email';

//Disables eval for JS (uses shapes.min.js)
mxStencilRegistry.allowEval = false;

(function()
{
	// Overrides default mode
	App.mode = App.MODE_DEVICE;

	// Disables new window option in edit diagram dialog
	EditDiagramDialog.showNewWindowOption = false;

	// Redirects printing to iframe to avoid document.write
	var printDialogCreatePrintPreview = PrintDialog.createPrintPreview; 
	
	PrintDialog.createPrintPreview = function()
	{
		var iframe = document.createElement('iframe');
		document.body.appendChild(iframe);

		var result = printDialogCreatePrintPreview.apply(this, arguments);
		result.wnd = iframe.contentWindow;
		result.iframe = iframe;
				
		// Workaround for lost gradients in print output
		result.previousGetBaseUrl = mxSvgCanvas2D.prototype.getBaseUrl;
		
		mxSvgCanvas2D.prototype.getBaseUrl = function()
		{
			return '';
		};
		
		return result;
	};
	
	var oldWindowOpen = window.open;
	window.open = function(url)
	{
		if (url != null && url.startsWith('http'))
		{
			const {shell} = require('electron');
			shell.openExternal(url);
		}
		else
		{
			return oldWindowOpen(url);
		}
	}

	mxPrintPreview.prototype.addPageBreak = function(doc)
	{
		// Do nothing
	};

	mxPrintPreview.prototype.closeDocument = function()
	{
		var doc = this.wnd.document;
		
		// Removes all event handlers in the print output
		mxEvent.release(doc.body);
	};
	
	PrintDialog.printPreview = function(preview)
	{
		if (preview.iframe != null)
		{
			preview.iframe.contentWindow.print();
			preview.iframe.parentNode.removeChild(preview.iframe);
		
			mxSvgCanvas2D.prototype.getBaseUrl = preview.previousGetBaseUrl;
			preview.iframe = null;
		}
	};
	
	PrintDialog.previewEnabled = false;
	
	var menusInit = Menus.prototype.init;
	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);

		var editorUi = this.editorUi;

		editorUi.actions.put('useOffline', new Action(mxResources.get('useOffline') + '...', function()
		{
			editorUi.openLink('https://www.draw.io/')
		}));
		
		this.put('openRecent', new Menu(function(menu, parent)
		{
			var recent = editorUi.getRecent();

			if (recent != null)
			{
				for (var i = 0; i < recent.length; i++)
				{
					(function(entry)
					{
						menu.addItem(entry.title, null, function()
						{
							function doOpenRecent()
							{
								//Simulate opening a file via args
								editorUi.loadArgs({args: [entry.id]});
							};
							
							var file = editorUi.getCurrentFile();
							
							if (file != null && file.isModified())
							{
								editorUi.confirm(mxResources.get('allChangesLost'), null, doOpenRecent,
									mxResources.get('cancel'), mxResources.get('discardChanges'));
							}
							else
							{
								doOpenRecent();
							}
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
		
		// Replaces file menu to replace openFrom menu with open and rename downloadAs to export
		this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['new', 'open'], parent);
			this.addSubmenu('openRecent', menu, parent);
			this.addMenuItems(menu, ['-', 'synchronize', '-', 'save', 'saveAs', '-', 'import'], parent);
			this.addSubmenu('exportAs', menu, parent);
			menu.addSeparator(parent);
			this.addSubmenu('embed', menu, parent);
			menu.addSeparator(parent);
			this.addMenuItems(menu, ['newLibrary', 'openLibrary', '-', 'pageSetup',
				'print', '-', 'close'], parent);
			// LATER: Find API for application.quit
		})));
	};
	
	var graphCreateLinkForHint = Graph.prototype.createLinkForHint;
	
	Graph.prototype.createLinkForHint = function(href, label)
	{
		var a = graphCreateLinkForHint.call(this, href, label);
		
		if (href != null && !this.isCustomLink(href))
		{
			// KNOWN: Event with gesture handler mouseUp the middle click opens a framed window
			mxEvent.addListener(a, 'click', mxUtils.bind(this, function(evt)
			{
				this.openLink(a.getAttribute('href'), a.getAttribute('target'));
				mxEvent.consume(evt);
			}));
		}
		
		return a;
	};
	
	Graph.prototype.openLink = function(url, target)
	{
		require('electron').shell.openExternal(url);
	};
	
	// Initializes the user interface
	var editorUiInit = EditorUi.prototype.init;
	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);

		var editorUi = this;
		var graph = this.editor.graph;
		
		global.__emt_isModified =
		e => {
			if (this.getCurrentFile())
			{
				return this.getCurrentFile().isModified()
			}

			return false
		}
		
		// global.__emt_getCurrentFile = e => {
		// 	return this.getCurrentFile()
		// }

		// Adds support for libraries
		this.actions.addAction('newLibrary...', mxUtils.bind(this, function()
		{
			editorUi.showLibraryDialog(null, null, null, null, App.MODE_DEVICE);
		}));
		
		this.actions.addAction('openLibrary...', mxUtils.bind(this, function()
		{
			editorUi.pickLibrary(App.MODE_DEVICE);
		}));

		// Replaces import action
		this.actions.addAction('import...', mxUtils.bind(this, function()
		{
			if (editorUi.getCurrentFile() != null)
			{
				const electron = require('electron');
				var remote = electron.remote;
				var dialog = remote.dialog;

		        var paths = dialog.showOpenDialogSync({properties: ['openFile']});
			           
		        if (paths !== undefined && paths[0] != null)
		        {
		        	var path = paths[0];
		        	var asImage = /\.png$/i.test(path) || /\.gif$/i.test(path) || /\.jpe?g$/i.test(path);
		        	var encoding = (asImage || /\.vsdx$/i.test(path) || /\.vssx$/i.test(path)) ?
		        		'base64' : 'utf-8';

					if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
					{
						var fs = require('fs');

						fs.readFile(path, encoding, mxUtils.bind(this, function (e, data)
				        {
			        		if (e)
			        		{
			        			editorUi.spinner.stop();
			        			editorUi.handleError(e);
			        		}
			        		else
				        	{
								try
								{
									if (editorUi.isLucidChartData(data))
									{
										editorUi.convertLucidChart(data, function(xml)
										{
											editorUi.spinner.stop();
											graph.setSelectionCells(editorUi.importXml(xml));
										}, function(e)
										{
											editorUi.spinner.stop();
											editorUi.handleError(e);
										});
									}
									else if  (/(\.vsdx)($|\?)/i.test(path))
									{
										editorUi.importVisio(editorUi.base64ToBlob(data, 'application/octet-stream'), function(xml)
										{
											editorUi.spinner.stop();
											graph.setSelectionCells(editorUi.importXml(xml));
										});
									}
									else if (!editorUi.isOffline() && new XMLHttpRequest().upload && editorUi.isRemoteFileFormat(data, path))
									{
										// Asynchronous parsing via server
										editorUi.parseFile(new Blob([data], {type : 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
										{
											if (xhr.readyState == 4)
											{
												editorUi.spinner.stop();
												
												if (xhr.status >= 200 && xhr.status <= 299)
												{
													graph.setSelectionCells(editorUi.importXml(xhr.responseText));
												}
											}
										}), path);
									}
									else
									{
										if (/\.png$/i.test(path))
										{
											var tmp = editorUi.extractGraphModelFromPng(data);
											
											if (tmp != null)
											{
												asImage = false;
												data = tmp;
											}
										}
										else if (/\.svg$/i.test(path))
						    			{
											// LATER: Use importXml without throwing exception if no data
						    				// Checks if SVG contains content attribute
					    					var root = mxUtils.parseXml(data);
				    						var svgs = root.getElementsByTagName('svg');
				    						
				    						if (svgs.length > 0)
					    					{
				    							var svgRoot = svgs[0];
						    					var cont = svgRoot.getAttribute('content');
		
						    					if (cont != null && cont.charAt(0) != '<' && cont.charAt(0) != '%')
						    					{
						    						cont = unescape((window.atob) ? atob(cont) : Base64.decode(cont, true));
						    					}
						    					
						    					if (cont != null && cont.charAt(0) == '%')
						    					{
						    						cont = decodeURIComponent(cont);
						    					}
		
						    					if (cont != null && (cont.substring(0, 8) === '<mxfile ' ||
						    						cont.substring(0, 14) === '<mxGraphModel '))
						    					{
						    						asImage = false;
						    						data = cont;
						    					}
						    					else
						    					{
						    						asImage = true;
						    						data = btoa(data);
						    					}
					    					}
						    			}
										
										if (asImage)
										{
											var img = new Image();
											img.onload = function()
											{
												editorUi.resizeImage(img, img.src, function(data2, w, h)
												{
													editorUi.spinner.stop();
													var pt = graph.getInsertPoint();
													graph.setSelectionCell(graph.insertVertex(null, null, '', pt.x, pt.y, w, h,
														'shape=image;aspect=fixed;image=' + editorUi.convertDataUri(data2) + ';'));
												}, true);
											};
											
											img.onerror = function(e)
											{
												editorUi.spinner.stop();
												editorUi.handleError();
											};
											
											var format = path.substring(path.lastIndexOf('.') + 1);
											
											if (format == 'svg')
											{
												format = 'svg+xml';
											}
											
											img.src = 'data:image/' + format + ';base64,' + data;
										}
										else
										{
											editorUi.spinner.stop();
											
											if (data != null)
											{
												graph.setSelectionCells(editorUi.importXml(data));
											}
										}
									}
								}
								catch(e)
								{
									editorUi.spinner.stop();
									editorUi.handleError(e);
								}
			        		}
			        	}));
					}
		        }
			}
		}));
		
		// Replaces new action
		var oldNew = this.actions.get('new').funct;
		
		this.actions.addAction('new...', mxUtils.bind(this, function()
		{
			if (this.getCurrentFile() == null)
			{
				oldNew();
			}
			else
			{
				const ipc = require('electron').ipcRenderer
				ipc.sendSync('winman', {action: 'newfile', opt: {width: 1600}})
			}
		}), null, null, Editor.ctrlKey + '+N');
		
		this.actions.get('open').shortcut = Editor.ctrlKey + '+O';
		
		// Adds shortcut keys for file operations
		editorUi.keyHandler.bindAction(78, true, 'new'); // Ctrl+N
		editorUi.keyHandler.bindAction(79, true, 'open'); // Ctrl+O
	}
	
	var appLoad = App.prototype.load;

	App.prototype.load = function()
	{
		appLoad.apply(this, arguments);
		const {ipcRenderer} = require('electron');
		
		ipcRenderer.on('args-obj', (event, argsObj) =>
		{
			this.loadArgs(argsObj)
		})

		var editorUi = this;
		
		ipcRenderer.on('export-vsdx', (event, argsObj) =>
		{
			var file = new LocalFile(editorUi, argsObj.xml, '');
			
			editorUi.fileLoaded(file);

			try
			{
				editorUi.saveData = function(filename, format, data, mimeType, base64Encoded)
				{
					ipcRenderer.send('export-vsdx-finished', data);
				};
				
				var expSuccess = new VsdxExport(editorUi).exportCurrentDiagrams();

				if (!expSuccess)
				{
					ipcRenderer.send('export-vsdx-finished', null);
				}
			}
			catch (e)
			{
				ipcRenderer.send('export-vsdx-finished', null);
			}
		})	
	}
	
	App.prototype.loadArgs = function(argsObj)
	{
		var paths = argsObj.args;
		
		// If a file is passed
		if (paths !== undefined && paths[0] != null && this.spinner.spin(document.body, mxResources.get('loading')))
		{
			var path = paths[0];
			this.hideDialog();
			
			var success = mxUtils.bind(this, function(fileEntry, data, stat, name)
			{
				this.spinner.stop();
				
				if (data != null)
				{
					var file = new LocalFile(this, data, name || '');
					file.fileObject = fileEntry;
					file.stat = stat;
					
					this.fileLoaded(file);
				}
			});
			
			var error = mxUtils.bind(this, function(e)
			{
				this.spinner.stop();
				
				if (e.code === 'ENOENT')
				{
					var title = path.replace(/^.*[\\\/]/, '');
					var data = this.emptyDiagramXml;
					var file = new LocalFile(this, data, title, null);
					
					file.fileObject = new Object();
					file.fileObject.path = path;
					file.fileObject.name = title;
					file.fileObject.type = 'utf-8';
					this.fileCreated(file, null, null, null);					
					this.saveFile();
				}
				else
				{
					this.handleError(e);
				}
				
			});
			
			// Tries to open the file
			this.readGraphFile(success, error, path);
		}
		// If no file is passed, but there is the "create-if-not-exists" flag
		else if (argsObj.create != null)
		{
			var title = 'Untitled document';
			var data = this.emptyDiagramXml;
			var file = new LocalFile(this, data, title, null);
			this.fileCreated(file, null, null, null);
		}		
	}

	var origFileLoaded = EditorUi.prototype.fileLoaded;
	
	EditorUi.prototype.fileLoaded = function(file)
	{
		
		if (file != null)
		{
			if (file.fileObject == null)
			{
				var fname = file.getTitle();
				
				var fileInfo = openFilesMap[fname];
				
				if (fileInfo != null)
				{
					file.fileObject = {
						name: fileInfo.name,
						path: fileInfo.path,
						type: fileInfo.type || 'utf-8'
					};
					//delete it such that it is not used again incorrectly
					delete openFilesMap[fname];
				}
			}
			
			if (file.fileObject != null)
			{
				var title = file.fileObject.path;
				
				if (title.length > 100)
				{
					title = '...' + title.substr(title.length - 97);
				}
				
				this.addRecent({id: file.fileObject.path, title: title});
			}
		}
		
		origFileLoaded.apply(this, arguments);
	};
	
	// Uses local picker
	App.prototype.pickFile = function()
	{
		var doPickFile = mxUtils.bind(this, function()
		{
			this.chooseFileEntry(mxUtils.bind(this, function(fileEntry, data, stat)
			{
				var file = new LocalFile(this, data, '');
				file.fileObject = fileEntry;
				file.stat = stat;
				this.fileLoaded(file);
			}));
		});

		var file = this.getCurrentFile();
		
		if (file != null && file.isModified())
		{
			this.confirm(mxResources.get('allChangesLost'), null, doPickFile,
				mxResources.get('cancel'), mxResources.get('discardChanges'));
		}
		else
		{
			doPickFile();
		}
	};
	
	/**
	 * Selects a library to load from a picker
	 * 
	 * @param mode the device mode, ignored in this case
	 */
	App.prototype.pickLibrary = function(mode)
	{
		this.chooseFileEntry(mxUtils.bind(this, function(fileEntry, data, stat)
		{
			try
			{
				var library = new DesktopLibrary(this, data, fileEntry);
				this.loadLibrary(library);
			}
			catch (e)
			{
				this.handleError(e, mxResources.get('errorLoadingFile'));
			}
		}));
	};
	
	// Uses local picker
	App.prototype.chooseFileEntry = function(fn)
	{
		const electron = require('electron');
		var remote = electron.remote;
		var dialog = remote.dialog;

        var paths = dialog.showOpenDialogSync({properties: ['openFile']});
	           
        if (paths !== undefined && paths[0] != null)
        {
			this.readGraphFile(fn, mxUtils.bind(this, function(err)
			{
				this.handleError(err);
			}), paths[0]);
        }
        else
        {
        	this.spinner.stop();
        }
	};

	//In order not to repeat the logic for opening a file, we collect files information here and use them in openLocalFile
	var origOpenFiles = EditorUi.prototype.openFiles;
	var openFilesMap = {};
	
	EditorUi.prototype.openFiles = function(files, temp)
	{
		openFilesMap = {};

		for (var i = 0; i < files.length; i++)
		{
			openFilesMap[files[i].name] = files[i];
		}
		
		origOpenFiles.apply(this, arguments);
	};
	
	App.prototype.readGraphFile = function(fn, fnErr, path)
	{
		var fs = require('fs');
		var index = path.lastIndexOf('.png');
		var isPng = index > -1 && index == path.length - 4;
		var isVsdx = /\.vsdx$/i.test(path) || /\.vssx$/i.test(path);
		var encoding = isVsdx? null : (isPng ? 'base64' : 'utf-8');

		fs.readFile(path, encoding, mxUtils.bind(this, function (e, data)
		{
			if (e)
			{
				fnErr(e);
			}
			else
			{
				var fileEntry = new Object();
				fileEntry.path = path;
				fileEntry.name = path.replace(/^.*[\\\/]/, '');
				fileEntry.type = encoding;

				//VSDX files are imported instead of being open
				if (isVsdx)
				{
					var name = fileEntry.name;

					this.importVisio(data, mxUtils.bind(this, function(xml)
					{
						var dot = name.lastIndexOf('.');
						
						if (dot >= 0)
						{
							name = name.substring(0, name.lastIndexOf('.')) + '.drawio';
						}
						else
						{
							name = name + '.drawio';
						}
						
						if (xml.substring(0, 10) == '<mxlibrary')
						{
							// Creates new temporary file if library is dropped in splash screen
							if (this.getCurrentFile() == null && urlParams['embed'] != '1')
							{
								this.openLocalFile(this.emptyDiagramXml, this.defaultFilename);
							}
						
							try
			    			{
								this.loadLibrary(new LocalLibrary(this, xml, name));
			    			}
							catch (e)
			    			{
			    				this.handleError(e, mxResources.get('errorLoadingFile'));
			    			}
							
							fn();
						}
						else
						{
							fn(null, xml, null, name);
						}
					}), null, name);
					
					return;
				}
				
				if (isPng)
				{
					// Detecting png by extension. Would need https://github.com/mscdex/mmmagic
					// to do it by inspection
					data = this.extractGraphModelFromPng('data:image/png;base64,' + data);
				}

				fs.stat(path, function(err, stat)
				{
					if (err)
					{
						fnErr(err);
					}
					else
					{
						fn(fileEntry, data, stat);
					}
				});
			}
		}));
	};

	// Disables temp files in Electron
	var LocalFileCtor = LocalFile;
	
	LocalFile = function(ui, data, title, temp)
	{
		LocalFileCtor.call(this, ui, data, title, false);
	};

	mxUtils.extend(LocalFile, LocalFileCtor);

	LocalFile.prototype.getLatestVersion = function(success, error)
	{
		if (this.fileObject == null)
		{
			if (error != null)
			{
				error({message: mxResources.get('fileNotFound')});
			}
		}
		else
		{
			this.ui.readGraphFile(mxUtils.bind(this, function(fileEntry, data, stat)
			{
				var file = new LocalFile(this, data, '');
				file.stat = stat;
				success(file);
			}), error, this.fileObject.path);
		}
	};
	
	// Call save as for copy
	LocalFile.prototype.copyFile = function(success, error)
	{
		this.saveAs(this.ui.getCopyFilename(this), success, error);
	};
	
	/**
	 * Adds all listeners.
	 */
	LocalFile.prototype.getDescriptor = function()
	{
		return this.stat;
	};

	/**
	* Updates the descriptor of this file with the one from the given file.
	*/
	LocalFile.prototype.setDescriptor = function(stat)
	{
		this.stat = stat;
	};
	
	LocalFile.prototype.reloadFile = function(success)
	{
		if (this.fileObject == null)
		{
			this.ui.handleError({message: mxResources.get('fileNotFound')});
		}
		else
		{
			this.ui.spinner.stop();
			
			var fn = mxUtils.bind(this, function()
			{
				this.setModified(false);
				var page = this.ui.currentPage;
				var viewState = this.ui.editor.graph.getViewState();
				var selection = this.ui.editor.graph.getSelectionCells();
				
				if (this.ui.spinner.spin(document.body, mxResources.get('loading')))
				{
					this.ui.readGraphFile(mxUtils.bind(this, function(fileEntry, data, stat)
					{
						this.ui.spinner.stop();
						
						var file = new LocalFile(this.ui, data, '');
						file.fileObject = fileEntry;
						file.stat = stat;
						
						this.ui.fileLoaded(file);
						this.ui.restoreViewState(page, viewState, selection);
		
						if (this.backupPatch != null)
						{
							this.patch([this.backupPatch]);
						}
						
						if (success != null)
						{
							success();
						}
					}), mxUtils.bind(this, function(err)
					{
						this.handleFileError(err);
					}), this.fileObject.path);
				}
			});
	
			if (this.isModified() && this.backupPatch == null)
			{
				this.ui.confirm(mxResources.get('allChangesLost'), mxUtils.bind(this, function()
				{
					this.handleFileSuccess(DrawioFile.SYNC == 'manual');
				}), fn, mxResources.get('cancel'), mxResources.get('discardChanges'));
			}
			else
			{
				fn();
			}
		}
	};

	LocalFile.prototype.isAutosave = function()
	{
		return this.fileObject != null && DrawioFile.prototype.isAutosave.apply(this, arguments);
	};
	
	LocalFile.prototype.isAutosaveOptional = function()
	{
		return this.fileObject != null;
	};
	
	LocalFile.prototype.getTitle = function()
	{
		return (this.fileObject != null) ? this.fileObject.name : this.title;
	};

	LocalFile.prototype.isRenamable = function()
	{
		return false;
	};
	
	// Restores default implementation of open with autosave
	LocalFile.prototype.open = DrawioFile.prototype.open;
	
	LocalFile.prototype.save = function(revision, success, error, unloading, overwrite)
	{
		DrawioFile.prototype.save.apply(this, [revision, mxUtils.bind(this, function()
		{
			this.saveFile(revision, success, error, unloading, overwrite);
		}), error, unloading, overwrite]);
	};

	LocalFile.prototype.isConflict = function(stat)
	{
		return stat != null && this.stat != null && stat.mtimeMs != this.stat.mtimeMs;
	};
	
	LocalFile.prototype.saveFile = function(revision, success, error, unloading, overwrite)
	{
		if (!this.savingFile)
		{
			var fn = mxUtils.bind(this, function()
			{
				var doSave = mxUtils.bind(this, function(data, enc)
				{
					var savedData = this.data;
					
					// Makes sure no changes get lost while the file is saved
					var prevModified = this.isModified;
					var modified = this.isModified();
					this.setModified(false);
					this.savingFile = true;
					var fs = require('fs');
					
					var errorWrapper = mxUtils.bind(this, function()
					{
						this.savingFile = false;
						this.isModified = prevModified;
						this.setModified(modified || this.isModified());
						
						if (error != null)
						{
	        				error();
						}
					});
					
					var writeFile = mxUtils.bind(this, function()
					{
						if (data == null || data.length == 0)
						{
							this.ui.handleError({message: mxResources.get('errorSavingFile')});
							errorWrapper();
						}
						else
						{
							fs.writeFile(this.fileObject.path, data, enc || this.fileObject.encoding,
								mxUtils.bind(this, function (e)
						    {
				        		if (e)
				        		{
				        			errorWrapper();
				        		}
				        		else
				        		{
									fs.stat(this.fileObject.path, mxUtils.bind(this, function(e2, stat2)
									{
										if (e2)
						        		{
						        			errorWrapper();
						        		}
										else
										{
											this.savingFile = false;
											this.isModified = prevModified;
											var lastDesc = this.stat;
											this.stat = stat2;
											
											this.fileSaved(savedData, lastDesc, mxUtils.bind(this, function()
											{
												this.contentChanged();
												
												if (success != null)
												{
													success();
												}
											}), error);
										}
									}));
				        		}
				        	}));
						}
					});
					
					if (overwrite)
					{
						writeFile();
					}
					else
					{
						fs.stat(this.fileObject.path, mxUtils.bind(this, function(err, stat)
						{
							if (this.isConflict(stat))
							{
								this.inConflictState = true;
								errorWrapper();
							}
							else if (err != null && err.code !== 'ENOENT')
							{
								errorWrapper();
							}
							else
							{
								writeFile();
							}
						}));
					}
				});
	
				if (!/(\.png)$/i.test(this.fileObject.name))
				{
					doSave(this.getData());
				}
				else
				{
					this.ui.getEmbeddedPng(function(data)
					{
						doSave(atob(data), 'binary');
					}, error);
				}
			});
			
			if (this.fileObject == null)
			{
				const electron = require('electron');
				var remote = electron.remote;
				var dialog = remote.dialog;
	
				var path = dialog.showSaveDialogSync({defaultPath: this.title});
	
		        if (path != null)
		        {
					this.fileObject = new Object();
					this.fileObject.path = path;
					this.fileObject.name = path.replace(/^.*[\\\/]/, '');
					this.fileObject.type = 'utf-8';
					fn();
				}
		        else
		        {
	            	this.ui.spinner.stop();
		        }
			}
			else
			{
				fn();
			}
		}
	};

	LocalFile.prototype.saveAs = function(title, success, error)
	{
		const electron = require('electron');
		var remote = electron.remote;
		var dialog = remote.dialog;
		var filename = this.title;
		
		// Adds default extension
		if (filename.length > 0 && (!/(\.xml)$/i.test(filename) && !/(\.html)$/i.test(filename) &&
			!/(\.svg)$/i.test(filename) && !/(\.png)$/i.test(filename) && !/(\.drawio)$/i.test(filename)))
		{
			filename += '.drawio';
		}
		
		var path = dialog.showSaveDialogSync({defaultPath: filename});
        
        if (path != null)
        {
			this.fileObject = new Object();
			this.fileObject.path = path;
			this.fileObject.name = path.replace(/^.*[\\\/]/, '');
			this.fileObject.type = 'utf-8';
			
			this.save(false, success, error, null, true);
		}
	};
	
	App.prototype.saveFile = function(forceDialog)
	{
		var file = this.getCurrentFile();
		
		if (file != null)
		{
			if (!forceDialog && file.getTitle() != null)
			{
				file.save(true, mxUtils.bind(this, function()
				{
					file.handleFileSuccess(true);
				}), mxUtils.bind(this, function(err)
				{
					file.handleFileError(err, true);
				}));
			}
			else
			{
				file.saveAs(null, mxUtils.bind(this, function()
				{
					file.handleFileSuccess(true);
				}), mxUtils.bind(this, function(err)
				{
					file.handleFileError(err, true);
				}));
			}
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	App.prototype.saveLibrary = function(name, images, file, mode, noSpin, noReload, fn)
	{
		mode = (mode != null) ? mode : this.mode;
		noSpin = (noSpin != null) ? noSpin : false;
		noReload = (noReload != null) ? noReload : false;
		var xml = this.createLibraryDataFromImages(images);
		
		var error = mxUtils.bind(this, function(resp)
		{
			this.spinner.stop();
			
			if (fn != null)
			{
				fn();
			}
			
			// Null means cancel by user and is ignored
			if (resp != null)
			{
				this.handleError(resp, mxResources.get('errorSavingFile'));
			}
		});
	
		// Handles special case for local libraries
		if (file == null)
		{
			file = new LocalLibrary(this, xml, name);
		}
		
		if (noSpin || this.spinner.spin(document.body, mxResources.get('saving')))
		{
			file.setData(xml);
			
			var doSave = mxUtils.bind(this, function()
			{
				file.save(true, mxUtils.bind(this, function(resp)
				{
					this.spinner.stop();
					this.hideDialog(true);
					
					if (!noReload)
					{
						this.libraryLoaded(file, images)
					}
					
					if (fn != null)
					{
						fn();
					}
				}), error);
			});
			
			if (name != file.getTitle())
			{
				var oldHash = file.getHash();
				
				file.rename(name, mxUtils.bind(this, function(resp)
				{
					// Change hash in stored settings
					if (file.constructor != LocalLibrary && oldHash != file.getHash())
					{
						mxSettings.removeCustomLibrary(oldHash);
						mxSettings.addCustomLibrary(file.getHash());
					}
	
					// Workaround for library files changing hash so
					// the old library cannot be removed from the
					// sidebar using the updated file in libraryLoaded
					this.removeLibrarySidebar(oldHash);
	
					doSave();
				}), error)
			}
			else
			{
				doSave();
			}
		}
	};
	
	
	/**
	 * Updates action states depending on the selection.
	 */
	var editorUiUpdateActionStates = EditorUi.prototype.updateActionStates;
	EditorUi.prototype.updateActionStates = function()
	{
		editorUiUpdateActionStates.apply(this, arguments);

		var file = this.getCurrentFile();
		var syncEnabled = file != null && file.fileObject != null;
		this.actions.get('synchronize').setEnabled(syncEnabled);
	};
	
	EditorUi.prototype.saveLocalFile = function(data, filename, mimeType, base64Encoded, format, allowBrowser)
	{
		this.saveData(filename, format, data, mimeType, base64Encoded);
	};
	
	EditorUi.prototype.saveRequest = function(filename, format, fn, data, base64Encoded, mimeType)
	{
		var xhr = fn(null, '1');
		
		if (xhr != null && this.spinner.spin(document.body, mxResources.get('saving')))
		{
			xhr.send(mxUtils.bind(this, function()
			{
				this.spinner.stop();
				
				if (xhr.getStatus() >= 200 && xhr.getStatus() <= 299)
				{
					this.saveData(filename, format, xhr.getText(), mimeType, true);
				}
				else
				{
					this.handleError({message: mxResources.get('errorSavingFile')});
				}
			}), function(resp)
			{
				this.spinner.stop();
				this.handleError(resp);
			});
		}
	};

	function mxElectronRequest(reqType, reqObj)
	{
		this.reqType = reqType;
		this.reqObj = reqObj;
	};

	//Extends mxXmlRequest
	mxUtils.extend(mxElectronRequest, mxXmlRequest);
	
	mxElectronRequest.prototype.send = function(callback, error)
	{
		const ipcRenderer = require('electron').ipcRenderer;
		ipcRenderer.send(this.reqType, this.reqObj);
		
		ipcRenderer.once(this.reqType + '-success', (event, data) => 
		{
			this.response = data;
			callback();
			ipcRenderer.send(this.reqType + '-finalize');
		})

		ipcRenderer.once(this.reqType + '-error', (event, err) => 
		{
			this.hasError = true;
			error(err);
			ipcRenderer.send(this.reqType + '-finalize');
		})
	};
	
	mxElectronRequest.prototype.getStatus = function()
	{
		return this.hasError? 500 : 200; 
	}
	
	mxElectronRequest.prototype.getText = function()
	{
		return this.response;
	}
	
	if (mxIsElectron5)
	{
		//Direct export to pdf
		EditorUi.prototype.createDownloadRequest = function(filename, format, ignoreSelection, base64, transparent, currentPage, scale, border, grid)
		{
			var graph = this.editor.graph;
			var bounds = graph.getGraphBounds();
			
			// Exports only current page for images that does not contain file data, but for
			// the other formats with XML included or pdf with all pages, we need to send the complete data and use
			// the from/to URL parameters to specify the page to be exported.
			var data = this.getFileData(true, null, null, null, ignoreSelection, currentPage == false? false : format != 'xmlpng');
			var range = null;
			var allPages = null;
			
			if (bounds.width * bounds.height > MAX_AREA || data.length > MAX_REQUEST_SIZE)
			{
				throw {message: mxResources.get('drawingTooLarge')};
			}
			
			var embed = '0';
			
			if (format == 'pdf' && currentPage == false)
			{
				allPages = '1';
			}
			
			if (format == 'xmlpng')
	       	{
	       		embed = '1';
	       		format = 'png';
	       		
	       		// Finds the current page number
	       		if (this.pages != null && this.currentPage != null)
	       		{
	       			for (var i = 0; i < this.pages.length; i++)
	       			{
	       				if (this.pages[i] == this.currentPage)
	       				{
	       					range = i;
	       					break;
	       				}
	       			}
	       		}
	       	}
			
			var bg = graph.background;
			
			if (format == 'png' && transparent)
			{
				bg = mxConstants.NONE;
			}
			else if (!transparent && (bg == null || bg == mxConstants.NONE))
			{
				bg = '#ffffff';
			}
			
			var extras = {globalVars: graph.getExportVariables()};
			
			if (grid)
			{
				extras.grid = {
					size: graph.gridSize,
					steps: graph.view.gridSteps,
					color: graph.view.gridColor
				};
			}
			
			return new mxElectronRequest('export', {
				format: format,
				xml: data,
				from: range,
				bg: (bg != null) ? bg : mxConstants.NONE,
				filename: (filename != null) ? filename : null,
				allPages: allPages,
				base64: base64,
				embedXml: embed,
				extras: encodeURIComponent(JSON.stringify(extras)),
				scale: scale,
				border: border
			});
		};
		
		//Export Dialog Pdf case
		var origExportFile = ExportDialog.exportFile;
		
		ExportDialog.exportFile = function(editorUi, name, format, bg, s, b, dpi)
		{
			var graph = editorUi.editor.graph;
			
			if (format == 'xml' || format == 'svg')
			{
				return origExportFile.apply(this, arguments);
			}
			else
			{
				var data = editorUi.getFileData(true, null, null, null, null, true);
	    		var bounds = graph.getGraphBounds();
				var w = Math.floor(bounds.width * s / graph.view.scale);
				var h = Math.floor(bounds.height * s / graph.view.scale);
				
				if (data.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA)
				{
					editorUi.hideDialog();
					
					if ((format == 'png' || format == 'jpg' || format == 'jpeg') && editorUi.isExportToCanvas())
					{
						if (format == 'png')
						{
							editorUi.exportImage(s, bg == null || bg == 'none', true,
						   		false, false, b, true, false, null, null, dpi);
						}
						else 
						{
							editorUi.exportImage(s, false, true,
								false, false, b, true, false, 'jpeg');
						}
					}
					else 
					{
						var extras = {globalVars: graph.getExportVariables()};
						
						editorUi.saveRequest(name, format,
							function(newTitle, base64)
							{
								return new mxElectronRequest('export', {
									format: format,
									xml: data,
									bg: (bg != null) ? bg : mxConstants.NONE,
									filename: (newTitle != null) ? newTitle : null,
									w: w,
									h: h,
									border: b,
									base64: (base64 || '0'),
									extras: JSON.stringify(extras),
									dpi: dpi > 0? dpi : null
								}); 
							});
					}
				}
				else
				{
					mxUtils.alert(mxResources.get('drawingTooLarge'));
				}
			}
		};
	}
	
	EditorUi.prototype.saveData = function(filename, format, data, mimeType, base64Encoded)
	{
		const electron = require('electron');
		var remote = electron.remote;
		var dialog = remote.dialog;
		var resume = (this.spinner != null && this.spinner.pause != null) ? this.spinner.pause() : function() {};
		
		// Spinner.stop is asynchronous so we must invoke save dialog asynchronously
		// to give the spinner some time to stop spinning
		window.setTimeout(mxUtils.bind(this, function()
		{
			var dlgConfig = {defaultPath: filename};
			var filters = null;
			
			switch (format)
			{
				case 'xmlpng':
				case 'png':
					filters = [
				          { name: 'PNG Images', extensions: ['png'] }
				       ];
				break;
				case 'jpg':
				case 'jpeg':
					filters = [
				          { name: 'JPEG Images', extensions: ['jpg', 'jpeg'] }
				       ];
				break;
				case 'svg':
					filters = [
				          { name: 'SVG Images', extensions: ['svg'] }
				       ];
				break;
				case 'pdf':
					filters = [
				          { name: 'PDF Documents', extensions: ['pdf'] }
				       ];
				break;
				case 'vsdx':
					filters = [
				          { name: 'VSDX Documents', extensions: ['vsdx'] }
				       ];
				break;
				case 'html':
					filters = [
				          { name: 'HTML Documents', extensions: ['html'] }
				       ];
				break;
				case 'xml':
					filters = [
				          { name: 'XML Documents', extensions: ['xml'] }
				       ];
				break;
			};
			
			dlgConfig['filters'] = filters;
			var path = dialog.showSaveDialogSync(dlgConfig);
	
	        if (path != null)
	        {
	        	if (data == null || data.length == 0)
				{
					this.handleError({message: mxResources.get('errorSavingFile')});
				}
				else
				{
					var fs = require('fs');
					resume();
					
					var fileObject = new Object();
					fileObject.path = path;
					fileObject.name = path.replace(/^.*[\\\/]/, '');
					fileObject.type = (base64Encoded) ? 'base64' : 'utf-8';
					
					fs.writeFile(fileObject.path, data, fileObject.type, mxUtils.bind(this, function (e)
				    {
						this.spinner.stop();
						
						if (e)
						{
							this.handleError({message: mxResources.get('errorSavingFile')});
						}
		        	}));
				}
			}
		}), 50);
	};

	EditorUi.prototype.addBeforeUnloadListener = function() {};
	
	EditorUi.prototype.loadDesktopLib = function(libPath, success, error)
	{
		this.readGraphFile(mxUtils.bind(this, function(fileEntry, data, stat)
		{
			var library = new DesktopLibrary(this, data, fileEntry);
			this.loadLibrary(library);
			success(library);
		}), error, libPath);
	};
})();
