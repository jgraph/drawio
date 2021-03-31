const
    {Server} = require('socket.io'),
    io = new Server(3030, {
	  cors: {
	    origin: function (origin, callback) 
		{
			if (/\.draw\.io$/.test(origin) || /\.diagrams\.io$/.test(origin))
			{
				callback(null, true); // allow all draw.io domains
			}
            else
			{
                callback(new Error('Now allowed')); // block others
            }
        }
	  }
    });

const SOCKET = '_socket', P2P = '_p2p';
let rooms = {}

io.on('connection', function (socket) 
{
  //TODO Review P2P and SOCKET rooms transitions and interaction
  let room = null, isP2P = false;

  function leaveRoom()
  {
	if (!room) return;

	room.clientCount--;
	socket.leave(room.name + (isP2P? P2P : SOCKET));
	
	if (room.clientCount == 0)
	{
		delete rooms[room.name];
	}	
	else
	{
		if (isP2P)
		{
			delete room.p2pClients[socket.id];
		}
		else
		{
			delete room.socketClients[socket.id];
		}
	} 
	
	room = null; 
  }

  socket.on('message', function (data) 
  {
	if (!room) return;
	
	socket.broadcast.to(room.name + SOCKET).emit('message', data);
	
	if (room.socketClients[socket.id] != null)
	{
		socket.broadcast.to(room.name + P2P).emit('message', data);
	}
  })
	
  socket.on('join', function (msg) {
	leaveRoom(); //If currently in a room, leave it
	
	let name = msg.name;
	
	if (!name) return;
	
	if (rooms[name])
	{
		room = rooms[name];
	}
	else
	{
	    room = {p2pClients: {}, socketClients: {}, clientCount: 0, name: name}
		rooms[name] = room;
	}

  	socket.join(room.name + SOCKET);
 	room.clientCount++;

	let allClientsIds = [];
	Object.keys(room.p2pClients).forEach(id => allClientsIds.push(id));
	Object.keys(room.socketClients).forEach(id => allClientsIds.push(id));
 	room.socketClients[socket.id] = socket;
	socket.emit('clientsList', {list: allClientsIds, cId: socket.id});
	socket.broadcast.to(room.name + P2P).emit('newClient', socket.id);
  });

  socket.on('movedToP2P', function()
  {
	if (!room) return;
	
	socket.join(room.name + P2P);
	room.p2pClients[socket.id] = socket;
	socket.leave(room.name +  SOCKET);
	delete room.socketClients[socket.id];
	isP2P = true;
  });

  socket.on('sendSignal', function(data)
  {
	if (!room) return;
	
	cSocket = room.p2pClients[data.to] || room.socketClients[data.to];
	
	if (cSocket)
	{
		cSocket.emit('signal', data);		
	}
	else
	{
		socket.emit('sendSignalFailed', {to: data.to});
	}
  });

  socket.on('disconnect', leaveRoom);
});