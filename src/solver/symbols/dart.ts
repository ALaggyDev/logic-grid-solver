import { Board, Cell, Color, Direction, Pos, getDirOffset, getOppositeColor, verifyPos } from '..';

export interface DartSymbol {
  pos: Pos;
  kind: 'dart';
  count: number;
  direction: Direction;
}

export function verifyDartSymbol(board: Board, symbol: DartSymbol): boolean {
  const pos = symbol.pos;
  const cell = board[pos.x][pos.y];

  if (cell == Cell.Empty) return true;

  let [dirX, dirY] = getDirOffset(symbol.direction);

  let x = pos.x + dirX;
  let y = pos.y + dirY;

  let oppositeCells = 0;
  let emptyCells = 0;

  while (verifyPos(board, { x, y })) {
    // Opposite Cell
    if (getOppositeColor(cell as Color) == board[x][y]) {
      oppositeCells += 1;
      if (oppositeCells > symbol.count) return false;
    }

    // Empty cells
    if (board[x][y] == Cell.Empty) emptyCells += 1;

    x += dirX;
    y += dirY;
  }

  return oppositeCells + emptyCells >= symbol.count;
}

// Dart adjacency can be built before running the solver
export function buildDartAdjacency(board: Board, symbol: DartSymbol): Pos[] {
  const affectedCells: Pos[] = [];

  let [dirX, dirY] = getDirOffset(symbol.direction);
  let x = symbol.pos.x;
  let y = symbol.pos.y;

  while (verifyPos(board, { x, y })) {
    if (board[x][y] == Cell.Empty) {
      affectedCells.push({ x, y });
    }

    x += dirX;
    y += dirY;
  }

  return affectedCells;
}
