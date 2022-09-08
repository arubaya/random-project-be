const onCreateRoom = (socket) => {
  return socket.on('createRoom', (roomName) => {
    socket.join(roomName)
    console.log(roomName, socket.rooms)
  })
}

const onJoinRoom = (io, socket) => {
  return socket.on('joinRoom', (roomName) => {
    let client = io.sockets.adapter.rooms.get(roomName).size;
    if (client < 2) {
      socket.join(roomName)
      client = io.sockets.adapter.rooms.get(roomName).size;
      socket.broadcast.to(roomName).emit('joinedPlayer', '');
      io.to(roomName).emit('joinRoomStatus', {
        status: 'success',
        message: 'success to join',
        roomData: {
          roomPlayers: client,
          roomId: roomName
        }
      })
      console.log(roomName, socket.rooms)
    } else {
      socket.to(roomName).emit('joinRoomStatus', {
        status: 'reject',
        message: 'Room full',
      })
    }
  })
}

const onPlayerChoice = (socket) => {
  return socket.on('playerChoice', (data) => {
    socket.broadcast.to(data.roomId).emit(data.choice);
  })
}

const onDisconect = (socket) => {
  return socket.on("disconnect", () => {
    console.log("Client disconnected");
    socket.broadcast.emit('disconectPlayer', '');
  });
}

const onGetRoomPlayers = (io, socket) => {
  return socket.on("getRoomPlayers", (roomId) => {
    const client = io.sockets.adapter.rooms.get(roomId).size;
    io.to(roomId).emit('roomPlayers', {
      roomId: roomId,
      roomPlayers: client
    });
    console.log(client);
    console.log(io.sockets.adapter.rooms.get(roomId));
  });
}

const onStartTheGame = (io, socket) => {
  return socket.on("startTheGame", (roomId) => {
    let interval;
    let countdown = 3;
    interval = setInterval(() => {
      if (countdown === 0) {
        clearInterval(interval);
      }
      io.to(roomId).emit('started', countdown)
      countdown--;
    }, 1000);
  });
}

const onSendChoice = (socket) => {
  return socket.on("sendChoice", (data) => {
    socket.broadcast.to(data.roomId).emit('player2Choice', data.data)
  });
}

const socketHandle = (io, socket) => {
  onCreateRoom(socket)
  onJoinRoom(io, socket)
  onGetRoomPlayers(io, socket)
  onPlayerChoice(socket)
  onDisconect(socket)
  onStartTheGame(io, socket)
  onSendChoice(socket)
}

module.exports = socketHandle