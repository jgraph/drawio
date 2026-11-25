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
 * Name of the BroadcastChannel on which tabs tell each other that they wrote
 * a file in the browser storage, so that the tabs that have the file open
 * check it at once instead of waiting for the next poll.
 */
StorageFile.channelName = 'drawio-storage-files';

/**
 * Overridden to listen to the writes of other tabs while the file is synced.
 */
StorageFile.prototype.startSync = function()
{
	DrawioFile.prototype.startSync.apply(this, arguments);

	if (this.sync != null && this.channel == null &&
		typeof window.BroadcastChannel === 'function')
	{
		try
		{
			this.channel = new BroadcastChannel(StorageFile.channelName);
			this.channel.onmessage = mxUtils.bind(this, function(evt)
			{
				this.handleChannelMessage(evt.data);
			});
		}
		catch (e)
		{
			this.channel = null;
		}
	}
};

/**
 * Checks the file at once if another tab wrote a version of it that this
 * tab does not have. Hidden and idle tabs poll nothing: they check the file
 * when they are shown or used again (see DrawioFileSync.start). The message
 * is only compared, never rendered.
 */
StorageFile.prototype.handleChannelMessage = function(msg)
{
	if (msg != null && msg.type == 'fileWritten' && this.sync != null &&
		typeof msg.title === 'string' && msg.title == this.getTitle() &&
		msg.etag != this.getCurrentRevisionId())
	{
		this.sync.pollNow();
	}
};

/**
 * Tells the other tabs that this file was written with the given etag.
 */
StorageFile.prototype.notifyWritten = function(etag)
{
	if (typeof window.BroadcastChannel === 'function')
	{
		try
		{
			// A channel of its own, as files without a sync have none. The
			// message is queued for the other channels when it is posted.
			var channel = new BroadcastChannel(StorageFile.channelName);
			channel.postMessage({type: 'fileWritten', title: this.getTitle(), etag: etag});
			channel.close();
		}
		catch (e)
		{
			// ignore
		}
	}
};

/**
 * Number of saves of this file in progress, from the bytes of the save to
 * the end of its write, with its retries (see saveFile). Default is 0.
 */
StorageFile.prototype.savesInProgress = 0;

/**
 * Overridden to return true while a save of this file is in progress (see
 * savesInProgress), as the file does not set savingFile.
 */
StorageFile.prototype.isSaving = function()
{
	return this.savesInProgress > 0 ||
		DrawioFile.prototype.isSaving.apply(this, arguments);
};

/**
 * Overridden to close the channel.
 */
StorageFile.prototype.destroy = function()
{
	if (this.channel != null)
	{
		try
		{
			this.channel.close();
		}
		catch (e)
		{
			// ignore
		}

		this.channel = null;
	}

	DrawioFile.prototype.destroy.apply(this, arguments);
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
		// The bytes were just updated: an edit made while the stored copy
		// is checked before the write is not in them and keeps the file
		// modified (see writeFile)
		this.setShadowModified(false);
		this.saveFile(this.getTitle(), false, success, error, null, true);
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
 * the browser storage (see doInsertFile for overwrite).
 */
StorageFile.insertFile = function(ui, title, data, success, error, file, overwrite)
{
	StorageFile.doInsertFile((file != null) ? file :
		new StorageFile(ui, data, title), success, error, overwrite);
};

/**
 * Writes the given file to the browser storage and passes it to success.
 * Asks the user to confirm before replacing an existing file with the same
 * title unless overwrite is the data of that file (the user has confirmed
 * to replace it as it was, see App.checkNewFile, so a file that has changed
 * since is asked for again). Cancel and a dismissal of the question (eg.
 * Escape) call error without an argument.
 */
StorageFile.doInsertFile = function(file, success, error, overwrite)
{
	var title = file.getTitle();
	var ui = file.getUi();

	var createStorageFile = mxUtils.bind(this, function(data)
	{
		var fn = function()
		{
			file.writeFile(title, function()
			{
				success(file);
			}, error);
		};

		if (data != null && (overwrite == null || overwrite !== data))
		{
			ui.confirmOrCancel(mxResources.get('replaceIt', [title]), fn, function()
			{
				error();
			});
		}
		else
		{
			fn();
		}
	});
	
	StorageFile.getFileContent(ui, title, function(data)
	{
		createStorageFile(data);
	}, function()
	{
		createStorageFile(null);
	});
};

/**
 * Passes the data of the file with the given title in the browser storage
 * to success, or null if it does not exist. Uses localStorage if no
 * database is available. If the file is not in localStorage either, the
 * error of the database is passed to error if it is not null.
 */
StorageFile.getFileContent = function(ui, title, success, error)
{
	ui.getDatabaseItem(title, function(obj)
	{
		success(obj != null? obj.data : null);
	}, 
	mxUtils.bind(this, function(e)
	{
		if (ui.database == null) //fallback to localstorage
		{
			ui.getLocalData(title, function(data)
			{
				if (data == null && error != null)
				{
					error(e);
				}
				else
				{
					success(data);
				}
			});
		}
		else if (error != null)
		{
			error(e);
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
 * Writes the file to the browser storage with the given title, or with its
 * title at the time of the write if current is true. If the stored file has
 * changed, it is merged and the save is retried up to maxRetries times. Asks
 * the user to confirm before replacing another file. lastBytes is true if the
 * bytes are those of the last save or load and were not taken for this save
 * (rename).
 */
StorageFile.prototype.saveFile = function(title, revision, success, error, retry, current, lastBytes)
{
	// The save is in progress until its callbacks, with its retries, which
	// get the wrapped callbacks. A check of the file that is asked for
	// meanwhile runs after it, also with autosave off: a merge between the
	// bytes and the write is not in the bytes (see DrawioFileSync.pollNow).
	// The error handler is wrapped also if the caller has none (eg. close):
	// a failed save would stay in progress otherwise, and every check of the
	// file that is asked for after it would wait for its end. For the same
	// reason a dismissed confirm and an exception end the save too.
	var end = null;

	if (retry == null)
	{
		var ended = false;
		this.savesInProgress++;

		end = mxUtils.bind(this, function(fn, args)
		{
			if (!ended)
			{
				ended = true;
				this.savesInProgress--;
			}

			try
			{
				if (fn != null)
				{
					fn.apply(null, args);
				}
			}
			finally
			{
				if (!this.isSaving() && this.sync != null)
				{
					this.sync.runDeferredPoll();
				}
			}
		});

		var done = success;
		var failed = error;

		success = function()
		{
			end(done, arguments);
		};

		error = function()
		{
			end(failed, arguments);
		};
	}

	retry = (retry != null) ? retry : 0;

	try
	{
		if (!this.isEditable())
		{
			if (success != null)
			{
				success();
			}
		}
		else
		{
			// A rename can complete while the stored copy is checked: a save that
			// wrote the title it started with undid the rename and brought the
			// old file back next to the renamed one (storage-inflight-edit)
			var fn = mxUtils.bind(this, function()
			{
				this.writeFile((current) ? this.getTitle() : title, success, error);
			});
		
			// Checks for trailing dots
			if (this.isRenamable() && title.charAt(0) == '.' && error != null)
			{
				error({message: mxResources.get('invalidName')});
			}
			else if (this instanceof StorageLibrary)
			{
				this.setShadowModified(false);
				fn(); // No need to check for conflicts with libraries			
			}
			else
			{
				// The version the bytes are based on: save and its retry take
				// them right before this call. A poll can merge another tab's
				// change, also while the stored copy is checked, which moves the
				// descriptor to the stored copy, but the bytes lack the change.
				// Writing them would drop it from the storage, so the save
				// starts again with new bytes (browser-tab-save-poll-race).
				// A rename writes the bytes of the last save or load, so that
				// unsaved edits stay unsaved. After a merge or a failed save
				// they are not those of the descriptor, and writing them would
				// drop the change, as the rename deletes the old file. It writes
				// the stored copy that the editor has merged in their place, and
				// is never retried, as a retry takes the bytes of the diagram in
				// the editor with its unsaved edits (browser-tab-rename-after-merge,
				// browser-tab-rename-unsaved-merge). Only a rename hashes its
				// bytes: a new file has the bytes of its template, which are not
				// those of the descriptor, and a retry would take the bytes of
				// the diagram in the editor (browser-tab-create-from-template).
				var etag = (lastBytes) ? this.getEtag(this.getData()) :
					this.getDescriptor();

				// Writes the stored copy for a rename. The file stays modified
				// if it was, also after a failed save, which took its edits
				// into the bytes but cleared the shadow of the modified state.
				var writeStored = mxUtils.bind(this, function(file)
				{
					if (file.getData() != null && file.getDescriptor() != etag)
					{
						if (this.isModified())
						{
							this.setShadowModified(true);
						}

						this.setData(file.getData());
					}

					fn();
				});

				// Checks the stored copy of the file, which has its title until
				// the write, and merges a change of another tab before the write
				var check = mxUtils.bind(this, function()
				{
					this.getLatestVersion(mxUtils.bind(this, function(file)
					{
						EditorUi.debug('StorageFile.saveFile', [this], 'title', title,
							'latestVersion', [file], 'descriptor', this.getDescriptor(),
							'latestVersionDescriptor', file.getDescriptor(),
							'bytesDescriptor', etag);

						if (file.getDescriptor() != this.getDescriptor() ||
							(!lastBytes && this.getDescriptor() != etag))
						{
							this.mergeFile(file, mxUtils.bind(this, function()
							{
								if (retry >= this.maxRetries ||
									this.invalidChecksum ||
									this.inConflictState)
								{
									this.setConflict();

									if (error != null)
									{
										error();
									}
								}
								else if (lastBytes)
								{
									writeStored(file);
								}
								else
								{
									this.retrySave(mxUtils.bind(this, function()
									{
										// Runs in a timeout, where an exception
										// would reach no one and the save would
										// never end
										try
										{
											this.updateFileData();
											this.setShadowModified(false);
											this.saveFile((current) ? this.getTitle() : title,
												revision, success, error, retry + 1, current);
										}
										catch (e)
										{
											if (error != null)
											{
												error(e);
											}
										}
									}));
								}
							}), error);
						}
						else if (lastBytes)
						{
							writeStored(file);
						}
						else
						{
							fn();
						}
					}), error);
				});

				StorageFile.getFileInfo(this.ui, title, mxUtils.bind(this, function(data)
				{
					EditorUi.debug('StorageFile.saveFile', [this], 'title', title,
						'data', data);

					if (!this.isRenamable() || this.getTitle() == title || data == null)
					{
						check();
					}
					else
					{
						// Replacing another file checks the stored copy too
						// (browser-tab-rename-replace-after-merge). A dismissal
						// (eg. Escape) runs neither button and ends the save
						// like Cancel. It closes the dialog before the buttons
						// run, so it waits for their answer.
						var answered = false;

						this.ui.confirm(mxResources.get('replaceIt', [title]), function()
						{
							answered = true;
							check();
						}, function()
						{
							answered = true;
							error.apply(null, arguments);
						}, null, null, null, function()
						{
							window.setTimeout(function()
							{
								if (!answered)
								{
									error();
								}
							}, 0);
						});
					}
				}), error);
			}
		}
	}
	catch (e)
	{
		// The caller gets the exception as before (DrawioFile.save passes
		// it to its error handler), so the save only ends here
		if (end != null)
		{
			end(null);
		}

		throw e;
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

			// Tells the other tabs that have the file open to check it
			if (this.type == 'F')
			{
				this.notifyWritten(this.getDescriptor());
			}

			// Notifies other tabs to refresh the scratchpad
			if (this.type == 'L' && this.title == '.scratchpad' &&
				this.ui.scratchpadSaved != null)
			{
				this.ui.scratchpadSaved();
			}

			this.fileSaved(data, desc, success, error);
		});
		
		// The shadow flag is cleared where the bytes are taken (save, its
		// retry, libraries), not here after the asynchronous check of the
		// stored copy: an edit made during the check is not in the bytes,
		// and a rename writes the bytes of the last save, so its unsaved
		// edits keep the file modified (storage-inflight-edit)
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
 * with the old title. Writes the bytes of the last save, so that unsaved
 * edits keep the file modified. Bytes that are not those of the descriptor,
 * eg. after a change of another tab was merged, are replaced with the stored
 * copy that the editor has merged, also when the rename replaces another
 * file (see saveFile).
 */
StorageFile.prototype.rename = function(title, success, error)
{
	var oldTitle = this.getTitle();

	if (oldTitle != title)
	{
		EditorUi.debug('StorageFile.rename', [this], 'oldTitle', oldTitle, 'newTitle', title);

		this.saveFile(title, false, mxUtils.bind(this, function()
		{
			// The delete of the old file ends once: its transaction calls the
			// error handler once for each of its deletes (files and
			// filesInfo) when it aborts, eg. after the first delete failed
			var ended = false;

			StorageFile.deleteFile(this.ui, oldTitle, mxUtils.bind(this, function()
			{
				if (!ended)
				{
					ended = true;
					this.ui.removeLocalData(oldTitle, success);
				}
			}), mxUtils.bind(this, function(e)
			{
				// The file is saved under the new title, so the rename took
				// effect and only the old copy is left: a message says so and
				// the rename completes after it, as the callers update the
				// file on success only (eg. the hash of a library in the
				// settings and its sidebar in saveLibrary, which closes the
				// library dialog after the message is closed)
				if (!ended)
				{
					ended = true;
					var done = false;

					this.ui.handleError(e, null, function()
					{
						if (!done)
						{
							done = true;

							if (success != null)
							{
								success();
							}
						}
					}, true);
				}
			}));
		}), error, null, null, true);
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
	ui.removeDatabaseItem([title, title], success, function(e)
	{
		if (ui.database == null) //fallback to localstorage
		{
			localStorage.removeItem(title)
			success();
		}
		else if (error != null)
		{
			// Passes on the error so that the failed delete is reported
			// (eg. after a rename has saved the new file). Transaction
			// errors are events with no message and a null error is taken
			// as a cancel by handleError (as in saveFile)
			error((e != null && e.message != null) ? e :
				{message: mxResources.get('errorDeletingFile')});
		}
	}, ['files', 'filesInfo']);
};
