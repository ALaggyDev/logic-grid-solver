import { Board, Pos, verifyPos, Cell, getNeighbours } from '..';

export interface GalaxySymbol {
  pos: Pos;
  kind: 'galaxy';
}

// Translate a position in relative to a galaxy symbol
function movePosGalaxy(board: Board, symbol: GalaxySymbol, pos: Pos): Pos | null {
  const newPos = { x: 2 * symbol.pos.x - pos.x, y: 2 * symbol.pos.y - pos.y };
  return verifyPos(board, newPos) ? newPos : null;
}

// Check if galaxy symbol is valid
export function verifyGalaxySymbol(board: Board, symbol: GalaxySymbol): Pos[] | false {
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

    const oppoPos = movePosGalaxy(board, symbol, curPos);
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
