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
	
	var menusInit = Menus.prototype.init;
	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);

		var editorUi = this.editorUi;

		editorUi.actions.put('useOffline', new Action(mxResources.get('useOffline') + '...', function()
		{
			editorUi.openLink('https://www.draw.io/')
		}));
		
		// Replaces file menu to replace openFrom menu with open and rename downloadAs to export
		this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['new', 'open', '-', 'save', 'saveAs', '-', 'import'], parent);
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

		        var paths = dialog.showOpenDialog({properties: ['openFile']});
			           
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
	}
	
	App.prototype.loadArgs = function(argsObj)
	{
		var paths = argsObj.args;
		
		// If a file is passed 
		if (paths !== undefined && paths[0] != null)
		{
			var path = paths[0];
			
			var success = mxUtils.bind(this, function(fileEntry, data)
			{
				var file = new LocalFile(this, data, '');
				file.fileObject = fileEntry;
				this.fileLoaded(file);
			});
			
			var error = mxUtils.bind(this, function(e)
			{
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
			this.readGraphFile(fn, this.handleError.bind(this), paths[0]);
        }
	};

	App.prototype.readGraphFile = function(fn, fnErr, path)
	{
		var fs = require('fs');
		var index = path.lastIndexOf('.png');
		var isPng = index > -1 && index == path.length - 4;
		var encoding = isPng ? 'base64' : 'utf-8'

		fs.readFile(path, encoding, mxUtils.bind(this, function (e, data)
		{
			if (e)
			{
				fnErr(e);
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

			var path = dialog.showSaveDialog({defaultPath: this.title});

	        if (path != null)
	        {
				this.fileObject = new Object();
				this.fileObject.path = path;
				this.fileObject.name = path.replace(/^.*[\\\/]/, '');
				this.fileObject.type = 'utf-8';
				fn();
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
					this.handleError(resp, mxResources.get('errorSavingFile'));
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
					this.handleError(resp, mxResources.get('errorSavingFile'));
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
			var path = dialog.showSaveDialog({defaultPath: filename});
	
	        if (path != null)
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
		}), 0);
	};

	EditorUi.prototype.addBeforeUnloadListener = function() {};
})();
