let socket = io();
function sendMove(x, y) {
  socket.emit("submitMove", y, x);
}
socket.on("board", function (d) {
  console.log(d) // just log the board, will do something with this eventually
});