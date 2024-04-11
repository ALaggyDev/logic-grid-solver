import {
  Board,
  Rule,
  SymbolType,
  Pos,
  Cell,
  SymbolInfo,
  verify_connected_rule,
  verify_area_symbol,
  verify_viewpoint_symbol,
  Direction,
  Color
} from './solver';
import { solve } from './solver/backtrack';

const canvas = document.getElementById('board')! as HTMLCanvasElement;
const rect = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d')!;

let sizeX = 9;
let sizeY = 9;

let board: Board = [];
let rules: Rule[] = [
  {
    kind: 'connected',
    color: Color.Black
  },
  {
    kind: 'connected',
    color: Color.White
  }
];
let symbols: SymbolInfo[] = [
  {
    pos: { x: 1, y: 1 },
    symbol: {
      kind: 'viewpoint',
      count: 3
    }
  },
  {
    pos: { x: 2, y: 2 },
    symbol: {
      kind: 'viewpoint',
      count: 6
    }
  },
  {
    pos: { x: 3, y: 3 },
    symbol: {
      kind: 'viewpoint',
      count: 4
    }
  },
  {
    pos: { x: 4, y: 4 },
    symbol: {
      kind: 'viewpoint',
      count: 4
    }
  },
  {
    pos: { x: 5, y: 5 },
    symbol: {
      kind: 'viewpoint',
      count: 4
    }
  },
  {
    pos: { x: 6, y: 6 },
    symbol: {
      kind: 'viewpoint',
      count: 3
    }
  },
  {
    pos: { x: 7, y: 7 },
    symbol: {
      kind: 'viewpoint',
      count: 6
    }
  },
  {
    pos: { x: 6, y: 1 },
    symbol: {
      kind: 'viewpoint',
      count: 4
    }
  },
  {
    pos: { x: 7, y: 2 },
    symbol: {
      kind: 'viewpoint',
      count: 7
    }
  },
  {
    pos: { x: 1, y: 6 },
    symbol: {
      kind: 'viewpoint',
      count: 3
    }
  },
  {
    pos: { x: 2, y: 7 },
    symbol: {
      kind: 'viewpoint',
      count: 6
    }
  }
];

// let board: Board = [];
// let rules: Rule[] = [
//   {
//     kind: 'connected',
//     color: Color.Black
//   }
// ];
// let symbols: SymbolInfo[] = [
//   {
//     pos: { x: 1, y: 1 },
//     symbol: {
//       kind: 'viewpoint',
//       count: 5
//     }
//   },
//   {
//     pos: { x: 3, y: 0 },
//     symbol: {
//       kind: 'viewpoint',
//       count: 5
//     }
//   },
//   {
//     pos: { x: 5, y: 1 },
//     symbol: {
//       kind: 'viewpoint',
//       count: 6
//     }
//   },
//   {
//     pos: { x: 2, y: 3 },
//     symbol: {
//       kind: 'viewpoint',
//       count: 4
//     }
//   },
//   {
//     pos: { x: 4, y: 3 },
//     symbol: {
//       kind: 'viewpoint',
//       count: 2
//     }
//   },
//   {
//     pos: { x: 1, y: 5 },
//     symbol: {
//       kind: 'viewpoint',
//       count: 7
//     }
//   },
//   {
//     pos: { x: 5, y: 5 },
//     symbol: {
//       kind: 'viewpoint',
//       count: 3
//     }
//   },
//   {
//     pos: { x: 3, y: 6 },
//     symbol: {
//       kind: 'viewpoint',
//       count: 2
//     }
//   }
// ];

let pixelCellSize = 50;

// Add event listeners to handle cell interaction
let isMouseDown = false;
let mouseCell: Cell = Cell.Empty;

resetBoard();
drawBoard(board, symbols);

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
function drawBoard(board: Board, symbols: SymbolInfo[]) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Loop through each cell in the board
  for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
      const pixelX = y * pixelCellSize;
      const pixelY = x * pixelCellSize;

      const cell = board[x][y];
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
  for (const pair of symbols) {
    const symbol = pair.symbol;
    const pixelX = pair.pos.y * pixelCellSize;
    const pixelY = pair.pos.x * pixelCellSize;

    ctx.fillStyle = board[pair.pos.x][pair.pos.y] == Cell.Black ? 'white' : 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the number on top of the cell
    if (symbol.kind == 'area' || symbol.kind == 'viewpoint' || symbol.kind == 'dart') {
      ctx.font = 'bold ' + Math.floor(pixelCellSize / 2) + 'px Arial';
      ctx.fillText(symbol.count.toString(), pixelX + pixelCellSize / 2, pixelY + pixelCellSize / 2);
    }

    if (symbol.kind != 'area') {
      ctx.font = Math.floor(pixelCellSize / 4) + 'px Arial';

      let text = symbol.kind;
      if (symbol.kind == 'dart') {
        if (symbol.direction == 'up') {
          text += ' ^';
        } else if (symbol.direction == 'down') {
          text += ' v';
        } else if (symbol.direction == 'left') {
          text += '<';
        } else if (symbol.direction == 'right') {
          text += ' >';
        }
      }

      ctx.fillText(text, pixelX + pixelCellSize / 2, pixelY + pixelCellSize / 1.25);
    }
  }
}

// Function to handle cell color change on mouse move
function handleMouseMove(event: MouseEvent) {
  if (!isMouseDown) return;

  handleMouseActivity(event);
}

// Function to handle cell color change on mouse down
function handleMouseDown(event: MouseEvent) {
  isMouseDown = true;

  if (event.button === 0) {
    mouseCell = Cell.Black; // Left click
  } else if (event.button === 2) {
    mouseCell = Cell.White; // Right click
  } else if (event.button === 1) {
    mouseCell = Cell.Empty; // Middle click
  }

  handleMouseActivity(event);
}

// Function to handle cell color change on mouse up
function handleMouseUp() {
  isMouseDown = false;
}

function handleMouseActivity(event: MouseEvent) {
  const pixelX = event.pageX - rect.left;
  const pixelY = event.pageY - rect.top;

  const x = Math.floor(pixelY / pixelCellSize);
  const y = Math.floor(pixelX / pixelCellSize);

  if (x < 0 || x >= sizeX || y < 0 || y >= sizeY) return;

  board[x][y] = mouseCell;
  drawBoard(board, symbols);
}

// Function to resize the board
function resizeBoard() {
  const newSizeX = parseInt((document.getElementById('size-x')! as HTMLInputElement).value);
  const newSizeY = parseInt((document.getElementById('size-y')! as HTMLInputElement).value);

  if (isNaN(newSizeX) || isNaN(newSizeY) || newSizeX < 1 || newSizeY < 1) {
    alert('Invalid size!');
    return;
  }

  sizeX = newSizeX;
  sizeY = newSizeY;
  resetBoard();
}

// Function to reset the board
function resetBoard() {
  board = [];
  for (let x = 0; x < sizeX; x++) {
    board.push([]);
    for (let y = 0; y < sizeY; y++) {
      board[x].push(Cell.Empty);
    }
  }

  canvas.width = sizeY * pixelCellSize;
  canvas.height = sizeX * pixelCellSize;

  drawBoard(board, symbols);
}

// Function to solve the board
function solveBoard() {
  console.log('Solving the board...');

  console.time();
  console.log(solve(board, rules, symbols));
  // console.log(solver.verify_area_symbol(board, symbols[0][0], symbols[0][1]));
  console.timeEnd();

  drawBoard(board, symbols);
}

window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('contextmenu', event => event.preventDefault());

document.getElementById('resize-button')!.addEventListener('click', resizeBoard);
document.getElementById('reset-button')!.addEventListener('click', resetBoard);
document.getElementById('solve-button')!.addEventListener('click', solveBoard);
