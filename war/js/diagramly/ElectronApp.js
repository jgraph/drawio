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
		
		editorUi.actions.addAction('online...', function()
		{
			window.open('https://www.draw.io/');
		});

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
			this.addMenuItems(menu, ['copyConnect', 'collapseExpand', '-', 'gridColor', 'autosave', '-',
			                         'createShape', 'editDiagram', '-', 'online'], parent);
		})));
	};
	
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