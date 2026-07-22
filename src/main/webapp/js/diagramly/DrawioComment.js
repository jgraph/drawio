/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */

DrawioComment = function(file, id, content, modifiedDate, createdDate, isResolved, user)
{
	// The file having this comment 
	this.file = file;
	
	// Unique ID
	this.id = id;
	
	// Comment contents
	this.content = content;
	
	// Comment modified date
	this.modifiedDate = modifiedDate;
	
	// Comment created date
	this.createdDate = createdDate;
	
	// Is comment resolved
	this.isResolved = isResolved;
	
	// User created this comment
	// Type: DrawioUser
	this.user = user;

	// Optional anchor that attaches this comment to a part of the diagram.
	// Generic JSON object, currently {p: pageId, c: cellId} for comments on
	// shapes (later region types add their own fields). null for comments
	// on the file. Storage backends (de)serialize this in their subclasses.
	this.anchor = null;

	this.replies = [];
};

/**
 * Returns the ID of the page this comment is anchored to, or null.
 */
DrawioComment.prototype.getAnchorPageId = function()
{
	return (this.anchor != null) ? this.anchor.p : null;
};

/**
 * Returns the IDs of the cells this comment is anchored to as an array,
 * or null. A single ID is stored as a string, multiple IDs as an array.
 */
DrawioComment.prototype.getAnchorCellIds = function()
{
	var c = (this.anchor != null) ? this.anchor.c : null;

	return (c == null) ? null : ((c instanceof Array) ? c : [c]);
};

/**
 * Returns the ID of the (first) cell this comment is anchored to, or null.
 */
DrawioComment.prototype.getAnchorCellId = function()
{
	var ids = this.getAnchorCellIds();

	return (ids != null && ids.length > 0) ? ids[0] : null;
};

/**
 * Returns the rectangular region (in graph coordinates, {x, y, w, h})
 * this comment is anchored to, or null.
 */
DrawioComment.prototype.getAnchorRect = function()
{
	return (this.anchor != null) ? this.anchor.r : null;
};

/**
 * Returns the point (in graph coordinates, {x, y}) this comment is
 * anchored to, or null.
 */
DrawioComment.prototype.getAnchorPoint = function()
{
	return (this.anchor != null) ? this.anchor.pt : null;
};

DrawioComment.prototype.addReplyDirect = function(reply)
{
	if (reply != null)
		this.replies.push(reply);
};

DrawioComment.prototype.addReply = function(reply, success, error, doResolve, doReopen)
{
	//Placeholder
	success();
};

DrawioComment.prototype.editComment = function(newContent, success, error)
{
	//Placeholder
	success();
};

DrawioComment.prototype.deleteComment = function(success, error)
{
	//Placeholder
	success();
};
