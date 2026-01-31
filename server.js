const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Allow configuring allowed origin via ENV; default to all for quick testing.
const io = new Server(server, {
  cors: { origin: process.env.ALLOWED_ORIGIN || "*" },
});

app.use(express.static("public"));

// Relay-only server: forward cursor events to other clients or to a room.
io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  socket.on("cursor-event", (data) => {
    if (data && data.room) {
      socket.to(data.room).emit("cursor-event", data);
    } else {
      socket.broadcast.emit("cursor-event", data);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
