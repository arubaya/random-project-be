const express = require('express');
const http = require('http');
const socketHandle = require('./socket/index')
const router = express.Router();

const app = express();
const PORT = 8080;

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});
app.use(router)

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


io.on('connection', (socket) => {
  console.log("New client connected");
  socket.emit('connected', 'Anda sudah terhubung ke server')

  socketHandle(io, socket)
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

