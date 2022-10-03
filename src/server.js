import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "익명";
  console.log("Connected to Browser ✅");
  socket.on("close", () => {
    console.log("Disconnected from the Browser 💤");
  });
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    const message_payload = message.payload.toString();
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message_payload}`)
        );
      case "nickname":
        socket["nickname"] = message_payload;
    }
  });
});

const handleListen = () =>
  console.log("📢 Listening on server: http://localhost:3000/");
server.listen(3000, handleListen);
