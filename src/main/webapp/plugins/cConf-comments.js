/**
 * Plugin for comments in embed mode in Confluence Connect post version 1.4.8
 */
Draw.loadPlugin(function(ui)
{
	var RESOLVED_MARKER = '$$RES$$ ';
	var REPLY_MARKER = '$$REP$$';
	var REPLY_MARKER_END = '$$ ';
	var DELETED_MARKER = '$$DELETED$$';
	
	var confUser = null;
	var confComments = null;
	var commentsVer = null;

	// Returns modified macro data to client
	var uiCreateLoadMessage = ui.createLoadMessage;
	
	ui.createLoadMessage = function(eventName)
	{
		var msg = uiCreateLoadMessage.apply(this, arguments);
		
		if (eventName == 'export')
		{
			msg.comments = confComments;
		}

		return msg;
	};

	function setModified()
	{
		ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('unsavedChanges')));
		ui.editor.setModified(true);	
	};
	
	var origRemoteInvoke = ui.remoteInvoke;
	
	ui.remoteInvoke = function()
	{
		if (typeof AC !== 'undefined')
		{
			var fnName = arguments[0];
			var fnArgs = arguments[1] || [];
			fnArgs.push(arguments[arguments.length - 2]);
			fnArgs.push(arguments[arguments.length - 1]);
			AC[fnName].apply(AC, fnArgs);
		}
		else
		{
			origRemoteInvoke.apply(ui, arguments);
		}
	};
	
	ui.getCurrentUser = function()
	{
		if (confUser == null)
		{
			ui.remoteInvoke('getCurrentUser', null, null, function(user)
			{
				confUser = new DrawioUser(user.id, user.email, user.displayName, user.pictureUrl);
			}, function()
			{
				//ignore such that next call we retry
			});
			
			//Return a dummy user until we have the actual user in order for UI to be populated
			return new DrawioUser(Date.now(), null, 'Anonymous');
		}
		
		return confUser;
	};
	
	
	ui.commentsSupported = function()
	{
		return true;
	};
	
	//Will limit ability to reply on replies to simplify retrieval in version 2
	ui.canReplyToReplies = function()
	{
		return commentsVer == 1;
	};
	
	ui.commentsRefreshNeeded = function()
	{
		return commentsVer != 1; //Refresh is needed for new format or if pre-fetch is not finished yet
	};
	
	function confOldCommentToDrawio(cComment, pCommentId)
 	{
        if (cComment.isDeleted) return null; //skip deleted comments
        
		var comment = new DrawioComment(null, cComment.id, cComment.content, 
						cComment.modifiedDate, cComment.createdDate, cComment.isResolved,
						new DrawioUser(cComment.user.id, cComment.user.email,
						cComment.user.displayName, cComment.user.pictureUrl), pCommentId);
		
		for (var i = 0; cComment.replies != null && i < cComment.replies.length; i++)
		{
			comment.addReplyDirect(confOldCommentToDrawio(cComment.replies[i], cComment.id));
		}
		
		return comment;
	};

	function confCommentToDrawio(atlasComment, parentId, siteUrl)
	{
		var user = atlasComment.history.createdBy;
		var comment = new DrawioComment({attVer: atlasComment.attVer, ui: ui}, atlasComment.id, 
				decodeURIComponent(atlasComment.body.storage.value), 
				atlasComment.version.when, atlasComment.history.createdDate, false,
				new DrawioUser(user.accountId, user.username,
						user.displayName, siteUrl + user.profilePicture.path));
		comment.parentId = parentId;
		comment.version = atlasComment.version.number;
		
		if (comment.content == DELETED_MARKER)
		{
			comment.content = mxResources.get('msgDeleted');
			comment.isLocked = true;
		}

		var replies = atlasComment.children != null ? atlasComment.children.comment.results : [];
		
		for (var i = 0; i < replies.length; i++)
		{
			var reply = confCommentToDrawio(replies[i], atlasComment.id, siteUrl);
    		comment.addReplyDirect(reply);
    		
    		var isResolvedReply = reply.content.indexOf(RESOLVED_MARKER) == 0;
    		
    		if (isResolvedReply)
			{
    			reply.content = reply.content.substr(RESOLVED_MARKER.length);
    			comment.isResolved = i == (replies.length - 1);
			}
		}
		
		return comment;
	};
	
	//TODO Improve this requirement if possible
	//This function must be called before any interaction with comments
	//Prefetch comments (for new diagrams, this sets comments version to 2)
	ui.initComments = function(contentId, success, error)
	{
		if (confComments == null)
		{
			ui.remoteInvoke('getOldComments', [contentId], null, function(comments, spaceKey, pageId, pageType, contentVer)
			{
				confComments = [];

				for (var i = 0; i < comments.length; i++)
				{
					var comment = confOldCommentToDrawio(comments[i]);
					
					if (comment != null) confComments.push(comment);
				}
				
				//If we have no old comments, switch to the new comments format
				commentsVer = confComments.length == 0? 2 : 1;
				
				if (success)
				{
					success(spaceKey, pageId, pageType, contentVer);
				}
			}, function()
			{
				if (error)
				{
					error();
				}
			});
		}
		else if (success)
		{
			success(confComments);
		}
	};
	
	ui.getComments = function(success, error)
	{
		if (commentsVer == null)
		{
			error(); //User can refresh to retry, we don't have content id here to get the old comments
		}
		else if (commentsVer == 1)
		{
			success(confComments);
		}
		else
		{
			ui.remoteInvoke('getComments', [null, false], null, function(comments, siteUrl)
			{
				var conComments = [];
				
				//First pass to convert replies to old comments to regular replies
				var commentsMap = {};
				var oldVerReplies = [];
				var origComments = [];
				
				for (var i = 0; i < comments.length; i++)
				{
					var cnt = decodeURIComponent(comments[i].body.storage.value);
					
					if (cnt.indexOf(REPLY_MARKER) == 0)
					{
						var end = cnt.indexOf(REPLY_MARKER_END, REPLY_MARKER.length);
						var parentId = cnt.substring(REPLY_MARKER.length, end);
						comments[i].body.storage.value = cnt.substring(REPLY_MARKER_END.length + end);
						oldVerReplies.push({parentId: parentId, reply: comments[i]});
					}
					else
					{
						commentsMap[comments[i].id] = comments[i];
						origComments.push(comments[i]);
					}
				}
	
				for (var i = 0; i < oldVerReplies.length; i++)
				{
					var pComment = commentsMap[oldVerReplies[i].parentId];
					
					if (pComment != null)
					{
						if (pComment.children == null) 
						{
							pComment.children = {comment: {results: []}};	
						}
						
						pComment.children.comment.results.push(oldVerReplies[i].reply);
					}
				}
				
				for (var i = 0; i < origComments.length; i++)
				{
					conComments.push(confCommentToDrawio(origComments[i], null, siteUrl));
				}
				
				success(conComments);
			}, error);
		}
	};

	ui.addComment = function(comment, success, error)
	{
		if (commentsVer == null || !comment.content)
		{
			error();
		}
		else if (commentsVer == 2)
		{
			ui.remoteInvoke('addComment', [comment.content], null, function(id, version, attVer)
			{
				comment.version = version;
				comment.file.attVer = attVer;
	        	success(id);
			}, error);
		}
		else
		{
			comment.id = confUser.id + ':' + Date.now();

			if (ui.saveComments != null)
			{
				var tmpComments = JSON.parse(JSON.stringify(confComments));
				tmpComments.push(comment);
					
				ui.saveComments(tmpComments, function()
				{
					success(comment.id);
				}, error);
			}
			else
			{
				setModified();
				success(comment.id);
			}
		}
	};
			
	ui.newComment = function(content, user)
	{
		return new DrawioComment(commentsVer == 2? {ui: ui} : null, null, //remove file information for old format 
				content, Date.now(), Date.now(), false, user); 
	};
	
	DrawioComment.prototype.addReply = function(reply, success, error, doResolve, doReopen)
	{
		if (commentsVer == null || !reply.content)
		{
			error();
		}
		else if (commentsVer == 2)
		{
			ui.remoteInvoke('addCommentReply', [this.id, this.file.attVer, reply.content, doResolve], null, function(id, version)
			{
				reply.version = version;
	        	success(id);
			}, error);
		}
		else
		{
			if (ui.saveComments != null)
			{
				reply.id = confUser.id + ':' + Date.now();
				this.replies.push(reply);
				var isResolved = this.isResolved;
				
				if (doResolve)
				{
					this.isResolved = true;
				}
				else if (doReopen)
				{
					this.isResolved = false;
				}
				
				var tmpComments = JSON.parse(JSON.stringify(confComments));
				this.replies.pop(); //Undo in case more changes are done before getting the reply
				this.isResolved = isResolved;
				
				ui.saveComments(tmpComments, function()
				{
					success(reply.id);
				}, error);
			}
			else
			{
				setModified();
				success();
			}
		}
	};

	DrawioComment.prototype.editComment = function(newContent, success, error)
	{
		if (commentsVer == null)
		{
			error();
		}
		else if (commentsVer == 2)
		{
			var _this = this;
			
			ui.remoteInvoke('editComment', [this.id, this.version, newContent], null, function(version)
			{
				_this.version = version;
	        	success();
			}, error);
		}
		else
		{
			if (ui.saveComments != null)
			{
				var oldContent = this.content;
				this.content = newContent;
				var tmpComments = JSON.parse(JSON.stringify(confComments));
				this.content = oldContent;
				
				ui.saveComments(tmpComments, success, error);
			}
			else
			{
				setModified();
				success();
			}
		}
	};

	DrawioComment.prototype.deleteComment = function(success, error)
	{
		if (commentsVer == null)
		{
			error();
		}
		else if (commentsVer == 2)
		{
			ui.remoteInvoke('deleteComment', [this.id, this.version, this.replies != null && this.replies.length > 0], null, success, error);
		}
		else
		{
			if (ui.saveComments != null)
			{
				var that = this;
				this.isDeleted = true; //Mark as deleted since searching for this comment in the entire structure is complex. It will be cleaned in next save
				var tmpComments = JSON.parse(JSON.stringify(confComments));
				
				ui.saveComments(tmpComments, success, function(err) 
				{
					that.isDeleted = false;
					error(err);
				});
			}
			else
			{
				setModified();
				success();
			}
		}
	};
	
	//Prefetch current user 
	ui.getCurrentUser();
});
