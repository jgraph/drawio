/*
 * $Id: ChatWindow.js,v 1.13 2013/12/13 12:53:01 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
function ChatWindow(editorUi, title, content, x, y, width, height, realtime)
{
	this.editorUi = editorUi;
	this.doc = realtime.doc;
	this.rtModel = realtime.rt;
	this.chatHistory = realtime.chatHistory;

	// Supports old chat map if it exists
	this.chatMap = realtime.chatMap;

	this.configCollabInfo();

	var mainDiv = document.createElement('div');
	mainDiv.id = 'mainDiv';
	var chatDiv = document.createElement('div');
	chatDiv.style.padding = '3px';
	mainDiv.appendChild(chatDiv);
	var chatLineDiv = document.createElement('div');
	chatLineDiv.style.paddingLeft = '3px';
	chatLineDiv.style.paddingRight = '15px';
	
	if (editorUi.editor.graph.isEnabled())
	{
		mainDiv.appendChild(chatLineDiv);
	}

	this.chatArea = document.createElement('div');
	this.chatArea.style.backgroundColor = 'white';

	this.chatArea.style.overflowX = 'hidden';
	this.chatArea.style.overflowY = 'auto';
	this.chatArea.style.width = '98%';
	this.chatArea.style.resize = 'none';
	chatDiv.appendChild(this.chatArea);

	this.chatLineArea = document.createElement('textarea');
	this.chatLineArea.style.resize = 'none';
	this.chatLineArea.rows = 1;
	this.chatLineArea.onkeydown = mxUtils.bind(this, function(evt)
	{
		var key = evt.keyCode || window.event.keyCode;
		if (key == 13 && this.chatLineArea.value != '')
		{
			this.sendMessage();
		}
	});
	
	this.sendBtn = document.createElement('button');
	this.sendBtn.style.cssFloat = 'right';
	this.sendBtn.style.styleFloat = 'right';
	mxUtils.write(this.sendBtn, mxResources.get('sendMessage'));
	mxEvent.addListener(this.sendBtn, 'click', mxUtils.bind(this, function(evt)
	{
		if (this.chatLineArea.value != '')
		{
			this.sendMessage();
		}
	}));
	chatLineDiv.appendChild(this.chatLineArea);
	chatLineDiv.appendChild(this.sendBtn);

	this.window = new mxWindow(title, mainDiv, x, y, width, height, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(true);
	this.window.setScrollable(true);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);

	this.handleResize();

	this.window.addListener(mxEvent.RESIZE, mxUtils.bind(this, this.handleResize));
	this.window.addListener(mxEvent.MAXIMIZE, mxUtils.bind(this, this.handleResize));
	this.window.addListener(mxEvent.NORMALIZE, mxUtils.bind(this, this.handleResize));

	if (this.chatHistory != null)
	{
		for (var i = Math.max(0, this.chatHistory.length - this.chatHistoryShow); i < this.chatHistory.length; i++)
		{
			this.updateChatArea(this.chatHistory.get(i));
		}
		
		this.chatHistory.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, mxUtils.bind(this, function(evt)
		{
			this.updateChatArea(evt.target.get(evt.index))
		}));
	}
	
	this.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, mxUtils.bind(this, this.collaboratorListener));
	this.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, mxUtils.bind(this, this.collaboratorListener));

	if (this.chatMap != null)
	{
		this.chatMap.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, mxUtils.bind(this, function(evt)
		{
			var map = evt.target;
			this.updateChatArea(map.get(evt.property));
		}));
	}
};

ChatWindow.prototype.window = null;
ChatWindow.prototype.doc = null;

ChatWindow.prototype.chatHistory = null;

ChatWindow.prototype.chatMap = null;

// Shows the last n entries from the chat history on startup
ChatWindow.prototype.chatHistoryShow = 10;

// 0 means keep history forever
ChatWindow.prototype.chatHistorySize = 0;

ChatWindow.prototype.setChatMap = function(chatMap)
{
	this.chatMap = chatMap;
};

ChatWindow.prototype.sendMessage = function()
{
	try
	{
		var msgObj = {timestamp: new Date().getTime(), collaboratorColor : this.collabColor, collaboratorName : this.displayName, text : this.chatLineArea.value, version : 1};
		this.chatHistory.push(msgObj);
	
		this.chatLineArea.value = '';
		//this.chatLineArea.selectionStart = 0;
	}
	catch (e)
	{
		this.editorUi.handleError(e);
	}
};

ChatWindow.prototype.updateChatArea = function(newMsgObj)
{	
	var headingElt = '<span style="color : ' + newMsgObj.collaboratorColor + ';">&#x25BA;</span>' + '<b>' + newMsgObj.collaboratorName + '</b>' + ': ';
	var newChatLine = headingElt + this.htmlEscape(newMsgObj.text) + '<br>';
	
	this.chatArea.innerHTML += newChatLine;
	this.chatArea.scrollTop = this.chatArea.scrollHeight;
};

ChatWindow.prototype.handleResize = function()
{
	var elt = this.window.getElement();
	var dy = (this.editorUi.editor.graph.isEnabled()) ? 70 : 40;
	this.chatArea.style.height = Math.max(0, elt.offsetHeight - dy) + 'px';
	this.chatLineArea.style.width = (elt.offsetWidth - this.sendBtn.offsetWidth - 40) + 'px';
};

ChatWindow.prototype.collaboratorListener = function(evt)
{
	var msg = null;

	if (evt.collaborator.isMe) 
	{
		return;
	}
	
	if (evt.type == gapi.drive.realtime.EventType.COLLABORATOR_JOINED)
	{
		msg = '<span style="color : ' + evt.collaborator.color + ';">&#x25B2</span>' + '<i>' + mxResources.get('chatJoined', [evt.collaborator.displayName]) + '</i>';
	}
	else if (evt.type == gapi.drive.realtime.EventType.COLLABORATOR_LEFT)
	{
		msg = '<span style="color : ' + evt.collaborator.color + ';">&#x25BC</span>' + '<i>' + mxResources.get('chatLeft', [evt.collaborator.displayName]) + '</i>';
	}
	else
	{
		return;
	}

	this.chatArea.innerHTML = this.chatArea.innerHTML + msg + '<br>';
	this.chatArea.scrollTop = this.chatArea.scrollHeight;
};

ChatWindow.prototype.configCollabInfo = function()
{
	var collaboratorsList = this.doc.getCollaborators();
	
	for ( var i = 0; i < collaboratorsList.length; i++)
	{
		var collaborator = collaboratorsList[i];
		
		if (collaborator.isMe)
		{
			this.collabColor = collaborator.color;
			this.displayName = collaborator.displayName;
		}
	}
};

ChatWindow.prototype.destroy = function() 
{
	this.window.destroy();
};

ChatWindow.prototype.htmlEscape = function(string) 
{
	return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
