export enum Cell {
  Empty = 0,
  White,
  Black
}

export type Board = Cell[][];

export interface Pos {
  x: number;
  y: number;
}

export enum Color {
  White,
  Black
}

export interface ConnectedRule {
  kind: 'connected';
  color: Color;
}

export interface AreaRule {
  kind: 'area';
  color: Color;
  count: number;
}

// Forbidden pattern
// Off by one

export type Rule = ConnectedRule | AreaRule;

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right'
}

export interface AreaSymbol {
  pos: Pos;
  kind: 'area';
  count: number;
}

export interface ViewpointSymbol {
  pos: Pos;
  kind: 'viewpoint';
  count: number;
}

export interface DartSymbol {
  pos: Pos;
  kind: 'dart';
  count: number;
  direction: Direction;
}

export interface LetterSymbol {
  pos: Pos;
  kind: 'letter';
  letter: number;
}

export interface LotusSymbol {
  pos: Pos;
  kind: 'lotus';
  rotation: number;
}

export interface GalaxySymbol {
  pos: Pos;
  kind: 'galaxy';
}

export type Symbol = AreaSymbol | ViewpointSymbol | DartSymbol | LetterSymbol | LotusSymbol | GalaxySymbol;

export interface Game {
  board: Board;
  rules: Rule[];
  symbols: Symbol[];
  sizeX: number;
  sizeY: number;
}

// TODO: ADD SYMBOL

export function get_neighbours(board: Board, pos: Pos): Pos[] {
  const positions: Pos[] = [];

  if (pos.x > 0) {
    positions.push({ x: pos.x - 1, y: pos.y });
  }
  if (pos.x + 1 < board.length) {
    positions.push({ x: pos.x + 1, y: pos.y });
  }
  if (pos.y > 0) {
    positions.push({ x: pos.x, y: pos.y - 1 });
  }
  if (pos.y + 1 < board[0].length) {
    positions.push({ x: pos.x, y: pos.y + 1 });
  }

  return positions;
}

function getCellColor(cell: Cell): Color | null {
  if (cell == Cell.Black) {
    return Color.Black;
  } else if (cell == Cell.White) {
    return Color.White;
  } else {
    return null;
  }
}

function oppositeColor(color: Color): Color {
  return color == Color.White ? Color.Black : Color.White;
}

function isCellColorMatch(cell: Cell, color: Color): boolean {
  return (cell == Cell.White && color == Color.White) || (cell == Cell.Black && color == Color.Black);
}

// Return false if invalid
export function verify_connected_rule(board: Board, rule: ConnectedRule): boolean {
  const lenX = board.length;
  const lenY = board[0].length;

  const queue: Pos[] = [];
  const visited: boolean[][] = [];

  // Initialize the visited array
  for (let x = 0; x < lenX; x++) {
    visited[x] = [];
    for (let y = 0; y < lenY; y++) {
      visited[x][y] = false;
    }
  }

  // Find all same cells
  const sameCells: Pos[] = [];
  for (let x = 0; x < lenX; x++) {
    for (let y = 0; y < lenY; y++) {
      if (isCellColorMatch(board[x][y], rule.color)) {
        sameCells.push({ x, y });
      }
    }
  }

  // If there are no same cells, return true
  if (sameCells.length === 0) {
    return true;
  }

  // Perform flood fill
  queue.push(sameCells[0]);
  visited[sameCells[0].x][sameCells[0].y] = true;

  while (queue.length > 0) {
    const curPos = queue.pop()!;

    for (const neighbour of get_neighbours(board, curPos)) {
      if (
        visited[neighbour.x][neighbour.y] ||
        isCellColorMatch(board[neighbour.x][neighbour.y], oppositeColor(rule.color))
      ) {
        continue;
      }

      queue.push(neighbour);
      visited[neighbour.x][neighbour.y] = true;
    }
  }

  // Check if any same cell is not reachable
  for (const cell of sameCells) {
    if (!visited[cell.x][cell.y]) return false;
  }

  return true;
}

// Check if
// 1. area symbol placed at pos do not have more same cells
// 2. area symbol placed at pos have enough empty cells to expand
export function verify_area_symbol(board: Board, symbol: AreaSymbol): boolean {
  const pos = symbol.pos;
  const cell = board[pos.x][pos.y];
  const color = getCellColor(cell);

  if (color == null) return true;

  const sameCellQueue: Pos[] = [pos];
  const usableCellQueue: Pos[] = [];

  let sameCellCount = 0;
  let usableCellCount = 0;
  const visited: boolean[][] = [];

  // Initialize the visited array
  for (let x = 0; x < board.length; x++) {
    visited[x] = [];
    for (let y = 0; y < board[0].length; y++) {
      visited[x][y] = false;
    }
  }

  visited[pos.x][pos.y] = true;

  // Count same cell
  while (sameCellQueue.length > 0) {
    const curPos = sameCellQueue.pop()!;
    sameCellCount += 1;

    for (const neighbour of get_neighbours(board, curPos)) {
      if (visited[neighbour.x][neighbour.y]) continue;

      if (board[neighbour.x][neighbour.y] == Cell.Empty) {
        usableCellQueue.push(neighbour);
        visited[neighbour.x][neighbour.y] = true;
      } else if (isCellColorMatch(board[neighbour.x][neighbour.y], color)) {
        sameCellQueue.push(neighbour);

        visited[neighbour.x][neighbour.y] = true;
      }
    }
  }

  if (sameCellCount > symbol.count) return false;

  // Count usable cell
  while (usableCellQueue.length > 0) {
    const curPos = usableCellQueue.pop()!;
    usableCellCount += 1;

    if (sameCellCount + usableCellCount >= symbol.count) return true;

    for (const neighbour of get_neighbours(board, curPos)) {
      if (visited[neighbour.x][neighbour.y]) continue;

      if (board[neighbour.x][neighbour.y] == Cell.Empty || isCellColorMatch(board[neighbour.x][neighbour.y], color)) {
        usableCellQueue.push(neighbour);
        visited[neighbour.x][neighbour.y] = true;
      }
    }
  }

  return sameCellCount + usableCellCount >= symbol.count;
}

// Check if viewpoint symbol placed at pos have enough same cells at four cardinal directions
export function verify_viewpoint_symbol(board: Board, symbol: ViewpointSymbol): boolean {
  const pos = symbol.pos;
  const cell = board[pos.x][pos.y];

  if (cell == Cell.Empty) return true;

  let usableCells = 1;
  let sameCells = 1;

  let connected = true;
  for (let x = pos.x - 1; x >= 0; x--) {
    if (
      connected &&
      ((cell == Cell.Black && board[x][pos.y] == Cell.Black) || (cell == Cell.White && board[x][pos.y] == Cell.White))
    ) {
      sameCells += 1;
      if (sameCells > symbol.count) return false;
    } else {
      connected = false;
    }

    if (
      (cell == Cell.Black && board[x][pos.y] == Cell.White) ||
      (cell == Cell.White && board[x][pos.y] == Cell.Black)
    ) {
      break;
    }
    usableCells += 1;
  }

  connected = true;
  for (let x = pos.x + 1; x < board.length; x++) {
    if (
      connected &&
      ((cell == Cell.Black && board[x][pos.y] == Cell.Black) || (cell == Cell.White && board[x][pos.y] == Cell.White))
    ) {
      sameCells += 1;
      if (sameCells > symbol.count) return false;
    } else {
      connected = false;
    }

    if (
      (cell == Cell.Black && board[x][pos.y] == Cell.White) ||
      (cell == Cell.White && board[x][pos.y] == Cell.Black)
    ) {
      break;
    }
    usableCells += 1;
  }

  connected = true;
  for (let y = pos.y - 1; y >= 0; y--) {
    if (
      connected &&
      ((cell == Cell.Black && board[pos.x][y] == Cell.Black) || (cell == Cell.White && board[pos.x][y] == Cell.White))
    ) {
      sameCells += 1;
      if (sameCells > symbol.count) return false;
    } else {
      connected = false;
    }

    if (
      (cell == Cell.Black && board[pos.x][y] == Cell.White) ||
      (cell == Cell.White && board[pos.x][y] == Cell.Black)
    ) {
      break;
    }
    usableCells += 1;
  }

  connected = true;
  for (let y = pos.y + 1; y < board[0].length; y++) {
    if (
      connected &&
      ((cell == Cell.Black && board[pos.x][y] == Cell.Black) || (cell == Cell.White && board[pos.x][y] == Cell.White))
    ) {
      sameCells += 1;
      if (sameCells > symbol.count) return false;
    } else {
      connected = false;
    }

    if (
      (cell == Cell.Black && board[pos.x][y] == Cell.White) ||
      (cell == Cell.White && board[pos.x][y] == Cell.Black)
    ) {
      break;
    }
    usableCells += 1;
  }

  return usableCells >= symbol.count;
}

export function get_dir(dir: Direction): [number, number] {
  switch (dir) {
    case Direction.Up:
      return [-1, 0];
    case Direction.Down:
      return [1, 0];
    case Direction.Left:
      return [0, -1];
    case Direction.Right:
      return [0, 1];
  }
}

// Check if dart symbol placed at pos count enough opposite color cells at the direction of the dart
export function verify_dart_symbol(board: Board, symbol: DartSymbol): boolean {
  const pos = symbol.pos;
  const cell = board[pos.x][pos.y];

  if (cell == Cell.Empty) return true;

  let [dirX, dirY] = get_dir(symbol.direction);

  let x = pos.x + dirX;
  let y = pos.y + dirY;

  let oppositeCells = 0;
  let emptyCells = 0;

  while (x >= 0 && x < board.length && y >= 0 && y < board[0].length) {
    // Opposite Cell
    if ((cell == Cell.Black && board[x][y] == Cell.White) || (cell == Cell.White && board[x][y] == Cell.Black)) {
      oppositeCells += 1;
      if (oppositeCells > symbol.count) return false;
    }

    // Empty cells
    if (board[x][y] == Cell.Empty) {
      emptyCells += 1;
    }

    x += dirX;
    y += dirY;
  }

  return oppositeCells + emptyCells >= symbol.count;
}

// Check if the position is within the board
function verify_pos(board: Board, pos: Pos): boolean {
  return pos.x >= 0 && pos.x < board.length && pos.y >= 0 && pos.y < board[0].length;
}

// Translate a position in relative to a galaxy symbol
function move_pos_galaxy(board: Board, symbol: GalaxySymbol, pos: Pos): Pos | null {
  const newPos = { x: 2 * symbol.pos.x - pos.x, y: 2 * symbol.pos.y - pos.y };
  return verify_pos(board, newPos) ? newPos : null;
}

// Translate a position in relative to a lotus symbol
function move_pos_lotus(board: Board, symbol: LotusSymbol, pos: Pos): Pos | null {
  const relX = pos.x - symbol.pos.x;
  const relY = pos.y - symbol.pos.y;

  let newPos: Pos;
  if (symbol.rotation == 0) {
    newPos = { x: pos.x, y: symbol.pos.y - relY };
  } else if (symbol.rotation == 1) {
    newPos = { x: symbol.pos.x - relY, y: symbol.pos.y - relX };
  } else if (symbol.rotation == 2) {
    newPos = { x: symbol.pos.x - relX, y: pos.y };
  } else if (symbol.rotation == 3) {
    newPos = { x: symbol.pos.x + relY, y: symbol.pos.y + relX };
  }

  return verify_pos(board, newPos!) ? newPos! : null;
}

// Check if galaxy symbol is valid
export function verify_galaxy_symbol(board: Board, symbol: GalaxySymbol): boolean {
  const pos = symbol.pos;
  const cell = board[pos.x][pos.y];
  const color = getCellColor(cell);

  if (color == null) return true;

  const queue: Pos[] = [pos];
  const visited: boolean[][] = [];

  // Initialize the visited array
  for (let x = 0; x < board.length; x++) {
    visited[x] = [];
    for (let y = 0; y < board[0].length; y++) {
      visited[x][y] = false;
    }
  }

  // Visit all connected cells
  while (queue.length > 0) {
    const curPos = queue.pop()!;

    if (visited[curPos.x][curPos.y]) continue;
    visited[curPos.x][curPos.y] = true;

    const oppoPos = move_pos_galaxy(board, symbol, curPos);
    if (oppoPos == null) return false;
    if (getCellColor(board[oppoPos.x][oppoPos.y]) == oppositeColor(color)) return false;

    for (const neighbour of get_neighbours(board, curPos)) {
      if (visited[neighbour.x][neighbour.y]) continue;

      if (getCellColor(board[neighbour.x][neighbour.y]) == color) {
        queue.push(neighbour);
      }
    }
  }

  return true;
}

// Check if lotus symbol is valid
export function verify_lotus_symbol(board: Board, symbol: LotusSymbol): boolean {
  const pos = symbol.pos;
  const cell = board[pos.x][pos.y];
  const color = getCellColor(cell);

  if (color == null) return true;

  const queue: Pos[] = [pos];
  const visited: boolean[][] = [];

  // Initialize the visited array
  for (let x = 0; x < board.length; x++) {
    visited[x] = [];
    for (let y = 0; y < board[0].length; y++) {
      visited[x][y] = false;
    }
  }

  // Visit all connected cells
  while (queue.length > 0) {
    const curPos = queue.pop()!;

    if (visited[curPos.x][curPos.y]) continue;
    visited[curPos.x][curPos.y] = true;

    const oppoPos = move_pos_lotus(board, symbol, curPos);
    if (oppoPos == null) return false;
    if (getCellColor(board[oppoPos.x][oppoPos.y]) == oppositeColor(color)) return false;

    for (const neighbour of get_neighbours(board, curPos)) {
      if (visited[neighbour.x][neighbour.y]) continue;

      if (getCellColor(board[neighbour.x][neighbour.y]) == color) {
        queue.push(neighbour);
      }
    }
  }

  return true;
}
