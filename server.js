const express = require('express');
const http = require('http');
const baguntasSocketHandle = require('./baguntas-socket/index')
const router = express.Router();

const app = express();
const PORT = process.env.PORT || 8080;

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

// List of namespace
const baguntasNamespaceSocket = io.of('/baguntas');



// List namespace listener
baguntasNamespaceSocket.on('connection', (socket) => {
  console.log("New client connected");
  socket.emit('connected', 'Anda sudah terhubung ke server')

  baguntasSocketHandle(baguntasNamespaceSocket, socket)
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

