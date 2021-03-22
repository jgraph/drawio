const
    {Server} = require("socket.io"),
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

var rooms = {}

io.on('connection', function (socket) 
{
  var room = null;

  function leaveRoom()
  {
	if (!room) return;

	room.clientCount--;
	socket.leave(room.name);
	
	if (room.clientCount == 0)
	{
		delete rooms[room.name];
	}	
	
	room = null; 
  }

  socket.on('message', function (data) 
  {
	if (!room) return;
	
	socket.broadcast.to(room.name).emit('message', data);
  })
	
  socket.on('join', function (msg) {
	leaveRoom(); //If currently in a room, leave it
	
	var name = msg.name;
	
	if (!name) return;
	
	if (rooms[name])
	{
		room = rooms[name];
	}
	else
	{
	    room = {clientCount: 0, name: name}
		rooms[name] = room;
	}

  	socket.join(room.name);
 	room.clientCount++;
  });

  socket.on("disconnect", leaveRoom);
});