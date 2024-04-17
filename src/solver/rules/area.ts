import { Board, Pos, Color, getNeighbours, Cell } from '..';

export interface AreaRule {
  kind: 'area';
  color: Color;
  count: number;
}

export function verifyAreaRule(board: Board, rule: AreaRule): boolean {
  const checked: boolean[][] = [];

  // Initialize the visited array
  for (let x = 0; x < board.length; x++) {
    checked[x] = [];
    for (let y = 0; y < board[0].length; y++) {
      checked[x][y] = false;
    }
  }

  // Loop through all cells
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[0].length; y++) {
      if (checked[x][y]) continue;

      if (board[x][y] == rule.color) {
        // Verify area
        if (!verifyAreaComplex(board, { x, y }, rule.color, rule.count, checked)) return false;
      }
    }
  }

  return true;
}

function verifyAreaComplex(board: Board, pos: Pos, color: Color, count: number, checked: boolean[][]): boolean {
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
  checked[pos.x][pos.y] = true;

  // Count same cell
  while (sameCellQueue.length > 0) {
    const curPos = sameCellQueue.pop()!;
    sameCellCount += 1;

    for (const neighbour of getNeighbours(board, curPos)) {
      if (visited[neighbour.x][neighbour.y]) continue;

      const neighbourCell = board[neighbour.x][neighbour.y];

      if (neighbourCell == Cell.Empty) {
        usableCellQueue.push(neighbour);
      } else if (neighbourCell == color) {
        sameCellQueue.push(neighbour);

        checked[neighbour.x][neighbour.y] = true;
      }

      visited[neighbour.x][neighbour.y] = true;
    }
  }

  if (sameCellCount > count) return false;

  // Count usable cell
  while (usableCellQueue.length > 0) {
    const curPos = usableCellQueue.pop()!;
    usableCellCount += 1;

    if (sameCellCount + usableCellCount >= count) return true;

    for (const neighbour of getNeighbours(board, curPos)) {
      if (visited[neighbour.x][neighbour.y]) continue;

      const neighbourCell = board[neighbour.x][neighbour.y];

      if (neighbourCell == Cell.Empty || neighbourCell == color) {
        usableCellQueue.push(neighbour);
        visited[neighbour.x][neighbour.y] = true;
      }
    }
  }

  return sameCellCount + usableCellCount >= count;
}
