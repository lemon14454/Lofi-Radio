import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import path from "path";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

// frontend
app.use(express.static(path.join(path.resolve(), "/build")));

let onlineUsers: any = [];

io.on("connection", (socket: Socket) => {
  socket.on("online", (user: any) => {
    const checkUserExists =
      onlineUsers.filter((onlineUser: any) => onlineUser.socketID === socket.id)
        .length > 0;

    if (!checkUserExists) {
      onlineUsers = [...onlineUsers, { ...user, socketID: socket.id }];
      io.emit("online", onlineUsers);
    }
  });

  socket.on("disconnect", () => {
    // console.log(socket.id, "disconnected");
    onlineUsers = onlineUsers.filter(
      (onlineUser: any) => onlineUser.socketID != socket.id
    );
    io.emit("online", onlineUsers);
  });

  socket.on("player", (player) => {
    io.emit("player", player);
  });
});

httpServer.listen(process.env.PORT || 5000, () => {
  console.log("server running at port 5000");
});
