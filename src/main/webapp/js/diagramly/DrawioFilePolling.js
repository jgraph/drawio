/**
 * Copyright (c) 2006-2024, draw.io AG
 * Copyright (c) 2006-2024, JGraph Ltd
 * 
 * Class for polling files for changes.
 */
DrawioFilePolling = function(file, sync)
{
    this.file = file;
    this.sync = sync;

};

/**
 * Maximum number if attempts to poll after an error.
 */
DrawioFilePolling.prototype.maxRetries = 2;

/**
 * Starts the polling with the given delay.
 */
DrawioFilePolling.prototype.start = function(delay)
{
    if (!this.isConnected())
    {
        this.thread = setInterval(mxUtils.bind(this, function()
        {
            this.poll();
        }), delay);

        EditorUi.debug('DrawioFilePolling.start', [this],
            'thread', this.thread, 'delay', delay,
            'rev', this.file.getCurrentRevisionId());
    }
};

/**
 * Checks if the file has been modified.
 */
DrawioFilePolling.prototype.updateStatus = function()
{
    this.sync.lastModified = this.file.getLastModifiedDate();
    this.sync.updateStatus();
};

/**
 * Checks if the file has been modified.
 */
DrawioFilePolling.prototype.poll = function(retry)
{
    retry = (retry != null) ? retry : 0;

    var handleError = mxUtils.bind(this, function(e)
    {
        if (retry < this.maxRetries)
        {
            this.retryPoll(mxUtils.bind(this, function()
            {
                this.poll(retry + 1);
            }));
        }
    });

    this.file.getLatestVersionId(mxUtils.bind(this, function(latestVersionId)
    {
        if (latestVersionId != -1)
        {
            var currentVersionId = this.file.getCurrentRevisionId();

            if (latestVersionId != currentVersionId)
            {
                this.file.getLatestVersion(mxUtils.bind(this, function(latestFile)
                {
                    this.file.mergeFile(latestFile, mxUtils.bind(this, function()
                    {
                        this.updateStatus();
                    }), handleError);
                }), handleError);
            }
            else
            {
                this.updateStatus();
            }
        }
        
    }), handleError);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFilePolling.prototype.retryPoll = function(fn)
{
	var delay = 300 + Math.random() * 300;
	window.setTimeout(fn, delay);
	
	EditorUi.debug('StorageFile.retryPoll', [this], 'delay', delay);
};

/**
 * Stops the polling.
 */
DrawioFilePolling.prototype.stop = function()
{
    EditorUi.debug('DrawioFilePolling.stop',
        [this], 'thread', this.thread);
    
    clearInterval(this.thread);
    this.thread = null;
};

/**
 * Returns true if polling is active.
 */
DrawioFilePolling.prototype.isConnected = function()
{
    return this.thread != null;
};
