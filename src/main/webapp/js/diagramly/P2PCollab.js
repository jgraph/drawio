function P2PCollab(ui)
{
    socket = io(App.SOCKET_IO_SRV);

	var svgP1 = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="684.000000pt" height="1024.000000pt" viewBox="0 0 684.000000 1024.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"  stroke="none" fill="';
	var svgP2 = '<path d="M0 5305 l0 -4940 568 567 c1170 1168 1637 1627 1644 1613 4 -7 242 -579 529 -1271 286 -693 523 -1262 527 -1266 4 -3 368 175 809 395 l802 402 -539 1294 c-297 712 -540 1296 -540 1298 0 2 682 3 1515 3 833 0 1515 3 1515 8 0 4 -1537 1544 -3415 3422 l-3415 3415 0 -4940z m3091 1175 l2604 -2599 -1304 -1 c-1236 0 -1303 -1 -1299 -17 3 -10 265 -641 582 -1402 318 -761 582 -1395 587 -1408 8 -22 -3 -29 -366 -210 -241 -121 -378 -184 -384 -178 -5 6 -262 622 -572 1370 -309 748 -564 1362 -566 1365 -2 2 -428 -420 -946 -938 -518 -518 -945 -942 -950 -942 -4 0 -7 1701 -7 3780 0 2224 4 3780 9 3780 5 0 1181 -1170 2612 -2600z"/></g></svg>';
	
	var graph = ui.editor.graph;
	var userCount = 0;
	var userColors = [
		'#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
		'#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', 
		'#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', 
		'#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', 
		'#000000'
	];
	var connectedUsers = {}, messageId = 1, clientLastMsgId = {};
	var myClientId, newClients = {}, p2pClients = {}, useSocket = true, fileJoined = false;

	function sendMessage(type, data)
	{
		var user = ui.getCurrentUser();

		if (!fileJoined || user == null || user.email == null) return;
		
		var msg = JSON.stringify({from: myClientId, id: messageId, type: type, 
								userId: user.id, username: user.displayName, data: data});
		messageId++;
		
		if (useSocket)
		{
			socket.emit('message', msg);
		}
		
		for (p2pId in p2pClients)
		{
			p2pClients[p2pId].send(msg);
		}
	};
	
	this.sendMessage = sendMessage;
	
	graph.addMouseListener(
	{
	    startX: 0,
	    startY: 0,
	    scrollLeft: 0,
	    scrollTop: 0,
	    mouseDown: function(sender, me) {},
	    mouseMove: function(sender, me)  //TODO debounce this function
		{
			var tr = graph.view.translate;
			var s = graph.view.scale;
			sendMessage('cursor', {x: me.graphX / s - tr.x, y: me.graphY / s - tr.y});
		},
	    mouseUp: function(sender, me) {}
	});

	function processMsg(msg) 
	{
		msg = JSON.parse(msg);
		
		//Safeguard from duplicate messages
		if (clientLastMsgId[msg.from] >= msg.id) return;
		
		clientLastMsgId[msg.from] = msg.id;
		var username = msg.username? msg.username : 'Anonymous';
		var userId = msg.userId;
		var cursor;
		
		if (connectedUsers[userId] == null)
		{
			var clr = userColors[userCount];
			
			connectedUsers[userId] = {
				cursor: document.createElement('div'),
				index: userCount,
				color: clr
			};
			
			userCount++;
			cursor = connectedUsers[userId].cursor;
			cursor.style.position = 'absolute';
			cursor.style.zIndex = 5000;
			var svg = 'data:image/svg+xml;base64,' + btoa(svgP1 + clr + '">' + svgP2);
			cursor.innerHTML = '<img src="' + svg + '" style="width:16px"><div style="color:' + clr + '">' +
					 username + '</div>';
			document.body.appendChild(cursor);
		}
		else
		{
			cursor = connectedUsers[userId].cursor;
		}
		
		var msgData = msg.data;
		
		switch (msg.type)
		{
			case 'cursor':
				var tr = graph.view.translate;
				var s = graph.view.scale;
				var container = ui.diagramContainer;
				var offset = mxUtils.getOffset(container);
		
				msgData.x = (tr.x + msgData.x) * s - container.scrollLeft + offset.x;
				msgData.y = (tr.y + msgData.y) * s - container.scrollTop + offset.y;
					
				cursor.style.left = msgData.x + 'px';
				cursor.style.top = msgData.y + 'px';
			break;
			case 'diff':
				var file = ui.getCurrentFile();
				
				if (file.sync != null)
				{
					file.sync.p2pCatchup(msgData.data, msgData.from, msgData.to, msgData.id, file.getDescriptor(), function()
					{
						console.log('Diff Synced');
					}, function()
					{
						console.log('Diff Error');
					});
				}
			break;
		}
	}
	
	socket.on('message', processMsg);
	
	function createPeer(id, initiator)
	{
		if (!SimplePeer.WEBRTC_SUPPORT)
		{
			return;	
		}
		
		var p = new SimplePeer({
	        initiator: initiator
	    });

		p.on('signal', function(data)
		{
			socket.emit('sendSignal', {to: id, from: myClientId, signal: data});
        });

		p.on('error', function(err) 
		{
			delete newClients[id];
			console.log('error', err); //TODO Handle errors
		});
		
		p.on('connect', function()
		{
			p2pClients[id] = p;
			delete newClients[id];
			
			if (Object.keys(newClients).length == 0)
			{
				useSocket = false;
				socket.emit('movedToP2P', '');
			}
	    });
		
		p.on('close', function()
		{
			delete p2pClients[id];
		});
		
		p.on('data', processMsg);

		newClients[id] = p;
		
		return p;
	};
	
	socket.on('clientsList', function(data) 
	{
		myClientId = data.cId;
		
		for (var i = 0; i < data.list.length; i++)
		{
			createPeer(data.list[i], true);
		}
	});
	
	socket.on('signal', function(data) 
	{
		var p;
		
		if (newClients[data.from])
		{
			p = newClients[data.from];	
		}
		else
		{
			p = createPeer(data.from, false);
			useSocket = true;
		}
		
		p.signal(data.signal);
	});
	
	socket.on('newClient', function(clientId) 
	{
		useSocket = true;
	});


	this.joinFile = function(channelId)
	{
		socket.emit('join', {name: channelId});
		fileJoined = true;	
	};
};
