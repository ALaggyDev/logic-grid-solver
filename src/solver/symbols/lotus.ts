import { Board, Cell, Pos, getNeighbours, verifyPos } from '..';

export interface LotusSymbol {
  pos: Pos;
  kind: 'lotus';
  rotation: 0 | 1 | 2 | 3;
}

// Translate a position in relative to a lotus symbol
function movePosLotus(board: Board, symbol: LotusSymbol, pos: Pos): Pos | null {
  let newPos: Pos;
  if (symbol.rotation == 0) {
    newPos = { x: pos.x, y: 2 * symbol.pos.y - pos.y };
  } else if (symbol.rotation == 1) {
    newPos = { x: symbol.pos.x + symbol.pos.y - pos.y, y: symbol.pos.x + symbol.pos.y - pos.x };
  } else if (symbol.rotation == 2) {
    newPos = { x: 2 * symbol.pos.x - pos.x, y: pos.y };
  } else if (symbol.rotation == 3) {
    newPos = { x: symbol.pos.x - symbol.pos.y + pos.y, y: symbol.pos.y - symbol.pos.x + pos.x };
  }

  return verifyPos(board, newPos!) ? newPos! : null;
}

// Check if lotus symbol is valid
export function verifyLotusSymbol(board: Board, symbol: LotusSymbol): Pos[] | false {
  const pos = symbol.pos;
  const cell = board[pos.x][pos.y];

  if (cell == Cell.Empty) return [pos];

  const queue: Pos[] = [pos];
  const visited: boolean[][] = [];

  const affectedCells: Pos[] = [];

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

    const oppoPos = movePosLotus(board, symbol, curPos);
    if (oppoPos == null) return false;
    if (!(board[oppoPos.x][oppoPos.y] == Cell.Empty || board[oppoPos.x][oppoPos.y] == cell)) return false;

    for (const neighbour of getNeighbours(board, curPos)) {
      if (visited[neighbour.x][neighbour.y]) continue;

      if (board[neighbour.x][neighbour.y] == Cell.Empty) {
        affectedCells.push(neighbour);
      } else if (board[neighbour.x][neighbour.y] == cell) {
        queue.push(neighbour);
      }
    }
  }

  return affectedCells;
}
