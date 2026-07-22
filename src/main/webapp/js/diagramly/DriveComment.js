/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
DriveComment = function(file, id, content, modifiedDate, createdDate, isResolved, user, pCommentId)
{
	DrawioComment.call(this, file, id, content, modifiedDate, createdDate, isResolved, user);
	this.pCommentId = pCommentId; //a reply
};

//Extends DrawioComment
mxUtils.extend(DriveComment, DrawioComment);

DriveComment.prototype.addReply = function(reply, success, error, doResolve, doReopen)
{
	var body = {'content': reply.content};

	if (doResolve)
	{
		body.action = 'resolve';
	}
	else if (doReopen)
	{
		body.action = 'reopen';
	}

	this.file.ui.drive.executeRequest(
		{
			fullUrl: this.file.getCommentUrl('/' + this.id + '/replies', 'id'),
			params: body,
			method: 'POST'
		},
		mxUtils.bind(this, function(resp)
		{
			success(resp.id); //pass reply id
		}), error);
};

DriveComment.prototype.editComment = function(newContent, success, error)
{
	this.content = newContent;
	var body = {'content': newContent};

	this.file.ui.drive.executeRequest(
		{
			fullUrl: this.pCommentId ?
				this.file.getCommentUrl('/' + this.pCommentId + '/replies/' + this.id, 'id') :
				this.file.getCommentUrl('/' + this.id, 'id'),
			params: body,
			method: 'PATCH'
		},
	success, error);
};

DriveComment.prototype.deleteComment = function(success, error)
{
	this.file.ui.drive.executeRequest(
		{
			fullUrl: this.file.getCommentUrl((this.pCommentId ?
				'/' + this.pCommentId + '/replies' : '') + '/' + this.id),
			method: 'DELETE'
		},
	success, error);
};
