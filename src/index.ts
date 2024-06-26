import presets from './presets';
import { Board, Symbol, Pos, Cell, Direction, Game } from './solver';
import { solveAdvanced } from './solver/backtrackAdvanced';

const canvas = document.getElementById('board')! as HTMLCanvasElement;
const rect = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d')!;

let game: Game = createEmptyGame(10, 10);

let pixelCellSize = 50;

// Add event listeners to handle cell interaction
let isMouseDown = false;
let mouseCell: Cell = Cell.Empty;

drawGame(game);
updateRuleList();

// Function to get the cell color
function getCellColor(cell: Cell): string {
  switch (cell) {
    case Cell.Empty:
      return '#A0A0A0';
    case Cell.Light:
      return '#FFFFFF';
    case Cell.Dark:
      return '#202020';
    case Cell.Border:
      return '#404040';
  }
}

// Function to draw the board
function drawGame(game: Game) {
  if (canvas.width != game.sizeY * pixelCellSize) canvas.width = game.sizeY * pixelCellSize;
  if (canvas.height != game.sizeX * pixelCellSize) canvas.height = game.sizeX * pixelCellSize;

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

    ctx.fillStyle = game.board[symbol.pos.x][symbol.pos.y] == Cell.Dark ? 'white' : 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the number on top of the cell
    if (symbol.kind == 'area' || symbol.kind == 'viewpoint' || symbol.kind == 'dart') {
      ctx.font = 'bold ' + Math.floor(pixelCellSize / 2) + 'px Arial';
      ctx.fillText(symbol.count.toString(), pixelX + pixelCellSize / 2, pixelY + pixelCellSize / 2);
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

    if (symbol.kind != 'area') {
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
  if (getMode() != 'cell' && getMode() != 'border') return;
  if (!isMouseDown) return;

  const pos = getMouseCellPos(event);
  if (!pos) return;

  game.board[pos.x][pos.y] = mouseCell;
  drawGame(game);
}

// Function to handle cell color change on mouse down
function handleMouseDown(event: MouseEvent) {
  if (getMode() != 'cell' && getMode() != 'border') return;

  isMouseDown = true;

  if (getMode() == 'border') {
    if (event.button == 0) {
      mouseCell = Cell.Border;
    } else if (event.button == 2) {
      mouseCell = Cell.Empty;
    }
  } else {
    if (event.button == 0) {
      mouseCell = Cell.Dark; // Left click
    } else if (event.button == 2) {
      mouseCell = Cell.Light; // Right click
    } else if (event.button == 1) {
      mouseCell = Cell.Empty; // Middle click
    }
  }

  const pos = getMouseCellPos(event);
  if (!pos) return;

  game.board[pos.x][pos.y] = mouseCell;
  drawGame(game);
}

// Function to handle cell color change on mouse up
function handleMouseUp() {
  if (getMode() != 'cell' && getMode() != 'border') return;
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

// Function to reset the game
function resetGame() {
  const sizeX = parseInt((document.getElementById('size-x')! as HTMLInputElement).value);
  const sizeY = parseInt((document.getElementById('size-y')! as HTMLInputElement).value);

  if (isNaN(sizeX) || isNaN(sizeY) || sizeX < 1 || sizeY < 1) {
    alert('Invalid size!');
    return;
  }

  game = createEmptyGame(sizeX, sizeY);

  drawGame(game);
  updateRuleList();
}

// Function to create an empty game
function createEmptyGame(sizeX: number, sizeY: number): Game {
  const board: Board = [];

  for (let x = 0; x < sizeX; x++) {
    board.push([]);
    for (let y = 0; y < sizeY; y++) {
      board[x].push(Cell.Empty);
    }
  }

  return {
    board,
    rules: [],
    symbols: [],
    sizeX,
    sizeY
  };
}

// Function to solve the game
function solveBoard() {
  console.log('Solving the game...');

  console.time();
  const success = solveAdvanced(game);
  console.timeEnd();

  if (!success) alert('No valid solutions found!');

  drawGame(game);
}

// Function to get the item mode
function getMode(): string {
  return (document.getElementById('item-select')! as HTMLSelectElement).value;
}

function getInput(event: MouseEvent, out: (value: string) => void) {
  const inputBox = document.createElement('input');
  inputBox.id = 'input-box';
  inputBox.style.left = `${event.pageX}px`;
  inputBox.style.top = `${event.pageY}px`;
  document.body.appendChild(inputBox);

  window.requestAnimationFrame(() => inputBox.focus());

  inputBox.addEventListener('keydown', e => {
    if (e.key != 'Enter') return;

    const value = inputBox.value;
    inputBox.blur();

    out(value);
  });

  inputBox.addEventListener('blur', () => {
    inputBox.remove();
  });
}

function handlePlaceSymbol(event: MouseEvent) {
  const mode = getMode();
  if (mode == 'cell' || mode == 'border') return;

  const pos = getMouseCellPos(event);
  if (!pos) return;

  if (event.button == 2) {
    // Remove symbol

    // If a symbol already exists at pos, remove it
    game.symbols = game.symbols.filter(s => s.pos.x != pos.x || s.pos.y != pos.y);
  } else if (event.button == 0) {
    // Place symbol

    // Symbols with input

    if (
      mode == 'area' ||
      mode == 'viewpoint' ||
      mode == 'dart 0' ||
      mode == 'dart 1' ||
      mode == 'dart 2' ||
      mode == 'dart 3'
    ) {
      getInput(event, value => {
        const num = parseInt(value);
        if (isNaN(num) || num < 1) return;

        let symbol: Symbol;
        if (mode == 'area') {
          symbol = { kind: 'area', pos, count: num };
        } else if (mode == 'viewpoint') {
          symbol = { kind: 'viewpoint', pos, count: num };
        } else if (mode == 'dart 0') {
          symbol = { kind: 'dart', pos, count: num, direction: Direction.Up };
        } else if (mode == 'dart 1') {
          symbol = { kind: 'dart', pos, count: num, direction: Direction.Down };
        } else if (mode == 'dart 2') {
          symbol = { kind: 'dart', pos, count: num, direction: Direction.Left };
        } else if (mode == 'dart 3') {
          symbol = { kind: 'dart', pos, count: num, direction: Direction.Right };
        }

        // If a symbol already exists at pos, remove it
        game.symbols = game.symbols.filter(s => s.pos.x != pos.x || s.pos.y != pos.y);

        // Add the symbol
        game.symbols.push(symbol!);

        drawGame(game);
      });

      return;
    }

    // Symbols without input

    let symbol: Symbol;
    if (mode == 'galaxy') {
      symbol = { kind: 'galaxy', pos };
    } else if (mode == 'lotus 0') {
      symbol = { kind: 'lotus', pos, rotation: 0 };
    } else if (mode == 'lotus 1') {
      symbol = { kind: 'lotus', pos, rotation: 1 };
    } else if (mode == 'lotus 2') {
      symbol = { kind: 'lotus', pos, rotation: 2 };
    } else if (mode == 'lotus 3') {
      symbol = { kind: 'lotus', pos, rotation: 3 };
    }

    // If a symbol already exists at pos, remove it
    game.symbols = game.symbols.filter(s => s.pos.x != pos.x || s.pos.y != pos.y);

    // Add the symbol
    game.symbols.push(symbol!);
  }

  drawGame(game);
}

function handleAddRule(event: MouseEvent) {
  const rule = (document.getElementById('rule-select')! as HTMLSelectElement).value;
  if (rule == 'connected dark') {
    game.rules.push({ kind: 'connected', color: Cell.Dark });
    updateRuleList();
  } else if (rule == 'connected light') {
    game.rules.push({ kind: 'connected', color: Cell.Light });
    updateRuleList();
  } else if (rule == 'area dark' || rule == 'area light') {
    getInput(event, value => {
      const num = parseInt(value);
      if (isNaN(num) || num < 1) return;

      if (rule == 'area dark') {
        game.rules.push({ kind: 'area', color: Cell.Dark, count: num });
      } else if (rule == 'area light') {
        game.rules.push({ kind: 'area', color: Cell.Light, count: num });
      }

      updateRuleList();
    });
  }
}

function handleClearRules() {
  game.rules = [];
  updateRuleList();
}

function updateRuleList() {
  const list = document.getElementById('rule-list')!;
  list.innerHTML = '';

  for (const rule of game.rules) {
    const element = document.createElement('li');

    if (rule.kind == 'connected') {
      element.textContent = `Connect all ${rule.color == Cell.Dark ? 'dark' : 'light'} cells`;
    } else if (rule.kind == 'area') {
      element.textContent = `All ${rule.color == Cell.Dark ? 'dark' : 'light'} regions have area ${rule.count}`;
    }

    list.appendChild(element);
  }
}

function handleImport(event: MouseEvent) {
  getInput(event, value => {
    if (value == '') return;

    try {
      game = JSON.parse(value);

      drawGame(game);
      updateRuleList();
    } catch (err) {
      console.error(err);
      alert('Import failed! See console for more details.');
    }
  });
}

function handlePreset(event: Event) {
  const preset = (event.target as HTMLSelectElement).value;

  if (preset == 'none') {
    resetGame();
  } else {
    game = JSON.parse(presets[parseInt(preset) - 1]);
  }
  drawGame(game);
  updateRuleList();
}

function handleExport() {
  console.log(JSON.stringify(game));

  alert('Game has been printed to the console.\nPress Ctrl+Shift+I to view it.');
}

canvas.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('contextmenu', event => event.preventDefault());

document.getElementById('reset-button')!.addEventListener('click', resetGame);
document.getElementById('add-rule-button')!.addEventListener('click', handleAddRule);
document.getElementById('clear-rules-button')!.addEventListener('click', handleClearRules);
document.getElementById('preset-select')!.addEventListener('change', handlePreset);
document.getElementById('import-button')!.addEventListener('click', handleImport);
document.getElementById('export-button')!.addEventListener('click', handleExport);
document.getElementById('solve-button')!.addEventListener('click', solveBoard);

canvas.addEventListener('mousedown', handlePlaceSymbol);
