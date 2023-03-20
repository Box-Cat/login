const express = require('express');
require('dotenv').config();
const app = express();
const dbConfig = require("./config/dbConfig");
const port = process.env.PORT || 5000;

const usersRoute = require("./routes/usersRoute");
const chatsRoute = require("./routes/chatsRoute");
const messagesRoute = require("./routes/messagesRoute");
app.use(express.json());

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// check the connection of socket from client
io.on("connection",(socket)=>{
  //socket events will be here

  socket.on("send-new-message-to-all",(data)=>{
    //send to all the clients
    socket.emit("new-message-from-server",data);
  })
});

app.use("/api/users", usersRoute);
app.use("/api/chats", chatsRoute);
app.use("/api/messages", messagesRoute);

server.listen(port, ()=>console.log(`Server ok running on port ${port}`))    