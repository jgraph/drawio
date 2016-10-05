window.TEMPLATE_PATH = 'templates';

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
		
//		// Replaces new action
//		this.actions.addAction('new...', mxUtils.bind(this, function()
//		{
//			if (this.getCurrentFile() == null)
//			{
//				// LATER: In Chrome OS the extension is not enforced resulting
//				// in possible files with no extension. Extensions such as XML,
//				// SVG and HTML are and should be allowed. How can we fix this?
//				chrome.fileSystem.chooseEntry({type: 'saveFile',
//					accepts: [{description: 'Draw.io Diagram (.xml)',
//					extensions: ['xml']}]}, mxUtils.bind(this, function(f)
//				{
//					if (!chrome.runtime.lastError)
//					{
//						var file = new LocalFile(editorUi, this.emptyDiagramXml, '');
//						file.fileObject = f;
//						
//						editorUi.fileLoaded(file);
//					}
//					else if (chrome.runtime.lastError.message != 'User cancelled')
//					{
//						editorUi.handleError(chrome.runtime.lastError);
//					}
//				}));
//			}
//			else
//			{
//				// Could use URL parameter to call new action but conflicts with splash screen
//				chrome.app.window.create('index.html',
//				{
//					bounds :
//					{
//						width: Math.floor(Math.min(screen.availWidth * 3 / 4, 1024)),
//						height: Math.floor(Math.min(screen.availHeight * 3 / 4, 768)),
//						left: Math.floor((screen.availWidth - Math.min(screen.availWidth * 3 / 4, 1024)) / 2),
//						top: Math.floor((screen.availHeight - Math.min(screen.availHeight * 3 / 4, 768)) / 3)
//					}
//				});
//			}
//		}), null, null, 'Ctrl+N');
		
		this.actions.get('open').shortcut = 'Ctrl+O';
		
		// Adds shortcut keys for file operations
		editorUi.keyHandler.bindAction(78, true, 'new'); // Ctrl+N
		editorUi.keyHandler.bindAction(79, true, 'open'); // Ctrl+O
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

//			chrome.fileSystem.chooseEntry({type: 'saveFile',
//				accepts: [(this.constructor == LocalFile) ? {description: 'Draw.io Diagram (.xml)',
//				extensions: ['xml']} : {description: 'Draw.io Library (.xml)',
//				extensions: ['xml']}]}, mxUtils.bind(this, function(xmlFile)

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
        
//		chrome.fileSystem.chooseEntry({type: 'saveFile',
//			accepts: [(this.constructor == LocalFile) ? {description: 'Draw.io Diagram (.xml)',
//			extensions: ['xml']} : {description: 'Draw.io Library (.xml)',
//			extensions: ['xml']}]}, mxUtils.bind(this, function(f)

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
	
	App.prototype.doSaveLocalFile = function(data, filename, mimeType, base64Encoded)
	{
		chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: filename, acceptsAllTypes: true}, mxUtils.bind(this, function(fileEntry)
		{
			if (!chrome.runtime.lastError)
			{
				fileEntry.createWriter(mxUtils.bind(this, function(writer)
				{
					writer.onwriteend = mxUtils.bind(this, function()
					{
						writer.onwriteend = null;
						writer.write((base64Encoded) ? this.base64ToBlob(data, mimeType) : new Blob([data], {type: mimeType}));
					});
					
					writer.onerror = mxUtils.bind(this, function(e)
					{
						this.handleError(e);
					});
					
					writer.truncate(0);
				}));
			}
			else if (chrome.runtime.lastError.message != 'User cancelled')
			{
				this.handleError(chrome.runtime.lastError);
			}
		}));
	};
})();