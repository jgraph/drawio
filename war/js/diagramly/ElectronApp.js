window.TEMPLATE_PATH = 'templates';
FeedbackDialog.feedbackUrl = 'https://log.draw.io/email';

(function()
{
	// Overrides default mode
	App.mode = App.MODE_DEVICE;
	
	// Redirects printing to iframe to avoid document.write
	PrintDialog.showPreview = function(preview, print)
	{
		var iframe = document.createElement('iframe');
		document.body.appendChild(iframe);
		
		// Workaround for lost gradients in print output
		var getBaseUrl = mxSvgCanvas2D.prototype.getBaseUrl;
		
		mxSvgCanvas2D.prototype.getBaseUrl = function()
		{
			return '';
		};

		// Renders print output into iframe and prints
		var result = preview.open(null, iframe.contentWindow);
		iframe.contentWindow.print();
		iframe.parentNode.removeChild(iframe);
		
		mxSvgCanvas2D.prototype.getBaseUrl = getBaseUrl;
		
		return result;
	};
	
	var menusInit = Menus.prototype.init;
	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);

		var editorUi = this.editorUi;
		
		// Replaces file menu to replace openFrom menu with open and rename downloadAs to export
		this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['new', 'open', '-', 'save', 'saveAs', '-'], parent);
			this.addSubmenu('exportAs', menu, parent);
			this.addSubmenu('embed', menu, parent);
			this.addMenuItems(menu, ['-', 'newLibrary', 'openLibrary', '-', 'documentProperties', 'print'], parent);
		})));
		
		this.put('extras', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['copyConnect', 'collapseExpand', '-', 'mathematicalTypesetting', 'autosave', '-',
			                         'createShape', 'editDiagram', '-', 'online'], parent);
		})));
	};
	
	// Initializes the user interface
	var editorUiInit = EditorUi.prototype.init;
	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);

		var editorUi = this;
		var graph = this.editor.graph;

		// Adds support for libraries
		this.actions.addAction('newLibrary...', mxUtils.bind(this, function()
		{
			editorUi.showLibraryDialog(null, null, null, null, App.MODE_DEVICE);
		}));
		
		this.actions.addAction('openLibrary...', mxUtils.bind(this, function()
		{
			editorUi.pickLibrary(App.MODE_DEVICE);
		}));

//		// Replaces import action
//		this.actions.addAction('import...', mxUtils.bind(this, function()
//		{
//			if (this.getCurrentFile() != null)
//			{
//				chrome.fileSystem.chooseEntry({type: 'openFile', acceptsAllTypes: true}, mxUtils.bind(this, function(fileEntry)
//				{
//					if (!chrome.runtime.lastError)
//					{
//						fileEntry.file(mxUtils.bind(this, function(fileObject)
//						{
//							if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
//							{
//								var reader = new FileReader();
//								
//								reader.onload = function(evt)
//								{
//									editorUi.spinner.stop();
//									
//									try
//									{
//										var data = reader.result;
//										
//										if (fileObject.type.substring(0, 9) == 'image/png')
//										{
//											data = editorUi.extractGraphModelFromPng(data);
//										}
//										else if (fileObject.type.substring(0, 6) == 'image/')
//										{
//											data = null;
//										}
//										
//										if (data != null)
//										{
//											graph.setSelectionCells(editorUi.importXml(data));
//										}
//										else
//										{
//											var img = new Image();
//											img.onload = function()
//											{
//												editorUi.resizeImage(img, reader.result, function(data2, w, h)
//												{
//													var pt = graph.getInsertPoint();
//													graph.setSelectionCell(graph.insertVertex(null, null, '', pt.x, pt.y, w, h,
//														'shape=image;aspect=fixed;image=' + editorUi.convertDataUri(data2) + ';'));
//												}, true);
//											};
//											img.src = reader.result;
//										}
//									}
//									catch(e)
//									{
//										console.log(e);
//										editorUi.handleError(e);
//									}
//								};
//								
//								reader.onerror = function(ev)
//								{
//									editorUi.spinner.stop();
//									editorUi.handleError(ev);
//								};
//							
//								if (fileObject.type.substring(0, 6) == 'image/')
//								{
//									reader.readAsDataURL(fileObject);
//								}
//								else
//								{
//									reader.readAsText(fileObject);
//								}
//							}
//						}));
//					}
//					else if (chrome.runtime.lastError.message != 'User cancelled')
//					{
//						editorUi.handleError(chrome.runtime.lastError);
//					}
//				}));
//			}
//		}));
		
		// Replaces new action
		var oldNew = this.actions.get('new').funct;
		
		this.actions.addAction('new...', mxUtils.bind(this, function()
		{
			mxLog.debug(this.getCurrentFile());

			if (this.getCurrentFile() == null)
			{
				oldNew();
			}
			else
			{
				const electron = require('electron');
				const remote = electron.remote;
				const BrowserWindow = remote.BrowserWindow;
				mainWindow = new BrowserWindow({width: 1600, height: 1200, "web-security" : false});

				// and load the index.html of the app.
				mainWindow.loadURL(`file://${__dirname}/index.html?dev=1&test=1&db=0&gapi=0&od=0&analytics=0&picker=0&mode=device&browser=0&p=electron`);

				// Emitted when the window is closed.
				mainWindow.on('closed', function()
				{
				    // Dereference the window object, usually you would store windows
				    // in an array if your app supports multi windows, this is the time
				    // when you should delete the corresponding element.
				    mainWindow = null;
				});
			}
		}), null, null, 'Ctrl+N');
		
		this.actions.get('open').shortcut = 'Ctrl+O';
		
		// Adds shortcut keys for file operations
		editorUi.keyHandler.bindAction(78, true, 'new'); // Ctrl+N
		editorUi.keyHandler.bindAction(79, true, 'open'); // Ctrl+O
		
		editorUi.actions.addAction('quickStart...', function()
		{
			const {shell} = require('electron');
			shell.openExternal('https://www.youtube.com/watch?v=8OaMWa4R1SE&t=1');
		});

		this.actions.addAction('support...', function()
		{
			const {shell} = require('electron');
			shell.openExternal('https://support.draw.io/display/DFCC/draw.io+for+Confluence+Cloud');
		});
		
		editorUi.actions.addAction('userManual...', function()
		{
			const {shell} = require('electron');
			shell.openExternal('https://support.draw.io/display/DO/Draw.io+Online+User+Manual');
		});
		
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
		this.chooseFileEntry(mxUtils.bind(this, function(fileEntry, data)
		{
			var file = new LocalFile(this, data, '');
			file.fileObject = fileEntry;
			this.fileLoaded(file);
		}));
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
			var library = new LocalLibrary(this, data, fileEntry.name);
			library.fileObject = fileEntry;
			this.loadLibrary(library);
		}));
	};
	
	// Uses local picker
	App.prototype.chooseFileEntry = function(fn)
	{
		const electron = require('electron');
		var remote = electron.remote;
		var dialog = remote.dialog;

        var paths = dialog.showOpenDialog({properties: [ 'openFile' ] });
	           
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
	
	LocalFile.prototype.isAutosave = function()
	{
		return this.ui.editor.autosave;
	};
	
	LocalFile.prototype.isAutosaveOptional = function()
	{
		return true;
	};
	
	LocalLibrary.prototype.isAutosave = function()
	{
		return true;
	};
	
	LocalFile.prototype.getTitle = function()
	{
		return (this.fileObject != null) ? this.fileObject.name : null;
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
	
	LocalLibrary.prototype.save = function(revision, success, error)
	{
		this.saveFile(revision, success, error);
	};
	
	LocalFile.prototype.saveFile = function(revision, success, error)
	{
		var fn = mxUtils.bind(this, function()
		{
			var doSave = mxUtils.bind(this, function(data)
			{
				if (!this.savingFile)
				{
					this.savingFile = true;
					
					// Makes sure no changes get lost while the file is saved
					var prevModified = this.isModified;
					var modified = this.isModified();
					this.setModified(false);
					var fs = require('fs');
					
					fs.writeFile(this.fileObject.path, data, this.fileObject.encoding, mxUtils.bind(this, function (e)
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
					error();
				}
			});

			if (!/(\.png)$/i.test(this.fileObject.name))
			{
				doSave(this.getData());
			}
			else
			{
			   	this.ui.exportToCanvas(mxUtils.bind(this, function(canvas)
			   	{
			   		try
			   		{
			   	   	    var data = canvas.toDataURL('image/png');
		   	   	   		data = this.ui.writeGraphModelToPng(data, 'zTXt', 'mxGraphModel',
		   	   	   			atob(this.ui.editor.graph.compress(mxUtils.getXml(this.ui.editor.getGraphXml()))));
			   	   	    doSave(data, 'base64');
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
			   	}));
			}
		});
		
		if (this.fileObject == null)
		{
			const electron = require('electron');
			var remote = electron.remote;
			var dialog = remote.dialog;

	        var path = dialog.showSaveDialog();

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
	
	LocalFile.prototype.saveAs = function(title, success, error)
	{
		const electron = require('electron');
		var remote = electron.remote;
		var dialog = remote.dialog;

        var path = dialog.showSaveDialog();
        
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
					this.editor.setStatus(mxResources.get('allChangesSaved'));
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
					this.editor.setStatus(mxResources.get('allChangesSaved'));
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

        var path = dialog.showSaveDialog();

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
        			// TODO
        		}

        	}));
		}
	};
	
	EditorUi.prototype.addBeforeUnloadListener = function() {};
})();
