const express = require("express");
const socketio = require("socket.io");
const exp = express();
exp.use(express.static("web"));
const web = exp.listen(3000, function () {
  console.log("Running");
});
const io = socketio(web);
let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "] // 9 spaces, will have Os and Xs
let playerCount = 0
let icons = ["O", "X"]
io.on("connection", function (socket) {
  console.log("connected to " + socket.id); // a new connection has been created
  let myIcon = icons[playerCount++] // assign O/X to player and advance playerCount
  // when the socket gets 'submitMove' it sends 'board' back
  socket.on("submitMove", function (row, col) {
    console.log("played at", row, col)
    // NEEDS DEVELOPMENT HERE
    board[row * 3 + col] = myIcon
    io.emit("board", board); // send the board array to client
  });
});