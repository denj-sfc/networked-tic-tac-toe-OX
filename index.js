const express = require("express");
const socketio = require("socket.io");
const exp = express();
exp.use(express.static("web"));
const web = exp.listen(3000, function () {
  console.log("Running");
});
const io = socketio(web);
// Every time a web browser requests the webpage a new connection is made.
// An instance of this code runs for each connection – so secretValue and
// turns will be specific to the connection
io.on("connection", function (socket) {
  // a new connection has been created
  // i.e. a web browser has connected to the server
  console.log("connected to " + socket.id);
  let secretValue = Math.floor(Math.random() * 100);
  console.log("Secret value is " + secretValue);
  let turns = 0;
  // when the socket gets 'submitGuess' it sends 'score' back
  socket.on("submitGuess", function (value) {
    turns++;
    console.log(value);
    if (value == secretValue) {
      socket.emit("score", { value: value, turns: turns, result: "PERFECT" });
    }
    if (value < secretValue) {
      socket.emit("score", { value: value, turns: turns, result: "LOW" });
    }
    if (value > secretValue) {
      socket.emit("score", { value: value, turns: turns, result: "HIGH" });
    }
  });
  // note when the browser disconnects
  socket.on("disconnect", function () {
    console.log(socket.id + " disconnected");
  });
});
