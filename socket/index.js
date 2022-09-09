const onCreateRoom = (socket) => {
  return socket.on('createRoom', (roomName) => {
    socket.join(roomName)
    console.log(roomName, socket.rooms)
  })
}

const onJoinRoom = (io, socket) => {
  return socket.on('joinRoom', (roomName) => {
    let client = io.sockets.adapter.rooms.get(roomName);
    if (client !== undefined) {
      if (client.size < 2) {
        socket.join(roomName)
        client = io.sockets.adapter.rooms.get(roomName).size;
        socket.broadcast.to(roomName).emit('joinedPlayer', '');
        io.to(roomName).emit('joinRoomStatus', {
          status: 'success',
          message: 'success to join',
          roomData: {
            roomPlayers: client.size,
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
    } else {
      socket.to(roomName).emit('joinRoomStatus', {
        status: 'reject',
        message: 'Room Not Found',
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
    const client = io.sockets.adapter.rooms.get(roomId);
    if (client !== undefined) {
      io.to(roomId).emit('roomPlayers', {
        roomId: roomId,
        roomPlayers: client.size
      });
    } else {
      io.to(roomId).emit('roomPlayers', {
        roomId: '-',
        roomPlayers: '-'
      });
    }
    console.log(client);
  });
}

const onStartTheGame = (io, socket) => {
  return socket.on("startTheGame", (roomId) => {
    let interval;
    let countdown = 3;
    io.to(roomId).emit('started', countdown)
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

const onRestartGame = (socket) => {
  return socket.on("restartGame", (roomId) => {
    console.log('restart', roomId)
    socket.broadcast.to(roomId).emit('restartedGame')
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
  onRestartGame(socket)
}

module.exports = socketHandle