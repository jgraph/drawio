/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
/**
 * Constructs a new file in the browser storage with the given data and
 * title.
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
 * Returns the etag for the given data, which is a hash of the data.
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
 * Returns App.MODE_BROWSER.
 */
StorageFile.prototype.getMode = function()
{
	return App.MODE_BROWSER;
};

/**
 * Returns true since files in the browser storage support synchronization.
 */
StorageFile.prototype.isSyncSupported = function()
{
	return true
};

/**
 * Returns true if changes of the file are detected by polling, which is the
 * case if sync is supported.
 */
StorageFile.prototype.isPolling = function()
{
	return this.isSyncSupported();
};

/**
 * Returns the polling interval in milliseconds.
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
 * Returns the hash of the file, which is L followed by the URI-encoded
 * title.
 */
StorageFile.prototype.getHash = function()
{
	return 'L' + encodeURIComponent(this.getTitle());
};

/**
 * Returns the title of the file.
 */
StorageFile.prototype.getTitle = function()
{
	return this.title;
};

/**
 * Returns true since files in the browser storage can be renamed.
 */
StorageFile.prototype.isRenamable = function()
{
	return true;
};

/**
 * Returns the descriptor of the file, which is the etag of its data.
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
 * Updates the file data and saves the file under its current title.
 */
StorageFile.prototype.save = function(revision, success, error)
{
	DrawioFile.prototype.save.apply(this, [false, mxUtils.bind(this, function()
	{
		this.saveFile(this.getTitle(), false, success, error);
	}), error]);
};

/**
 * Saves the file with the given title by renaming it.
 */
StorageFile.prototype.saveAs = function(title, success, error)
{
	this.rename(title, success, error);
};

/**
 * Inserts the given file, or a new file with the given title and data, into
 * the browser storage.
 */
StorageFile.insertFile = function(ui, title, data, success, error, file)
{
	StorageFile.doInsertFile((file != null) ? file :
		new StorageFile(ui, data, title), success, error);
};

/**
 * Writes the given file to the browser storage and passes it to success.
 * Asks the user to confirm before replacing an existing file with the same
 * title.
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
 * Passes the data of the file with the given title in the browser storage
 * to success, or null if it does not exist. Uses localStorage if no
 * database is available.
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
 * Passes the info object of the file with the given title in the browser
 * storage to success, or null if it does not exist. Uses localStorage if no
 * database is available.
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
 * Writes the file to the browser storage with the given title. If the stored
 * file has changed, it is merged and the save is retried up to maxRetries
 * times. Asks the user to confirm before replacing another file.
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
						EditorUi.debug('StorageFile.saveFile', [this], 'title', title,
							'data', data, 'latestVersion', [file], 'descriptor',
							this.getDescriptor(), 'latestVersionDescriptor',
							file.getDescriptor());
						
						if (file.getDescriptor() != this.getDescriptor())
						{
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
 * Invokes the given function after a random delay of 300 to 600 ms.
 */
StorageFile.prototype.retrySave = function(fn)
{
	var delay = 300 + Math.random() * 300;
	window.setTimeout(fn, delay);
	
	EditorUi.debug('StorageFile.retrySave', [this], 'delay', delay);
};

/**
 * Writes the data of the file with the given title to the browser storage
 * database, or to localStorage if no database is available, and updates the
 * descriptor.
 */
StorageFile.prototype.writeFile = function(title, success, error)
{
	EditorUi.debug('StorageFile.writeFile', [this], 'title', title);

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

			// Notifies other tabs to refresh the scratchpad
			if (this.type == 'L' && this.title == '.scratchpad' &&
				this.ui.scratchpadSaved != null)
			{
				this.ui.scratchpadSaved();
			}

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
		}], saveDone, mxUtils.bind(this, function(e)
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
				// Passes on the error so that the failed write is reported
				// to the user. Transaction errors are events with no message
				// and a null error is ignored by App.createFile
				// [jgraph/drawio-dev#672]
				error((e != null && e.message != null) ? e :
					{message: mxResources.get('errorSavingFile')});
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
 * Renames the file by saving it with the given title and deleting the file
 * with the old title.
 */
StorageFile.prototype.rename = function(title, success, error)
{
	var oldTitle = this.getTitle();

	if (oldTitle != title)
	{
		EditorUi.debug('StorageFile.rename', [this], 'oldTitle', oldTitle, 'newTitle', title);

		this.saveFile(title, false, mxUtils.bind(this, function()
		{
			StorageFile.deleteFile(this.ui, oldTitle, mxUtils.bind(this, function()
			{
				this.ui.removeLocalData(oldTitle, success);
			}, error));
		}), error);
	}
	else
	{
		success();
	}
};

/**
 * Passes the latest version of the file in the browser storage to success.
 */
StorageFile.prototype.getLatestVersion = function(success, error)
{
	StorageFile.getFileContent(this.ui, this.title, mxUtils.bind(this, function(data)
	{
		success(new StorageFile(this.ui, data, this.title));
	}), error);
};

/**
 * Returns the info objects of the files and libraries in localStorage. The
 * optional type (F for files or L for libraries) limits the result.
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
 * Copies all files and libraries, including the scratchpad, from
 * localStorage to the given database.
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
 * Passes the info objects of the files in the browser storage to success.
 * The optional type (F for files or L for libraries) limits the result.
 * Titles starting with a dot are ignored.
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
 * Deletes the file with the given title from the browser storage.
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
