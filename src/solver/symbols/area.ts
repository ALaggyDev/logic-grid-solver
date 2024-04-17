import { Board, Cell, Pos, getNeighbours } from '..';

export interface AreaSymbol {
  pos: Pos;
  kind: 'area';
  count: number;
}

export function verifyAreaSymbol(board: Board, symbol: AreaSymbol): Pos[] | false {
  const pos = symbol.pos;
  const cell = board[pos.x][pos.y];

  if (cell == Cell.Empty) return [symbol.pos];

  const visited: boolean[][] = [];

  const sameCellQueue: Pos[] = [pos];
  const usableCellQueue: Pos[] = [];

  let sameCellCount = 0;
  let usableCellCount = 0;

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

    for (const neighbour of getNeighbours(board, curPos)) {
      if (visited[neighbour.x][neighbour.y]) continue;

      const neighbourCell = board[neighbour.x][neighbour.y];

      if (neighbourCell == Cell.Empty) {
        usableCellQueue.push(neighbour);
      } else if (neighbourCell == cell) {
        sameCellQueue.push(neighbour);
      }

      visited[neighbour.x][neighbour.y] = true;
    }
  }

  if (sameCellCount > symbol.count) return false;

  const emptyNeighbours = [...usableCellQueue];

  // Count usable cell
  while (usableCellQueue.length > 0) {
    const curPos = usableCellQueue.pop()!;
    usableCellCount += 1;

    if (sameCellCount + usableCellCount >= symbol.count) return emptyNeighbours;

    for (const neighbour of getNeighbours(board, curPos)) {
      if (visited[neighbour.x][neighbour.y]) continue;

      const neighbourCell = board[neighbour.x][neighbour.y];

      if (neighbourCell == Cell.Empty || neighbourCell == cell) {
        usableCellQueue.push(neighbour);
        visited[neighbour.x][neighbour.y] = true;
      }
    }
  }

  return sameCellCount + usableCellCount >= symbol.count ? emptyNeighbours : false;
}
