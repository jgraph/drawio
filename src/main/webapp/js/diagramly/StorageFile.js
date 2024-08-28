/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
/**
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 * @constructor
 * @class Implements a basic 2D point. Known subclassers = {@link mxRectangle}.
 * @param {number} x X-coordinate of the point.
 * @param {number} y Y-coordinate of the point.
 */
StorageFile = function(ui, data, title)
{
	DrawioFile.call(this, ui, data);
	
	this.title = title;
	this.etag = this.getEtag(data);
};

//Extends mxEventSource
mxUtils.extend(StorageFile, DrawioFile);

/**
* Updates the descriptor of this file with the one from the given file.
*/
StorageFile.prototype.getEtag = function(data)
{
	return this.ui.hashValue((data != null) ? data : '');};

/**
 * Sets the delay for autosave in milliseconds. Default is 1000.
 */
StorageFile.prototype.autosaveDelay = 500;

/**
 * Sets the delay for autosave in milliseconds. Default is 20000.
 */
StorageFile.prototype.maxAutosaveDelay = 20000;

/**
 * Maximum number if attempts to automatically catchup on save.
 */
StorageFile.prototype.maxRetries = 5;

/**
 * A differentiator of the stored object type (file or lib)
 */
StorageFile.prototype.type = 'F';

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.prototype.getMode = function()
{
	return App.MODE_BROWSER;
};

/**
 * Overridden to enable the autosave option in the document properties dialog.
 */
StorageFile.prototype.isSyncSupported = function()
{
	return true
};

/**
 * Overridden to enable the autosave option in the document properties dialog.
 */
StorageFile.prototype.isPolling = function()
{
	return this.isSyncSupported();
};

/**
 * Overridden to enable the autosave option in the document properties dialog.
 */
StorageFile.prototype.getPollingInterval = function()
{
	return 10000;
};

/**
 * Hook for subclassers to get the latest descriptor of this file
 * and return it in the success handler.
 */
StorageFile.prototype.loadDescriptor = function(success, error)
{
	this.getLatestVersionId(success, error);
};

/**
 * Hook for subclassers to get the latest version ID of this file
 * and return it in the success handler.
 */
StorageFile.prototype.getLatestVersionId = function(success, error)
{
	StorageFile.getFileContent(this.ui, this.title, mxUtils.bind(this, function(data)
	{
		success(this.getEtag(data));
	}), error);
};

/**
 * Overridden to enable the autosave option in the document properties dialog.
 */
StorageFile.prototype.isAutosaveOptional = function()
{
	return true;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.prototype.getHash = function()
{
	return 'L' + encodeURIComponent(this.getTitle());
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.prototype.getTitle = function()
{
	return this.title;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.prototype.isRenamable = function()
{
	return true;
};

/**
 * Adds all listeners.
 */
StorageFile.prototype.getDescriptor = function()
{
	return this.etag;
};

/**
* Updates the descriptor of this file with the one from the given file.
*/
StorageFile.prototype.setDescriptor = function(etag)
{
	this.etag = etag;
};

/**
 * Returns the etag from the given descriptor.
 */
StorageFile.prototype.getDescriptorEtag = function(desc)
{
	return desc;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.prototype.save = function(revision, success, error)
{
	this.saveAs(this.getTitle(), success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.prototype.saveAs = function(title, success, error)
{
	DrawioFile.prototype.save.apply(this, [false, mxUtils.bind(this, function()
	{
		this.saveFile(this.getTitle(), false, success, error);
	}), error]);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.insertFile = function(ui, title, data, success, error, file)
{
	StorageFile.doInsertFile((file != null) ? file :
		new StorageFile(ui, data, title), success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.doInsertFile = function(file, success, error)
{
	var title = file.getTitle();
	var ui = file.getUi();

	var createStorageFile = mxUtils.bind(this, function(exists)
	{
		var fn = function()
		{
			file.writeFile(title, function()
			{
				success(file);
			}, error);
		};

		if (exists)
		{
			ui.confirm(mxResources.get('replaceIt', [title]), fn, error);
		}
		else
		{
			fn();
		}
	});
	
	StorageFile.getFileContent(ui, title, function(data)
	{
		createStorageFile(data != null);
	}, function()
	{
		createStorageFile(false);
	});
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.getFileContent = function(ui, title, success, error)
{
	ui.getDatabaseItem(title, function(obj)
	{
		success(obj != null? obj.data : null);
	}, 
	mxUtils.bind(this, function()
	{
		if (ui.database == null) //fallback to localstorage
		{
			ui.getLocalData(title, success);
		}
		else if (error != null)
		{
			error();
		}
	}), 'files');
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.getFileInfo = function(ui, title, success, error)
{
	ui.getDatabaseItem(title, function(obj)
	{
		success(obj);
	}, 
	mxUtils.bind(this, function()
	{
		if (ui.database == null) //fallback to localstorage
		{
			ui.getLocalData(title, function(data)
			{
				success(data != null? {title: title} : null);
			});
		}
		else if (error != null)
		{
			error();
		}
	}), 'filesInfo');
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.prototype.saveFile = function(title, revision, success, error, retry)
{
	retry = (retry != null) ? retry : 0;

	if (!this.isEditable())
	{
		if (success != null)
		{
			success();
		}
	}
	else
	{
		var fn = mxUtils.bind(this, function()
		{
			this.writeFile(title, success, error);
		});
		
		// Checks for trailing dots
		if (this.isRenamable() && title.charAt(0) == '.' && error != null)
		{
			error({message: mxResources.get('invalidName')});
		}
		else if (this instanceof StorageLibrary)
		{
			fn(); // No need to check for conflicts with libraries			
		}
		else
		{
			StorageFile.getFileInfo(this.ui, title, mxUtils.bind(this, function(data)
			{
				if (!this.isRenamable() || this.getTitle() == title || data == null)
				{
					this.getLatestVersion(mxUtils.bind(this, function(file)
					{
						if (file.getDescriptor() != this.getDescriptor())
						{
							EditorUi.debug('StorageFile.saveFile',
								[this], 'conflict', [file]);

							this.mergeFile(file, mxUtils.bind(this, function()
							{
								if (retry >= this.maxRetries ||
									this.invalidChecksum ||
									this.inConflictState)
								{
									this.inConflictState = true;

									if (error != null)
									{
										error();
									}
								}
								else
								{
									this.retrySave(mxUtils.bind(this, function()
									{
										this.updateFileData();
										this.saveFile(title, revision,
											success, error, retry + 1);
									}));
								}
							}), error);
						}
						else
						{
							fn();
						}
					}), error);
				}
				else
				{
					this.ui.confirm(mxResources.get('replaceIt', [title]), fn, error);
				}
			}), error);
		}
	}

	EditorUi.debug('StorageFile.saveFile', [this], 'title', title,
		'revision', revision, 'retry', retry);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.prototype.retrySave = function(fn)
{
	var delay = 300 + Math.random() * 300;
	window.setTimeout(fn, delay);
	
	EditorUi.debug('StorageFile.retrySave', [this], 'delay', delay);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.prototype.writeFile = function(title, success, error)
{
	if (this.isRenamable())
	{
		this.title = title;
	}
	
	try
	{
		var desc = this.getDescriptor();
		var data = this.getData();

		var saveDone = mxUtils.bind(this, function()
		{
			this.setModified(this.getShadowModified());
			this.setDescriptor(this.getEtag(data));
			this.contentChanged();
			this.fileSaved(data, desc, success, error);
		});
		
		this.setShadowModified(false);

		this.ui.setDatabaseItem(null, [{
				title: this.title,
				size: data.length,
				lastModified: Date.now(),
				type: this.type
			}, {
				title: this.title,
				data: data
			}], saveDone, mxUtils.bind(this, function()
			{
				if (this.ui.database == null) //fallback to localstorage
				{
					try
					{
						this.ui.setLocalData(this.title, data, saveDone);
					}
					catch (e)
					{
						if (error != null)
						{
							error(e);
						}
					}
				}
				else if (error != null)
				{
					error();
				}
			}), ['filesInfo', 'files']);
	}
	catch (e)
	{
		if (error != null)
		{
			error(e);
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.prototype.rename = function(title, success, error)
{
	var oldTitle = this.getTitle();

	if (oldTitle != title)
	{
		StorageFile.getFileInfo(this.ui, title, mxUtils.bind(this, function(data)
		{
			var fn = mxUtils.bind(this, function()
			{
				this.title = title;
				
				// Updates the data if the extension has changed
				if (!this.hasSameExtension(oldTitle, title))
				{
					this.setData(this.ui.getFileData());
				}
				
				this.saveFile(title, false, mxUtils.bind(this, function()
				{
					this.ui.removeLocalData(oldTitle, success);
				}), error);
			});
			
			if (data != null)
			{
				this.ui.confirm(mxResources.get('replaceIt', [title]), fn, error);
			}
			else
			{
				fn();
			}
		}), error);
	}
	else
	{
		success();
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
StorageFile.prototype.getLatestVersion = function(success, error)
{
	StorageFile.getFileContent(this.ui, this.title, mxUtils.bind(this, function(data)
	{
		success(new StorageFile(this.ui, data, this.title));
	}), error);
};

/**
 * Stops any pending autosaves and removes all listeners.
 */
StorageFile.prototype.destroy = function()
{
	DrawioFile.prototype.destroy.apply(this, arguments);
	
	if (this.storageListener != null)
	{
		mxEvent.removeListener(window, 'storage', this.storageListener);
		this.storageListener = null;
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.listLocalStorageFiles = function(type)
{
	var filesInfo = [];
	
	for (var i = 0; i < localStorage.length; i++)
	{
		var key = localStorage.key(i);
		var value = localStorage.getItem(key);
		
		if (key.length > 0 && key.charAt(0) != '.' && value.length > 0)
		{
			var isFile = (type == null || type == 'F') && (value.substring(0, 8) === '<mxfile ' ||
						value.substring(0, 5) === '<?xml' || value.substring(0, 12) === '<!--[if IE]>');
			var isLib = (type == null || type == 'L') && (value.substring(0, 11) === '<mxlibrary>');

			if (isFile || isLib)
			{
				filesInfo.push({
					title: key,
					type: isFile? 'F' : 'L',
					size: value.length,
					lastModified: Date.now()
				});
			}	
		}
	}
	
	return filesInfo;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.migrate = function(db) 
{
	var lsFilesInfo = StorageFile.listLocalStorageFiles();
	lsFilesInfo.push({title: '.scratchpad', type: 'L'}); //Adding scratchpad also since it is a library (storage file)
	var tx = db.transaction(['files', 'filesInfo'], 'readwrite');
	var files = tx.objectStore('files');
	var filesInfo = tx.objectStore('filesInfo');
	
	for (var i = 0; i < lsFilesInfo.length; i++)
	{
		var lsFileInfo = lsFilesInfo[i];
		var data = localStorage.getItem(lsFileInfo.title);
		files.add({
			title: lsFileInfo.title,
			data: data
		});
		filesInfo.add(lsFileInfo);
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.listFiles = function(ui, type, success, error)
{
	ui.getDatabaseItems(function(filesInfo)
	{
		var files = [];
		
		if (filesInfo != null)
		{
			for (var i = 0; i < filesInfo.length; i++)
			{
				if (filesInfo[i].title.charAt(0) != '.' && (type == null || filesInfo[i].type == type))
				{
					files.push(filesInfo[i]);
				}
			}
		}
		
		success(files);
	}, function()
	{
		if (ui.database == null) //fallback to localstorage
		{
			success(StorageFile.listLocalStorageFiles(type));
		}
		else if (error != null)
		{
			error();
		}
	}, 'filesInfo');
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageFile.deleteFile = function(ui, title, success, error)
{
	ui.removeDatabaseItem([title, title], success, function()
	{
		if (ui.database == null) //fallback to localstorage
		{
			localStorage.removeItem(title)
			success();
		}
		else if (error != null)
		{
			error();
		}
	}, ['files', 'filesInfo']);
};