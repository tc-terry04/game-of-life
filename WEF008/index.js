const unitLength = 20;
const boxColor = 0;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;

let fr = 1; /* starting FPS */

let slider; /* build the slider */

let img; /* show the image */

let spr; /* show the sprite */

/* create random box color */
setInterval(() => {
  r = Math.floor(Math.random() * 255);
  g = Math.floor(Math.random() * 255);
  b = Math.floor(Math.random() * 255);
}, 300);

function setup() {
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(
    windowWidth - (300 + (windowWidth % 20)),
    windowHeight - 170
  );
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength) + 1;

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  // Now both currentBoard and nextBoard are array of array of undefined values.

  /* Set the framerate */
  frameRate(fr);

  /* Set the slider */
  slider = createSlider(1, 60, 0, 1);
  slider.position(90, 130);
  slider.style("width", "80px");

  /* Set the frame count */
  textSize(50);
  textAlign(CENTER);

  init(); // Set the initial values of the currentBoard and nextBoard
}

// Initialize/reset the board state
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

function draw() {
  background(255);

  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        fill(r, g, b);
      } else {
        fill(255, 255, 255);
      }
      stroke(r, g, b);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }

  /* let framerate follow the slider */
  let val = slider.value();
  frameRate(val);

  drawFrame();
}

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < 2) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > 3) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == 3) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function drawPattern(startX, startY) {
  const pattern = [
    [1, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ];
  for (let i = startX; i < startX + pattern.length; i++) {
    for (let j = startY; j < startY + pattern[0].length; j++) {
      currentBoard[i][j] = pattern[i - startX][j - startY];

      // fill(pattern[i - startX][j - startY]);
      // rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
}
/**
 * When mouse is dragged
 */
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (
    mouseX > unitLength * columns ||
    mouseY > unitLength * rows ||
    mouseX < 0 ||
    mouseY < 0
  ) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  // currentBoard[x][y] = 1;
  drawPattern(x, y);
  fill(boxColor);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/* Draw the frame count */
function drawFrame() {
  fill(250, 0, 0);
  textSize(30);
  textAlign(LEFT);
  text(frameCount, unitLength / 2, unitLength + 10);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  noLoop();
  mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
  loop();
}

function windowResized() {
  resizeCanvas(windowWidth - (300 + (windowWidth % 20)), windowHeight - 170);
  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength) + 1;

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  // Now both currentBoard and nextBoard are array of array of undefined values.

  /* Set the framerate */
  frameRate(fr);

  /* Set the slider */
  slider = createSlider(1, 60, 0, 1);
  slider.position(90, 130);
  slider.style("width", "80px");

  /* Set the frame count */
  textSize(50);
  textAlign(CENTER);

  init(); // Set the initial values of the currentBoard and nextBoard
}
// document.querySelector("#reset-game").addEventListener("click", function () {
//   init();
// });
