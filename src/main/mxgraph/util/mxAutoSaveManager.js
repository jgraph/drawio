/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxAutoSaveManager
 * 
 * Manager for automatically saving diagrams. The <save> hook must be
 * implemented.
 * 
 * Example:
 * 
 * (code)
 * var mgr = new mxAutoSaveManager(editor.graph);
 * mgr.save = function()
 * {
 *   mxLog.show();
 *   mxLog.debug('save');
 * };
 * (end)
 * 
 * Constructor: mxAutoSaveManager
 *
 * Constructs a new automatic layout for the given graph.
 *
 * Arguments:
 * 
 * graph - Reference to the enclosing graph. 
 */
function mxAutoSaveManager(graph)
{
	// Notifies the manager of a change
	this.changeHandler = mxUtils.bind(this, function(sender, evt)
	{
		if (this.isEnabled())
		{
			this.graphModelChanged(evt.getProperty('edit').changes);
		}
	});

	this.setGraph(graph);
};

/**
 * Extends mxEventSource.
 */
mxAutoSaveManager.prototype = new mxEventSource();
mxAutoSaveManager.prototype.constructor = mxAutoSaveManager;

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxAutoSaveManager.prototype.graph = null;

/**
 * Variable: autoSaveDelay
 * 
 * Minimum amount of seconds between two consecutive autosaves. Eg. a
 * value of 1 (s) means the graph is not stored more than once per second.
 * Default is 10.
 */
mxAutoSaveManager.prototype.autoSaveDelay = 10;

/**
 * Variable: autoSaveThrottle
 * 
 * Minimum amount of seconds between two consecutive autosaves triggered by
 * more than <autoSaveThreshhold> changes within a timespan of less than
 * <autoSaveDelay> seconds. Eg. a value of 1 (s) means the graph is not
 * stored more than once per second even if there are more than
 * <autoSaveThreshold> changes within that timespan. Default is 2.
 */
mxAutoSaveManager.prototype.autoSaveThrottle = 2;

/**
 * Variable: autoSaveThreshold
 * 
 * Minimum amount of ignored changes before an autosave. Eg. a value of 2
 * means after 2 change of the graph model the autosave will trigger if the
 * condition below is true. Default is 5.
 */
mxAutoSaveManager.prototype.autoSaveThreshold = 5;

/**
 * Variable: ignoredChanges
 * 
 * Counter for ignored changes in autosave.
 */
mxAutoSaveManager.prototype.ignoredChanges = 0;

/**
 * Variable: lastSnapshot
 * 
 * Used for autosaving. See <autosave>.
 */
mxAutoSaveManager.prototype.lastSnapshot = 0;

/**
 * Variable: enabled
 * 
 * Specifies if event handling is enabled. Default is true.
 */
mxAutoSaveManager.prototype.enabled = true;

/**
 * Variable: changeHandler
 * 
 * Holds the function that handles graph model changes.
 */
mxAutoSaveManager.prototype.changeHandler = null;

/**
 * Function: isEnabled
 * 
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
mxAutoSaveManager.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Function: setEnabled
 * 
 * Enables or disables event handling. This implementation
 * updates <enabled>.
 * 
 * Parameters:
 * 
 * enabled - Boolean that specifies the new enabled state.
 */
mxAutoSaveManager.prototype.setEnabled = function(value)
{
	this.enabled = value;
};

/**
 * Function: setGraph
 * 
 * Sets the graph that the layouts operate on.
 */
mxAutoSaveManager.prototype.setGraph = function(graph)
{
	if (this.graph != null)
	{
		this.graph.getModel().removeListener(this.changeHandler);
	}
	
	this.graph = graph;
	
	if (this.graph != null)
	{
		this.graph.getModel().addListener(mxEvent.CHANGE, this.changeHandler);
	}
};

/**
 * Function: save
 * 
 * Empty hook that is called if the graph should be saved.
 */
mxAutoSaveManager.prototype.save = function()
{
	// empty
};

/**
 * Function: graphModelChanged
 * 
 * Invoked when the graph model has changed.
 */
mxAutoSaveManager.prototype.graphModelChanged = function(changes)
{
	var now = new Date().getTime();
	var dt = (now - this.lastSnapshot) / 1000;
	
	if (dt > this.autoSaveDelay ||
		(this.ignoredChanges >= this.autoSaveThreshold &&
		 dt > this.autoSaveThrottle))
	{
		this.save();
		this.reset();
	}
	else
	{
		// Increments the number of ignored changes
		this.ignoredChanges++;
	}
};

/**
 * Function: reset
 * 
 * Resets all counters.
 */
mxAutoSaveManager.prototype.reset = function()
{
	this.lastSnapshot = new Date().getTime();
	this.ignoredChanges = 0;
};

/**
 * Function: destroy
 * 
 * Removes all handlers from the <graph> and deletes the reference to it.
 */
mxAutoSaveManager.prototype.destroy = function()
{
	this.setGraph(null);
};
