// $Id = LocalFile.js,v 1.12 2010-01-02 09 =45 =14 gaudenz Exp $
// Copyright (c) 2006-2014, JGraph Holdings Ltd
/**
 * Constructs a new file on the local device with the given data and title.
 * Temporary files have no storage mode. The optional file handle and
 * descriptor are used with the File System Access API.
 */
LocalFile = function(ui, data, title, temp, fileHandle, desc, editable)
{
	DrawioFile.call(this, ui, data);
	
	this.title = title;
	this.mode = (temp) ? null : App.MODE_DEVICE;
	this.fileHandle = fileHandle;
	this.desc = desc;
	this.editable = editable;
};

//Extends mxEventSource
mxUtils.extend(LocalFile, DrawioFile);

/**
 * Returns true if the file has a valid file handle and autosave is enabled.
 */
LocalFile.prototype.isAutosave = function()
{
	return this.fileHandle != null && !this.invalidFileHandle && DrawioFile.prototype.isAutosave.apply(this, arguments);
};

/**
 * Specifies if the autosave checkbox should be shown in the document
 * properties dialog. Default is false.
 */
LocalFile.prototype.isAutosaveOptional = function()
{
	return this.fileHandle != null;
};

/**
 * Returns the storage mode of the file, which is null for temporary files.
 */
LocalFile.prototype.getMode = function()
{
	return this.mode;
};

/**
 * Returns the title of the file.
 */
LocalFile.prototype.getTitle = function()
{
	return this.title;
};

/**
 * Returns true since local files can be renamed.
 */
LocalFile.prototype.isRenamable = function()
{
	return true;
};

/**
 * Returns true if the file is editable and the editable flag is not false.
 */
LocalFile.prototype.isEditable = function()
{
	return DrawioFile.prototype.isEditable.apply(this, arguments) &&
		(this.editable == null || this.editable);
};

/**
 * Sets the editable flag of the file and fires a descriptorChanged event.
 */
LocalFile.prototype.setEditable = function(editable)
{
	this.editable = editable;
	this.descriptorChanged();
};

/**
 * Saves the file under its current title.
 */
LocalFile.prototype.save = function(revision, success, error, unloading, overwrite)
{
	this.saveAs(this.title, success, error, unloading, overwrite);
};

/**
 * Saves the file with the given title.
 */
LocalFile.prototype.saveAs = function(title, success, error, unloading, overwrite)
{
	this.saveFile(title, false, success, error, null, unloading, overwrite);
};

/**
 * Returns the descriptor of the file.
 */
LocalFile.prototype.getDescriptor = function()
{
	return this.desc;
};

/**
* Updates the descriptor of this file with the one from the given file.
*/
LocalFile.prototype.setDescriptor = function(desc)
{
	this.desc = desc;
};

/**
 * Loads the latest version of the file from its file handle. Invokes error
 * if the file has no file handle.
 */
LocalFile.prototype.getLatestVersion = function(success, error)
{
	if (this.fileHandle == null)
	{
		if (error != null)
		{
			error({message: mxResources.get('cannotOpenFile')});
		}
	}
	else
	{
		this.ui.loadFileSystemEntry(this.fileHandle, success, error);
	}
};

/**
 * Saves the file with the given title. If the file has a file handle, the
 * data is written to the local file unless it was changed on disk and
 * overwrite is false. Otherwise the file is downloaded. A new title drops
 * the file handle.
 */
LocalFile.prototype.saveFile = function(title, revision, success, error, useCurrentData, unloading, overwrite)
{
	if (title != this.title)
	{
		this.fileHandle = null;
		this.desc = null;
		this.editable = null;
	}

	this.title = title;

	// Updates data after changing file name, waits for the fonts to be
	// loaded into the local cache for saving SVG files with embedded
	// fonts and renders the PNG for binary files, keeps the synchronous
	// flow during page unload
	var generateData = mxUtils.bind(this, function(fn, fail)
	{
		var doGenerate = mxUtils.bind(this, function()
		{
			var binary = Editor.useCanvasForExport && /(\.png)$/i.test(this.getTitle());
			this.setShadowModified(false);
			var savedData = this.getData();

			if (binary)
			{
				var p = this.ui.getPngFileProperties(this.ui.fileNode);

				this.ui.getEmbeddedPng(mxUtils.bind(this, function(imageData)
				{
					fn(imageData, savedData, binary);
				}), fail, (this.ui.getCurrentFile() != this) ?
					savedData : null, p.scale, p.border);
			}
			else
			{
				fn(savedData, savedData, binary);
			}
		});

		if (!useCurrentData && !unloading)
		{
			this.loadFonts(mxUtils.bind(this, function()
			{
				this.updateFileData();
				doGenerate();
			}));
		}
		else
		{
			if (!useCurrentData)
			{
				this.updateFileData();
			}

			doGenerate();
		}
	});

	var done = mxUtils.bind(this, function()
	{
		this.setModified(this.getShadowModified());
		this.contentChanged();

		if (success != null)
		{
			success();
		}
	});

	if (this.fileHandle != null)
	{
		// Sets shadow modified state during save
		if (!this.savingFile)
		{
			this.savingFileTime = new Date();
			this.savingFile = true;

			var errorWrapper = mxUtils.bind(this, function(e, writable)
			{
				this.savingFile = false;

				// Discards the swap file for the aborted save
				if (writable != null)
				{
					writable.abort().then(function() { }, function() { });
				}

				if (error != null)
				{
					// Wraps error object to offer save status option
					error({error: e});
				}
			});

			// Creates the writable before the data is generated so that the
			// write permission prompt is shown while the transient user
			// activation of the event that triggered the save is valid, as
			// generating the data can take longer than the lifespan of the
			// user activation, in which case the prompt would be blocked
			this.fileHandle.createWritable().then(mxUtils.bind(this, function(writable)
			{
				generateData(mxUtils.bind(this, function(data, savedData, binary)
				{
					// Saves a copy as a draft while saving
					this.saveDraft(savedData);

					this.fileHandle.getFile().then(mxUtils.bind(this, function(newDesc)
					{
						this.invalidFileHandle = null;

						EditorUi.debug('LocalFile.saveFile', [this],
							'desc', [this.desc], 'newDesc', [newDesc],
							'conflict', this.desc.lastModified !=
								newDesc.lastModified);

						if (overwrite || this.desc.lastModified == newDesc.lastModified)
						{
							writable.write((binary) ? this.ui.base64ToBlob(data, 'image/png') : data).then(mxUtils.bind(this, function()
							{
								writable.close().then(mxUtils.bind(this, function()
								{
									this.fileHandle.getFile().then(mxUtils.bind(this, function(desc)
									{
										try
										{
											var lastDesc = this.desc;
											this.savingFile = false;
											this.desc = desc;
											this.fileSaved(savedData, lastDesc, done, errorWrapper);

											// Deletes draft after saving
											this.removeDraft();
										}
										catch (e)
										{
											errorWrapper(e);
										}
									}), errorWrapper);
								}), errorWrapper);
							}), mxUtils.bind(this, function(e)
							{
								errorWrapper(e, writable);
							}));
						}
						else
						{
							this.inConflictState = true;
							errorWrapper(null, writable);
						}
					}), mxUtils.bind(this, function(e)
					{
						this.invalidFileHandle = true;
						errorWrapper(e, writable);
					}));
				}), mxUtils.bind(this, function(e)
				{
					errorWrapper(e, writable);
				}));
			}), errorWrapper);
		}
		else if (error != null)
		{
			// The file is saved again when the current save operation
			// completes if it is still modified (see handleFileSuccess)
			error({code: App.ERROR_BUSY, message: mxResources.get('busy')});
		}
	}
	else
	{
		generateData(mxUtils.bind(this, function(data, savedData, binary)
		{
			if (this.ui.isOfflineApp() || this.ui.isLocalFileSave())
			{
				this.ui.doSaveLocalFile(data, title, (binary) ?
					'image/png' : 'text/xml', binary);
			}
			else
			{
				if (data.length < MAX_REQUEST_SIZE)
				{
					var dot = title.lastIndexOf('.');
					var format = (dot > 0) ? title.substring(dot + 1) : 'xml';

					// Do not update modified flag
					new mxXmlRequest(SAVE_URL, 'format=' + format +
						'&xml=' + encodeURIComponent(data) +
						'&filename=' + encodeURIComponent(title) +
						((binary) ? '&binary=1' : '')).
						simulate(document, '_blank');
				}
				else
				{
					this.ui.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'), mxUtils.bind(this, function()
					{
						mxUtils.popup(data);
					}));
				}
			}

			done();
		}), error);
	}
};

/**
 * Sets the title of the file and fires a descriptorChanged event.
 */
LocalFile.prototype.rename = function(title, success, error)
{
	this.title = title;
	this.descriptorChanged();
	
	if (success != null)
	{
		success();
	}
};
