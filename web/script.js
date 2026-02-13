let socket = io();
let finished = false;
let numberData = [];
let lastGuess = -1;

function setup() {
  // create canvas
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 100; i++) {
    numberData.push({
      value: i,
      state: "possible", // 'possible', 'eliminated', 'correct'
    });
  }
  let inputField = select("#guess");
  inputField.elt.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      sendGuess();
    }
  });
}

function sendGuess() {
  let inputElem = select("#guess");
  let val = inputElem.value();
  if (!finished && val !== "") {
    let intVal = parseInt(val);
    lastGuess = intVal;
    socket.emit("submitGuess", intVal);
    inputElem.value("");
  }
}

function draw() {
  background(50);
  let cols = 10;
  let rows = 10;
  // create grid
  let maxSize = min(width, height) * 0.8;
  let cellSize = maxSize / 10;
  // center grid
  let startX = (width - maxSize) / 2;
  let startY = (height - maxSize) / 2 - 50;
  textAlign(CENTER, CENTER);
  textSize(cellSize * 0.4);

  for (let i = 0; i < numberData.length; i++) {
    let x = startX + (i % cols) * cellSize;
    let y = startY + Math.floor(i / rows) * cellSize;
    let n = numberData[i];
    // colour based on state
    stroke(0);
    if (n.state === "possible") {
      fill(100, 255, 100);
    } else if (n.state === "eliminated") {
      fill(80);
    } else if (n.state === "correct") {
      fill(255, 215, 0);
    }

    // highlight just guessed
    if (n.value === lastGuess && n.state !== "correct") {
      stroke(255);
      strokeWeight(3);
    } else {
      strokeWeight(1);
    }
    // draw cell
    rect(x, y, cellSize, cellSize);
    // draw number
    fill(0);
    // eliminated
    if (n.state === "eliminated") fill(50);
    text(n.value, x + cellSize / 2, y + cellSize / 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

socket.on("score", function (d) {
  let guessVal = parseInt(d.value);

  // results
  let newResult = document.createElement("p");
  newResult.innerText = "Turn " + d.turns + ": " + d.value + " " + d.result;
  newResult.style.color = "#FFF";
  document.getElementById("results").appendChild(newResult);

  // update visual state
  if (d.result === "PERFECT") {
    finished = true;
    numberData[guessVal].state = "correct";
  } else if (d.result === "LOW") {
    for (let i = 0; i < numberData.length; i++) {
      if (numberData[i].value <= guessVal) {
        numberData[i].state = "eliminated";
      }
    }
  } else if (d.result === "HIGH") {
    for (let i = 0; i < numberData.length; i++) {
      if (numberData[i].value >= guessVal) {
        numberData[i].state = "eliminated";
      }
    }
  }
});
