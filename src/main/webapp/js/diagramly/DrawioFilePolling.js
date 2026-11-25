/**
 * Copyright (c) 2006-2024, draw.io AG
 * Copyright (c) 2006-2024, JGraph Holdings Ltd
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
 * The minimum delay between polls for adaptive polling.
 */
DrawioFilePolling.prototype.minPollDelay = 2000;

/**
 * Starts the polling with the given delay.
 */
DrawioFilePolling.prototype.start = function(delay)
{
    if (!this.isConnected())
    {
        this.maxDelay = delay;
        this.delay = delay;
        this.thread = setTimeout(mxUtils.bind(this, this.run), this.nextDelay());

        EditorUi.debug('DrawioFilePolling.start', [this],
            'thread', this.thread, 'delay', delay,
            'rev', this.file.getCurrentRevisionId());
    }
};

/**
 * Returns the delay for the next poll and increases it for the poll after
 * that, up to the delay of start. A detected change resets it (see poll).
 */
DrawioFilePolling.prototype.nextDelay = function()
{
    var delay = this.delay;
    this.delay = Math.min(this.maxDelay, this.delay + 2000); // TODO this or this.delay * 2

    return delay;
};

/**
 * Runs a poll and schedules the next one when it is done. A poll that is
 * asked for while one is in progress runs right after it, as the poll in
 * progress may have read the file before the change.
 */
DrawioFilePolling.prototype.run = function()
{
    if (this.pending)
    {
        this.pollAgain = true;
    }
    else if (this.isConnected())
    {
        this.pending = true;
        this.pollAgain = false;

        this.poll(0, mxUtils.bind(this, function()
        {
            this.pending = false;

            if (this.pollAgain)
            {
                this.run();
            }
            // To get adaptive polling, we use timeout instead of interval.
            // Nothing is scheduled after stop.
            else if (this.isConnected())
            {
                clearTimeout(this.thread);
                this.thread = setTimeout(mxUtils.bind(this, this.run), this.nextDelay());
            }
        }));
    }
};

/**
 * Polls at once instead of waiting for the next poll, eg. when the window
 * is shown or another tab wrote the file. Does nothing if the polling is
 * not active.
 */
DrawioFilePolling.prototype.pollNow = function()
{
    if (this.isConnected())
    {
        EditorUi.debug('DrawioFilePolling.pollNow', [this],
            'pending', this.pending);

        if (!this.pending)
        {
            clearTimeout(this.thread);
        }

        this.run();
    }
};

/**
 * Checks if the file has been modified.
 */
DrawioFilePolling.prototype.updateStatus = function()
{
    if (this.hasOtherWriters())
    {
        this.sync.lastMessage = mxResources.get('otherUsersEditing');
    }

    this.sync.lastModified = this.file.getLastModifiedDate();
    this.sync.updateStatus();
};

/**
 * Checks if the file has been modified.
 */
DrawioFilePolling.prototype.poll = function(retry, nextFn)
{
    retry = (retry != null) ? retry : 0;

    // Retries nothing after stop, also if it stops during the delay of
    // the retry: the retry would read the file before it checks
    var handleError = mxUtils.bind(this, function(e)
    {
        if (retry < this.maxRetries && this.isConnected())
        {
            this.retryPoll(mxUtils.bind(this, function()
            {
                if (this.isConnected())
                {
                    this.poll(retry + 1, nextFn);
                }
                else
                {
                    nextFn();
                }
            }));
        }
        else
        {
            nextFn();
        }
    });

    this.file.getLatestVersionId(mxUtils.bind(this, function(latestVersionId)
    {
        // Merges nothing after stop, eg. into a file that was closed
        if (latestVersionId != -1 && this.isConnected())
        {
            var currentVersionId = this.file.getCurrentRevisionId();

            if (latestVersionId != currentVersionId)
            {
                this.file.getLatestVersion(mxUtils.bind(this, function(latestFile)
                {
                    if (!this.isConnected())
                    {
                        nextFn();

                        return;
                    }

                    this.file.mergeFile(latestFile, mxUtils.bind(this, function()
                    {
                        // An update is detected, so start adaptive polling
                        this.delay = this.minPollDelay;
                        this.lastOtherWriter = Date.now();
                        this.updateStatus();
                        nextFn();
                    }), handleError);
                }), handleError);
            }
            else
            {
                this.updateStatus();
                nextFn();
            }
        }
        else
        {
            nextFn();
        }
        
    }), handleError);
};

/**
 * Invokes the given function after a random delay of 300 to 600 ms.
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
    
    clearTimeout(this.thread);
    this.thread = null;
    this.pollAgain = false;
};

/**
 * Returns true if polling is active.
 */
DrawioFilePolling.prototype.isConnected = function()
{
    return this.thread != null;
};

DrawioFilePolling.prototype.hasOtherWriters = function()
{
    return this.lastOtherWriter != null && Date.now() - this.lastOtherWriter < 60 * 1000; // Other writer detected in the last minute
};
