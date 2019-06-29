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
		body.verb = 'resolve';
	} 
	else if (doReopen) 
	{
		body.verb = 'reopen';
	}
	
	this.file.ui.drive.executeRequest(gapi.client.drive.replies.insert(
		{
			'fileId': this.file.getId(),
			'commentId': this.id,
			'resource': body
		}),
		mxUtils.bind(this, function(resp)
		{
			success(resp.replyId); //pass comment id
		}), error);
};

DriveComment.prototype.editComment = function(newContent, success, error)
{
	this.content = newContent;
	var body = {'content': newContent};
	 
	this.file.ui.drive.executeRequest(
		this.pCommentId?
		gapi.client.drive.replies.patch({
			'fileId': this.file.getId(),
			'commentId': this.pCommentId,
			'replyId': this.id,
			'resource': body
		}) :
		gapi.client.drive.comments.patch({
			'fileId': this.file.getId(),
			'commentId': this.id,
			'resource': body
		}),
	success, error);
};

DriveComment.prototype.deleteComment = function(success, error)
{
	this.file.ui.drive.executeRequest(
		this.pCommentId?
		gapi.client.drive.replies.delete({
			'fileId': this.file.getId(),
			'commentId': this.pCommentId,
			'replyId': this.id
		}):
		gapi.client.drive.comments.delete({
			'fileId': this.file.getId(),
			'commentId': this.id
		}),
	success, error);
};
