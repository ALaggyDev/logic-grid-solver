import {
  Board,
  Rule,
  Symbol,
  Pos,
  Cell,
  verify_connected_rule,
  verify_area_symbol,
  verify_viewpoint_symbol,
  Direction,
  Color,
  Game,
  verify_galaxy_symbol,
  GalaxySymbol,
  verify_lotus_symbol,
  LotusSymbol
} from './solver';
import { solve } from './solver/backtrack';
import { solveAdvanced } from './solver/backtrack_advanced';

const canvas = document.getElementById('board')! as HTMLCanvasElement;
const rect = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d')!;

let game: Game = JSON.parse(`{"board":[[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,1,0,0,1,0,0,2],[2,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2],[2,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,2],[2,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1,0,2],[2,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,2],[2,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,2],[2,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,2],[2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,2],[2,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,2],[2,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,2],[2,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,2],[2,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,2],[2,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2],[2,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,2],[2,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,2],[2,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,2],[2,0,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,2],[2,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,2],[2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,2],[2,0,0,1,0,0,1,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]],"rules":[{"kind":"connected","color":1},{"kind":"connected","color":1}],"symbols":[{"kind":"viewpoint","pos":{"x":3,"y":1},"count":2},{"kind":"viewpoint","pos":{"x":2,"y":2},"count":6},{"kind":"viewpoint","pos":{"x":2,"y":4},"count":3},{"kind":"viewpoint","pos":{"x":2,"y":6},"count":3},{"kind":"viewpoint","pos":{"x":1,"y":7},"count":3},{"kind":"viewpoint","pos":{"x":1,"y":10},"count":4},{"kind":"viewpoint","pos":{"x":1,"y":15},"count":5},{"kind":"viewpoint","pos":{"x":1,"y":17},"count":3},{"kind":"viewpoint","pos":{"x":1,"y":20},"count":3},{"kind":"viewpoint","pos":{"x":2,"y":21},"count":2},{"kind":"viewpoint","pos":{"x":4,"y":4},"count":7},{"kind":"viewpoint","pos":{"x":5,"y":5},"count":3},{"kind":"viewpoint","pos":{"x":4,"y":8},"count":4},{"kind":"viewpoint","pos":{"x":3,"y":11},"count":9},{"kind":"viewpoint","pos":{"x":4,"y":12},"count":8},{"kind":"viewpoint","pos":{"x":3,"y":14},"count":8},{"kind":"viewpoint","pos":{"x":4,"y":16},"count":5},{"kind":"viewpoint","pos":{"x":5,"y":18},"count":7},{"kind":"viewpoint","pos":{"x":4,"y":19},"count":7},{"kind":"viewpoint","pos":{"x":4,"y":21},"count":2},{"kind":"viewpoint","pos":{"x":6,"y":21},"count":3},{"kind":"viewpoint","pos":{"x":7,"y":22},"count":5},{"kind":"viewpoint","pos":{"x":6,"y":1},"count":5},{"kind":"viewpoint","pos":{"x":8,"y":1},"count":3},{"kind":"viewpoint","pos":{"x":7,"y":4},"count":8},{"kind":"viewpoint","pos":{"x":9,"y":3},"count":6},{"kind":"viewpoint","pos":{"x":7,"y":8},"count":2},{"kind":"viewpoint","pos":{"x":9,"y":7},"count":2},{"kind":"viewpoint","pos":{"x":5,"y":10},"count":5},{"kind":"viewpoint","pos":{"x":6,"y":12},"count":3},{"kind":"viewpoint","pos":{"x":7,"y":14},"count":4},{"kind":"viewpoint","pos":{"x":8,"y":16},"count":6},{"kind":"viewpoint","pos":{"x":8,"y":19},"count":2},{"kind":"viewpoint","pos":{"x":10,"y":22},"count":5},{"kind":"viewpoint","pos":{"x":11,"y":20},"count":6},{"kind":"viewpoint","pos":{"x":10,"y":18},"count":5},{"kind":"viewpoint","pos":{"x":12,"y":19},"count":6},{"kind":"viewpoint","pos":{"x":12,"y":17},"count":6},{"kind":"viewpoint","pos":{"x":11,"y":13},"count":3},{"kind":"viewpoint","pos":{"x":10,"y":11},"count":7},{"kind":"viewpoint","pos":{"x":12,"y":10},"count":10},{"kind":"viewpoint","pos":{"x":13,"y":12},"count":3},{"kind":"viewpoint","pos":{"x":11,"y":6},"count":5},{"kind":"viewpoint","pos":{"x":11,"y":4},"count":3},{"kind":"viewpoint","pos":{"x":12,"y":3},"count":3},{"kind":"viewpoint","pos":{"x":13,"y":5},"count":5},{"kind":"viewpoint","pos":{"x":13,"y":1},"count":10},{"kind":"viewpoint","pos":{"x":15,"y":4},"count":8},{"kind":"viewpoint","pos":{"x":15,"y":7},"count":6},{"kind":"viewpoint","pos":{"x":16,"y":9},"count":6},{"kind":"viewpoint","pos":{"x":16,"y":1},"count":10},{"kind":"viewpoint","pos":{"x":17,"y":2},"count":2},{"kind":"viewpoint","pos":{"x":19,"y":2},"count":10},{"kind":"viewpoint","pos":{"x":21,"y":2},"count":9},{"kind":"viewpoint","pos":{"x":22,"y":3},"count":4},{"kind":"viewpoint","pos":{"x":19,"y":4},"count":7},{"kind":"viewpoint","pos":{"x":18,"y":5},"count":8},{"kind":"viewpoint","pos":{"x":19,"y":7},"count":11},{"kind":"viewpoint","pos":{"x":22,"y":6},"count":3},{"kind":"viewpoint","pos":{"x":22,"y":8},"count":5},{"kind":"viewpoint","pos":{"x":20,"y":9},"count":7},{"kind":"viewpoint","pos":{"x":19,"y":11},"count":12},{"kind":"viewpoint","pos":{"x":17,"y":11},"count":11},{"kind":"viewpoint","pos":{"x":20,"y":12},"count":7},{"kind":"viewpoint","pos":{"x":18,"y":13},"count":8},{"kind":"viewpoint","pos":{"x":22,"y":13},"count":9},{"kind":"viewpoint","pos":{"x":19,"y":15},"count":11},{"kind":"viewpoint","pos":{"x":22,"y":16},"count":9},{"kind":"viewpoint","pos":{"x":21,"y":17},"count":3},{"kind":"viewpoint","pos":{"x":21,"y":19},"count":3},{"kind":"viewpoint","pos":{"x":21,"y":21},"count":3},{"kind":"viewpoint","pos":{"x":20,"y":22},"count":9},{"kind":"viewpoint","pos":{"x":19,"y":19},"count":7},{"kind":"viewpoint","pos":{"x":18,"y":18},"count":5},{"kind":"viewpoint","pos":{"x":16,"y":19},"count":9},{"kind":"viewpoint","pos":{"x":17,"y":22},"count":4},{"kind":"viewpoint","pos":{"x":15,"y":22},"count":3},{"kind":"viewpoint","pos":{"x":14,"y":20},"count":5},{"kind":"viewpoint","pos":{"x":14,"y":16},"count":11},{"kind":"viewpoint","pos":{"x":16,"y":15},"count":6}],"sizeX":24,"sizeY":24}`);

let pixelCellSize = 40;

// Add event listeners to handle cell interaction
let isMouseDown = false;
let mouseCell: Cell = Cell.Empty;

if (game.board.length == 0) {
  resetGame();
} else {
  canvas.width = game.sizeY * pixelCellSize;
  canvas.height = game.sizeX * pixelCellSize;
}
drawGame(game);

// Function to get the cell color
function getCellColor(cell: Cell): string {
  switch (cell) {
    case Cell.Empty:
      return '#A0A0A0';
    case Cell.White:
      return '#FFFFFF';
    case Cell.Black:
      return '#202020';
  }
}

// Function to draw the board
function drawGame(game: Game) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Loop through each cell in the board
  for (let x = 0; x < game.sizeX; x++) {
    for (let y = 0; y < game.sizeY; y++) {
      const pixelX = y * pixelCellSize;
      const pixelY = x * pixelCellSize;

      const cell = game.board[x][y];
      const color = getCellColor(cell);

      // Draw the cell
      ctx.fillStyle = color;
      ctx.fillRect(pixelX, pixelY, pixelCellSize, pixelCellSize);

      // Draw the border
      ctx.strokeStyle = '#404040';
      ctx.strokeRect(pixelX, pixelY, pixelCellSize, pixelCellSize);
    }
  }

  // Draw the symbols
  for (const symbol of game.symbols) {
    const pixelX = symbol.pos.y * pixelCellSize;
    const pixelY = symbol.pos.x * pixelCellSize;

    ctx.fillStyle = game.board[symbol.pos.x][symbol.pos.y] == Cell.Black ? 'white' : 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the number on top of the cell
    if (symbol.kind == 'area' || symbol.kind == 'viewpoint' || symbol.kind == 'dart') {
      ctx.font = 'bold ' + Math.floor(pixelCellSize / 2) + 'px Arial';
      ctx.fillText(symbol.count.toString(), pixelX + pixelCellSize / 2, pixelY + pixelCellSize / 2);
    }

    if (symbol.kind == 'letter') {
      ctx.font = 'bold ' + Math.floor(pixelCellSize / 2) + 'px Arial';
      ctx.fillText(String.fromCharCode(symbol.letter + 65), pixelX + pixelCellSize / 2, pixelY + pixelCellSize / 2);
    }

    if (symbol.kind == 'lotus') {
      ctx.font = 'bold ' + Math.floor(pixelCellSize / 2) + 'px Arial';
      let text: string;
      if (symbol.rotation == 0) {
        text = '↕';
      } else if (symbol.rotation == 1) {
        text = '⤢';
      } else if (symbol.rotation == 2) {
        text = '↔';
      } else if (symbol.rotation == 3) {
        text = '⤡';
      }
      ctx.fillText(text!, pixelX + pixelCellSize / 2, pixelY + pixelCellSize / 2);
    }

    if (symbol.kind != 'area' && symbol.kind != 'letter') {
      ctx.font = Math.floor(pixelCellSize / 4) + 'px Arial';

      let text = symbol.kind;
      if (symbol.kind == 'dart') {
        if (symbol.direction == 'up') {
          text += ' ↑';
        } else if (symbol.direction == 'down') {
          text += ' ↓';
        } else if (symbol.direction == 'left') {
          text += ' ←';
        } else if (symbol.direction == 'right') {
          text += ' →';
        }
      }

      ctx.fillText(text, pixelX + pixelCellSize / 2, pixelY + pixelCellSize / 1.25);
    }
  }
}

// Function to handle cell color change on mouse move
function handleMouseMove(event: MouseEvent) {
  if (placingSymbolsMode) return;
  if (!isMouseDown) return;

  const pos = getMouseCellPos(event);
  if (!pos) return;

  game.board[pos.x][pos.y] = mouseCell;
  drawGame(game);
}

// Function to handle cell color change on mouse down
function handleMouseDown(event: MouseEvent) {
  if (placingSymbolsMode) return;
  isMouseDown = true;

  if (event.button === 0) {
    mouseCell = Cell.Black; // Left click
  } else if (event.button === 2) {
    mouseCell = Cell.White; // Right click
  } else if (event.button === 1) {
    mouseCell = Cell.Empty; // Middle click
  }

  const pos = getMouseCellPos(event);
  if (!pos) return;

  game.board[pos.x][pos.y] = mouseCell;
  drawGame(game);
}

// Function to handle cell color change on mouse up
function handleMouseUp() {
  if (placingSymbolsMode) return;
  isMouseDown = false;
}

function getMouseCellPos(event: MouseEvent): Pos | null {
  const pixelX = event.pageX - rect.left;
  const pixelY = event.pageY - rect.top;

  const x = Math.floor(pixelY / pixelCellSize);
  const y = Math.floor(pixelX / pixelCellSize);

  if (x < 0 || x >= game.sizeX || y < 0 || y >= game.sizeY) return null;

  return { x, y };
}

// Function to resize the game
function resizeGame() {
  const newSizeX = parseInt((document.getElementById('size-x')! as HTMLInputElement).value);
  const newSizeY = parseInt((document.getElementById('size-y')! as HTMLInputElement).value);

  if (isNaN(newSizeX) || isNaN(newSizeY) || newSizeX < 1 || newSizeY < 1) {
    alert('Invalid size!');
    return;
  }

  game.sizeX = newSizeX;
  game.sizeY = newSizeY;
  resetGame();
}

// Function to reset the game
function resetGame() {
  game.board = [];
  for (let x = 0; x < game.sizeX; x++) {
    game.board.push([]);
    for (let y = 0; y < game.sizeY; y++) {
      game.board[x].push(Cell.Empty);
    }
  }

  game.symbols = [];

  canvas.width = game.sizeY * pixelCellSize;
  canvas.height = game.sizeX * pixelCellSize;

  drawGame(game);
}

// Function to solve the game
function solveBoard() {
  console.log('Solving the game...');

  console.time();
  console.log(solveAdvanced(game));
  console.timeEnd();

  drawGame(game);
}

window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('contextmenu', event => event.preventDefault());

document.getElementById('resize-button')!.addEventListener('click', resizeGame);
document.getElementById('reset-button')!.addEventListener('click', resetGame);
document.getElementById('export')!.addEventListener('click', () => console.log(JSON.stringify(game)));
document.getElementById('solve-button')!.addEventListener('click', solveBoard);

canvas.addEventListener('mousedown', displayInputBox);

let placingSymbolsMode = false;

document.getElementById('mode-switch')!.addEventListener('click', () => {
  placingSymbolsMode = !placingSymbolsMode;
  if (placingSymbolsMode) {
    document.getElementById('mode-switch')!.innerText = 'Mode: Symbol';
  } else {
    document.getElementById('mode-switch')!.innerText = 'Mode: Cell';
  }
});

function displayInputBox(event: MouseEvent) {
  if (!placingSymbolsMode) return;

  const pos = getMouseCellPos(event);
  if (!pos) return;

  const inputBox = document.createElement('input');
  inputBox.classList.add('input-box');
  inputBox.style.left = `${event.pageX}px`;
  inputBox.style.top = `${event.pageY}px`;
  document.body.appendChild(inputBox);

  window.requestAnimationFrame(() => inputBox.focus());

  inputBox.addEventListener('keydown', e => {
    if (e.key != 'Enter') return;

    const value = inputBox.value;
    inputBox.blur();

    const num = parseInt(value);
    if (isNaN(num)) return;

    // If a symbol already exists at pos, remove it
    game.symbols = game.symbols.filter(s => s.pos.x != pos.x || s.pos.y != pos.y);

    // Add the symbol
    game.symbols.push({ kind: 'viewpoint', pos, count: num });

    drawGame(game);
  });

  inputBox.addEventListener('blur', () => {
    inputBox.remove();
  });
}
