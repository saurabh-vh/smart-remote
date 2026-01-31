const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const robot = require("robotjs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

robot.setMouseDelay(0);

io.on("connection", (socket) => {
  console.log("Touchpad connected");

  socket.on("cursor-event", (data) => {
    const pos = robot.getMousePos();

    switch (data.type) {
      case "move":
        robot.moveMouse(
          pos.x + data.dx * 1.5,
          pos.y + data.dy * 1.5
        );
        break;

      case "down":
        robot.mouseToggle("down", "left");
        break;

      case "up":
        robot.mouseToggle("up", "left");
        break;

      case "click":
        robot.mouseClick("left");
        break;

      case "doubleClick":
        robot.mouseClick("left", true);
        break;

      case "scroll":
        robot.scrollMouse(0, -data.dy / 4);
        break;
    }
  });
});

server.listen(3000, () => {
  console.log("🔥 God-Mode Touchpad Active");
});
