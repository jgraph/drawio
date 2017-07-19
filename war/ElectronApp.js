window.OPEN_URL = 'https://www.draw.io/open';
window.TEMPLATE_PATH = 'templates';
FeedbackDialog.feedbackUrl = 'https://log.draw.io/email';

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
	
	// Enables PDF export via print
	EditorUi.prototype.printPdfExport = true;
	
	var menusInit = Menus.prototype.init;
	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);

		var editorUi = this.editorUi;
		
		// Replaces file menu to replace openFrom menu with open and rename downloadAs to export
		this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['new', 'open', '-', 'save', 'saveAs', '-', 'import'], parent);
			this.addSubmenu('exportAs', menu, parent);
			this.addSubmenu('embed', menu, parent);
			this.addMenuItems(menu, ['-', 'newLibrary', 'openLibrary', '-', 'documentProperties', 'print'], parent);
		})));
		
		this.put('extras', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['copyConnect', 'collapseExpand', '-', 'mathematicalTypesetting', 'autosave', '-',
			                         'createShape', 'editDiagram', '-', 'tags', '-', 'online'], parent);
		})));
	};
	
	// Initializes the user interface
	var editorUiInit = EditorUi.prototype.init;
	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);

		var editorUi = this;
		var graph = this.editor.graph;
		this.editor.autosave = false;
		
		global.__emt_isModified = e => {
			if (this.getCurrentFile())
				return this.getCurrentFile().isModified()
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

		        var paths = dialog.showOpenDialog({properties: ['openFile']});
			           
		        if (paths !== undefined && paths[0] != null)
		        {
		        	var fs = require('fs');
		        	var path = paths[0];
		        	var index = path.lastIndexOf('.png');
		        	var isPng = index > -1 && index == path.length - 4;
		        	var encoding = (isPng || /\.gif$/i.test(path) || /\.jpe?g$/i.test(path) ||
		        		/\.vsdx$/i.test(path)) ? 'base64' : 'utf-8'

					if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
					{
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
									if (isPng)
									{
										var tmp = editorUi.extractGraphModelFromPng(data);
										
										if (tmp != null)
										{
											data = tmp;
										}
									}
									
									if (!editorUi.isOffline() && new XMLHttpRequest().upload && editorUi.isRemoteFileFormat(data, path))
									{
										// Asynchronous parsing via server
										editorUi.parseFile(editorUi.base64ToBlob(data, 'application/octet-stream'), mxUtils.bind(this, function(xhr)
										{
											if (xhr.readyState == 4)
											{
												editorUi.spinner.stop();
												
												if (xhr.status >= 200 && xhr.status <= 299)
												{
													
													editorUi.editor.graph.setSelectionCells(editorUi.insertTextAt(xhr.responseText, 0, 0, true));
												}
											}
										}), path);
									}
									else if (isPng || /\.gif$/i.test(path) || /\.jpe?g$/i.test(path))
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
										
										img.src = 'data:image/png;base64,' + data;
									}
									else if (data != null)
									{
										editorUi.spinner.stop();
										graph.setSelectionCells(editorUi.importXml(data));
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
			mxLog.debug(this.getCurrentFile());

			if (this.getCurrentFile() == null)
			{
				oldNew();
			}
			else {
				const ipc = require('electron').ipcRenderer
				ipc.sendSync('winman', {action: 'newfile', opt: {width: 1600}})

			}
		}), null, null, 'Ctrl+N');
		
		this.actions.get('open').shortcut = 'Ctrl+O';
		
		// Adds shortcut keys for file operations
		editorUi.keyHandler.bindAction(78, true, 'new'); // Ctrl+N
		editorUi.keyHandler.bindAction(79, true, 'open'); // Ctrl+O
		
		editorUi.actions.addAction('keyboardShortcuts...', function()
		{
			const electron = require('electron');
			const remote = electron.remote;
			const BrowserWindow = remote.BrowserWindow;
			keyboardWindow = new BrowserWindow({width: 1200, height: 1000});

			// and load the index.html of the app.
			keyboardWindow.loadURL(`file://${__dirname}/shortcuts.svg`);

			// Emitted when the window is closed.
			keyboardWindow.on('closed', function()
			{
			    // Dereference the window object, usually you would store windows
			    // in an array if your app supports multi windows, this is the time
			    // when you should delete the corresponding element.
				keyboardWindow = null;
			});
		});
	}

	// Uses local picker
	App.prototype.pickFile = function()
	{
		var doPickFile = mxUtils.bind(this, function()
		{
			this.chooseFileEntry(mxUtils.bind(this, function(fileEntry, data)
			{
				var file = new LocalFile(this, data, '');
				file.fileObject = fileEntry;
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
		this.chooseFileEntry(mxUtils.bind(this, function(fileEntry, data)
		{
			try
			{
				var library = new LocalLibrary(this, data, fileEntry.name);
				library.fileObject = fileEntry;
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

        var paths = dialog.showOpenDialog({properties: ['openFile']});
	           
        if (paths !== undefined && paths[0] != null)
        {
        	var fs = require('fs');
        	var path = paths[0];
        	var index = path.lastIndexOf('.png');
        	var isPng = index > -1 && index == path.length - 4;
        	var encoding = isPng ? 'base64' : 'utf-8'

        	fs.readFile(path, encoding, mxUtils.bind(this, function (e, data)
        	{
        		if (e)
        		{
        			this.handleError(e);
        		}
        		else
        		{
        			if (isPng)
        			{
        				// Detecting png by extension. Would need https://github.com/mscdex/mmmagic
        				// to do it by inspection
        				data = this.extractGraphModelFromPng(data, true);
        			}

        			var fileEntry = new Object();
        			fileEntry.path = path;
        			fileEntry.name = path.replace(/^.*[\\\/]/, '');
        			fileEntry.type = encoding;
        			fn(fileEntry, data);
        		}
        	}));
        }
	};

	// Disables temp files in Electron
	var LocalFileCtor = LocalFile;
	
	LocalFile = function(ui, data, title, temp)
	{
		LocalFileCtor.call(this, ui, data, title, false);
	};

	mxUtils.extend(LocalFile, LocalFileCtor);

	LocalFile.prototype.isAutosave = function()
	{
		return this.ui.editor.autosave && this.fileObject != null;
	};
	
	LocalFile.prototype.isAutosaveOptional = function()
	{
		return true;
	};
	
	LocalLibrary.prototype.isAutosave = function()
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

	LocalFile.prototype.save = function(revision, success, error)
	{
		DrawioFile.prototype.save.apply(this, arguments);
		
		this.saveFile(revision, success, error);
	};
	
	LocalFile.prototype.saveFile = function(revision, success, error)
	{
		var fn = mxUtils.bind(this, function()
		{
			var doSave = mxUtils.bind(this, function(data, enc)
			{
				if (!this.savingFile)
				{
					this.savingFile = true;
					
					// Makes sure no changes get lost while the file is saved
					var prevModified = this.isModified;
					var modified = this.isModified();
					this.setModified(false);
					var fs = require('fs');
					
					fs.writeFile(this.fileObject.path, data, enc || this.fileObject.encoding, mxUtils.bind(this, function (e)
				    {
		        		if (e)
		        		{
		        			this.savingFile = false;
							this.isModified = prevModified;
							this.setModified(modified || this.isModified());
							
							if (error != null)
							{
		        				error();
							}
		        		}
		        		else
		        		{
							this.savingFile = false;
							this.isModified = prevModified;
							this.contentChanged();
							this.lastData = data;
							
							if (success != null)
							{
								success();
							}
		        		}
		        	}));
				}
				else
				{
					// TODO, already saving. Need a better error
					if (error != null)
					{
        				error();
					}
				}
			});

			if (!/(\.png)$/i.test(this.fileObject.name))
			{
				doSave(this.getData());
			}
			else
			{
				var graph = this.ui.editor.graph;
				
				// Exports PNG for first page while other page is visible by creating a graph
				// LATER: Add caching for the graph or SVG while not on first page
				if (this.ui.pages != null && this.ui.currentPage != this.ui.pages[0])
				{
					graph = this.ui.createTemporaryGraph(graph.getStylesheet());
					var graphGetGlobalVariable = graph.getGlobalVariable;
					var page = this.ui.pages[0];
			
					graph.getGlobalVariable = function(name)
					{
						if (name == 'page')
						{
							return page.getName();
						}
						else if (name == 'pagenumber')
						{
							return 1;
						}
						
						return graphGetGlobalVariable.apply(this, arguments);
					};
			
					document.body.appendChild(graph.container);
					graph.model.setRoot(page.root);
				}
				
			   	this.ui.exportToCanvas(mxUtils.bind(this, function(canvas)
			   	{
			   		try
			   		{
			   	   	    var data = canvas.toDataURL('image/png');
		   	   	   		data = this.ui.writeGraphModelToPng(data, 'zTXt', 'mxGraphModel',
		   	   	   			atob(this.ui.editor.graph.compress(this.ui.getFileData(true))));
		   	   	   		doSave(atob(data.substring(data.lastIndexOf(',') + 1)), 'binary');

						// Removes temporary graph from DOM
		   	   	    	if (graph != this.ui.editor.graph)
						{
							graph.container.parentNode.removeChild(graph.container);
						}
			   		}
			   		catch (e)
			   		{
			   			if (error != null)
			   			{
			   				error(e);
			   			}
			   		}
			   	}), null, null, null, mxUtils.bind(this, function(e)
			   	{
			   		if (error != null)
		   			{
		   				error(e);
		   			}
			   	}), null, null, null, null, null, null, graph);
			}
		});
		
		if (this.fileObject == null)
		{
			const electron = require('electron');
			var remote = electron.remote;
			var dialog = remote.dialog;

			var path = dialog.showSaveDialog({defaultPath: this.title});

	        if (path != null)
	        {
				this.fileObject = new Object();
				this.fileObject.path = path;
				this.fileObject.name = path.replace(/^.*[\\\/]/, '');
				this.fileObject.type = 'utf-8';
				fn();
			}
	        else if (error != null)
			{
				error();
			}
		}
		else
		{
			fn();
		}
	};

	LocalLibrary.prototype.save = function(revision, success, error)
	{
		LocalFile.prototype.saveFile.apply(this, arguments);
	};
	
	LocalFile.prototype.saveAs = function(title, success, error)
	{
		const electron = require('electron');
		var remote = electron.remote;
		var dialog = remote.dialog;
		var filename = this.title;
		
		// Adds default extension
		if (filename.length > 0 && (!/(\.xml)$/i.test(filename) && !/(\.html)$/i.test(filename) &&
			!/(\.svg)$/i.test(filename) && !/(\.png)$/i.test(filename)))
		{
			filename += '.xml';
		}
		
		var path = dialog.showSaveDialog({defaultPath: filename});
        
        if (path != null)
        {
			this.fileObject = new Object();
			this.fileObject.path = path;
			this.fileObject.name = path.replace(/^.*[\\\/]/, '');
			this.fileObject.type = 'utf-8';
			this.save(false, success, error);
		}
        else if (error != null)
		{
			error();
		}
	};

	App.prototype.saveFile = function(forceDialog)
	{
		var file = this.getCurrentFile();
		
		if (file != null)
		{
			if (!forceDialog && file.getTitle() != null)
			{
				file.save(true, mxUtils.bind(this, function(resp)
				{
					this.spinner.stop();
					this.editor.setStatus(mxUtils.htmlEntities(mxResources.get('allChangesSaved')));
				}), mxUtils.bind(this, function(resp)
				{
					this.editor.setStatus('');
					this.handleError(resp, (resp != null) ? mxResources.get('errorSavingFile') : null);
				}));
			}
			else
			{
				file.saveAs(null, mxUtils.bind(this, function(resp)
				{
					this.spinner.stop();
					this.editor.setStatus(mxUtils.htmlEntities(mxResources.get('allChangesSaved')));
				}), mxUtils.bind(this, function(resp)
				{
					this.editor.setStatus('');
					this.handleError(resp, (resp != null) ? mxResources.get('errorSavingFile') : null);
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
	
	EditorUi.prototype.saveData = function(filename, format, data, mimeType, base64Encoded)
	{
		const electron = require('electron');
		var remote = electron.remote;
		var dialog = remote.dialog;

        var path = dialog.showSaveDialog({defaultPath: filename});

        if (path != null)
        {
			this.fileObject = new Object();
			this.fileObject.path = path;
			this.fileObject.name = path.replace(/^.*[\\\/]/, '');
			var isImage = mimeType != null && mimeType.startsWith('image');
			this.fileObject.type = base64Encoded ? 'base64' : 'utf-8';
			var fs = require('fs');
			
			fs.writeFile(this.fileObject.path, data, this.fileObject.type, mxUtils.bind(this, function (e)
		    {
				if (e)
				{
					this.handleError({message: mxResources.get('errorSavingFile')});
				}
        	}));
		}
	};
	
	EditorUi.prototype.addBeforeUnloadListener = function() {};
})();
